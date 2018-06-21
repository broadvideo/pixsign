package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Room;

public interface RoomService {

	PageResult getRoomList(Room room, PageInfo pageinfo);

	Integer addRoom(Room room);

	void updateRoom(Room room);

	void deleteRoom(Room room);

	boolean validateNameCode(Room room);

	List<Device> listUnbindTerminals(Integer orgid);

	void syncRooms(List<Room> rooms, Integer orgid);

}
