package com.broadvideo.pixsignage.task;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.domain.Attendancescheme;
import com.broadvideo.pixsignage.service.AttendanceService;

/**
 * 生成考勤事件
 * 
 * @author charles
 *
 */
public class AttendanceeventTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;
	@Autowired
	private AttendanceService attendanceService;


	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;
			List<Attendancescheme> attendanceschemes = this.attendanceService.getAllEnableAttendanceschemes();
			if (attendanceschemes == null || attendanceschemes.size() == 0) {
				logger.error("Not found enable attendancescheme.");
				return;
			}
			for (Attendancescheme attendancescheme : attendanceschemes) {

				try {
				this.attendanceService.genAttendanceevents(attendancescheme.getAttendanceschemeid(), 0);
				} catch (Exception ex) {
					logger.error("genAttendanceevents(attendanceschemeid:{}) ocurred exception.",
							attendancescheme.getAttendanceschemeid(), ex);
					continue;
				}
			}

			logger.info("Start Gen Attendanceevent Quartz Task.");

		} catch (Exception e) {
			logger.error("Gen Attendanceevent Quartz Task error: {}", e.getMessage());
		} finally {
			workflag = false;

		}
	}




}
