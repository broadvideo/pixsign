package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Attendance;
import com.broadvideo.pixsignage.persistence.AttendanceMapper;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("attendanceAction")
public class AttendanceAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Attendance attendance;

	@Autowired
	private AttendanceMapper attendancelogMapper;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String classroomid = getParameter("classroomid");
			Integer numclassroomid = null;
			if (StringUtils.isNotBlank(classroomid)) {
				numclassroomid = NumberUtils.toInt(classroomid);
			}

			List<Object> aaData = new ArrayList<Object>();
			int count = attendancelogMapper.selectCount(getLoginStaff().getOrgid(),
 numclassroomid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Map<String, Object>> attendancelogList = attendancelogMapper.selectList(getLoginStaff().getOrgid(),
					numclassroomid,
					search,
 NumberUtils.toInt(start), NumberUtils.toInt(length));
			for (Map<String, Object> attendancelogMap : attendancelogList) {

				aaData.add(attendancelogMap);

			}

			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AttendanceAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			attendancelogMapper.deleteByPrimaryKey(attendance.getAttendanceid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AttendanceAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Attendance getAttendance() {
		return attendance;
	}

	public void setAttendance(Attendance attendance) {
		this.attendance = attendance;
	}



	
	



}
