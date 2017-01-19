package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Pagezone;

public interface PageService {
	public Page selectByPrimaryKey(String pageid);

	public int selectTemplateCount(String search);

	public List<Page> selectTemplateList(String search, String start, String length);

	public int selectPageCount(String orgid, String branchid, String search);

	public List<Page> selectPageList(String orgid, String branchid, String search, String start, String length);

	public void addTemplatePage(Page page);

	public void addCommonPage(Page page);

	public void updatePage(Page page);

	public void deletePage(String pageid);

	public void addPagezone(Pagezone pagezone);

	public void deletePagezone(String pagezoneid);

	public void savePage(Page page);
}
