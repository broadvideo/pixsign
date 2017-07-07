package com.broadvideo.pixsignage.service;

import java.util.List;

import org.json.JSONArray;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Page;

public interface PageService {
	public Page selectByPrimaryKey(String pageid);

	public int selectCount(String orgid, String branchid, String search);

	public List<Page> selectList(String orgid, String branchid, String search, String start, String length);

	public void addPage(Page page) throws Exception;

	public void copyPage(String frompageid, Page page) throws Exception;

	public void updatePage(Page page);

	public void deletePage(String pageid);

	public void design(Page page) throws Exception;

	public void push(Page page, Device[] devices, Devicegroup[] devicegroups) throws Exception;

	public JSONArray generatePageJsonArray(List<Integer> pageids);
}
