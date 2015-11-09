package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Vchannel;

public interface VchannelService {
	public int selectCount(String orgid, String search);

	public List<Vchannel> selectList(String orgid, String search, String start, String length);

	public void addVchannel(Vchannel vchannel);

	public void updateVchannel(Vchannel vchannel);

	public void deleteVchannel(String vchannelid);
}
