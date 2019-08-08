package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Intent;

import net.sf.json.JSONObject;

public interface IntentService {
	public int selectCount(String orgid, String search);

	public List<Intent> selectList(String orgid, String search, String start, String length);

	public Intent selectByPrimaryKey(String intentid);

	public void addIntent(Intent intent);

	public void updateIntent(Intent intent);

	public void deleteIntent(String intentid);

	public JSONObject generateAllIntentsJson(String orgid) throws Exception;
}
