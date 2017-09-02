package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.domain.Attendance;
import com.broadvideo.pixsignage.domain.Attendanceevent;
import com.broadvideo.pixsignage.domain.Attendancescheme;

/**
 * 考勤接口
 * 
 * @author charles
 *
 */
public interface AttendanceService {

	Integer addAttendancescheme(Attendancescheme attendancescheme);
	void updateAttendancescheme(Attendancescheme attendancescheme);
	void updateEnableflag(Integer attendanceschemeid, String enableflag, Integer orgid);
	PageResult getAttendanceschemes(String search, PageInfo page, Integer orgId);
	void deleteAttendancescheme(Integer attendanceschemeid, Integer orgid);
	Attendancescheme getEnableAttendancescheme(Integer orgid);
	void genAttendanceevents(Integer attendanceschemeid, Integer afterDays);
	List<Attendanceevent> getAttendanceevents(Integer classroomid, String yyyyMMdd, Integer orgid);
	List<Attendancescheme> getAllEnableAttendanceschemes();
	boolean isInitAttendanceevents(Integer attendanceschemeid, String yyyyMMdd);
	Attendanceevent getAttendanceevent(Integer attendanceeventid, Integer orgid);
	List<Attendance> getAttendancesByEventid(Integer attendanceeventid, Integer classroomid, Integer orgid);

}
