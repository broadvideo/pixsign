package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Layoutschedule;

public interface LayoutscheduleService {
	public List<Layoutschedule> selectList(String bindtype, String bindid);

	public void addLayoutschedule(Layoutschedule layoutschedule);

	public void updateLayoutschedule(Layoutschedule layoutschedule);

	public void deleteLayoutschedule(String layoutscheduleid);
}
