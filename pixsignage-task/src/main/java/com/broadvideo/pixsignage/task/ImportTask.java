package com.broadvideo.pixsignage.task;

import java.io.File;
import java.io.FilenameFilter;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Template;
import com.broadvideo.pixsignage.domain.Templatezone;
import com.broadvideo.pixsignage.domain.Templatezonedtl;
import com.broadvideo.pixsignage.service.BundleService;
import com.broadvideo.pixsignage.service.PageService;
import com.broadvideo.pixsignage.service.TemplateService;

import net.sf.json.JSONObject;

public class ImportTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private BundleService bundleService;
	@Autowired
	private PageService pageService;
	@Autowired
	private TemplateService templateService;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;

			File[] zips = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/import").listFiles(new FilenameFilter() {
				@Override
				public boolean accept(File file, String name) {
					return (name.startsWith("bundle") || name.startsWith("page-") || name.startsWith("template-"))
							&& name.endsWith(".zip");
				}
			});
			if (zips == null) {
				zips = new File[0];
			}
			for (int i = 0; i < zips.length; i++) {
				if (zips[i].getName().startsWith("bundle")) {
					logger.info("Begin to import bundle {}", zips[i].getAbsolutePath());
					bundleService.importZip(1, 1, zips[i]);
				} else if (zips[i].getName().startsWith("page-")) {
					logger.info("Begin to import page {}", zips[i].getAbsolutePath());
					pageService.importZip(1, 1, zips[i]);
				} else if (zips[i].getName().startsWith("template-")) {
					logger.info("Begin to import template {}", zips[i].getAbsolutePath());
					templateService.importZip(zips[i]);
				}
			}
		} catch (Exception e) {
			logger.error("ImportTask Quartz Task error: {}", e);
		}
		workflag = false;
	}

	public static void main(String args[]) {
		try {
			JSONObject templateJson = JSONObject
					.fromObject(FileUtils.readFileToString(new File("D:/pixdata/pixsignage/template/8/8.jsf")));
			Map<String, Class> map = new HashMap<String, Class>();
			map.put("templatezones", Templatezone.class);
			map.put("templatezonedtls", Templatezonedtl.class);
			Template template = (Template) JSONObject.toBean(templateJson, Template.class, map);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
