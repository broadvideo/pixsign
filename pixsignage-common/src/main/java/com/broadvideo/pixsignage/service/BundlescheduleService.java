package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Bundleschedule;

public interface BundlescheduleService {
	public List<Bundleschedule> selectList(String bindtype, String bindid);

	public void addBundleschedule(Bundleschedule bundleschedule);

	public void updateBundleschedule(Bundleschedule bundleschedule);

	public void deleteBundleschedule(String bundlescheduleid);
}
