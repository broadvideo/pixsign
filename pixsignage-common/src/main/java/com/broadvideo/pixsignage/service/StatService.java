package com.broadvideo.pixsignage.service;

import java.util.HashMap;
import java.util.List;

public interface StatService {
	public List<HashMap<String, String>> statDevices(String orgid, String branchid, String cataitemid1,
			String cataitemid2);

	public List<HashMap<String, String>> statVideoCount(String orgid);

	public List<HashMap<String, String>> statImageCount(String orgid);

	public List<HashMap<String, String>> statFilesizeSum(String orgid);
}
