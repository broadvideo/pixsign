package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Adplandtl;

public interface AdplandtlService {
	public Adplandtl selectByPrimaryKey(String adplandtlid);

	public int selectCount(String adplanid);

	public List<Adplandtl> selectList(String adplanid, String start, String length);

	public void addAdplandtl(Adplandtl adplandtl);

	public void updateAdplandtl(Adplandtl adplandtl);

	public void deleteAdplandtl(String adplandtlid);

}
