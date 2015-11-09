package com.broadvideo.pixsignage.service;

import java.util.List;

import org.json.JSONObject;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Layout;
import com.broadvideo.pixsignage.domain.Layoutdtl;
import com.broadvideo.pixsignage.domain.Region;
import com.broadvideo.pixsignage.domain.Staff;

public interface LayoutService {
	public Layout selectByPrimaryKey(String layoutid);

	public List<Layout> selectList(String orgid, String type);

	public List<Layoutdtl> selectLayoutdtlList(String layoutid);

	public List<Region> selectRegionList();

	public List<Region> selectActiveRegionList();

	public void addLayout(Layout layout);

	public void updateLayout(Layout layout);

	public void deleteLayout(String layoutid);

	public void syncLayoutdtlList(Layout layout, Layoutdtl[] layoutdtls);

	public String handleWizard(Staff staff, Layout layout, Device[] devices, Devicegroup[] devicegroups);

	public JSONObject generateLayoutScheduleJson(String bindtype, String bindid);

	public JSONObject generateRegionScheduleJson(String bindtype, String bindid, String regionid);
}
