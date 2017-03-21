package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Oplog;

public interface OplogService {
	public Oplog selectByPrimaryKey(String oplogid);

	public int selectCount(String orgid, String branchid, String type, String search);

	public List<Oplog> selectList(String orgid, String branchid, String type, String search, String start,
			String length);

	public void addOplog(Oplog oplog);

	public void updateOplog(Oplog oplog);

	public void deleteOplog(String oplogid);

}
