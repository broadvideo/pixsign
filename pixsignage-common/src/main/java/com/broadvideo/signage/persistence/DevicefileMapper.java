package com.broadvideo.signage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.signage.domain.Devicefile;

public interface DevicefileMapper {
	Devicefile selectByPrimaryKey(@Param(value = "devicefileid") String devicefileid);

	int selectCountByDevice(@Param(value = "filetype") String filetype, @Param(value = "deviceid") String deviceid);

	List<Devicefile> selectByDevice(@Param(value = "deviceid") String deviceid,
			@Param(value = "filetype") String filetype, @Param(value = "syncstatus") String syncstatus,
			@Param(value = "start") String start, @Param(value = "length") String length);

	List<Devicefile> selectByFile(@Param(value = "deviceid") String deviceid,
			@Param(value = "filetype") String filetype, @Param(value = "fileid") String fileid);

	List<Devicefile> selectDownloadingFileByDevice(@Param(value = "deviceid") String deviceid);

	int insert(Devicefile record);

	int insertSelective(Devicefile record);

	int updateByPrimaryKeySelective(Devicefile record);

	int updateByPrimaryKey(Devicefile record);

	int deleteByKeys(String ids);

	int updateByUuid(@Param(value = "mediaid") String mediaid, @Param(value = "uuid") String uuid);
}