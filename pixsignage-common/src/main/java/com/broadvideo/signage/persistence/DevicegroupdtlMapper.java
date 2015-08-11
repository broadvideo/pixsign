package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Devicegroupdtl;

public interface DevicegroupdtlMapper {
    int deleteByKeys(String ids);

    int insert(Devicegroupdtl record);
    int insertSelective(Devicegroupdtl record);

    Devicegroupdtl selectByPrimaryKey(Integer devicegroupdtlid);
	public int selectCountByDeviceGroup(@Param(value="devicegroupid") String devicegroupid);
	public List<Devicegroupdtl> selectListByDeviceGroup(@Param(value="devicegroupid") String devicegroupid, 
			@Param(value="start") String start, @Param(value="length") String length);
	public List<Devicegroupdtl> selectListByDevice(@Param(value="deviceid") String deviceid);

    int updateByPrimaryKeySelective(Devicegroupdtl record);
    int updateByPrimaryKey(Devicegroupdtl record);
}