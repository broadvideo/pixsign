package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Layout;
import com.broadvideo.pixsignage.domain.Layoutdtl;

public interface LayoutService {
	public Layout selectByPrimaryKey(String layoutid);

	public List<Layout> selectList(String orgid, String branchid);

	public List<Layout> selectPublicList(String orgid, String branchid);

	public List<Layoutdtl> selectLayoutdtlList(String layoutid);

	public void addLayout(Layout layout);

	public void updateLayout(Layout layout);

	public void deleteLayout(String layoutid);

	public void addLayoutdtl(Layoutdtl layoutdtl);

	public void deleteLayoutdtl(String layoutdtlid);

	public void design(Layout layout);

}
