package com.broadvideo.pixcourse.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ConfigDao {
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public String selectValueByCode(String code) {

		List<String> values = jdbcTemplate.queryForList("select value from config where code=?", String.class, code);
		if (values == null || values.size() == 0) {

			return "";
		}
		return values.get(0);

	}
}
