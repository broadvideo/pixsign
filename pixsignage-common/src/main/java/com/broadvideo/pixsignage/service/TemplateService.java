package com.broadvideo.pixsignage.service;

import java.io.File;
import java.util.List;

import com.broadvideo.pixsignage.domain.Template;

public interface TemplateService {
	public Template selectByPrimaryKey(String templateid);

	public Template selectByUuid(String uuid);

	public int selectCount(String orgid, String ratio, String touchflag, String homeflag, String publicflag,
			String search);

	public List<Template> selectList(String orgid, String ratio, String touchflag, String homeflag, String publicflag,
			String search, String start, String length);

	public void addTemplate(Template template);

	public void copyTemplate(String fromtemplateid, Template template) throws Exception;

	public void updateTemplate(Template template);

	public void deleteTemplate(String templateid);

	public void design(Template template) throws Exception;

	public void saveFromPage(String pageid) throws Exception;

	public void exportZip(String templateid) throws Exception;

	public void importZip(File zipfile) throws Exception;

	public String fetch(String sourceid) throws Exception;

}
