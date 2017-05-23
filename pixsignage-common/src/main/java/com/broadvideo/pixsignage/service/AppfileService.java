package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Appfile;

public interface AppfileService {
	public List<Appfile> selectList(String name, String mtype);

	public Appfile selectLatest(String name, String mtype);

	public void addAppfile(Appfile appfile);

	public void updateAppfile(Appfile appfile);

	public void deleteAppfile(String appfileid);
}
