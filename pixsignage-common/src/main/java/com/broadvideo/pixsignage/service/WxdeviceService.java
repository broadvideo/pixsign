package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Wxdevice;

public interface WxdeviceService {
	public Wxdevice selectByPrimaryKey(String wxdeviceid);

	public int selectCount(String orgid, String wxdeviceapplyid);

	public List<Wxdevice> selectList(String orgid, String wxdeviceapplyid, String start, String length);

	public void addWxdevice(Wxdevice wxdevice);

	public void updateWxdevice(Wxdevice wxdevice);

	public void syncWxdevice(Wxdevice wxdevice);

}
