package com.broadvideo.pixsignage.action;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Equipment;
import com.broadvideo.pixsignage.service.EquipmentService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("equipmentAction")
public class EquipmentAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Equipment equipment;
	@Autowired
	private EquipmentService equipmentService;


	public String doList() {
		try {
			PageInfo pageInfo=super.initPageInfo();
			String search = getParameter("sSearch");
			Integer meetingroomid = null;
			if (StringUtils.isNotBlank(getParameter("meetingroomid"))) {
				meetingroomid = NumberUtils.toInt(getParameter("meetingroomid"));
			}
			search = SqlUtil.likeEscapeH(search);
			PageResult pageResult = this.equipmentService.getEquipmentList(search, meetingroomid, pageInfo,
					getLoginStaff().getOrgid());
			this.setiTotalRecords(pageResult.getTotalCount());
			this.setiTotalDisplayRecords(pageResult.getTotalCount());
			this.setAaData(pageResult.getResult());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("equipmentAction doList exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {

		try {
			if (equipment == null || StringUtils.isBlank(equipment.getName()) || equipment.getType() == null) {
				renderError(RetCodeEnum.EXCEPTION, "缺少参数");
				return ERROR;
			}
			equipment.setOrgid(getLoginStaff().getOrgid());
			equipment.setCreatestaffid(getLoginStaff().getStaffid());
			equipmentService.addEquipment(equipment);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("equipmentAction doAdd exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}

	}

	public String doUpdate() {
		try {
			if (equipment == null || StringUtils.isBlank(equipment.getName()) || equipment.getType() == null) {
				renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
				return ERROR;
			}
			equipment.setOrgid(getStaffOrgid());
			equipment.setUpdatestaffid(getStaffid());
			equipment.setUpdatetime(new Date());
			equipmentService.updateEquipment(equipment);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("equipmentAction doUpdate exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			if (equipment == null || equipment.getEquipmentid() == null) {
				renderError(RetCodeEnum.EXCEPTION, "缺少参数");
				return ERROR;
			}
			equipment.setOrgid(getStaffOrgid());
			equipment.setUpdatestaffid(getStaffid());
			equipment.setUpdatetime(new Date());
			equipmentService.deleteEquipment(equipment);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("equipmentAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Equipment getEquipment() {
		return equipment;
	}

	public void setEquipment(Equipment equipment) {
		this.equipment = equipment;
	}



	
	



}
