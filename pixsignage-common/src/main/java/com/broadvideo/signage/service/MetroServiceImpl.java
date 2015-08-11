package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.signage.domain.Metroline;
import com.broadvideo.signage.persistence.MetrolineMapper;

@Service("metroService")
public class MetroServiceImpl implements MetroService {

	@Autowired
	private MetrolineMapper metrolineMapper;

	public List<Metroline> selectMetrolineList() {
		return metrolineMapper.selectList();
	}

}
