package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.session.RowBounds;

import com.broadvideo.pixsignage.domain.Room;

public interface RoomMapper {
	List<Room> selectList(Room room, RowBounds rowBounds);

	List<Room> selectExists(Room room);

	int updateRoom(Room room);

    int deleteByPrimaryKey(Integer roomid);

    int insert(Room record);

    int insertSelective(Room record);

    Room selectByPrimaryKey(Integer roomid);

    int updateByPrimaryKeySelective(Room record);

    int updateByPrimaryKey(Room record);
}