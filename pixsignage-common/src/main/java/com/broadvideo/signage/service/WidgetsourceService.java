package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Widgetsource;

public interface WidgetsourceService {
	public Widgetsource selectByPrimaryKey(Integer widgetsourceid);
	public int selectCount(String orgid);
	public List<Widgetsource> selectList(String orgid, String start, String length);

	public void addWidgetsource(Widgetsource widgetsource);
	public void updateWidgetsource(Widgetsource widgetsource);
	public void deleteWidgetsource(String[] ids);
	
}
