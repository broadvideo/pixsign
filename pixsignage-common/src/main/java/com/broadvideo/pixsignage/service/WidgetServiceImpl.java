package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Widget;
import com.broadvideo.pixsignage.persistence.WidgetMapper;

@Service("widgetService")
public class WidgetServiceImpl implements WidgetService {

	@Autowired
	private WidgetMapper widgetMapper;

	public Widget selectByPrimaryKey(String widgetid) {
		return widgetMapper.selectByPrimaryKey(widgetid);
	}

	public int selectCount(String orgid) {
		return widgetMapper.selectCount(orgid);
	}

	public List<Widget> selectList(String orgid, String start, String length) {
		return widgetMapper.selectList(orgid, start, length);
	}

	@Transactional
	public void addWidget(Widget widget) {
		widgetMapper.insertSelective(widget);
	}

	@Transactional
	public void updateWidget(Widget widget) {
		widgetMapper.updateByPrimaryKeySelective(widget);
	}

	@Transactional
	public void deleteWidget(String widgetid) {
		widgetMapper.deleteByPrimaryKey(widgetid);
	}

}
