package com.broadvideo.pixsign.service;

import java.util.List;

import com.broadvideo.pixsign.domain.Config;

public interface ConfigService {
	public List<Config> selectList();

	public String selectValueByCode(String code);

	public void updateConfig(Config config);

	public void updateValue(String code, String value);
}
