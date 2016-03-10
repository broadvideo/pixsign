package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Vsp;

public interface VspService {
	public List<Vsp> selectList();

	public Vsp selectByCode(String code);

	public Vsp selectByPrimaryKey(String vspid);

	public void addVsp(Vsp vsp);

	public void updateVsp(Vsp vsp);

	public void deleteVsp(String vspid);

	public boolean validateName(Vsp vsp);

	public boolean validateCode(Vsp vsp);
}
