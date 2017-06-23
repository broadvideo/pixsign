package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Ptempletzone;

public interface PtempletzoneMapper {
	Ptempletzone selectByPrimaryKey(@Param(value = "ptempletzoneid") String ptempletzoneid);

	List<Ptempletzone> selectList(@Param(value = "ptempletid") String ptempletid);

	int deleteByPrimaryKey(@Param(value = "ptempletzoneid") String ptempletzoneid);

	// int insert(Ptempletzone record);

	int insertSelective(Ptempletzone record);

	int updateByPrimaryKeySelective(Ptempletzone record);

	int updateByPrimaryKeyWithBLOBs(Ptempletzone record);

	// int updateByPrimaryKey(Ptempletzone record);
}