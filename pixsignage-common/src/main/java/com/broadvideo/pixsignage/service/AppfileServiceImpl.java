package com.broadvideo.pixsignage.service;

import java.io.File;
import java.util.Calendar;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Appfile;
import com.broadvideo.pixsignage.persistence.AppfileMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;

@Service("appfileService")
public class AppfileServiceImpl implements AppfileService {

	@Autowired
	private AppfileMapper appfileMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	public List<Appfile> selectList(String name, String mtype) {
		return appfileMapper.selectList(name, mtype);
	}

	public Appfile selectLatest(String name, String mtype) {
		return appfileMapper.selectLatest(name, mtype);
	}

	@Transactional
	public void addAppfile(Appfile appfile) {
		Appfile appfile1 = appfileMapper.select(appfile.getName(), appfile.getMtype(), "" + appfile.getVcode());
		if (appfile1 != null) {
			appfile.setAppfileid(appfile1.getAppfileid());
			appfile.setDescription(appfile1.getDescription());
			appfile.setCreatetime(Calendar.getInstance().getTime());
			appfileMapper.updateByPrimaryKeySelective(appfile);
		} else {
			appfileMapper.insertSelective(appfile);
		}
		appfileMapper.update2outdate(appfile.getName(), appfile.getMtype());
		appfileMapper.update2latest(appfile.getName(), appfile.getMtype());
	}

	@Transactional
	public void updateAppfile(Appfile appfile) {
		appfileMapper.updateByPrimaryKeySelective(appfile);
	}

	@Transactional
	public void deleteAppfile(String appfileid) {
		Appfile appfile = appfileMapper.selectByPrimaryKey(appfileid);
		if (appfile != null) {
			FileUtils.deleteQuietly(new File(CommonConfig.CONFIG_PIXDATA_HOME + appfile.getFilepath()));
			appfileMapper.deleteByPrimaryKey(appfileid);
			appfileMapper.update2latest(appfile.getName(), appfile.getMtype());
			deviceMapper.checkAppfile(appfileid);
		}
	}

}
