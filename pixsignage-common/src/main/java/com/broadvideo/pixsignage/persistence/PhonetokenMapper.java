package com.broadvideo.pixsignage.persistence;

import com.broadvideo.pixsignage.domain.Phonetoken;

public interface PhonetokenMapper {
	int deleteByPrimaryKey(String phone);

	int insert(Phonetoken record);

	int insertSelective(Phonetoken record);

	Phonetoken selectByPrimaryKey(String phone);

	int updateByPrimaryKeySelective(Phonetoken record);

	int updateByPrimaryKey(Phonetoken record);
}