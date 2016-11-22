package com.broadvideo.pixsignage.service;

import java.util.List;

import org.json.JSONObject;

import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Bundleschedule;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Staff;

public interface BundleService {
	public int selectCount(String orgid, String branchid, String reviewflag, String touchflag, String homeflag,
			String search);

	public List<Bundle> selectList(String orgid, String branchid, String reviewflag, String touchflag, String homeflag,
			String search, String start, String length);

	public void addBundle(Bundle bundle);

	public void updateBundle(Bundle bundle);

	public void deleteBundle(String bundleid);

	public void design(Bundle bundle) throws Exception;

	public void push(Bundle bundle, Device[] devices, Devicegroup[] devicegroups) throws Exception;

	public void handleWizard(Staff staff, Bundle bundle, Device[] devices, Devicegroup[] devicegroups) throws Exception;

	public void addBundleschedules(Bundleschedule[] bundleschedules);

	public void syncBundleByLayout(String layoutid) throws Exception;

	public void syncBundle(String bundleid) throws Exception;

	public void setBundleReviewWait(String bundleid);

	public void setBundleReviewResut(String bundleid, String reviewflag, String comment);

	public JSONObject generateBundleJson(String bundleid);

	public void syncBundleSchedule(String bindtype, String bindid) throws Exception;

	public JSONObject generateBundleScheduleJson(String bindtype, String bindid);
}
