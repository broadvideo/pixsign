package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Text;

public interface TextMapper {
	Text selectByPrimaryKey(@Param(value = "textid") String textid);

	int selectCount(@Param(value = "orgid") String orgid);

	List<Text> selectList(@Param(value = "orgid") String orgid, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "textid") String textid);

	// int insert(Text record);

	int insertSelective(Text record);

	int updateByPrimaryKeySelective(Text record);

	int updateByPrimaryKeyWithBLOBs(Text record);

	// int updateByPrimaryKey(Text record);
}