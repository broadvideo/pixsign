package com.broadvideo.pixsignage.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
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
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Template;
import com.broadvideo.pixsignage.domain.Templatezone;
import com.broadvideo.pixsignage.domain.Templatezonedtl;
import com.broadvideo.pixsignage.persistence.ImageMapper;
import com.broadvideo.pixsignage.persistence.TemplateMapper;
import com.broadvideo.pixsignage.persistence.TemplatezoneMapper;
import com.broadvideo.pixsignage.persistence.TemplatezonedtlMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

import net.sf.json.JSONObject;

@Service("templateService")
public class TemplateServiceImpl implements TemplateService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private TemplateMapper templateMapper;
	@Autowired
	private TemplatezoneMapper templatezoneMapper;
	@Autowired
	private TemplatezonedtlMapper templatezonedtlMapper;
	@Autowired
	private ImageMapper imageMapper;

	public Template selectByPrimaryKey(String templateid) {
		return templateMapper.selectByPrimaryKey(templateid);
	}

	public Template selectByUuid(String uuid) {
		return templateMapper.selectByUuid(uuid);
	}

	public int selectCount(String orgid, String ratio, String touchflag, String homeflag, String publicflag,
			String search) {
		return templateMapper.selectCount(orgid, ratio, touchflag, homeflag, publicflag, search);
	}

	public List<Template> selectList(String orgid, String ratio, String touchflag, String homeflag, String publicflag,
			String search, String start, String length) {
		return templateMapper.selectList(orgid, ratio, touchflag, homeflag, publicflag, search, start, length);
	}

	@Transactional
	public void addTemplate(Template template) {
		if (template.getName() == null || template.getName().equals("")) {
			template.setName("UNKNOWN");
		}
		if (template.getRatio().equals("1")) {
			// 16:9
			template.setWidth(1920);
			template.setHeight(1080);
		} else if (template.getRatio().equals("2")) {
			// 9:16
			template.setWidth(1080);
			template.setHeight(1920);
		}
		templateMapper.insertSelective(template);

		if (template.getName().equals("UNKNOWN")) {
			template.setName("TEMPLATE-" + template.getTemplateid());
		}
		templateMapper.updateByPrimaryKeySelective(template);
	}

	@Transactional
	public void copyTemplate(String fromtemplateid, Template template) throws Exception {
		if (template.getName() == null || template.getName().equals("")) {
			template.setName("UNKNOWN");
		}
		Template fromtemplate = templateMapper.selectByPrimaryKey(fromtemplateid);
		if (fromtemplate == null) {
			// Create template from blank
			if (template.getRatio().equals("1")) {
				// 16:9
				template.setWidth(1920);
				template.setHeight(1080);
			} else if (template.getRatio().equals("2")) {
				// 9:16
				template.setWidth(1080);
				template.setHeight(1920);
			}
			templateMapper.insertSelective(template);

			if (template.getName().equals("UNKNOWN")) {
				template.setName("TEMPLATE-" + template.getTemplateid());
			}
			templateMapper.updateByPrimaryKeySelective(template);
		} else {
			// Copy template
			template.setTemplateid(fromtemplate.getTemplateid());
			template.setRatio(fromtemplate.getRatio());
			template.setHeight(fromtemplate.getHeight());
			template.setWidth(fromtemplate.getWidth());
			templateMapper.insertSelective(template);
			if (template.getName().equals("UNKNOWN")) {
				template.setName("TEMPLATE-" + template.getTemplateid());
			}
			if (fromtemplate.getSnapshot() != null) {
				String snapshotFilePath = "/template/" + template.getTemplateid() + "/snapshot/"
						+ template.getTemplateid() + ".png";
				File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + fromtemplate.getSnapshot()),
						snapshotFile);
				template.setSnapshot(snapshotFilePath);
			}
			templateMapper.updateByPrimaryKeySelective(template);

			List<Templatezone> fromtemplatezones = fromtemplate.getTemplatezones();
			for (Templatezone fromtemplatezone : fromtemplatezones) {
				Templatezone templatezone = new Templatezone();
				templatezone.setTemplateid(template.getTemplateid());
				if (template.getHomeflag().equals("0")) {
					templatezone.setHometemplateid(template.getHometemplateid());
				} else {
					templatezone.setHometemplateid(template.getTemplateid());
				}
				templatezone.setType(fromtemplatezone.getType());
				templatezone.setHeight(fromtemplatezone.getHeight());
				templatezone.setWidth(fromtemplatezone.getWidth());
				templatezone.setTopoffset(fromtemplatezone.getTopoffset());
				templatezone.setLeftoffset(fromtemplatezone.getLeftoffset());
				templatezone.setZindex(fromtemplatezone.getZindex());
				templatezone.setTransform(fromtemplatezone.getTransform());
				templatezone.setBdcolor(fromtemplatezone.getBdcolor());
				templatezone.setBdstyle(fromtemplatezone.getBdstyle());
				templatezone.setBdwidth(fromtemplatezone.getBdwidth());
				templatezone.setBdradius(fromtemplatezone.getBdradius());
				templatezone.setBgcolor(fromtemplatezone.getBgcolor());
				templatezone.setBgopacity(fromtemplatezone.getBgopacity());
				templatezone.setOpacity(fromtemplatezone.getOpacity());
				templatezone.setPadding(fromtemplatezone.getPadding());
				templatezone.setShadowh(fromtemplatezone.getShadowh());
				templatezone.setShadowv(fromtemplatezone.getShadowv());
				templatezone.setShadowblur(fromtemplatezone.getShadowblur());
				templatezone.setShadowcolor(fromtemplatezone.getShadowcolor());
				templatezone.setColor(fromtemplatezone.getColor());
				templatezone.setFontfamily(fromtemplatezone.getFontfamily());
				templatezone.setFontsize(fromtemplatezone.getFontsize());
				templatezone.setFontweight(fromtemplatezone.getFontweight());
				templatezone.setFontstyle(fromtemplatezone.getFontstyle());
				templatezone.setDecoration(fromtemplatezone.getDecoration());
				templatezone.setAlign(fromtemplatezone.getAlign());
				templatezone.setLineheight(fromtemplatezone.getLineheight());
				templatezone.setRows(fromtemplatezone.getRows());
				templatezone.setCols(fromtemplatezone.getCols());
				templatezone.setRules(fromtemplatezone.getRules());
				templatezone.setRulecolor(fromtemplatezone.getRulecolor());
				templatezone.setRulewidth(fromtemplatezone.getRulewidth());
				templatezone.setDateformat(fromtemplatezone.getDateformat());
				templatezone.setContent(fromtemplatezone.getContent());
				templatezoneMapper.insertSelective(templatezone);
				for (Templatezonedtl fromtemplatezonedtl : fromtemplatezone.getTemplatezonedtls()) {
					Templatezonedtl templatezonedtl = new Templatezonedtl();
					templatezonedtl.setTemplatezoneid(templatezone.getTemplatezoneid());
					templatezonedtl.setObjtype(fromtemplatezonedtl.getObjtype());
					templatezonedtl.setObjid(fromtemplatezonedtl.getObjid());
					templatezonedtl.setSequence(fromtemplatezonedtl.getSequence());
					templatezonedtlMapper.insertSelective(templatezonedtl);
				}
			}
		}
	}

	@Transactional
	public void updateTemplate(Template template) {
		templateMapper.updateByPrimaryKeySelective(template);
	}

	@Transactional
	public void deleteTemplate(String templateid) {
		Template template = templateMapper.selectByPrimaryKey(templateid);
		if (template != null) {
			for (Template subtemplate : template.getSubtemplates()) {
				templateMapper.deleteByPrimaryKey("" + subtemplate.getTemplateid());
			}
		}
		templateMapper.deleteByPrimaryKey(templateid);
	}

	@Transactional
	public void design(Template template) throws Exception {
		if (template.getName() == null || template.getName().equals("")) {
			template.setName("UNKNOWN");
		}

		templateMapper.updateByPrimaryKeySelective(template);
		int templateid = template.getTemplateid();
		List<Templatezone> templatezones = template.getTemplatezones();
		List<Templatezone> oldtemplatezones = templatezoneMapper.selectList("" + templateid);
		HashMap<Integer, Templatezone> hash = new HashMap<Integer, Templatezone>();
		for (Templatezone templatezone : templatezones) {
			if (templatezone.getTemplatezoneid() > 0) {
				hash.put(templatezone.getTemplatezoneid(), templatezone);
			}
		}
		for (int i = 0; i < oldtemplatezones.size(); i++) {
			Templatezone oldTemplatezone = oldtemplatezones.get(i);
			if (hash.get(oldTemplatezone.getTemplatezoneid()) == null) {
				templatezonedtlMapper.deleteByTemplatezone("" + oldtemplatezones.get(i).getTemplatezoneid());
				templatezoneMapper.deleteByPrimaryKey("" + oldtemplatezones.get(i).getTemplatezoneid());
			}
		}
		for (Templatezone templatezone : templatezones) {
			if (template.getHomeflag().equals("0")) {
				templatezone.setHometemplateid(template.getHometemplateid());
			} else {
				templatezone.setHometemplateid(template.getTemplateid());
			}
			if (templatezone.getTemplatezoneid() <= 0) {
				templatezone.setTemplateid(templateid);
				templatezoneMapper.insertSelective(templatezone);
			} else {
				templatezoneMapper.updateByPrimaryKeySelective(templatezone);
				templatezonedtlMapper.deleteByTemplatezone("" + templatezone.getTemplatezoneid());
			}
			for (Templatezonedtl templatezonedtl : templatezone.getTemplatezonedtls()) {
				templatezonedtl.setTemplatezoneid(templatezone.getTemplatezoneid());
				templatezonedtlMapper.insertSelective(templatezonedtl);
			}
		}

		String snapshotdtl = template.getSnapshotdtl();
		if (snapshotdtl != null && snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
			String snapshotFilePath = "/template/" + template.getTemplateid() + "/snapshot/" + template.getTemplateid()
					+ ".png";
			File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
			FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
			template.setSnapshot(snapshotFilePath);
			templateMapper.updateByPrimaryKeySelective(template);
		}
	}

	public void exportZip(String templateid) throws Exception {
		ArrayList<Template> templateList = new ArrayList<Template>();
		HashMap<Integer, Image> imageHash = new HashMap<Integer, Image>();
		Template template = templateMapper.selectByPrimaryKey(templateid);
		templateList.add(template);
		for (Template subtemplate : template.getSubtemplates()) {
			Template p = templateMapper.selectByPrimaryKey("" + subtemplate.getTemplateid());
			templateList.add(p);
		}
		for (Template p : templateList) {
			for (Templatezone templatezone : p.getTemplatezones()) {
				if (templatezone.getType() == Templatezone.Type_Image
						|| templatezone.getType() == Templatezone.Type_Button) {
					for (Templatezonedtl templatezonedtl : templatezone.getTemplatezonedtls()) {
						Image image = templatezonedtl.getImage();
						if (image != null && imageHash.get(image.getImageid()) == null) {
							imageHash.put(image.getImageid(), image);
						}
					}
				}
			}
		}

		String saveDir = CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + templateid;
		String zipname = "template-" + template.getUuid() + ".zip";
		FileUtils.forceMkdir(new File(saveDir));
		File zipFile = new File(saveDir, zipname);
		if (zipFile.exists()) {
			zipFile.delete();
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

		for (Template t : templateList) {
			String templateDir = CommonConfig.CONFIG_PIXDATA_HOME + "/template/" + t.getTemplateid();
			File jsfFile = new File(templateDir, "" + t.getTemplateid() + ".jsf");
			FileUtils.writeStringToFile(jsfFile, JSONObject.fromObject(t).toString(2), "UTF-8", false);
			String jsfname = "index.jsf";
			String pngname = "index.png";
			if (t.getHomeflag().equals("0")) {
				jsfname = "" + t.getTemplateid() + ".jsf";
				pngname = "" + t.getTemplateid() + ".png";
			}
			CommonUtil.zip(out, jsfFile, jsfname);
			if (t.getSnapshot() != null) {
				File snapshot = new File(CommonConfig.CONFIG_PIXDATA_HOME + t.getSnapshot());
				CommonUtil.zip(out, snapshot, pngname);
			}
		}
		out.close();
	}

	@Transactional
	public void importZip(File zipFile) throws Exception {
		String fileName = zipFile.getName();
		logger.info("Begin to import template {}", fileName);
		fileName = fileName.substring(0, fileName.lastIndexOf("."));
		String unzipFilePath = CommonConfig.CONFIG_PIXDATA_HOME + "/import/" + fileName;
		FileUtils.deleteQuietly(new File(unzipFilePath));
		CommonUtil.unzip(zipFile.getAbsolutePath(), unzipFilePath, false);
		FileUtils.forceDelete(zipFile);

		HashMap<Integer, Template> templateHash = new HashMap<Integer, Template>();
		HashMap<Integer, Image> imageHash = new HashMap<Integer, Image>();

		Date now = Calendar.getInstance().getTime();
		File indexJsf = new File(unzipFilePath, "index.jsf");
		logger.info("parse {}", indexJsf.getAbsoluteFile());
		JSONObject templateJson = JSONObject.fromObject(FileUtils.readFileToString(indexJsf));
		Map<String, Class> map = new HashMap<String, Class>();
		map.put("subtemplates", Template.class);
		map.put("templatezones", Templatezone.class);
		map.put("templatezonedtls", Templatezonedtl.class);
		Template template = (Template) JSONObject.toBean(templateJson, Template.class, map);
		Integer fromTemplateid = template.getTemplateid();
		Template oldTemplate = templateMapper.selectByUuid(template.getUuid());
		if (oldTemplate != null) {
			templateMapper.deleteByPrimaryKey("" + oldTemplate.getTemplateid());
		}
		template.setOrgid(1);
		template.setCreatetime(now);
		templateMapper.insertSelective(template);
		String snapshotFilePath = "/template/" + template.getTemplateid() + "/snapshot/" + template.getTemplateid()
				+ ".png";
		template.setSnapshot(snapshotFilePath);
		File fromSnapshotFile = new File(unzipFilePath, "index.png");
		File toSnapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		if (fromSnapshotFile.exists()) {
			FileUtils.copyFile(fromSnapshotFile, toSnapshotFile);
		}
		templateMapper.updateByPrimaryKeySelective(template);
		templateHash.put(fromTemplateid, template);
		logger.info("Add template oldid={}, newid={}", fromTemplateid, template.getTemplateid());

		for (Template subtemplet : template.getSubtemplates()) {
			File jsf = new File(unzipFilePath, "" + subtemplet.getTemplateid() + ".jsf");
			logger.info("parse {}", jsf.getAbsoluteFile());
			JSONObject json = JSONObject.fromObject(FileUtils.readFileToString(jsf));
			Template t = (Template) JSONObject.toBean(json, Template.class, map);
			fromTemplateid = t.getTemplateid();
			t.setOrgid(1);
			t.setHometemplateid(template.getTemplateid());
			t.setCreatetime(now);
			templateMapper.insertSelective(t);
			snapshotFilePath = "/template/" + t.getTemplateid() + "/snapshot/" + t.getTemplateid() + ".png";
			t.setSnapshot(snapshotFilePath);
			fromSnapshotFile = new File(unzipFilePath, "" + fromTemplateid + ".png");
			toSnapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
			if (fromSnapshotFile.exists()) {
				FileUtils.copyFile(fromSnapshotFile, toSnapshotFile);
			}
			templateMapper.updateByPrimaryKeySelective(t);
			templateHash.put(fromTemplateid, t);
			logger.info("Add subtemplate oldid={}, newid={}", fromTemplateid, t.getTemplateid());
		}

		Iterator<Entry<Integer, Template>> iter = templateHash.entrySet().iterator();
		while (iter.hasNext()) {
			Entry<Integer, Template> entry = iter.next();
			Template t = entry.getValue();
			for (Templatezone templatezone : t.getTemplatezones()) {
				for (Templatezonedtl templatezonedtl : templatezone.getTemplatezonedtls()) {
					Image image = templatezonedtl.getImage();
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
				}
			}
		}

		iter = templateHash.entrySet().iterator();
		while (iter.hasNext()) {
			Entry<Integer, Template> entry = iter.next();
			Template t = entry.getValue();
			for (Templatezone templatezone : t.getTemplatezones()) {
				templatezone.setTemplateid(templateHash.get(templatezone.getTemplateid()).getTemplateid());
				templatezone.setHometemplateid(template.getTemplateid());
				Template touchTemplate = templateHash.get(templatezone.getTouchtemplateid());
				if (touchTemplate != null) {
					templatezone.setTouchtemplateid(touchTemplate.getTemplateid());
				} else {
					templatezone.setTouchtemplateid(0);
				}
				templatezoneMapper.insertSelective(templatezone);
				for (Templatezonedtl templatezonedtl : templatezone.getTemplatezonedtls()) {
					if (templatezonedtl.getObjtype().equals("2")) {
						templatezonedtl.setTemplatezoneid(templatezone.getTemplatezoneid());
						templatezonedtl.setObjid(imageHash.get(templatezonedtl.getObjid()).getImageid());
						templatezonedtlMapper.insertSelective(templatezonedtl);
					}
				}
			}
		}
	}
}
