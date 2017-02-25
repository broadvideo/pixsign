package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Privilege;

public interface PrivilegeService {
	public Privilege selectByPrimaryKey(String privilegeid);

	public List<Privilege> selectSysTreeList();

	public List<Privilege> selectVspTreeList();

	public List<Privilege> selectOrgTreeList(Org org);
}
