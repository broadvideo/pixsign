package com.broadvideo.pixsignage.service;

import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Wxinfo;
import com.broadvideo.pixsignage.persistence.WxinfoMapper;
import com.broadvideo.pixsignage.util.WeixinUtil;

@Service("wxinfoService")
public class WxinfoServiceImpl implements WxinfoService {

	@Autowired
	private WxinfoMapper wxinfoMapper;

	public Wxinfo selectByOrg(String orgid) {
		return wxinfoMapper.selectByOrg(orgid);
	}

	@Transactional
	public void updateWxinfo(Wxinfo wxinfo) {
		refreshToken(wxinfo);
	}

	@Transactional
	public Wxinfo getToken(String orgid) {
		Wxinfo wxinfo = wxinfoMapper.selectByOrg(orgid);
		if (wxinfo.getValidflag().equals("1")
				&& wxinfo.getExpiretime().getTime() < Calendar.getInstance().getTimeInMillis()) {
			refreshToken(wxinfo);
		}
		return wxinfo;
	}

	private void refreshToken(Wxinfo wxinfo) {
		WeixinUtil wxutil = new WeixinUtil();
		wxutil.getToken(wxinfo.getWxappid(), wxinfo.getWxsecret());
		if (wxutil.getResponseCode() == WeixinUtil.SUCCESS) {
			wxinfo.setValidflag("1");
			wxinfo.setAccesstocken(wxutil.getResponseJson().getString("access_token"));
			wxinfo.setApplytime(Calendar.getInstance().getTime());
			Calendar c = Calendar.getInstance();
			c.setTimeInMillis(c.getTimeInMillis() + 6600000);
			wxinfo.setExpiretime(c.getTime());
			wxinfo.setComment("OK");
		} else {
			wxinfo.setValidflag("0");
			wxinfo.setComment(wxutil.getResponseError());
		}
		wxinfoMapper.updateByPrimaryKeySelective(wxinfo);
	}

}
