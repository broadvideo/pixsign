package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Onlinelog;

public interface OnlinelogService {
	public Onlinelog selectByPrimaryKey(String onlinelogid);

	public int selectCount(String orgid, String deviceid);

	public List<Onlinelog> selectList(String orgid, String deviceid, String start, String length);

	public void addOnlinelog(Onlinelog onlinelog);

	public void updateOnlinelog(Onlinelog onlinelog);

	public void deleteOnlinelog(String onlinelogid);

	public void updateAll();

	public void updateLast2Offline(String deviceid);

	public void updateLast2Online(String deviceid);
}
