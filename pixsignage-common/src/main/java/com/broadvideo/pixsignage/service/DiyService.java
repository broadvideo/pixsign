package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Diy;

public interface DiyService {
	public Diy selectByPrimaryKey(String diyid);

	public int selectCount(String orgid, String branchid, String search);

	public List<Diy> selectList(String orgid, String branchid, String search, String start, String length);

	public Diy selectByCode(String code);

	public void uploadDiy(Diy diy);

	public void updateDiy(Diy diy);

	public void deleteDiy(String diyid);

}
