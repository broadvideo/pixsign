package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Templet;

public interface TempletService {
	public Templet selectByPrimaryKey(String templetid);

	public int selectCount(String orgid, String touchflag, String homeflag, String search);

	public List<Templet> selectList(String orgid, String touchflag, String homeflag, String search, String start,
			String length);

	public void addTemplet(Templet templet);

	public void updateTemplet(Templet templet);

	public void deleteTemplet(String templetid);

	public void design(Templet templet) throws Exception;

}
