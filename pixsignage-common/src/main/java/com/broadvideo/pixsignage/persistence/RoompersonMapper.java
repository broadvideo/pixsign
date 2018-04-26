package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Roomperson;

public interface RoompersonMapper {
    int deleteByPrimaryKey(Integer roompersonid);

	int deleteByRoomid(@Param("roomid") Integer roomid);

    int insert(Roomperson record);

    int insertSelective(Roomperson record);

    Roomperson selectByPrimaryKey(Integer roompersonid);

	List<Roomperson> selectByRoomid(@Param("roomid") Integer roomid);

    int updateByPrimaryKeySelective(Roomperson record);

    int updateByPrimaryKey(Roomperson record);

}