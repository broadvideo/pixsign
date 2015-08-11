package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Org;

public interface OrgService {
	public List<Org> selectList();

	public Org selectByCode(String code);

	public Org selectByPrimaryKey(Integer orgid);

	public void addOrg(Org org);

	public void updateOrg(Org org);

	public void deleteOrg(String[] ids);

	public boolean validateName(Org org);

	public boolean validateCode(Org org);

	public void updateCurrentdevices();

	public void updateCurrentstorage();
}
