package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Service;

import com.broadvideo.pixsignage.domain.Region;
import com.broadvideo.pixsignage.persistence.RegionMapper;

@Service("regionService")
public class RegionServiceImpl implements RegionService {

	@Autowired
	private RegionMapper regionMapper;
	@Autowired
	protected ResourceBundleMessageSource messageSource;

	public List<Region> selectList() {
		List<Region> regionList = regionMapper.selectList();
		for (Region region : regionList) {
			region.translate(messageSource);
		}
		return regionList;
	}

	public List<Region> selectActiveList() {
		List<Region> regionList = regionMapper.selectActiveList();
		for (Region region : regionList) {
			region.translate(messageSource);
		}
		return regionList;
	}
}
