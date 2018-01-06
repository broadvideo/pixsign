package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.session.RowBounds;

import com.broadvideo.pixsignage.domain.Event;

public interface EventMapper {
    int deleteByPrimaryKey(Integer eventid);

    int insert(Event record);

    int insertSelective(Event record);

	List<Event> selectList(Event event, RowBounds rowBounds);
    Event selectByPrimaryKey(Integer eventid);

    int updateByPrimaryKeySelective(Event record);

    int updateByPrimaryKey(Event record);
}