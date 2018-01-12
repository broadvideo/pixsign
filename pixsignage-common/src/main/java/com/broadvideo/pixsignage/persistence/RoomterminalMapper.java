package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Roomterminal;

public interface RoomterminalMapper {
    int deleteByPrimaryKey(Integer roomterminalid);

	int deleteByRoomid(@Param("roomid") Integer roomid);

    int insert(Roomterminal record);

    int insertSelective(Roomterminal record);

    Roomterminal selectByPrimaryKey(Integer roomterminalid);

	List<Roomterminal> selectByRoomid(@Param("roomid") Integer roomid);

	Roomterminal selectRoomterminal(@Param("terminalid") String terminalid);

    int updateByPrimaryKeySelective(Roomterminal record);

    int updateByPrimaryKey(Roomterminal record);
}