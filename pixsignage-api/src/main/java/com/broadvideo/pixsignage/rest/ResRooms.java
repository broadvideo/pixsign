package com.broadvideo.pixsignage.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Room;
import com.broadvideo.pixsignage.domain.Roomterminal;
import com.broadvideo.pixsignage.persistence.RoomMapper;
import com.broadvideo.pixsignage.persistence.RoomterminalMapper;

@Component
@Path("/rooms")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ResRooms extends ResBase {
	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private RoomMapper roomMapper;
	@Autowired
	private RoomterminalMapper roomterminalMapper;

	@GET
	@Path("/")
	public String getRoomList(String request, @Context HttpServletRequest req,
			@QueryParam("terminal_id") String terminalid, @QueryParam("org_id") Integer orgid) {
		if (StringUtils.isBlank(terminalid) && orgid == null) {
			return handleResult(ApiRetCodeEnum.INVALID_ARGS, "根据terminal_id或者org_id查询房间");
		}
		try {
			logger.info("getRoomList for terminalid:{},orgid:{}", terminalid, orgid);
			RowBounds rowBounds = new RowBounds(0, Integer.MAX_VALUE);
			Room searchRoom = new Room();
			searchRoom.setOrgid(orgid);
			List<Room> roomList = roomMapper.selectList(searchRoom, rowBounds);
			List<Map<String, Object>> dataMapList = new ArrayList<Map<String, Object>>();
			for (Room room : roomList) {
				Map<String, Object> dataMap = new HashMap<String, Object>();
				dataMap.put("room_id", room.getRoomid());
				dataMap.put("room_type", room.getType());
				dataMap.put("name", room.getName());
				dataMapList.add(dataMap);
			}
			return this.handleResult(RetCodeEnum.SUCCESS, "success", dataMapList);
		} catch (Exception e) {

			logger.error("getRoomList exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}

	@GET
	@Path("/room")
	public String getRoomDtl(String request, @Context HttpServletRequest req,
			@QueryParam("terminal_id") String terminalid) {
		logger.info("getRoomDtl for terminalid:{}", terminalid);
		if (StringUtils.isBlank(terminalid)) {
			return handleResult(ApiRetCodeEnum.INVALID_ARGS, "terminal_id不允许为空.");
		}
		try {
		Roomterminal roomterminal = roomterminalMapper.selectRoomterminal(terminalid);
		JSONObject roomJson = new JSONObject();
		if (roomterminal != null) {
			Room room = this.roomMapper.selectByPrimaryKey(roomterminal.getRoomid());
			if (room != null) {
				roomJson.put("room_id", room.getRoomid());
				roomJson.put("room_type", room.getType());
				roomJson.put("name", room.getName());
			}
		}
			return this.handleResult(RetCodeEnum.SUCCESS, "success", roomJson);

		} catch (Exception e) {

			logger.error("getRoomDtl exception.", e);
			return this.handleResult(ApiRetCodeEnum.EXCEPTION, e.getMessage());
		}

	}



}
