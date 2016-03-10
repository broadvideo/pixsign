package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Privilege;

public interface PrivilegeService {
	public List<Privilege> selectSysTreeList();

	public List<Privilege> selectVspTreeList();

	public List<Privilege> selectOrgTreeList(String orgtype);
}
