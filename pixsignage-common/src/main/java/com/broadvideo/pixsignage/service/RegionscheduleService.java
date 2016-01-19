package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Regionschedule;

public interface RegionscheduleService {
	public List<Regionschedule> selectList(String bindtype, String bindid, String regionid, String playmode,
			String fromdate, String todate);

	public void addRegionschedule(Regionschedule regionschedule);

	public void updateRegionschedule(Regionschedule regionschedule);

	public void deleteRegionschedule(String regionscheduleid);
}
