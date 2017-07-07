package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Template;

public interface TemplateService {
	public Template selectByPrimaryKey(String templateid);

	public int selectCount(String orgid, String ratio, String publicflag, String search);

	public List<Template> selectList(String orgid, String ratio, String publicflag, String search, String start,
			String length);

	public void addTemplate(Template template);

	public void copyTemplate(String fromtemplateid, Template template) throws Exception;

	public void updateTemplate(Template template);

	public void deleteTemplate(String templateid);

	public void design(Template template) throws Exception;

}
