package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageRetRespEntity;
import com.broadvideo.pixsignage.common.ResponseUtil;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Classroom;
import com.broadvideo.pixsignage.service.ClassroomService;

@Scope("request")
@Controller("classroomAction")
public class ClassroomAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4998193365612935083L;
	private final Logger logger = LoggerFactory.getLogger(getClass());
	private PageInfo<Map<String, Object>> page = new PageInfo<Map<String, Object>>(10);
	@Autowired
	private ClassroomService classroomService;
	private Classroom classroom;


	public String listClassrooms() throws Exception {
		try{
			String strPageNo = getParameter("pageNo");
			String strPageSize = getParameter("pageSize");
			String searchKey = getParameter("searchKey");
			Integer orgId = getLoginStaff().getOrgid();
		if (NumberUtils.isNumber(strPageNo)) {
			page.setPageNo(NumberUtils.toInt(strPageNo));
		}
		if (NumberUtils.isNumber(strPageSize)) {
			page.setPageSize(NumberUtils.toInt(strPageSize));
		}
			this.classroomService.getClassrooms(searchKey, page, orgId);
			List<Map<String, Object>> results = page.getResult();
			int recordsTotal = (results == null ? 0 : page.getTotalCount());
			PageRetRespEntity respEntity = new PageRetRespEntity(RetCodeEnum.SUCCESS, null, recordsTotal, recordsTotal,
					results);
			ResponseUtil.responseJson(respEntity);
			return NONE;

		}catch(Exception ex){
			logger.error("ClassroomAction listClassrooms exception, ", ex);
			renderError(-1, ex.getMessage());
			return ERROR;
		}

	}



	public String addClassroom() throws Exception {
		
		if (StringUtils.isBlank(classroom.getName())) {
			logger.error("classroom.name is empty.");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args");
			return NONE;

		}
		classroom.setCreatepsnid(getStaffid());
		classroom.setOrgid(getStaffOrgid());
		try {
			Integer id = this.classroomService.addClassroom(classroom);
			ResponseUtil.idRetResonse(id, null);
		} catch (Exception ex) {
			logger.error("ClassroomAction addClassroom exception.", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());
		}
		
		return NONE;
	}

	public String loadClassRoom() throws Exception {
		String id = getParameter("id");
		if (StringUtils.isBlank(id) || !NumberUtils.isNumber(id)) {
			logger.error("获取教室详情：无效的参数！");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args.");
			return NONE;
		}
		try {
			Classroom classroom = this.classroomService.loadClassroom(NumberUtils.toInt(id), getStaffOrgid());
			JSONObject data = new JSONObject();
			data.put("id", classroom.getId());
			data.put("name", classroom.getName());
			data.put("description", classroom.getDescription());
			data.put("create_time", classroom.getCreatetime().getTime());

			ResponseUtil.objectRetResponse(data, "");
		} catch (Exception ex) {
			logger.error("获取教室信息出现异常!", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());

		}
		return NONE;
	}

	public String updateClassroom() throws Exception {

		if (classroom.getId() == null || StringUtils.isBlank(classroom.getName())) {

			logger.error("修改教室失败：无效的参数！");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Invalid args.");
			return NONE;
		}
		classroom.setCreatepsnid(getStaffid());
		classroom.setOrgid(getStaffOrgid());
		try {
		this.classroomService.updateClassroom(classroom);
			ResponseUtil.codeResponse(RetCodeEnum.SUCCESS, "");
		} catch (Exception ex) {

			logger.error("修改教师出现异常！", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());
		}

		return NONE;
	}

	public String deleteClassroom() throws Exception {

		String ids = getParameter("ids");
		if (StringUtils.isBlank(ids)) {
			logger.error("删除教室缺少参数Ids！");
			ResponseUtil.codeResponse(RetCodeEnum.INVALID_ARGS, "Ids is empty.");
			return NONE;
		}
		String[] strIds = ids.split(",");
		List<Integer> idList=new ArrayList<Integer>();
		for(String strId : strIds){
			idList.add(NumberUtils.toInt(strId));
		}
	
		try {
			classroomService.deleteClassroom(idList, getStaffid(), getStaffOrgid());
			ResponseUtil.codeResponse(RetCodeEnum.SUCCESS, "");
		} catch (Exception ex) {

			logger.error("删除教室异常!", ex);
			ResponseUtil.codeResponse(RetCodeEnum.EXCEPTION, ex.getMessage());

		}


		return NONE;
	}

	public Classroom getClassroom() {
		return classroom;
	}

	public void setClassroom(Classroom classroom) {
		this.classroom = classroom;
	}

}
