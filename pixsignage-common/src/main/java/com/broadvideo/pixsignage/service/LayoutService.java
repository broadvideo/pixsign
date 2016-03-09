package com.broadvideo.pixsignage.service;

import java.util.List;

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

	public void design(Layout layout);

	public String handleWizard(Staff staff, Layout layout, Device[] devices, Devicegroup[] devicegroups)
			throws Exception;

	public void addLayoutschedules(Layoutschedule[] layoutschedules, Device[] devices);

	public void addLayoutschedules(Layoutschedule[] layoutschedules, Devicegroup[] devicegroups);

	public void addRegionschedules(Regionschedule[] regionschedules, Device[] devices);

	public void addRegionschedules(Regionschedule[] regionschedules, Devicegroup[] devicegroups);

}
