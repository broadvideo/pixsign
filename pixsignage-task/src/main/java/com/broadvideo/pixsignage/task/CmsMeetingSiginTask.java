package com.broadvideo.pixsignage.task;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.service.ConfigService;
import com.broadvideo.pixsignage.service.MeetingService;
import com.broadvideo.pixsignage.service.OrgService;
import com.broadvideo.pixsignage.vo.StaffSwipe;
import com.microsoft.sqlserver.jdbc.SQLServerDataSource;
import com.microsoft.sqlserver.jdbc.SQLServerException;

public class CmsMeetingSiginTask {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	private static boolean workflag = false;
	private static Long lastMaxId = -1L;
	private final String FETCH_SIGNIN_SQL = "select ID,SwipeTime,CardNumber,APID,APName,Account,nTag from SwipeLog where nTag='0' and ID>? order by ID asc";
	private final String UPDATE_SQL = "update SwipeLog set nTag='1' where ID=?";
	@Autowired
	private OrgService orgService;
	@Autowired
	private MeetingService meetingService;
	@Autowired
	private ConfigService configService;

	public void work() {

		Connection conn = null;
		PreparedStatement queryPs = null;
		PreparedStatement updatePs = null;
		ResultSet rs = null;
		try {
			if (workflag) {
				return;
			}
			workflag = true;
			logger.info("cms:fetch swipe list");
			final Org org = orgService.selectByCode("default");
			String runEnv = configService.selectValueByCode("RunEnv");
			if (StringUtils.isBlank(runEnv)) {
				logger.error("RunEnv:{}没有配置!", runEnv);
				return;
			}
			conn = MssqDbUtil.getConnection(runEnv);
			queryPs = conn.prepareStatement(FETCH_SIGNIN_SQL);
			queryPs.setLong(1, lastMaxId);
			rs = queryPs.executeQuery();
			updatePs = conn.prepareStatement(UPDATE_SQL);
			int count = 0;
			conn.setAutoCommit(false);
			logger.info(" conn.getAutoCommit():" + conn.getAutoCommit());
			while (rs.next()) {
				long id = rs.getLong("ID");
				Date swipetime = rs.getTimestamp("SwipeTime");
				int apid = rs.getInt("APID");
				String apname = rs.getString("APNAME");
				String account = rs.getString("Account");
				String ntag = rs.getString("nTag");
				StaffSwipe staffswipe = new StaffSwipe(id, swipetime, apid, account);
				// 同步考勤记录
				this.meetingService.syncMeetingSignin(staffswipe, org.getOrgid());
				// 标记当前记录已读
				updatePs.setLong(1, id);
				updatePs.addBatch();
				lastMaxId = id;
				count++;
			}
			if (count > 0) {
				logger.info("Batch update records({})....", count);
			    updatePs.executeBatch();
				conn.commit();
			}
			conn.setAutoCommit(true);
			logger.info("CmsMeetingSiginTask execute end.");
		} catch (Exception e) {
			logger.error("Task error: {}", e.getMessage());
		} finally {
			workflag = false;
			MssqDbUtil.close(rs, queryPs, conn);
			MssqDbUtil.close(null, updatePs, null);

		}
	}


	private static class MssqDbUtil {

		private final static Logger logger = LoggerFactory.getLogger(MssqDbUtil.class);
		private static Map<String, String> connMap = new HashMap<String, String>();
		static {
			connMap.put("development", "jdbc:sqlserver://localhost:1433;databaseName=AxiomLog;user=sa;password=111111;");
			connMap.put("test", "jdbc:sqlserver://localhost:1433;databaseName=AxiomLog;user=sa;password=111111;");
			connMap.put("product", "jdbc:sqlserver://localhost:1433;databaseName=AxiomLog;user=sa;password=111111;");
		}
		private static SQLServerDataSource _ds;


		public static Connection getConnection(String runEnv) throws SQLServerException {
			// Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
			// return DriverManager.getConnection(GetConnectionString());
			if (_ds == null) {
				_ds = new SQLServerDataSource();
				String connStr = connMap.get(runEnv);
				logger.info("fetch runEnv({})  connstr({})", runEnv, connStr);
				_ds.setURL(connStr);
			}
			return _ds.getConnection();

		}



		public static void close(ResultSet rs, PreparedStatement ps, Connection conn) {

			if (rs != null)
				try {
					rs.close();
				} catch (Exception e) {
				}
			if (ps != null)
				try {
					ps.close();
				} catch (Exception e) {
				}
			if (conn != null)
				try {
					conn.close();
				} catch (Exception e) {
				}

		}


	}



}
