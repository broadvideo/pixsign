package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Stat;

public interface StatService {
	public List<Stat> selectMediaCount(String orgid, String type);
	public List<Stat> selectFilesizeSum(String orgid);
}
