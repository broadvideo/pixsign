package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Wxdeviceapply;

public interface WxdeviceapplyService {
	public Wxdeviceapply selectByPrimaryKey(String wxdeviceapplyid);

	public int selectCount(String orgid);

	public List<Wxdeviceapply> selectList(String orgid, String start, String length);

	public void addWxdeviceapply(Wxdeviceapply wxdeviceapply);

	public void updateWxdeviceapply(Wxdeviceapply wxdeviceapply);

}
