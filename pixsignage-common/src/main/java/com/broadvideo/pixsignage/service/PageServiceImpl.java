package com.broadvideo.pixsignage.service;

import java.io.File;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.persistence.PageMapper;
import com.broadvideo.pixsignage.persistence.PagezoneMapper;

@Service("pageService")
public class PageServiceImpl implements PageService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private PageMapper pageMapper;
	@Autowired
	private PagezoneMapper pagezoneMapper;

	public Page selectByPrimaryKey(String pageid) {
		return pageMapper.selectByPrimaryKey(pageid);
	}

	public int selectTemplateCount(String search) {
		return pageMapper.selectTemplateCount(search);
	}

	public List<Page> selectTemplateList(String search, String start, String length) {
		return pageMapper.selectTemplateList(search, start, length);
	}

	public int selectPageCount(String orgid, String branchid, String search) {
		return pageMapper.selectPageCount(orgid, branchid, search);
	}

	public List<Page> selectPageList(String orgid, String branchid, String search, String start, String length) {
		return pageMapper.selectPageList(orgid, branchid, search, start, length);
	}

	@Transactional
	public void addTemplatePage(Page page) {
		page.setTemplateflag("1");
		if (page.getRatio().equals("1")) {
			page.setWidth(1920);
			page.setHeight(1080);
		} else {
			page.setWidth(1080);
			page.setHeight(1920);
		}
		page.setUpdatetime(Calendar.getInstance().getTime());
		pageMapper.insertSelective(page);
	}

	@Transactional
	public void addCommonPage(Page page) {
		Page template = pageMapper.selectByPrimaryKey("" + page.getTemplateid());
		if (template != null) {
			page.setTemplateflag("0");
			page.setWidth(template.getWidth());
			page.setHeight(template.getHeight());
			page.setRatio(template.getRatio());
			page.setUpdatetime(Calendar.getInstance().getTime());
			pageMapper.insertSelective(page);

			List<Pagezone> pagezones = template.getPagezones();
			for (Pagezone pagezone : pagezones) {
				pagezone.setPagezoneid(0);
				pagezone.setPageid(page.getPageid());
				pagezoneMapper.insertSelective(pagezone);
			}

			if (template.getSnapshot() != null) {
				String snapshotFilePath = "/pagepkg/" + page.getPagepkgid() + "/snapshot/" + page.getPageid() + ".png";
				File snapshotFile1 = new File(CommonConfig.CONFIG_PIXDATA_HOME + template.getSnapshot());
				File snapshotFile2 = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				try {
					FileUtils.copyFile(snapshotFile1, snapshotFile2);
					page.setSnapshot(snapshotFilePath);
					pageMapper.updateByPrimaryKeySelective(page);
				} catch (Exception ex) {
					logger.error("addCommonPage exception. ", ex);
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
	public void addPagezone(Pagezone pagezone) {
		pagezoneMapper.insertSelective(pagezone);
	}

	@Transactional
	public void deletePagezone(String pagezoneid) {
		pagezoneMapper.deleteByPrimaryKey(pagezoneid);
	}

	@Transactional
	public void savePage(Page page) {
		pageMapper.updateByPrimaryKeySelective(page);

		int pageid = page.getPageid();
		List<Pagezone> oldpagezones = pagezoneMapper.selectList("" + pageid);
		HashMap<Integer, Pagezone> hash = new HashMap<Integer, Pagezone>();
		for (Pagezone pagezone : page.getPagezones()) {
			if (pagezone.getPagezoneid() == 0) {
				pagezone.setPageid(pageid);
				addPagezone(pagezone);
			} else {
				pagezoneMapper.updateByPrimaryKeySelective(pagezone);
				hash.put(pagezone.getPagezoneid(), pagezone);
			}
		}
		for (int i = 0; i < oldpagezones.size(); i++) {
			if (hash.get(oldpagezones.get(i).getPagezoneid()) == null) {
				deletePagezone("" + oldpagezones.get(i).getPagezoneid());
			}
		}
	}
}
