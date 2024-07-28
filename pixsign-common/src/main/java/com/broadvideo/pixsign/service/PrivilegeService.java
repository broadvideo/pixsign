package com.broadvideo.pixsign.service;

import java.util.List;

import com.broadvideo.pixsign.domain.Org;
import com.broadvideo.pixsign.domain.Privilege;

public interface PrivilegeService {
	public Privilege selectByPrimaryKey(String privilegeid);

	public List<Privilege> selectSysTreeList();

	public List<Privilege> selectOrgTreeList(Org org);
}
