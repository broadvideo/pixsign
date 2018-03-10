package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Org;

public interface OrgService {
	public List<Org> selectList(String vspid, String orgid);

	public Org selectByCode(String code);

	public Org selectByPrimaryKey(String orgid);

	public void addOrg(Org org);

	public void updateOrg(Org org);

	public void addOrg2c(String vspid, String loginname, String phone, String password);

	public void resetPassword(String orgid);

	public void deleteOrg(String orgid);

	public boolean validateName(Org org);

	public boolean validateCode(Org org);

	public void updateCurrentdevices();

	public void updateCurrentstorage();
}
