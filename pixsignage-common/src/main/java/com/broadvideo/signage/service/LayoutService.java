package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Layout;
import com.broadvideo.signage.domain.Regiondtl;
import com.broadvideo.signage.domain.Task;

public interface LayoutService {
	public int selectCount(int orgid, int branchid, String search);
	public List<Layout> selectList(int orgid, int branchid, String search, String start, String length);
	public Layout selectByPrimaryKey(String layoutid);
	public Layout selectWithXmlByPrimaryKey(String layoutid);
	public String selectPreviewXlf(String layoutid);

	public void addLayout(Layout layout, int tpllayoutid);
	public void updateLayout(Layout layout);
	public void updateLayoutWithRegion(Layout layout);
	public void handleWizard(Layout layout, Task task);
	public void deleteLayout(String[] ids);
	
	public Regiondtl selectRegiondtl(String regiondtlid);
}
