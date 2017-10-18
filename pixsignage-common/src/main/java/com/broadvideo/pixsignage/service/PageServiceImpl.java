package com.broadvideo.pixsignage.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.domain.Pagezonedtl;
import com.broadvideo.pixsignage.domain.Template;
import com.broadvideo.pixsignage.domain.Templatezone;
import com.broadvideo.pixsignage.domain.Templatezonedtl;
import com.broadvideo.pixsignage.persistence.PageMapper;
import com.broadvideo.pixsignage.persistence.PagezoneMapper;
import com.broadvideo.pixsignage.persistence.PagezonedtlMapper;
import com.broadvideo.pixsignage.persistence.TemplateMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

import net.sf.json.JSONObject;

@Service("pageService")
public class PageServiceImpl implements PageService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static Hashtable<String, String> CONFIG_FONTS = new Hashtable<String, String>();

	@Autowired
	private PageMapper pageMapper;
	@Autowired
	private PagezoneMapper pagezoneMapper;
	@Autowired
	private PagezonedtlMapper pagezonedtlMapper;
	@Autowired
	private TemplateMapper templateMapper;

	public Page selectByPrimaryKey(String pageid) {
		return pageMapper.selectByPrimaryKey(pageid);
	}

	public int selectCount(String orgid, String branchid, String touchflag, String homeflag, String search) {
		return pageMapper.selectCount(orgid, branchid, touchflag, homeflag, search);
	}

	public List<Page> selectList(String orgid, String branchid, String touchflag, String homeflag, String search,
			String start, String length) {
		return pageMapper.selectList(orgid, branchid, touchflag, homeflag, search, start, length);
	}

	@Transactional
	public void addPage(Page page) throws Exception {
		if (page.getName() == null || page.getName().equals("")) {
			page.setName("UNKNOWN");
		}
		Template template = templateMapper.selectByPrimaryKey("" + page.getTemplateid());
		if (template == null) {
			// Create page from blank
			if (page.getRatio().equals("1")) {
				// 16:9
				page.setWidth(1920);
				page.setHeight(1080);
			} else if (page.getRatio().equals("2")) {
				// 9:16
				page.setWidth(1080);
				page.setHeight(1920);
			}
			page.setUpdatetime(Calendar.getInstance().getTime());
			pageMapper.insertSelective(page);

			if (page.getName().equals("UNKNOWN")) {
				page.setName("PAGE-" + page.getPageid());
			}
			pageMapper.updateByPrimaryKeySelective(page);
		} else {
			// Create page from template
			Hashtable<Integer, Integer> pageidHash = new Hashtable<Integer, Integer>();
			ArrayList<Template> templateList = new ArrayList<Template>();

			page.setTemplateid(template.getTemplateid());
			page.setRatio(template.getRatio());
			page.setHeight(template.getHeight());
			page.setWidth(template.getWidth());
			page.setHomeidletime(template.getHomeidletime());
			page.setLimitflag(template.getLimitflag());
			page.setUpdatetime(Calendar.getInstance().getTime());
			pageMapper.insertSelective(page);
			if (page.getName().equals("UNKNOWN")) {
				page.setName("PAGE-" + template.getTemplateid());
			}
			if (template.getSnapshot() != null) {
				String snapshotFilePath = "/page/" + page.getPageid() + "/snapshot/" + page.getPageid() + ".png";
				File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + template.getSnapshot()), snapshotFile);
				page.setSnapshot(snapshotFilePath);
			}
			pageMapper.updateByPrimaryKeySelective(page);
			pageidHash.put(template.getTemplateid(), page.getPageid());
			templateList.add(template);

			List<Template> subtemplates = template.getSubtemplates();
			for (Template s : subtemplates) {
				Template subtemplate = templateMapper.selectByPrimaryKey("" + s.getTemplateid());
				Page subpage = new Page();
				subpage.setOrgid(page.getOrgid());
				subpage.setBranchid(page.getBranchid());
				subpage.setTemplateid(subtemplate.getTemplateid());
				subpage.setName(subtemplate.getName());
				subpage.setRatio(subtemplate.getRatio());
				subpage.setHeight(subtemplate.getHeight());
				subpage.setWidth(subtemplate.getWidth());
				subpage.setTouchflag(subtemplate.getTouchflag());
				subpage.setHomeflag(subtemplate.getHomeflag());
				subpage.setHomepageid(page.getPageid());
				subpage.setHomeidletime(subtemplate.getHomeidletime());
				subpage.setLimitflag(subtemplate.getLimitflag());
				subpage.setUpdatetime(page.getUpdatetime());
				subpage.setCreatestaffid(page.getCreatestaffid());
				pageMapper.insertSelective(subpage);
				pageidHash.put(subtemplate.getTemplateid(), subpage.getPageid());
				templateList.add(subtemplate);
				if (subtemplate.getSnapshot() != null) {
					String snapshotFilePath = "/page/" + subpage.getPageid() + "/snapshot/" + subpage.getPageid()
							+ ".png";
					File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
					FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + subtemplate.getSnapshot()),
							snapshotFile);
					subpage.setSnapshot(snapshotFilePath);
					pageMapper.updateByPrimaryKeySelective(subpage);
				}
			}

			for (Template t : templateList) {
				List<Templatezone> templatezones = t.getTemplatezones();
				for (Templatezone templatezone : templatezones) {
					Pagezone pagezone = new Pagezone();
					pagezone.setPageid(pageidHash.get(t.getTemplateid()));
					if (page.getHomeflag().equals("0")) {
						pagezone.setHomepageid(page.getHomepageid());
					} else {
						pagezone.setHomepageid(page.getPageid());
					}
					pagezone.setType(templatezone.getType());
					pagezone.setHeight(templatezone.getHeight());
					pagezone.setWidth(templatezone.getWidth());
					pagezone.setTopoffset(templatezone.getTopoffset());
					pagezone.setLeftoffset(templatezone.getLeftoffset());
					pagezone.setZindex(templatezone.getZindex());
					pagezone.setTransform(templatezone.getTransform());
					pagezone.setBdcolor(templatezone.getBdcolor());
					pagezone.setBdstyle(templatezone.getBdstyle());
					pagezone.setBdwidth(templatezone.getBdwidth());
					pagezone.setBdradius(templatezone.getBdradius());
					pagezone.setBgcolor(templatezone.getBgcolor());
					pagezone.setBgopacity(templatezone.getBgopacity());
					pagezone.setOpacity(templatezone.getOpacity());
					pagezone.setPadding(templatezone.getPadding());
					pagezone.setShadowh(templatezone.getShadowh());
					pagezone.setShadowv(templatezone.getShadowv());
					pagezone.setShadowblur(templatezone.getShadowblur());
					pagezone.setShadowcolor(templatezone.getShadowcolor());
					pagezone.setColor(templatezone.getColor());
					pagezone.setFontfamily(templatezone.getFontfamily());
					pagezone.setFontsize(templatezone.getFontsize());
					pagezone.setFontweight(templatezone.getFontweight());
					pagezone.setFontstyle(templatezone.getFontstyle());
					pagezone.setDecoration(templatezone.getDecoration());
					pagezone.setAlign(templatezone.getAlign());
					pagezone.setLineheight(templatezone.getLineheight());
					pagezone.setRows(templatezone.getRows());
					pagezone.setCols(templatezone.getCols());
					pagezone.setRules(templatezone.getRules());
					pagezone.setRulecolor(templatezone.getRulecolor());
					pagezone.setRulewidth(templatezone.getRulewidth());
					pagezone.setDateformat(templatezone.getDateformat());
					pagezone.setDiyid(templatezone.getDiyid());
					pagezone.setTouchtype(templatezone.getTouchtype());
					Integer touchpageid = pageidHash.get(templatezone.getTouchtemplateid());
					if (touchpageid == null) {
						touchpageid = 0;
					}
					pagezone.setTouchpageid(touchpageid);
					pagezone.setDiyactionid(templatezone.getDiyactionid());
					pagezone.setAnimationinit(templatezone.getAnimationinit());
					pagezone.setAnimationinitdelay(templatezone.getAnimationinitdelay());
					pagezone.setAnimationclick(templatezone.getAnimationclick());
					pagezone.setContent(templatezone.getContent());
					pagezoneMapper.insertSelective(pagezone);
					for (Templatezonedtl templatezonedtl : templatezone.getTemplatezonedtls()) {
						Pagezonedtl pagezonedtl = new Pagezonedtl();
						pagezonedtl.setPagezoneid(pagezone.getPagezoneid());
						pagezonedtl.setObjtype(templatezonedtl.getObjtype());
						pagezonedtl.setObjid(templatezonedtl.getObjid());
						pagezonedtl.setSequence(templatezonedtl.getSequence());
						pagezonedtlMapper.insertSelective(pagezonedtl);
					}
				}
			}

		}
	}

	@Transactional
	public void copyPage(String frompageid, Page page) throws Exception {
		if (page.getName() == null || page.getName().equals("")) {
			page.setName("UNKNOWN");
		}
		Page frompage = pageMapper.selectByPrimaryKey(frompageid);
		if (frompage == null) {
			// Create page from blank
			if (page.getRatio().equals("1")) {
				// 16:9
				page.setWidth(1920);
				page.setHeight(1080);
			} else if (page.getRatio().equals("2")) {
				// 9:16
				page.setWidth(1080);
				page.setHeight(1920);
			}
			page.setUpdatetime(Calendar.getInstance().getTime());
			pageMapper.insertSelective(page);

			if (page.getName().equals("UNKNOWN")) {
				page.setName("TEMPLET-" + page.getPageid());
			}
			pageMapper.updateByPrimaryKeySelective(page);
		} else {
			// Copy page
			page.setPageid(frompage.getPageid());
			page.setTemplateid(frompage.getTemplateid());
			page.setRatio(frompage.getRatio());
			page.setHeight(frompage.getHeight());
			page.setWidth(frompage.getWidth());
			page.setHomeidletime(frompage.getHomeidletime());
			page.setLimitflag(frompage.getLimitflag());
			page.setUpdatetime(Calendar.getInstance().getTime());
			pageMapper.insertSelective(page);
			if (page.getName().equals("UNKNOWN")) {
				page.setName("TEMPLET-" + page.getPageid());
			}
			if (frompage.getSnapshot() != null) {
				String snapshotFilePath = "/page/" + page.getPageid() + "/snapshot/" + page.getPageid() + ".png";
				File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + frompage.getSnapshot()), snapshotFile);
				page.setSnapshot(snapshotFilePath);
			}
			pageMapper.updateByPrimaryKeySelective(page);

			List<Pagezone> frompagezones = frompage.getPagezones();
			for (Pagezone frompagezone : frompagezones) {
				Pagezone pagezone = new Pagezone();
				pagezone.setPageid(page.getPageid());
				if (page.getHomeflag().equals("0")) {
					pagezone.setHomepageid(page.getHomepageid());
				} else {
					pagezone.setHomepageid(page.getPageid());
				}
				pagezone.setType(frompagezone.getType());
				pagezone.setHeight(frompagezone.getHeight());
				pagezone.setWidth(frompagezone.getWidth());
				pagezone.setTopoffset(frompagezone.getTopoffset());
				pagezone.setLeftoffset(frompagezone.getLeftoffset());
				pagezone.setZindex(frompagezone.getZindex());
				pagezone.setTransform(frompagezone.getTransform());
				pagezone.setBdcolor(frompagezone.getBdcolor());
				pagezone.setBdstyle(frompagezone.getBdstyle());
				pagezone.setBdwidth(frompagezone.getBdwidth());
				pagezone.setBdradius(frompagezone.getBdradius());
				pagezone.setBgcolor(frompagezone.getBgcolor());
				pagezone.setBgopacity(frompagezone.getBgopacity());
				pagezone.setOpacity(frompagezone.getOpacity());
				pagezone.setPadding(frompagezone.getPadding());
				pagezone.setShadowh(frompagezone.getShadowh());
				pagezone.setShadowv(frompagezone.getShadowv());
				pagezone.setShadowblur(frompagezone.getShadowblur());
				pagezone.setShadowcolor(frompagezone.getShadowcolor());
				pagezone.setColor(frompagezone.getColor());
				pagezone.setFontfamily(frompagezone.getFontfamily());
				pagezone.setFontsize(frompagezone.getFontsize());
				pagezone.setFontweight(frompagezone.getFontweight());
				pagezone.setFontstyle(frompagezone.getFontstyle());
				pagezone.setDecoration(frompagezone.getDecoration());
				pagezone.setAlign(frompagezone.getAlign());
				pagezone.setLineheight(frompagezone.getLineheight());
				pagezone.setRows(frompagezone.getRows());
				pagezone.setCols(frompagezone.getCols());
				pagezone.setRules(frompagezone.getRules());
				pagezone.setRulecolor(frompagezone.getRulecolor());
				pagezone.setRulewidth(frompagezone.getRulewidth());
				pagezone.setDateformat(frompagezone.getDateformat());
				pagezone.setDiyid(frompagezone.getDiyid());
				pagezone.setTouchtype(frompagezone.getTouchtype());
				pagezone.setTouchpageid(frompagezone.getTouchpageid());
				pagezone.setDiyactionid(frompagezone.getDiyactionid());
				pagezone.setAnimationinit(frompagezone.getAnimationinit());
				pagezone.setAnimationinitdelay(frompagezone.getAnimationinitdelay());
				pagezone.setAnimationclick(frompagezone.getAnimationclick());
				pagezone.setContent(frompagezone.getContent());
				pagezoneMapper.insertSelective(pagezone);
				for (Pagezonedtl frompagezonedtl : frompagezone.getPagezonedtls()) {
					Pagezonedtl pagezonedtl = new Pagezonedtl();
					pagezonedtl.setPagezoneid(pagezone.getPagezoneid());
					pagezonedtl.setObjtype(frompagezonedtl.getObjtype());
					pagezonedtl.setObjid(frompagezonedtl.getObjid());
					pagezonedtl.setSequence(frompagezonedtl.getSequence());
					pagezonedtlMapper.insertSelective(pagezonedtl);
				}
			}
		}
	}

	@Transactional
	public void updatePage(Page page) {
		page.setUpdatetime(Calendar.getInstance().getTime());
		pageMapper.updateByPrimaryKeySelective(page);
	}

	@Transactional
	public void deletePage(String pageid) {
		pageMapper.deleteByPrimaryKey(pageid);
	}

	@Transactional
	public void design(Page page) throws Exception {
		if (page.getName() == null || page.getName().equals("")) {
			page.setName("UNKNOWN");
		}

		pageMapper.updateByPrimaryKeySelective(page);
		int pageid = page.getPageid();
		List<Pagezone> pagezones = page.getPagezones();
		List<Pagezone> oldpagezones = pagezoneMapper.selectList("" + pageid);
		HashMap<Integer, Pagezone> hash = new HashMap<Integer, Pagezone>();
		for (Pagezone pagezone : pagezones) {
			if (pagezone.getPagezoneid() > 0) {
				hash.put(pagezone.getPagezoneid(), pagezone);
			}
		}
		for (int i = 0; i < oldpagezones.size(); i++) {
			Pagezone oldPagezone = oldpagezones.get(i);
			if (hash.get(oldPagezone.getPagezoneid()) == null) {
				pagezonedtlMapper.deleteByPagezone("" + oldpagezones.get(i).getPagezoneid());
				pagezoneMapper.deleteByPrimaryKey("" + oldpagezones.get(i).getPagezoneid());
			}
		}
		for (Pagezone pagezone : pagezones) {
			if (page.getHomeflag().equals("0")) {
				pagezone.setHomepageid(page.getHomepageid());
			} else {
				pagezone.setHomepageid(page.getPageid());
			}
			if (pagezone.getPagezoneid() <= 0) {
				pagezone.setPageid(pageid);
				pagezoneMapper.insertSelective(pagezone);
			} else {
				pagezoneMapper.updateByPrimaryKeySelective(pagezone);
				pagezonedtlMapper.deleteByPagezone("" + pagezone.getPagezoneid());
			}
			for (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) {
				pagezonedtl.setPagezoneid(pagezone.getPagezoneid());
				pagezonedtlMapper.insertSelective(pagezonedtl);
			}
		}

		String snapshotdtl = page.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
		}
		String snapshotFilePath = "/page/" + page.getPageid() + "/snapshot/" + page.getPageid() + ".png";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		page.setSnapshot(snapshotFilePath);
		page.setUpdatetime(Calendar.getInstance().getTime());
		pageMapper.updateByPrimaryKeySelective(page);
	}

	public void makeHtmlZip(String pageid) throws Exception {
		if (CONFIG_FONTS.size() == 0) {
			Properties properties = new Properties();
			InputStream is = this.getClass().getResourceAsStream("/fonts.properties");
			properties.load(is);
			CONFIG_FONTS = new Hashtable<String, String>();
			Iterator<Entry<Object, Object>> it = properties.entrySet().iterator();
			while (it.hasNext()) {
				Entry<Object, Object> entry = it.next();
				logger.info("Init font key={}, value={}", entry.getKey().toString(), entry.getValue().toString());
				CONFIG_FONTS.put(entry.getKey().toString(), entry.getValue().toString());
			}
			is.close();
		}

		ArrayList<Page> pageList = new ArrayList<Page>();
		ArrayList<String> fontList = new ArrayList<String>();
		HashMap<Integer, Image> imageHash = new HashMap<Integer, Image>();

		Page page = pageMapper.selectByPrimaryKey(pageid);
		pageList.add(page);
		for (Page subpage : page.getSubpages()) {
			Page p = pageMapper.selectByPrimaryKey("" + subpage.getPageid());
			pageList.add(p);
		}

		for (Page p : pageList) {
			for (Pagezone pagezone : p.getPagezones()) {
				if (pagezone.getType() == Pagezone.Type_Image || pagezone.getType() == Pagezone.Type_Button) {
					for (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) {
						Image image = pagezonedtl.getImage();
						if (image != null && imageHash.get(image.getImageid()) == null) {
							imageHash.put(image.getImageid(), image);
						}
					}
				}
				if ((pagezone.getType() == Pagezone.Type_Text || pagezone.getType() == Pagezone.Type_Button)
						&& pagezone.getFontfamily().length() > 0) {
					String font = CONFIG_FONTS.get(pagezone.getFontfamily());
					if (font != null && fontList.indexOf(font) < 0) {
						logger.info("Copy one font, family={}, file={}", pagezone.getFontfamily(), font);
						fontList.add(font);
					}
				}
			}
		}

		String saveDir = CommonConfig.CONFIG_PIXDATA_HOME + "/page/" + page.getPageid();
		String zipname = "page-" + page.getPageid() + ".zip";
		FileUtils.forceMkdir(new File(saveDir));

		File zipFile = new File(saveDir, zipname);
		if (zipFile.exists()) {
			zipFile.delete();
		}
		ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));
		out.putNextEntry(new ZipEntry("fonts/"));
		out.putNextEntry(new ZipEntry("image/"));

		Iterator<Entry<Integer, Image>> iter = imageHash.entrySet().iterator();
		while (iter.hasNext()) {
			Entry<Integer, Image> entry = iter.next();
			Image image = entry.getValue();
			File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + image.getFilepath());
			CommonUtil.zip(out, imageFile, "image/" + image.getFilename());
		}

		ClassLoader classLoader = getClass().getClassLoader();
		for (String font : fontList) {
			if (classLoader.getResource("/pagezip/fonts/" + font) != null) {
				File fontFile = new File(classLoader.getResource("/pagezip/fonts/" + font).getFile());
				CommonUtil.zip(out, fontFile, "fonts/" + font);
			} else {
				logger.error("font file {} not exists", font);
			}
		}

		String pageDir = CommonConfig.CONFIG_PIXDATA_HOME + "/page/" + page.getPageid();
		File jsonFile = new File(pageDir, "index.json");
		FileUtils.writeStringToFile(jsonFile, JSONObject.fromObject(page).toString(2), "UTF-8", false);
		CommonUtil.zip(out, jsonFile, "index.json");
		for (Page p : pageList) {
			pageDir = CommonConfig.CONFIG_PIXDATA_HOME + "/page/" + p.getPageid();
			File dataFile = new File(pageDir, "" + p.getPageid() + ".js");
			FileUtils.writeStringToFile(dataFile, "var Page=" + JSONObject.fromObject(p).toString(2), "UTF-8", false);
			CommonUtil.zip(out, dataFile, "" + p.getPageid() + ".js");

			File htmlFile = new File(pageDir, "index.html");
			String htmlContent = FileUtils
					.readFileToString(new File(classLoader.getResource("/pagezip/index.html").getFile()));
			htmlContent = htmlContent.replaceFirst("data.js", "" + p.getPageid() + ".js");
			String diyContent = "";
			for (Pagezone pz : p.getPagezones()) {
				if (pz.getDiy() != null) {
					diyContent += "<script src='module/route-guide/route-guide.js'></script>\n";
					diyContent += "<script src='" + pz.getDiy().getCode() + "/diy.data.js'></script>\n";
					CommonUtil.zip(out, new File(CommonConfig.CONFIG_PIXDATA_HOME + pz.getDiy().getFilepath()),
							pz.getDiy().getCode());
					break;
				}
			}
			htmlContent = htmlContent.replaceFirst("<!-- DIY -->", diyContent);
			FileUtils.writeStringToFile(htmlFile, htmlContent, "UTF-8", false);
			if (p.getHomeflag().equals("1")) {
				CommonUtil.zip(out, htmlFile, "index.html");
			} else {
				CommonUtil.zip(out, htmlFile, "" + p.getPageid() + ".html");
			}
		}

		CommonUtil.zip(out, new File(classLoader.getResource("/pagezip/pixpage").getFile()), "pixpage");
		CommonUtil.zip(out, new File(classLoader.getResource("/pagezip/module").getFile()), "module");
		CommonUtil.zip(out, new File(classLoader.getResource("/pagezip/plugin").getFile()), "plugin");
		out.close();
	}

}
