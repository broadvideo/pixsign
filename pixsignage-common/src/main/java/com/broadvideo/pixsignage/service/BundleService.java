package com.broadvideo.pixsignage.service;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Staff;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public interface BundleService {
	public Bundle selectByPrimaryKey(String bundleid);

	public int selectCount(String orgid, String branchid, String reviewflag, String touchflag, String homeflag,
			String search);

	public List<Bundle> selectList(String orgid, String branchid, String reviewflag, String touchflag, String homeflag,
			String search, String start, String length);

	public List<Bundle> selectExportList();

	public void addBundle(Bundle bundle) throws Exception;

	public void copyBundle(String frombundleid, Bundle bundle) throws Exception;

	public void updateBundle(Bundle bundle);

	public void deleteBundle(String bundleid);

	public void design(Bundle bundle) throws Exception;

	public void makeJsonFile(String bundleid) throws Exception;

	public void push(Bundle bundle, HashMap<String, Object>[] binds) throws Exception;

	public void handleWizard(Staff staff, Bundle bundle, HashMap<String, Object>[] binds) throws Exception;

	public void setBundleReviewWait(String bundleid);

	public void setBundleReviewResut(String bundleid, String reviewflag, String comment) throws Exception;

	public JSONObject generateBundleJson(String bundleid);

	public JSONArray generateBundleJsonArray(List<Integer> bundleids);

	public Bundle importZip(Integer orgid, Integer branchid, File zipFile) throws Exception;

}
