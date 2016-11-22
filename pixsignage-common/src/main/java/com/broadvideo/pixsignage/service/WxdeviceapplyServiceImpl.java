package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Wxdeviceapply;
import com.broadvideo.pixsignage.persistence.WxdeviceapplyMapper;
import com.broadvideo.pixsignage.persistence.WxinfoMapper;

@Service("wxdeviceapplyService")
public class WxdeviceapplyServiceImpl implements WxdeviceapplyService {

	@Autowired
	private WxdeviceapplyMapper wxdeviceapplyMapper;
	@Autowired
	private WxinfoMapper wxinfoMapper;

	public Wxdeviceapply selectByPrimaryKey(String wxdeviceapplyid) {
		return wxdeviceapplyMapper.selectByPrimaryKey(wxdeviceapplyid);
	}

	public int selectCount(String orgid) {
		return wxdeviceapplyMapper.selectCount(orgid);
	}

	public List<Wxdeviceapply> selectList(String orgid, String start, String length) {
		return wxdeviceapplyMapper.selectList(orgid, start, length);
	}

	@Transactional
	public void addWxdeviceapply(Wxdeviceapply wxdeviceapply) {

		wxdeviceapplyMapper.insertSelective(wxdeviceapply);
	}

	@Transactional
	public void updateWxdeviceapply(Wxdeviceapply wxdeviceapply) {
		wxdeviceapplyMapper.updateByPrimaryKeySelective(wxdeviceapply);
	}

}
