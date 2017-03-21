package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Dvb;

public interface DvbService {
	public Dvb selectByPrimaryKey(String dvbid);

	public int selectCount(String orgid, String branchid, String status, String search);

	public List<Dvb> selectList(String orgid, String branchid, String status, String search, String start,
			String length);

	public void addDvb(Dvb dvb);

	public void updateDvb(Dvb dvb);

	public void deleteDvb(String dvbid);

}
