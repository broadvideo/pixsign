package com.broadvideo.pixsignage.action;

import java.io.InputStream;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Attendancelog;
import com.broadvideo.pixsignage.persistence.AttendancelogMapper;
import com.broadvideo.pixsignage.util.DateUtil;
import com.broadvideo.pixsignage.util.SqlUtil;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@SuppressWarnings("serial")
@Scope("request")
@Controller("vipattendanceAction")
public class VIPAttendanceAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());
	private Attendancelog attendancelog;
	private InputStream inputStream;
	private String downloadname;
	@Autowired
	private AttendancelogMapper atteandancelogMapper;

	public String doList() {
		try {
			PageInfo page = super.initPageInfo();
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			if (attendancelog == null) {
				attendancelog = new Attendancelog();
			}
			String starttime = getParameter("attendancelog.starttime");
			String endtime = getParameter("attendancelog.endtime");
			logger.info("doList:starttime:{},endtime:{}", starttime, endtime);
			if (StringUtils.isNotBlank(starttime)) {
				attendancelog.setStarttime(DateUtil.getDate(starttime, "yyyy-MM-dd HH:mm"));
			}
			if (StringUtils.isNotBlank(endtime)) {
				attendancelog.setEndtime(DateUtil.getDate(endtime, "yyyy-MM-dd HH:mm"));
			}

			attendancelog.setSearch(search);
			attendancelog.setOrgid(getStaffOrgid());
			RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
			List dataList = this.atteandancelogMapper.selectList3(attendancelog, rowBounds);
			PageList pageList = (PageList) dataList;
			int totalCount = pageList.getPaginator().getTotalCount();
			this.setiTotalRecords(totalCount);
			this.setiTotalDisplayRecords(totalCount);
			this.setAaData(dataList);
			return SUCCESS;

		} catch (Exception ex) {
			logger.error("vipattendanceAction doList exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}



	




	public Attendancelog getAttendancelog() {
		return attendancelog;
	}

	public void setAttendancelog(Attendancelog attendancelog) {
		this.attendancelog = attendancelog;
	}
	public InputStream getInputStream() {
		return inputStream;
	}

	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}

	public String getDownloadname() {
		return downloadname;
	}

	public void setDownloadname(String downloadname) {
		this.downloadname = downloadname;
	}

}
