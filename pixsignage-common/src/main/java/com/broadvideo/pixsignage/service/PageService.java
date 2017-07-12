package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Page;

public interface PageService {
	public Page selectByPrimaryKey(String pageid);

	public int selectCount(String orgid, String branchid, String touchflag, String homeflag, String search);

	public List<Page> selectList(String orgid, String branchid, String touchflag, String homeflag, String search,
			String start, String length);

	public void addPage(Page page) throws Exception;

	public void copyPage(String frompageid, Page page) throws Exception;

	public void updatePage(Page page);

	public void deletePage(String pageid);

	public void design(Page page) throws Exception;

	public void makeZip(String pageid) throws Exception;
}
