package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Mediagrid;
import com.broadvideo.pixsignage.domain.Mediagriddtl;

public interface MediagridService {
	public Mediagrid selectByPrimaryKey(String mediagridid);

	public int selectCount(String orgid, String branchid, String status, String gridlayoutcode, String search);

	public List<Mediagrid> selectList(String orgid, String branchid, String status, String gridlayoutcode,
			String search, String start, String length);

	public List<Mediagriddtl> selectMediagriddtlList(String mediagridid);

	public void addMediagrid(Mediagrid mediagrid);

	public void updateMediagrid(Mediagrid mediagrid);

	public void deleteMediagrid(String mediagridid);

	public void design(Mediagrid mediagrid) throws Exception;

	public void checkStatus();

}
