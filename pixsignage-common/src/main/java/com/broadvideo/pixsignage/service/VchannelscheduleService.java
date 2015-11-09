package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Vchannelschedule;

public interface VchannelscheduleService {
	public List<Vchannelschedule> selectList(String vchannelid);

	public void addVchannelschedule(Vchannelschedule vchannelschedule);

	public void updateVchannelschedule(Vchannelschedule vchannelschedule);

	public void deleteVchannelschedule(String vchannelscheduleid);

}
