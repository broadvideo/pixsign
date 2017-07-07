
package com.broadvideo.pixsignage.action;

import java.util.Arrays;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Classroom;
import com.broadvideo.pixsignage.service.ClassroomService;
import com.broadvideo.pixsignage.util.SqlUtil;

@Scope("request")
@Controller("classroomAction")
public class ClassroomAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4998193365612935083L;
	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ClassroomService classroomService;
	private Classroom classroom;


	public String listClassrooms() throws Exception {
		try{
			PageInfo pageInfo = super.initPageInfo();
			Integer orgid = getLoginStaff().getOrgid();
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			PageResult pageResult = this.classroomService.getClassrooms(search, pageInfo, orgid);
			this.setiTotalRecords(pageResult.getTotalCount());
			this.setiTotalDisplayRecords(pageResult.getTotalCount());
			this.setAaData(pageResult.getResult());
			return SUCCESS;

		}catch(Exception ex){
			logger.error("ClassroomAction listClassrooms exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}

	}



	public String doAdd() throws Exception {
		
		if (StringUtils.isBlank(classroom.getName())) {
			logger.error("classroom.name is empty.");
			renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
			return ERROR;

		}
		classroom.setCreatepsnid(getStaffid());
		classroom.setOrgid(getStaffOrgid());
		try {
			Integer id = this.classroomService.addClassroom(classroom);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("ClassroomAction addClassroom exception.", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
		
	}



	public String doUpdate() throws Exception {

		if (classroom.getClassroomid() == null || StringUtils.isBlank(classroom.getName())) {

			logger.error("修改教室失败：无效的参数！");
			renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
			return ERROR;
		}
		classroom.setCreatepsnid(getStaffid());
		classroom.setOrgid(getStaffOrgid());
		try {
		this.classroomService.updateClassroom(classroom);
			return SUCCESS;
		} catch (Exception ex) {

			logger.error("修改教师出现异常！", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}

	}

	public String doDelete() throws Exception {

		if (classroom.getClassroomid() == null) {
			logger.error("删除教室缺少参数Ids！");
			renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
			return ERROR;
		}
	

		try {
			classroomService.deleteClassroom(Arrays.asList(classroom.getClassroomid()), getStaffid(), getStaffOrgid());
			return SUCCESS;
		} catch (Exception ex) {

			logger.error("删除教室异常!", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}

	}

	public Classroom getClassroom() {
		return classroom;
	}

	public void setClassroom(Classroom classroom) {
		this.classroom = classroom;
	}

}
