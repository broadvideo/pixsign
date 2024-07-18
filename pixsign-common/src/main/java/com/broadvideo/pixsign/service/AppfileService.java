package com.broadvideo.pixsign.service;

import java.util.List;

import com.broadvideo.pixsign.domain.Appfile;

public interface AppfileService {
	public List<Appfile> selectList(String name, String mtype);

	public Appfile selectLatest(String name, String mtype);

	public void addAppfile(Appfile appfile);

	public void updateAppfile(Appfile appfile);

	public void deleteAppfile(String appfileid);
}
