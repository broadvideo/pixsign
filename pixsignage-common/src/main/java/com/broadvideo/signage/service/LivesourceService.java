package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Livesource;

public interface LivesourceService {
	public Livesource selectByPrimaryKey(Integer livesourceid);
	public int selectCount(String orgid);
	public List<Livesource> selectList(String orgid, String start, String length);

	public void addLivesource(Livesource livesource);
	public void updateLivesource(Livesource livesource);
	public void deleteLivesource(String[] ids);
	
}
