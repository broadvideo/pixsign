package com.broadvideo.pixsignage.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

public interface StatMapper {
	List<HashMap<String, String>> statDevices(@Param(value = "orgid") String orgid,
			@Param(value = "branchid") String branchid);

	List<HashMap<String, String>> statVideoCount(@Param(value = "orgid") String orgid);

	List<HashMap<String, String>> statImageCount(@Param(value = "orgid") String orgid);

	List<HashMap<String, String>> statFilesizeSum(@Param(value = "orgid") String orgid);
}
