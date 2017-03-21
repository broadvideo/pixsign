package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Widget;

public interface WidgetService {
	public Widget selectByPrimaryKey(String widgetid);

	public int selectCount(String orgid, String branchid, String search);

	public List<Widget> selectList(String orgid, String branchid, String search, String start, String length);

	public void addWidget(Widget widget);

	public void updateWidget(Widget widget);

	public void deleteWidget(String widgetid);

}
