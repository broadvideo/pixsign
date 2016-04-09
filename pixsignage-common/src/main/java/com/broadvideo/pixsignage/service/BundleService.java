package com.broadvideo.pixsignage.service;

import java.util.List;

import org.json.JSONObject;

import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Bundleschedule;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Staff;

public interface BundleService {
	public int selectCount(String orgid, String branchid, String search);

	public List<Bundle> selectList(String orgid, String branchid, String search, String start, String length);

	public void addBundle(Bundle bundle);

	public void updateBundle(Bundle bundle);

	public void deleteBundle(String bundleid);

	public void design(Bundle bundle);

	public void push(Bundle bundle, Device[] devices, Devicegroup[] devicegroups) throws Exception;

	public void handleWizard(Staff staff, Bundle bundle, Device[] devices, Devicegroup[] devicegroups) throws Exception;

	public void addBundleschedules(Bundleschedule[] bundleschedules);

	public void syncBundleLayout(String bindtype, String bindid) throws Exception;

	public JSONObject generateBundleLayoutJson(String bindtype, String bindid);

	public void syncBundleRegions(String bindtype, String bindid) throws Exception;

	public JSONObject generateBundleRegionJson(String bindtype, String bindid, String regionid);

	public void syncBundleLayoutByLayout(String layoutid) throws Exception;

	public void syncBundle(String bundleid) throws Exception;
}
