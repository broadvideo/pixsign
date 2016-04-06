package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Medialist;
import com.broadvideo.pixsignage.domain.Medialistdtl;

public interface MedialistService {
	public int selectCount(int orgid, String branchid, String search);

	public List<Medialist> selectList(int orgid, String branchid, String search, String start, String length);

	public List<Medialistdtl> selectMedialistdtlList(String medialistid);

	public void addMedialist(Medialist medialist);

	public void updateMedialist(Medialist medialist);

	public void deleteMedialist(String medialistid);

	public void syncMedialistdtlList(Medialist medialist, Medialistdtl[] medialistdtls);
}
