package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Staff;

public interface PageService {
	public Page selectByPrimaryKey(String pageid);

	public int selectCount(String orgid, String branchid, String touchflag, String homeflag, String search);

	public List<Page> selectList(String orgid, String branchid, String touchflag, String homeflag, String search,
			String start, String length, Staff staff);

	public int selectStaffCount(String pageid, String search);

	public List<Staff> selectStaff(String pageid, String search, String start, String length);

	public int selectStaff2SelectCount(String pageid, String search);

	public List<Staff> selectStaff2Select(String pageid, String search, String start, String length);

	public void addPage(Page page) throws Exception;

	public void copyPage(String frompageid, Page page) throws Exception;

	public void updatePage(Page page);

	public void deletePage(String pageid);

	public void design(Page page) throws Exception;

	public void makeHtmlZip(String pageid) throws Exception;

	public void addStaffs(Page page, String[] staffids);

	public void deleteStaffs(Page page, String[] staffids);

}
