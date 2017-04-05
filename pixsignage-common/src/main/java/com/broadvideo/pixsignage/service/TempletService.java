package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Templet;

public interface TempletService {
	public Templet selectByPrimaryKey(String templetid);

	public int selectCount(String orgid, String ratio, String touchflag, String homeflag, String publicflag,
			String search);

	public List<Templet> selectList(String orgid, String ratio, String touchflag, String homeflag, String publicflag,
			String search, String start, String length);

	public void addTemplet(Templet templet);

	public void copyTemplet(String fromtempletid, Templet templet) throws Exception;

	public void updateTemplet(Templet templet);

	public void deleteTemplet(String templetid);

	public void design(Templet templet) throws Exception;

}
