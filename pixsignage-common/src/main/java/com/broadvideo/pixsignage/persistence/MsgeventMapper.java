package com.broadvideo.pixsignage.persistence;

import com.broadvideo.pixsignage.domain.Msgevent;

public interface MsgeventMapper {
	Msgevent selectByPrimaryKey(Integer msgeventid);

	int deleteByPrimaryKey(Integer msgeventid);

	// int insert(Msgevent record);

	int insertSelective(Msgevent record);

	int updateByPrimaryKeySelective(Msgevent record);

	// int updateByPrimaryKey(Msgevent record);
}