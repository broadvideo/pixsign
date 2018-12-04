package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Adplan;

public interface AdplanService {
	public Adplan selectByPrimaryKey(String adplanid);

	public int selectCount(String orgid);

	public List<Adplan> selectList(String orgid, String start, String length);

	public void addAdplan(Adplan adplan);

	public void updateAdplan(Adplan adplan);

	public void deleteAdplan(String adplanid);

}
