package com.broadvideo.pixsignage.action;

import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Room;
import com.broadvideo.pixsignage.service.RoomService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("roomAction")
public class RoomAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());
	private Room room;
	@Autowired
	private RoomService roomService;

	public String doList() {
		try {
			PageInfo pageInfo = super.initPageInfo();
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			if (room == null) {
				room = new Room();
			}
			room.setSearch(search);
			room.setOrgid(getStaffOrgid());
			PageResult pageResult = this.roomService.getRoomList(room, pageInfo);
			this.setiTotalRecords(pageResult.getTotalCount());
			this.setiTotalDisplayRecords(pageResult.getTotalCount());
			this.setAaData(pageResult.getResult());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("roomAction doList exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			room.setCreatestaffid(getStaffid());
			room.setCreatetime(new Date());
			room.setOrgid(getStaffOrgid());
			room.setType(1);
			roomService.addRoom(room);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doAdd exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}


	public String doUpdate() {
		try {

			room.setUpdatetime(new Date());
			room.setUpdatestaffid(getStaffid());
			room.setOrgid(getStaffOrgid());
			roomService.updateRoom(room);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doUpdate exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			room.setUpdatestaffid(getStaffid());
			room.setOrgid(getStaffOrgid());
			roomService.deleteRoom(room);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doDelete exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}

	public String doValidate() {
		try {
			if (room.getName() != null) {
				room.setOrgid(getStaffOrgid());
				if (roomService.validateNameCode(room)) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					setErrormsg("名称已存在");
					return ERROR;
				}
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doValidate exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}

	public String listUnbindTerminals() {

		try {
			List devices = this.roomService.listUnbindTerminals(getStaffOrgid());
			this.setAaData(devices);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("meetingroomAction listUnbindTerminals exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}

	public Room getRoom() {
		return room;
	}

	public void setRoom(Room room) {
		this.room = room;
	}





}
