package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.signage.domain.Config;
import com.broadvideo.signage.persistence.ConfigMapper;

@Service("configService")
public class ConfigServiceImpl implements ConfigService {

	@Autowired
	private ConfigMapper configMapper;

	public Config selectByPrimaryKey(Integer configid) {
		return configMapper.selectByPrimaryKey(configid);
	}

	public List<Config> selectList() {
		return configMapper.selectList();
	}

	public String selectValueByCode(String code) {
		return configMapper.selectValueByCode(code);
	}

	@Transactional
	public void updateConfig(Config config) {
		configMapper.updateByPrimaryKeySelective(config);
	}
}
