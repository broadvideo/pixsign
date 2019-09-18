package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Routeguidedtl;

public interface RouteguidedtlService {
	public List<Routeguidedtl> selectList(String routeguideid);

	public Routeguidedtl selectByPrimaryKey(String routeguidedtlid);

	public void addRouteguidedtl(Routeguidedtl routeguidedtl);

	public void updateRouteguidedtl(Routeguidedtl routeguidedtl);

	public void deleteRouteguidedtl(String routeguidedtlid);
}
