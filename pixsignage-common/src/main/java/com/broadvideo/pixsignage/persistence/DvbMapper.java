package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Dvb;

public interface DvbMapper {
	Dvb selectByPrimaryKey(@Param(value = "dvbid") String dvbid);

	int selectCount(@Param(value = "orgid") String orgid);

	List<Dvb> selectList(@Param(value = "orgid") String orgid, @Param(value = "start") String start,
			@Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "dvbid") String dvbid);

	// int insert(Dvb record);

	int insertSelective(Dvb record);

	int updateByPrimaryKeySelective(Dvb record);

	// int updateByPrimaryKey(Dvb record);
}