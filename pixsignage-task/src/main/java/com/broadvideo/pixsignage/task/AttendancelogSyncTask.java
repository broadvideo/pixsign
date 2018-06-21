package com.broadvideo.pixsignage.task;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.domain.Attendancelog;
import com.broadvideo.pixsignage.domain.Config;
import com.broadvideo.pixsignage.domain.Event;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Person;
import com.broadvideo.pixsignage.domain.Room;
import com.broadvideo.pixsignage.persistence.AttendancelogMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.EventMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.PersonMapper;
import com.broadvideo.pixsignage.persistence.RoomMapper;
import com.broadvideo.pixsignage.util.DateUtil;
import com.broadvideo.pixsignage.util.HttpClientUtils;
import com.broadvideo.pixsignage.util.HttpClientUtils.SimpleHttpResponse;

@Service("attendancelogSyncTask")
public class AttendancelogSyncTask extends Thread implements InitializingBean {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private AttendancelogMapper attendancelogMapper;
	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private EventMapper eventMapper;
	@Autowired
	private RoomMapper roomMapper;
	@Autowired
	private PersonMapper personMapper;
	private Integer lastMaxId = 0;
	private final Integer fetchSize = 50;

	public AttendancelogSyncTask() {

	}

	public void run() {
		logger.info("Start Attendancelog Sync Task.");
		final Org org = orgMapper.selectByCode("default");
		Config config = configMapper.selectByCode("SafeCampusServer");
		if (config == null || StringUtils.isBlank(config.getValue())) {
			return;
		}
		final String serviceUrl = "http://" + config.getValue()
				+ "/thirdparty/pixsignage/service/attendance/sync_event_attendance";
		while (true) {
			try {
				List<Attendancelog> dataList = this.attendancelogMapper.selectListFrom(lastMaxId, fetchSize,
						org.getOrgid());
				for (Attendancelog attendancelog : dataList) {
					JSONObject bodyJson = new JSONObject();
					Event event = eventMapper.selectByPrimaryKey(attendancelog.getEventid());
					Person person = personMapper.selectByPrimaryKey(attendancelog.getPersonid());
					Room room = roomMapper.selectByPrimaryKey(attendancelog.getRoomid());
					if (event == null || person == null || room == null) {
						this.updateSyncFlag(attendancelog.getAttendancelogid(), GlobalFlag.DELETE);
						lastMaxId = attendancelog.getAttendancelogid();
						continue;
					}
					bodyJson.put("event_uuid", event.getUuid());
					bodyJson.put("person_uuid", person.getUuid());
					bodyJson.put("room_uuid", room.getUuid());
					bodyJson.put("sign_time", DateUtil.getDateStr(attendancelog.getSigntime(), "yyyy-MM-dd HH:mm"));
					SimpleHttpResponse resp = HttpClientUtils.doPost(serviceUrl, bodyJson.toString());
					logger.info("AttenancelogSyncTask doPost({}) with body:{},resp:{}", serviceUrl,
							bodyJson.toString(), resp);
					final int statusCode = resp.getStatusCode();
					if (statusCode >= 200 && statusCode <= 300) {
						logger.info("AttenancelogSyncTask resp body:{}", resp.getBody());
						JSONObject respBody = new JSONObject(resp.getBody());
						int retcode = respBody.getInt("retcode");
						logger.info("AttenancelogSyncTask sync success for attendancelogid:{}，retcode:{}",
								attendancelog.getAttendancelogid(), retcode);
						this.updateSyncFlag(attendancelog.getAttendancelogid(), GlobalFlag.YES);
						lastMaxId = attendancelog.getAttendancelogid();

					} else {

						logger.error("Response error,statuscode:{}", statusCode);
						throw new Exception("Response error:statuscode=" + statusCode);

					}

				}

			} catch (Exception ex) {
				logger.error("Start Attendancelog Sync Task exception: {}", ex);
			}
			try {
				Thread.sleep(6 * 1000L);
			} catch (Exception e) {
				e.printStackTrace();
				continue;

			}
		}
	}

	private void updateSyncFlag(Integer attendancelogid, String syncstatus) {

		Attendancelog updateRecord = new Attendancelog();
		updateRecord.setAttendancelogid(attendancelogid);
		updateRecord.setSyncstatus(syncstatus);
		this.attendancelogMapper.updateByPrimaryKeySelective(updateRecord);

	}

	@Override
	public void afterPropertiesSet() throws Exception {
		try {
			logger.info("##AttenancelogSyncTask start");
			this.setName("Atendancelog-Sync-Task");
			this.start();
		} catch (Exception ex) {
			ex.printStackTrace();

		}
	}

}
