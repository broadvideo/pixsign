package com.broadvideo.pixsignage.service;

import java.util.HashMap;
import java.util.List;

public interface StatService {
	public List<HashMap<String, String>> selectVideoCount(String orgid);

	public List<HashMap<String, String>> selectImageCount(String orgid);

	public List<HashMap<String, String>> selectFilesizeSum(String orgid);
}
