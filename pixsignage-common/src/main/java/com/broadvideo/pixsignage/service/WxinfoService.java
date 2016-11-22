package com.broadvideo.pixsignage.service;

import com.broadvideo.pixsignage.domain.Wxinfo;

public interface WxinfoService {
	public Wxinfo selectByOrg(String orgid);

	public void updateWxinfo(Wxinfo wxinfo);

	public Wxinfo getToken(String orgid);
}
