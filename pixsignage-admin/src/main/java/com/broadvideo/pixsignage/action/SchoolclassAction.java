package com.broadvideo.pixsignage.action;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Schoolclass;
import com.broadvideo.pixsignage.persistence.SchoolclassMapper;
import com.broadvideo.pixsignage.service.SchoolclassService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("schoolclassAction")
public class SchoolclassAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Schoolclass schoolclass;
	@Autowired
	private SchoolclassService schoolclassService;

	@Autowired
	private SchoolclassMapper schoolclassMapper;

	public String doList() {
		try {
			PageInfo pageInfo=super.initPageInfo();
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			PageResult pageResult = this.schoolclassService.getSchoolclassList(search, pageInfo, getLoginStaff()
					.getOrgid());
			this.setiTotalRecords(pageResult.getTotalCount());
			this.setiTotalDisplayRecords(pageResult.getTotalCount());
			this.setAaData(pageResult.getResult());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("SchoolclassAction doList exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {

		try {
			if (schoolclass == null || StringUtils.isBlank(schoolclass.getName())) {
				renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
				return ERROR;
			}
			schoolclass.setOrgid(getLoginStaff().getOrgid());
			schoolclass.setCreatestaffid(getLoginStaff().getStaffid());
			schoolclassService.addSchoolclass(schoolclass);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("SchoolclassAction doAdd exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}

	}

	public String doUpdate() {
		try {
			if (schoolclass == null || StringUtils.isBlank(schoolclass.getName())
					|| schoolclass.getSchoolclassid() == null) {
				renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
				return ERROR;
			}
			schoolclassService.upateSchoolclass(schoolclass);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("SchoolclassAction doUpdate exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			if (schoolclass == null
					|| schoolclass.getSchoolclassid() == null) {
				renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
				return ERROR;
			}
			schoolclassService.deleteSchoolclass(schoolclass.getSchoolclassid(), getLoginStaff().getOrgid());
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
