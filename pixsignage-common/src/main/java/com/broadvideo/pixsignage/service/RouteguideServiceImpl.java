package com.broadvideo.pixsignage.service;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.domain.Route;
import com.broadvideo.pixsignage.domain.Routeguide;
import com.broadvideo.pixsignage.domain.Routeguidedtl;
import com.broadvideo.pixsignage.persistence.RouteMapper;
import com.broadvideo.pixsignage.persistence.RouteguideMapper;
import com.broadvideo.pixsignage.persistence.RouteguidedtlMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service("routeguideService")
public class RouteguideServiceImpl implements RouteguideService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private RouteguideMapper routeguideMapper;
	@Autowired
	private RouteguidedtlMapper routeguidedtlMapper;
	@Autowired
	private RouteMapper routeMapper;

	public List<Routeguide> selectList() {
		return routeguideMapper.selectList();
	}

	public List<Route> selectRouteList() {
		return routeMapper.selectList();
	}

	public Routeguide selectByCode(String code) {
		return routeguideMapper.selectByCode(code);
	}

	public Routeguide selectByPrimaryKey(String routeguideid) {
		return routeguideMapper.selectByPrimaryKey(routeguideid);
	}

	@Transactional
	public void addRouteguide(Routeguide routeguide) {
		routeguideMapper.insertSelective(routeguide);
	}

	@Transactional
	public void updateRouteguide(Routeguide routeguide) {
		routeguideMapper.updateByPrimaryKeySelective(routeguide);
	}

	@Transactional
	public void deleteRouteguide(String routeguideid) {
		routeguideMapper.deleteByPrimaryKey(routeguideid);
	}

	public void zipRouteguide(String routeguideid) throws Exception {
		logger.info("Begin to make routeguide zip, routeguideid={}", routeguideid);
		Routeguide routeguide = routeguideMapper.selectByPrimaryKey(routeguideid);
		List<Routeguidedtl> routeguidedtls = routeguidedtlMapper.selectList(routeguideid);
		String saveDir = CommonConfig.CONFIG_PIXDATA_HOME + "/routeguide/" + routeguideid;
		String zipname = routeguide.getCode() + ".zip";
		FileUtils.forceMkdir(new File(saveDir));
		
		File jsonFile = new File(saveDir, "diy.json");
		JSONObject json = new JSONObject();
		json.put("name", routeguide.getName());
		json.put("code", routeguide.getCode());
		json.put("type", "route-guide");
		json.put("version", "1.0.0");
		json.put("snapshot", "img/guide.png");
		json.put("desc", routeguide.getName());
		JSONArray actionArray = new JSONArray();
		for (Routeguidedtl routeguidedtl : routeguidedtls) {
			JSONObject actionJson = new JSONObject();
			actionJson.put("id", "route_" + routeguidedtl.getRoute().getCode());
			actionJson.put("name", routeguidedtl.getRoute().getName());
			actionArray.add(actionJson);
		}
		json.put("actions", actionArray);
		FileUtils.writeStringToFile(jsonFile, json.toString(2), "UTF-8", false);
		
		File jsFile = new File(saveDir, "diy.data.js");
		StringBuffer sb = new StringBuffer();
		sb.append("RouteGuide.RouteData = [{\r\n");
		for (int i=0; i<routeguidedtls.size(); i++) {
			Routeguidedtl routeguidedtl = routeguidedtls.get(i);
			sb.append("    \"routeid\": \"route_" + routeguidedtl.getRoute().getCode() + "\",\r\n");
			sb.append("    \"routename\": \"" + routeguidedtl.getRoute().getName() + "\",\r\n");
			sb.append("    \"routelines\": [\r\n");
			sb.append("        " + routeguidedtl.getRoutelines() + "\r\n");
			sb.append("    ],\r\n");
			sb.append("    \"area\": [{x: 1, y: 1}],\r\n");
			sb.append("    \"bg\": \"guide01\"\r\n");
			if (i < routeguidedtls.size() - 1) {
				sb.append("}, {\r\n");
			} else {
				sb.append("}];\r\n");
			}
		}
		FileUtils.writeStringToFile(jsFile, sb.toString(), "UTF-8", false);

		File htmlFile = new File(saveDir, "index.html");
		String htmlContent = FileUtils
				.readFileToString(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/routeguide/" + "index.html"), "UTF-8");
		String btnContent = "";
		for (Routeguidedtl routeguidedtl : routeguidedtls) {
			btnContent += "<button id=\"";
			btnContent += routeguidedtl.getRoute().getCode();
			btnContent += "\"  type=\"button\">";
			btnContent += routeguidedtl.getRoute().getName();
			btnContent += "</button>\r\n";
		}
		htmlContent = htmlContent.replaceFirst("<!-- BUTTON -->", btnContent);
		FileUtils.writeStringToFile(htmlFile, htmlContent, "UTF-8", false);

		File zipFile = new File(saveDir, zipname);
		if (zipFile.exists()) {
			zipFile.delete();
		}
		ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));
		out.putNextEntry(new ZipEntry(routeguide.getCode() + "/img/"));
		CommonUtil.zip(out, new File(CommonConfig.CONFIG_PIXDATA_HOME + "/routeguide/" + routeguideid + "/guide.png"), routeguide.getCode() + "/img/guide.png");
		CommonUtil.zip(out, new File(CommonConfig.CONFIG_PIXDATA_HOME + "/routeguide/" + routeguideid + "/guide.png"), routeguide.getCode() + "/img/guide01.png");
		CommonUtil.zip(out, new File(CommonConfig.CONFIG_PIXDATA_HOME + "/routeguide/step.png"), routeguide.getCode() + "/img/step.png");
		CommonUtil.zip(out, new File(CommonConfig.CONFIG_PIXDATA_HOME + "/routeguide/" + routeguideid + "/diy.json"), routeguide.getCode() + "/diy.json");
		CommonUtil.zip(out, new File(CommonConfig.CONFIG_PIXDATA_HOME + "/routeguide/" + routeguideid + "/diy.data.js"), routeguide.getCode() + "/diy.data.js");
		CommonUtil.zip(out, new File(CommonConfig.CONFIG_PIXDATA_HOME + "/routeguide/" + routeguideid + "/index.html"), routeguide.getCode() + "/index.html");
		out.close();
		logger.info("Making routeguide zip done, routeguideid={}", routeguideid);
	}

	public boolean validateCode(Routeguide routeguide) {
		Routeguide oldRouteguide = routeguideMapper.selectByCode(routeguide.getCode());
		if (oldRouteguide == null) {
			return true;
		} else {
			return (routeguide.getRouteguideid().intValue() == oldRouteguide.getRouteguideid().intValue());
		}
	}
}
