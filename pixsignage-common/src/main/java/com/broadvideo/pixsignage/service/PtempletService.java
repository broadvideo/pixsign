package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Ptemplet;

public interface PtempletService {
	public Ptemplet selectByPrimaryKey(String ptempletid);

	public int selectCount(String orgid, String ratio, String publicflag, String search);

	public List<Ptemplet> selectList(String orgid, String ratio, String publicflag, String search, String start,
			String length);

	public void addPtemplet(Ptemplet ptemplet);

	public void copyPtemplet(String fromptempletid, Ptemplet ptemplet) throws Exception;

	public void updatePtemplet(Ptemplet ptemplet);

	public void deletePtemplet(String ptempletid);

	public void design(Ptemplet ptemplet) throws Exception;

}
