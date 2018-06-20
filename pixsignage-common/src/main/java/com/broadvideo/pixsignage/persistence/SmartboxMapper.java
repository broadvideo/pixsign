package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.broadvideo.pixsignage.domain.Smartbox;

public interface SmartboxMapper {
	int deleteByPrimaryKey(Integer smartboxid);

	int insert(Smartbox record);

	int insertSelective(Smartbox record);

	List<Smartbox> selectList(@Param("search") String search, @Param("orgid") Integer orgid, RowBounds rowBounds);

	Smartbox selectByTerminalid(@Param("terminalid") String terminalid, @Param("orgid") Integer orgid);

	Smartbox selectByPrimaryKey(Integer smartboxid);

	int updateByPrimaryKeySelective(Smartbox record);

	int updateByPrimaryKey(Smartbox record);
}