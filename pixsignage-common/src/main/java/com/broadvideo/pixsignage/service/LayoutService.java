package com.broadvideo.pixsignage.service;

import java.util.List;

import org.json.JSONObject;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Layout;
import com.broadvideo.pixsignage.domain.Layoutdtl;
import com.broadvideo.pixsignage.domain.Layoutschedule;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.domain.Staff;

public interface LayoutService {
	public Layout selectByPrimaryKey(String layoutid);

	public List<Layout> selectList(String orgid, String type);

	public List<Layoutdtl> selectLayoutdtlList(String layoutid);

	public void addLayout(Layout layout);

	public void updateLayout(Layout layout);

	public void deleteLayout(String layoutid);

	public void design(Layout layout, Layoutdtl[] layoutdtls);

	public String handleWizard(Staff staff, Layout layout, Device[] devices, Devicegroup[] devicegroups)
			throws Exception;

	public void addLayoutschedules(Layoutschedule[] layoutschedules, Device[] devices);

	public void addLayoutschedules(Layoutschedule[] layoutschedules, Devicegroup[] devicegroups);

	public void addRegionschedules(Regionschedule[] regionschedules, Device[] devices);

	public void addRegionschedules(Regionschedule[] regionschedules, Devicegroup[] devicegroups);

	public void syncLayoutschedule(String bindtype, String bindid) throws Exception;

	public JSONObject generateLayoutScheduleJson(String bindtype, String bindid);

	public void syncRegionschedule(String bindtype, String bindid) throws Exception;

	public JSONObject generateRegionScheduleJson(String bindtype, String bindid, String regionid);

	public void syncLayoutscheduleByLayout(String layoutid) throws Exception;
}
