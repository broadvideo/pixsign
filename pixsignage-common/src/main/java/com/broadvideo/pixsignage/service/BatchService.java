package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Batch;

public interface BatchService {
	public Batch selectByPrimaryKey(String batchid);

	public int selectCount(String search);

	public List<Batch> selectList(String search, String start, String length);

	public void addBatch(Batch batch);
}
