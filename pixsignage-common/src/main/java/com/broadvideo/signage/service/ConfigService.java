package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Config;

public interface ConfigService {
	public Config selectByPrimaryKey(Integer configid);

	public List<Config> selectList();

	public String selectValueByCode(String code);

	public void updateConfig(Config config);
}
