package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Region;

public interface RegionService {
	public List<Region> selectList();

	public List<Region> selectActiveList();
}
