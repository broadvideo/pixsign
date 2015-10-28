package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Selfapply;

public interface SelfapplyService {
	public int selectCount(String status, String search);

	public List<Selfapply> selectList(String status, String search, String start, String length);

	public Selfapply selectByPrimaryKey(String selfapplyid);

	public void addSelfapply(Selfapply selfapply);

	public void updateSelfapply(Selfapply selfapply);

	public void deleteSelfapply(String selfapplyid);
}
