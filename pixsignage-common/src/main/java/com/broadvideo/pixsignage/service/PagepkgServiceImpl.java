package com.broadvideo.pixsignage.service;

import java.io.File;
import java.util.Calendar;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Pagepkg;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.persistence.PageMapper;
import com.broadvideo.pixsignage.persistence.PagepkgMapper;
import com.broadvideo.pixsignage.persistence.PagezoneMapper;

@Service("pagepkgService")
public class PagepkgServiceImpl implements PagepkgService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private PagepkgMapper pagepkgMapper;
	@Autowired
	private PageMapper pageMapper;
	@Autowired
	private PagezoneMapper pagezoneMapper;

	public int selectCount(int orgid, String branchid, String search) {
		return pagepkgMapper.selectCount(orgid, branchid, search);
	}

	public List<Pagepkg> selectList(int orgid, String branchid, String search, String start, String length) {
		return pagepkgMapper.selectList(orgid, branchid, search, start, length);
	}

	@Transactional
	public void addPagepkg(Pagepkg pagepkg) {
		Page page = pageMapper.selectByPrimaryKey("" + pagepkg.getTemplateid());
		if (page != null) {
			page.setPageid(0);
			page.setTemplateid(pagepkg.getTemplateid());
			page.setPagepkgid(pagepkg.getPagepkgid());
			page.setEntry("1");
			page.setType("0");
			page.setUpdatetime(Calendar.getInstance().getTime());
			pageMapper.insertSelective(page);

			List<Pagezone> pagezones = page.getPagezones();
			for (Pagezone pagezone : pagezones) {
				pagezone.setPagezoneid(0);
				pagezone.setPageid(page.getPageid());
				pagezoneMapper.insertSelective(pagezone);
			}

			pagepkg.setRatio(page.getRatio());
			pagepkg.setWidth(page.getWidth());
			pagepkg.setHeight(page.getHeight());
			pagepkg.setIndexpageid(page.getPageid());
			pagepkg.setUpdatetime(Calendar.getInstance().getTime());
			pagepkgMapper.insertSelective(pagepkg);

			if (page.getSnapshot() != null) {
				String snapshotFilePath = "/pagepkg/" + pagepkg.getPagepkgid() + "/snapshot/" + page.getPageid()
						+ ".png";
				File snapshotFile1 = new File(CommonConfig.CONFIG_PIXDATA_HOME + page.getSnapshot());
				File snapshotFile2 = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				try {
					FileUtils.copyFile(snapshotFile1, snapshotFile2);
					page.setSnapshot(snapshotFilePath);
					pagepkg.setSnapshot(snapshotFilePath);
				} catch (Exception ex) {
					logger.error("addPagepkg exception. ", ex);
				}
			}

			page.setPagepkgid(pagepkg.getPagepkgid());
			pageMapper.updateByPrimaryKeySelective(page);
			pagepkgMapper.updateByPrimaryKeySelective(pagepkg);
		}
	}

	@Transactional
	public void updatePagepkg(Pagepkg pagepkg) {
		pagepkg.setUpdatetime(Calendar.getInstance().getTime());
		pagepkgMapper.updateByPrimaryKeySelective(pagepkg);
	}

	@Transactional
	public void deletePagepkg(String pagepkgid) {
		pagepkgMapper.deleteByPrimaryKey(pagepkgid);
	}

}
