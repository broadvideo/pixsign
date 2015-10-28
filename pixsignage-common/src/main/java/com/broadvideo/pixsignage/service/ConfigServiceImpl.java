package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Config;
import com.broadvideo.pixsignage.persistence.ConfigMapper;

@Service("configService")
public class ConfigServiceImpl implements ConfigService {

	@Autowired
	private ConfigMapper configMapper;

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
