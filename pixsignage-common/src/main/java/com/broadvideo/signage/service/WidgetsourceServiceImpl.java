package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.signage.domain.Widgetsource;
import com.broadvideo.signage.persistence.WidgetsourceMapper;

@Service("widgetsourceService")
public class WidgetsourceServiceImpl implements WidgetsourceService {

	@Autowired
	private WidgetsourceMapper widgetsourceMapper ;
	
	public Widgetsource selectByPrimaryKey(Integer widgetsourceid) {
		return widgetsourceMapper.selectByPrimaryKey(widgetsourceid);
	}
	
	public int selectCount(String orgid) {
		return widgetsourceMapper.selectCount(orgid);
	}
	
	public List<Widgetsource> selectList(String orgid, String start, String length) {
		return widgetsourceMapper.selectList(orgid, start, length);
	}
	
	@Transactional
	public void addWidgetsource(Widgetsource widgetsource) {
		widgetsourceMapper.insert(widgetsource);
	}
	
	public void updateWidgetsource(Widgetsource widgetsource) {
		widgetsourceMapper.updateByPrimaryKeySelective(widgetsource);
	}
	
	public void deleteWidgetsource(String[] ids) {
		String s = "";
		if (ids.length > 0) s = ids[0];
		for (int i=1; i<ids.length; i++) {
			s += "," + ids[i];
		}
		widgetsourceMapper.deleteByKeys(s);
	}

}
