package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Wxdevice;
import com.broadvideo.pixsignage.persistence.WxdeviceMapper;

@Service("wxdeviceService")
public class WxdeviceServiceImpl implements WxdeviceService {

	@Autowired
	private WxdeviceMapper wxdeviceMapper;

	public Wxdevice selectByPrimaryKey(String wxdeviceid) {
		return wxdeviceMapper.selectByPrimaryKey(wxdeviceid);
	}

	public int selectCount(String orgid, String wxdeviceapplyid) {
		return wxdeviceMapper.selectCount(orgid, wxdeviceapplyid);
	}

	public List<Wxdevice> selectList(String orgid, String wxdeviceapplyid, String start, String length) {
		return wxdeviceMapper.selectList(orgid, wxdeviceapplyid, start, length);
	}

	@Transactional
	public void addWxdevice(Wxdevice wxdevice) {
		wxdeviceMapper.insertSelective(wxdevice);
	}

	@Transactional
	public void updateWxdevice(Wxdevice wxdevice) {
		wxdeviceMapper.updateByPrimaryKeySelective(wxdevice);
	}

	@Transactional
	public void syncWxdevice(Wxdevice wxdevice) {
		Wxdevice oldWxdevice = wxdeviceMapper.selectByPrimaryKey("" + wxdevice.getWxdeviceid());
		if (oldWxdevice != null) {
			wxdeviceMapper.updateByPrimaryKeySelective(wxdevice);
		} else {
			wxdeviceMapper.insertSelective(wxdevice);
		}
	}
}
