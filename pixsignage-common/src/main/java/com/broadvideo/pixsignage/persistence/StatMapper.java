package com.broadvideo.pixsignage.persistence;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

public interface StatMapper {
	List<HashMap<String, String>> selectVideoCount(@Param(value = "orgid") String orgid);

	List<HashMap<String, String>> selectImageCount(@Param(value = "orgid") String orgid);

	List<HashMap<String, String>> selectFilesizeSum(@Param(value = "orgid") String orgid);
}
