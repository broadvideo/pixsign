package com.broadvideo.pixsignage.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.UUID;
import java.util.Vector;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.imageio.ImageIO;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Diy;
import com.broadvideo.pixsignage.domain.Diyaction;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.domain.Pagezonedtl;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.domain.Template;
import com.broadvideo.pixsignage.domain.Templatezone;
import com.broadvideo.pixsignage.domain.Templatezonedtl;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.ImageMapper;
import com.broadvideo.pixsignage.persistence.PageMapper;
import com.broadvideo.pixsignage.persistence.PagezoneMapper;
import com.broadvideo.pixsignage.persistence.PagezonedtlMapper;
import com.broadvideo.pixsignage.persistence.TemplateMapper;
import com.broadvideo.pixsignage.persistence.VideoMapper;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Service("pageService")
public class PageServiceImpl implements PageService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static Hashtable<String, String> CONFIG_FONTS = new Hashtable<String, String>();
	private static Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").setPrettyPrinting().create();

	@Autowired
	private PageMapper pageMapper;
	@Autowired
	private PagezoneMapper pagezoneMapper;
	@Autowired
	private PagezonedtlMapper pagezonedtlMapper;
	@Autowired
	private TemplateMapper templateMapper;
	@Autowired
	private ImageMapper imageMapper;
	@Autowired
	private VideoMapper videoMapper;

	@Autowired
	private DiyService diyService;

	public Page selectByPrimaryKey(String pageid) {
		return pageMapper.selectByPrimaryKey(pageid);
	}

	public Page selectByUuid(String orgid, String uuid) {
		return pageMapper.selectByUuid(orgid, uuid);
	}

	public int selectCount(String orgid, String branchid, String reviewflag, String ratio, String touchflag,
			String homeflag, String search) {
		return pageMapper.selectCount(orgid, branchid, reviewflag, ratio, touchflag, homeflag, search);
	}

	public List<Page> selectList(String orgid, String branchid, String reviewflag, String ratio, String touchflag,
			String homeflag, String search, String start, String length, Staff staff) {
		List<Page> pageList = pageMapper.selectList(orgid, branchid, reviewflag, ratio, touchflag, homeflag, search,
				start, length);
		for (Page page : pageList) {
			page.setEditflag("1");
			if (page.getPrivilegeflag().equals("1") && !staff.getLoginname().equals("admin")
					&& !staff.getLoginname().startsWith("admin@")
					&& staff.getStaffid().intValue() != page.getCreatestaffid().intValue()) {
				Staff s = pageMapper.selectStaffPage("" + staff.getStaffid(), "" + page.getPageid());
				if (s == null) {
					page.setEditflag("0");
				}
			}
			List<Page> subpages = page.getSubpages();
			for (Page subpage : subpages) {
				subpage.setEditflag("1");
				if (subpage.getPrivilegeflag().equals("1") && !staff.getLoginname().equals("admin")
						&& !staff.getLoginname().startsWith("admin@")
						&& staff.getStaffid().intValue() != subpage.getCreatestaffid().intValue()) {
					Staff s = pageMapper.selectStaffPage("" + staff.getStaffid(), "" + subpage.getPageid());
					if (s == null) {
						subpage.setEditflag("0");
					}
				}
			}
		}
		return pageList;
	}

	public List<Page> selectExportList() {
		return pageMapper.selectExportList();
	}

	public int selectStaffCount(String pageid, String search) {
		return pageMapper.selectStaffCount(pageid, search);
	}

	public List<Staff> selectStaff(String pageid, String search, String start, String length) {
		return pageMapper.selectStaff(pageid, search, start, length);
	}

	public int selectStaff2SelectCount(String pageid, String search) {
		return pageMapper.selectStaff2SelectCount(pageid, search);
	}

	public List<Staff> selectStaff2Select(String pageid, String search, String start, String length) {
		return pageMapper.selectStaff2Select(pageid, search, start, length);
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
			page.setUuid(UUID.randomUUID().toString().replace("-", ""));
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
			page.setUuid(UUID.randomUUID().toString().replace("-", ""));
			page.setUpdatetime(Calendar.getInstance().getTime());
			pageMapper.insertSelective(page);
			if (page.getName().equals("UNKNOWN")) {
				page.setName("PAGE-" + template.getTemplateid());
			}
			if (template.getSnapshot() != null) {
				String snapshotFilePath = "/page/" + page.getPageid() + "/snapshot/" + page.getPageid() + ".jpg";
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
							+ ".jpg";
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
					Integer touchid = pageidHash.get(templatezone.getTouchid());
					if (touchid == null) {
						touchid = 0;
					}
					pagezone.setTouchid(touchid);
					pagezone.setFixflag(templatezone.getFixflag());
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
			page.setUuid(UUID.randomUUID().toString().replace("-", ""));
			page.setUpdatetime(Calendar.getInstance().getTime());
			pageMapper.insertSelective(page);

			if (page.getName().equals("UNKNOWN")) {
				page.setName("PAGE-" + page.getPageid());
			}
			pageMapper.updateByPrimaryKeySelective(page);
		} else {
			// Copy page
			page.setTemplateid(frompage.getTemplateid());
			page.setRatio(frompage.getRatio());
			page.setHeight(frompage.getHeight());
			page.setWidth(frompage.getWidth());
			page.setHomeidletime(frompage.getHomeidletime());
			page.setLimitflag(frompage.getLimitflag());
			page.setUuid(UUID.randomUUID().toString().replace("-", ""));
			page.setUpdatetime(Calendar.getInstance().getTime());
			pageMapper.insertSelective(page);
			if (page.getName().equals("UNKNOWN")) {
				page.setName("PAGE-" + page.getPageid());
			}
			if (frompage.getSnapshot() != null) {
				String snapshotFilePath = "/page/" + page.getPageid() + "/snapshot/" + page.getPageid() + ".jpg";
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
				pagezone.setTouchid(frompagezone.getTouchid());
				pagezone.setFixflag(frompagezone.getFixflag());
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
		logger.info("Begin to degin page, pageid={}", page.getPageid());
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

		logger.info("Begin to update page snapshot, pageid={}", page.getPageid());
		String snapshotdtl = page.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/jpeg;base64,")) {
			snapshotdtl = snapshotdtl.substring(23);
		}
		String snapshotFilePath = "/page/" + page.getPageid() + "/snapshot/" + page.getPageid() + ".jpg";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		page.setSnapshot(snapshotFilePath);
		page.setUpdatetime(Calendar.getInstance().getTime());

		if (page.getHomeflag().equals("1")) {
			page.setExportflag("0");
		} else {
			Page homepage = pageMapper.selectByPrimaryKey("" + page.getHomepageid());
			homepage.setExportflag("0");
			pageMapper.updateByPrimaryKeySelective(homepage);
		}
		pageMapper.updateByPrimaryKeySelective(page);

	}

	public void copySinglePage(String sourcepageid, String destpageids) throws Exception {
		String[] destpageidList = destpageids.split(",");
		Page sourcepage = pageMapper.selectByPrimaryKey(sourcepageid);
		Vector<Integer> pageidVector = new Vector<Integer>();
		for (int i = 0; i < destpageidList.length; i++) {
			logger.info("Copy page from sourcepageid={}, destpageid={}", sourcepageid, destpageidList[i]);
			Page destpage = pageMapper.selectByPrimaryKey(destpageidList[i]);
			pageMapper.clearPagezones(destpageidList[i]);
			destpage.setHomeidletime(sourcepage.getHomeidletime());
			File fromSnapshotFile = new File(
					CommonConfig.CONFIG_PIXDATA_HOME + "/page/" + sourcepageid + "/snapshot/" + sourcepageid + ".jpg");
			if (fromSnapshotFile.exists()) {
				String snapshotFilePath = "/page/" + destpageidList[i] + "/snapshot/" + destpageidList[i] + ".jpg";
				File toSnapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				destpage.setSnapshot(snapshotFilePath);
				FileUtils.copyFile(fromSnapshotFile, toSnapshotFile);
			}
			pageMapper.updateByPrimaryKeySelective(destpage);
			if (destpage.getHomeflag().equals("1")) {
				if (pageidVector.indexOf(destpage.getPageid()) < 0) {
					pageidVector.add(destpage.getPageid());
				}
			} else {
				if (pageidVector.indexOf(destpage.getHomepageid()) < 0) {
					pageidVector.add(destpage.getHomepageid());
				}
			}

			for (Pagezone pagezone : sourcepage.getPagezones()) {
				pagezone.setPageid(destpage.getPageid());
				pagezone.setHomepageid(destpage.getHomepageid());
				if (pagezone.getTouchtype().equals("2")) {
					Page touchPage = pageMapper.selectByPrimaryKey("" + pagezone.getTouchid());
					if (touchPage == null || touchPage.getHomepageid().intValue() != destpage.getHomepageid()) {
						pagezone.setTouchtype("9");
						pagezone.setTouchid(0);
					}
				}
				pagezoneMapper.insertSelective(pagezone);
				for (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) {
					pagezonedtl.setPagezoneid(pagezone.getPagezoneid());
					pagezonedtlMapper.insertSelective(pagezonedtl);
				}
			}
		}
		for (int pageid : pageidVector) {
			makeHtmlZip("" + pageid);
		}
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

		logger.info("Making page zip, pageid={}", pageid);
		ArrayList<Page> pageList = new ArrayList<Page>();
		ArrayList<String> fontList = new ArrayList<String>();
		ArrayList<String> diyList = new ArrayList<String>();
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
				if ((pagezone.getType() == Pagezone.Type_Text || pagezone.getType() == Pagezone.Type_Scroll
						|| pagezone.getType() == Pagezone.Type_Button) && pagezone.getFontfamily().length() > 0) {
					String font = CONFIG_FONTS.get(pagezone.getFontfamily());
					if (font != null && fontList.indexOf(font) < 0) {
						logger.info("Copy one font, family={}, file={}", pagezone.getFontfamily(), font);
						fontList.add(font);
					}
				}
				if (pagezone.getDiy() != null && diyList.indexOf(pagezone.getDiy().getCode()) < 0) {
					diyList.add(pagezone.getDiy().getCode());
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
		CommonUtil.zip(out, new File(CommonConfig.CONFIG_PAGE_HOME, "image"), "image");

		Iterator<Entry<Integer, Image>> iter = imageHash.entrySet().iterator();
		while (iter.hasNext()) {
			Entry<Integer, Image> entry = iter.next();
			Image image = entry.getValue();
			File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + image.getFilepath());
			CommonUtil.zip(out, imageFile, "image/" + image.getFilename());
		}

		for (String font : fontList) {
			File fontFile = new File(CommonConfig.CONFIG_PAGE_HOME + "/fonts", font);
			if (fontFile.exists()) {
				CommonUtil.zip(out, fontFile, "fonts/" + font);
			} else {
				logger.error("font file {} not exists", font);
			}
		}

		for (String diy : diyList) {
			CommonUtil.zip(out, new File(CommonConfig.CONFIG_PIXDATA_HOME + "/diy/" + diy), diy);
		}

		String pageDir = CommonConfig.CONFIG_PIXDATA_HOME + "/page/" + page.getPageid();
		File jsonFile = new File(pageDir, "index.json");
		FileUtils.writeStringToFile(jsonFile, gson.toJson(page), "UTF-8", false);
		CommonUtil.zip(out, jsonFile, "index.json");
		for (Page p : pageList) {
			pageDir = CommonConfig.CONFIG_PIXDATA_HOME + "/page/" + p.getPageid();
			File dataFile = new File(pageDir, "" + p.getPageid() + ".js");
			FileUtils.writeStringToFile(dataFile, "var Page=" + gson.toJson(p), "UTF-8", false);
			CommonUtil.zip(out, dataFile, "" + p.getPageid() + ".js");

			File htmlFile = new File(pageDir, "index.html");
			String htmlContent = FileUtils
					.readFileToString(new File(CommonConfig.CONFIG_PAGE_HOME, "index-pixsign.html"), "UTF-8");
			htmlContent = htmlContent.replaceFirst("data.js", "" + p.getPageid() + ".js");
			String diyContent = "";
			for (Pagezone pz : p.getPagezones()) {
				if (pz.getDiy() != null) {
					diyContent += "<script src='module/route-guide/route-guide.js'></script>\n";
					diyContent += "<script src='" + pz.getDiy().getCode() + "/diy.data.js'></script>\n";
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

		CommonUtil.zip(out, new File(CommonConfig.CONFIG_PAGE_HOME, "pixpage"), "pixpage");
		CommonUtil.zip(out, new File(CommonConfig.CONFIG_PAGE_HOME, "module"), "module");
		CommonUtil.zip(out, new File(CommonConfig.CONFIG_PAGE_HOME, "plugin"), "plugin");
		out.close();

		page.setSize(FileUtils.sizeOf(zipFile));
		FileInputStream fis = new FileInputStream(zipFile);
		page.setMd5(DigestUtils.md5Hex(fis));
		pageMapper.updateByPrimaryKeySelective(page);
		logger.info("Making page zip done, pageid={}", pageid);
	}

	public void exportZip(String pageid, File zipFile) throws Exception {
		ArrayList<Page> pageList = new ArrayList<Page>();
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
			}
		}

		ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));
		out.putNextEntry(new ZipEntry("image/"));

		Iterator<Entry<Integer, Image>> iter = imageHash.entrySet().iterator();
		while (iter.hasNext()) {
			Entry<Integer, Image> entry = iter.next();
			Image image = entry.getValue();
			File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + image.getFilepath());
			CommonUtil.zip(out, imageFile, "image/" + image.getFilename());
		}

		for (Page p : pageList) {
			String pageDir = CommonConfig.CONFIG_PIXDATA_HOME + "/page/" + p.getPageid();
			File jsfFile = new File(pageDir, "" + p.getPageid() + ".jsf");
			FileUtils.writeStringToFile(jsfFile, gson.toJson(p), "UTF-8", false);
			String jsfname = "index.jsf";
			String jpgname = "index.jpg";
			if (p.getHomeflag().equals("0")) {
				jsfname = "" + p.getPageid() + ".jsf";
				jpgname = "" + p.getPageid() + ".jpg";
			}
			CommonUtil.zip(out, jsfFile, jsfname);
			if (p.getSnapshot() != null) {
				File snapshot = new File(CommonConfig.CONFIG_PIXDATA_HOME + p.getSnapshot());
				CommonUtil.zip(out, snapshot, jpgname);
			}
		}
		out.close();
	}

	@Transactional
	public Page importZip(Integer orgid, Integer branchid, File zipFile) throws Exception {
		String fileName = zipFile.getName();
		logger.info("Begin to import page {}", fileName);
		fileName = fileName.substring(0, fileName.lastIndexOf("."));
		String unzipFilePath = CommonConfig.CONFIG_PIXDATA_HOME + "/import/" + fileName;
		FileUtils.deleteQuietly(new File(unzipFilePath));
		CommonUtil.unzip(zipFile, unzipFilePath, false);
		FileUtils.forceDelete(zipFile);

		File[] zips = new File(unzipFilePath).listFiles(new FilenameFilter() {
			@Override
			public boolean accept(File file, String name) {
				return name.startsWith("page") && name.endsWith(".zip");
			}
		});
		if (zips != null && zips.length > 0) {
			CommonUtil.unzip(zips[0], unzipFilePath, false);
		}

		HashMap<Integer, Page> pageHash = new HashMap<Integer, Page>();
		HashMap<Integer, Image> imageHash = new HashMap<Integer, Image>();
		HashMap<Integer, Video> videoHash = new HashMap<Integer, Video>();
		HashMap<Integer, Diy> diyHash = new HashMap<Integer, Diy>();

		Date now = Calendar.getInstance().getTime();
		File indexJsf = new File(unzipFilePath, "index.jsf");
		logger.info("parse {}", indexJsf.getAbsoluteFile());
		Page page = gson.fromJson(FileUtils.readFileToString(indexJsf, "UTF-8"), Page.class);

		// JSONObject pageJson =
		// JSONObject.fromObject(FileUtils.readFileToString(indexJsf, "UTF-8"));
		// Map<String, Class> map = new HashMap<String, Class>();
		// map.put("subpages", Page.class);
		// map.put("pagezones", Pagezone.class);
		// map.put("pagezonedtls", Pagezonedtl.class);
		// map.put("diyactions", Diyaction.class);
		// Page page = (Page) JSONObject.toBean(pageJson, Page.class, map);
		Integer fromPageid = page.getPageid();
		page.setOrgid(orgid);
		page.setBranchid(branchid);
		page.setCreatetime(now);
		Page oldPage = pageMapper.selectByUuid("" + orgid, page.getUuid());
		if (oldPage != null) {
			pageMapper.clearSubpages("" + oldPage.getPageid());
			pageMapper.clearPagezones("" + oldPage.getPageid());
			page.setPageid(oldPage.getPageid());
			pageMapper.updateByPrimaryKeySelective(page);
		} else {
			pageMapper.insertSelective(page);
		}
		File fromSnapshotFile = new File(unzipFilePath, "index.jpg");
		if (fromSnapshotFile.exists()) {
			String snapshotFilePath = "/page/" + page.getPageid() + "/snapshot/" + page.getPageid() + ".jpg";
			File toSnapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
			page.setSnapshot(snapshotFilePath);
			FileUtils.copyFile(fromSnapshotFile, toSnapshotFile);
			pageMapper.updateByPrimaryKeySelective(page);
		}
		pageHash.put(fromPageid, page);
		logger.info("Add page oldid={}, newid={}", fromPageid, page.getPageid());

		for (Page subpage : page.getSubpages()) {
			File jsf = new File(unzipFilePath, "" + subpage.getPageid() + ".jsf");
			logger.info("parse {}", jsf.getAbsoluteFile());
			Page p = gson.fromJson(FileUtils.readFileToString(jsf, "UTF-8"), Page.class);
			// JSONObject json =
			// JSONObject.fromObject(FileUtils.readFileToString(jsf, "UTF-8"));
			// Page p = (Page) JSONObject.toBean(json, Page.class, map);
			fromPageid = p.getPageid();
			p.setOrgid(orgid);
			p.setBranchid(branchid);
			p.setHomepageid(page.getPageid());
			p.setCreatetime(now);
			pageMapper.insertSelective(p);
			fromSnapshotFile = new File(unzipFilePath, "" + fromPageid + ".jpg");
			if (fromSnapshotFile.exists()) {
				String snapshotFilePath = "/page/" + p.getPageid() + "/snapshot/" + p.getPageid() + ".jpg";
				p.setSnapshot(snapshotFilePath);
				File toSnapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(fromSnapshotFile, toSnapshotFile);
				pageMapper.updateByPrimaryKeySelective(p);
			}
			pageHash.put(fromPageid, p);
			logger.info("Add subpage oldid={}, newid={}", fromPageid, p.getPageid());
		}

		Iterator<Entry<Integer, Page>> iter = pageHash.entrySet().iterator();
		while (iter.hasNext()) {
			Entry<Integer, Page> entry = iter.next();
			Page t = entry.getValue();
			for (Pagezone pagezone : t.getPagezones()) {
				for (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) {
					Image image = pagezonedtl.getImage();
					if (image != null && imageHash.get(image.getImageid()) == null) {
						Integer fromImageid = image.getImageid();
						Image toImage = imageMapper.selectByUuid(image.getUuid());
						if (toImage == null) {
							// Insert image
							File fromFile = new File(unzipFilePath + "/image", image.getFilename());
							toImage = new Image();
							toImage.setUuid(image.getUuid());
							toImage.setOrgid(1);
							toImage.setBranchid(1);
							toImage.setFolderid(1);
							toImage.setName(image.getName());
							toImage.setFilename(image.getFilename());
							toImage.setStatus("9");
							toImage.setObjtype("0");
							toImage.setObjid(0);
							toImage.setCreatestaffid(1);
							imageMapper.insertSelective(toImage);
							String newFileName = "" + toImage.getImageid() + "."
									+ FilenameUtils.getExtension(fromFile.getName());
							String imageFilePath, thumbFilePath;
							imageFilePath = "/image/upload/" + newFileName;
							thumbFilePath = "/image/thumb/" + newFileName;
							File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + imageFilePath);
							File thumbFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbFilePath);
							if (imageFile.exists()) {
								imageFile.delete();
							}
							if (thumbFile.exists()) {
								thumbFile.delete();
							}
							FileUtils.copyFile(fromFile, imageFile);
							CommonUtil.resizeImage(imageFile, thumbFile, 640);

							BufferedImage img = ImageIO.read(imageFile);
							toImage.setWidth(img.getWidth());
							toImage.setHeight(img.getHeight());
							toImage.setFilepath(imageFilePath);
							toImage.setThumbnail(thumbFilePath);
							toImage.setFilename(newFileName);
							toImage.setSize(FileUtils.sizeOf(imageFile));
							FileInputStream fis = new FileInputStream(imageFile);
							toImage.setMd5(DigestUtils.md5Hex(fis));
							fis.close();
							toImage.setStatus("1");
							imageMapper.updateByPrimaryKeySelective(toImage);
							logger.info("Add image oldid={}, newid={}", fromImageid, toImage.getImageid());
						}
						imageHash.put(fromImageid, toImage);
					}

					Video video = pagezonedtl.getVideo();
					if (video != null && videoHash.get(video.getVideoid()) == null) {
						Integer fromVideoid = video.getVideoid();
						Video toVideo = videoMapper.selectByUuid(video.getUuid());
						if (toVideo == null) {
							// Insert video
							File fromFile = new File(unzipFilePath + "/video", video.getFilename());
							if (!fromFile.exists()) {
								continue;
							}
							toVideo = new Video();
							toVideo.setUuid(video.getUuid());
							toVideo.setOrgid(1);
							toVideo.setBranchid(1);
							toVideo.setFolderid(1);
							toVideo.setType(Video.TYPE_INTERNAL);
							toVideo.setName(video.getName());
							toVideo.setOname(video.getOname());
							toVideo.setFilename(video.getFilename());
							toVideo.setFormat(video.getFormat());
							toVideo.setSize(video.getSize());
							toVideo.setMd5(video.getMd5());
							toVideo.setStatus("9");
							toVideo.setCreatestaffid(1);
							videoMapper.insertSelective(toVideo);
							String newFileName = "" + toVideo.getVideoid() + "."
									+ FilenameUtils.getExtension(fromFile.getName());
							String videoFilePath, thumbFilePath;
							videoFilePath = "/video/upload/" + newFileName;
							thumbFilePath = "/video/snapshot/" + toVideo.getVideoid() + ".jpg";
							File videoFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + videoFilePath);
							File thumbFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbFilePath);
							if (videoFile.exists()) {
								videoFile.delete();
							}
							if (thumbFile.exists()) {
								thumbFile.delete();
							}
							FileUtils.moveFile(fromFile, videoFile);

							try {
								// Generate preview gif
								FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/snapshot"));
								String command = CommonConfig.CONFIG_FFMPEG_CMD + " -i "
										+ CommonConfig.CONFIG_PIXDATA_HOME + videoFilePath
										+ " -y -f image2 -ss 5 -vframes 1 " + CommonConfig.CONFIG_PIXDATA_HOME
										+ thumbFilePath;
								logger.info("Begin to generate preview and thumbnail: " + command);
								CommonUtil.execCommand(command);
								if (!thumbFile.exists()) {
									command = CommonConfig.CONFIG_FFMPEG_CMD + " -i " + CommonConfig.CONFIG_PIXDATA_HOME
											+ videoFilePath + " -y -f image2 -ss 1 -vframes 1 "
											+ CommonConfig.CONFIG_PIXDATA_HOME + thumbFilePath;
									CommonUtil.execCommand(command);
								}
								if (thumbFile.exists()) {
									BufferedImage img = ImageIO.read(thumbFile);
									toVideo.setWidth(img.getWidth());
									toVideo.setHeight(img.getHeight());
									toVideo.setThumbnail("/video/snapshot/" + toVideo.getVideoid() + ".jpg");
									logger.info("Finish thumbnail generating.");
								} else {
									logger.info("Failed to generate thumbnail.");
								}

							} catch (IOException ex) {
								logger.info("Video parse error, file={}", videoFilePath, ex);
							}

							toVideo.setFilename(newFileName);
							toVideo.setFilepath(videoFilePath);
							toVideo.setThumbnail(thumbFilePath);
							toVideo.setFilename(newFileName);
							toVideo.setStatus("1");
							videoMapper.updateByPrimaryKeySelective(toVideo);
							logger.info("Add video oldid={}, newid={}", fromVideoid, toVideo.getVideoid());
						}
						videoHash.put(fromVideoid, toVideo);
					}
				}

				// Handle DIY
				if (pagezone.getDiy() != null) {
					Diy diy = pagezone.getDiy();
					diy.setOrgid(1);
					diy.setBranchid(1);
					int fromdiyid = diy.getDiyid();
					diyService.uploadDiy(diy);
					String thumbnailPath = "/diy/snapshot/" + diy.getDiyid() + "."
							+ FilenameUtils.getExtension(diy.getSnapshot());
					File thumbFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbnailPath);
					File snapshotFile = new File(unzipFilePath + diy.getSnapshot().substring(4));
					CommonUtil.resizeImage(snapshotFile, thumbFile, 640);
					diy.setThumbnail(thumbnailPath);
					diyService.updateDiy(diy);
					String diyFilePath = "/diy/" + diy.getCode();
					File diyFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + diyFilePath);
					FileUtils.deleteQuietly(diyFile);
					FileUtils.moveDirectory(new File(unzipFilePath + "/" + diy.getCode()), diyFile);
					pagezone.setDiyid(diy.getDiyid());
					diyHash.put(fromdiyid, diy);
				}
			}

		}

		iter = pageHash.entrySet().iterator();
		while (iter.hasNext()) {
			Entry<Integer, Page> entry = iter.next();
			Page t = entry.getValue();
			for (Pagezone pagezone : t.getPagezones()) {
				// Handle DiyAction
				if (pagezone.getDiyaction() != null) {
					Diy diy = diyHash.get(pagezone.getDiyaction().getDiyid());
					Diyaction diyaction = diyService.selectByActionCode("" + diy.getDiyid(),
							pagezone.getDiyaction().getCode());
					if (diyaction != null) {
						pagezone.setDiyactionid(diyaction.getDiyactionid());
					}
				}

				pagezone.setPageid(pageHash.get(pagezone.getPageid()).getPageid());
				pagezone.setHomepageid(page.getPageid());
				Page touchPage = pageHash.get(pagezone.getTouchid());
				if (touchPage != null) {
					pagezone.setTouchid(touchPage.getPageid());
				} else {
					pagezone.setTouchid(0);
				}
				pagezoneMapper.insertSelective(pagezone);
				for (Pagezonedtl pagezonedtl : pagezone.getPagezonedtls()) {
					if (pagezonedtl.getObjtype().equals(Pagezonedtl.ObjType_Video)) {
						if (videoHash.get(pagezonedtl.getObjid()).getVideoid() != null) {
							pagezonedtl.setPagezoneid(pagezone.getPagezoneid());
							pagezonedtl.setObjid(videoHash.get(pagezonedtl.getObjid()).getVideoid());
							pagezonedtlMapper.insertSelective(pagezonedtl);
						}
					} else if (pagezonedtl.getObjtype().equals(Pagezonedtl.ObjType_Image)) {
						if (imageHash.get(pagezonedtl.getObjid()).getImageid() != null) {
							pagezonedtl.setPagezoneid(pagezone.getPagezoneid());
							pagezonedtl.setObjid(imageHash.get(pagezonedtl.getObjid()).getImageid());
							pagezonedtlMapper.insertSelective(pagezonedtl);
						}
					}
				}
			}
		}

		makeHtmlZip("" + page.getPageid());
		return page;
	}

	public void addStaffs(Page page, String[] staffids) {
		for (int i = 0; i < staffids.length; i++) {
			pageMapper.addStaff("" + page.getPageid(), staffids[i]);
		}
	}

	public void deleteStaffs(Page page, String[] staffids) {
		for (int i = 0; i < staffids.length; i++) {
			pageMapper.deleteStaff("" + page.getPageid(), staffids[i]);
		}
	}

	public void setPageReviewWait(String pageid) {
		Page page = pageMapper.selectByPrimaryKey(pageid);
		if (page != null && page.getHomepageid() > 0) {
			page = pageMapper.selectByPrimaryKey("" + page.getHomepageid());
		}
		if (page != null) {
			if (page.getReviewflag().equals(Page.REVIEW_PASSED)) {
				page.setJson(gson.toJson(page));
			}
			page.setReviewflag(Page.REVIEW_WAIT);
			pageMapper.updateByPrimaryKeySelective(page);
			List<Page> subpages = page.getSubpages();
			if (subpages != null) {
				for (Page b : subpages) {
					if (b.getReviewflag().equals(Page.REVIEW_PASSED)) {
						b.setJson(gson.toJson(b));
					}
					b.setReviewflag(Page.REVIEW_WAIT);
					pageMapper.updateByPrimaryKeySelective(b);
				}
			}
		}
	}

	public void setPageReviewResut(String pageid, String reviewflag, String comment) throws Exception {
		Page page = pageMapper.selectByPrimaryKey(pageid);
		if (page != null && page.getHomepageid() > 0) {
			page = pageMapper.selectByPrimaryKey("" + page.getHomepageid());
		}
		if (page != null) {
			page.setReviewflag(reviewflag);
			page.setComment(comment);
			pageMapper.updateByPrimaryKeySelective(page);
			List<Page> subpages = page.getSubpages();
			if (subpages != null) {
				for (Page b : subpages) {
					b.setReviewflag(reviewflag);
					b.setComment(comment);
					pageMapper.updateByPrimaryKeySelective(b);
				}
			}

			if (reviewflag.equals(Page.REVIEW_PASSED)) {
				makeHtmlZip("" + page.getPageid());
			}
		}
	}

}
