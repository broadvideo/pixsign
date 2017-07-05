package com.broadvideo.pixsignage.service;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Template;
import com.broadvideo.pixsignage.domain.Templatezone;
import com.broadvideo.pixsignage.domain.Templatezonedtl;
import com.broadvideo.pixsignage.persistence.TemplateMapper;
import com.broadvideo.pixsignage.persistence.TemplatezoneMapper;
import com.broadvideo.pixsignage.persistence.TemplatezonedtlMapper;

@Service("templateService")
public class TemplateServiceImpl implements TemplateService {

	@Autowired
	private TemplateMapper templateMapper;
	@Autowired
	private TemplatezoneMapper templatezoneMapper;
	@Autowired
	private TemplatezonedtlMapper templatezonedtlMapper;

	public Template selectByPrimaryKey(String templateid) {
		return templateMapper.selectByPrimaryKey(templateid);
	}

	public int selectCount(String orgid, String ratio, String publicflag, String search) {
		return templateMapper.selectCount(orgid, ratio, publicflag, search);
	}

	public List<Template> selectList(String orgid, String ratio, String publicflag, String search, String start,
			String length) {
		return templateMapper.selectList(orgid, ratio, publicflag, search, start, length);
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
			template.setName("TEMPLET-" + template.getTemplateid());
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
				template.setName("TEMPLET-" + template.getTemplateid());
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
				template.setName("TEMPLET-" + template.getTemplateid());
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
				templatezone.setBdtl(fromtemplatezone.getBdtl());
				templatezone.setBdtr(fromtemplatezone.getBdtr());
				templatezone.setBdbl(fromtemplatezone.getBdbl());
				templatezone.setBdbr(fromtemplatezone.getBdbr());
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

}
