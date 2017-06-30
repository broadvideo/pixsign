package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Schoolclass;
import com.broadvideo.pixsignage.persistence.SchoolclassMapper;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("schoolclassAction")
public class SchoolclassAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Schoolclass schoolclass;

	@Autowired
	private SchoolclassMapper schoolclassMapper;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			List<Object> aaData = new ArrayList<Object>();
			int count = schoolclassMapper.selectCount(getLoginStaff().getOrgid(), search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Map<String, Object>> schoolclassList = schoolclassMapper.selectList(getLoginStaff().getOrgid(),
					search, NumberUtils.toInt(start), NumberUtils.toInt(length));
			for (Map<String, Object> schoolclassMap : schoolclassList) {
				aaData.add(schoolclassMap);
			}

			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("SchoolclassAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {

		try {
			schoolclass.setOrgid(getLoginStaff().getOrgid());
			schoolclass.setCreatestaffid(getLoginStaff().getStaffid());
			schoolclass.setCreatetime(Calendar.getInstance().getTime());
			schoolclassMapper.insertSelective(schoolclass);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("SchoolclassAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}

	}

	public String doUpdate() {
		try {

			schoolclassMapper.updateByPrimaryKeySelective(schoolclass);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("SchoolclassAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			schoolclassMapper.deleteByPrimaryKey(schoolclass.getSchoolclassid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("SchoolclassAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Schoolclass getSchoolclass() {
		return schoolclass;
	}

	public void setSchoolclass(Schoolclass schoolclass) {
		this.schoolclass = schoolclass;
	}


	
	



}
