package com.broadvideo.pixsignage.service;

import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Adplandtl;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.AdplandtlMapper;
import com.broadvideo.pixsignage.persistence.VideoMapper;

@Service("adplandtlService")
public class AdplandtlServiceImpl implements AdplandtlService {

	@Autowired
	private AdplandtlMapper adplandtlMapper;
	@Autowired
	private VideoMapper videoMapper;

	public Adplandtl selectByPrimaryKey(String adplandtlid) {
		return adplandtlMapper.selectByPrimaryKey(adplandtlid);
	}

	public int selectCount(String adplanid) {
		return adplandtlMapper.selectCount(adplanid);
	}

	public List<Adplandtl> selectList(String adplanid, String start, String length) {
		return adplandtlMapper.selectList(adplanid, start, length);
	}

	@Transactional
	public void addAdplandtl(Adplandtl adplandtl) {
		if (adplandtl.getAdtype().equals("1")) {
			Video video = videoMapper.selectByPrimaryKey("" + adplandtl.getAdid());
			adplandtl.setDuration(video.getDuration());
		} else if (adplandtl.getAdtype().equals("2")) {
			adplandtl.setDuration(10);
		}
		adplandtl.setAmount(
				adplandtl.getUnitprice() * adplandtl.getDuration() * adplandtl.getTimes() * adplandtl.getMonths());
		Calendar c = Calendar.getInstance();
		c.setTime(adplandtl.getStarttime());
		c.add(Calendar.MONTH, adplandtl.getMonths());
		adplandtl.setEndtime(c.getTime());
		adplandtlMapper.insertSelective(adplandtl);
	}

	@Transactional
	public void updateAdplandtl(Adplandtl adplandtl) {
		adplandtlMapper.updateByPrimaryKeySelective(adplandtl);
	}

	@Transactional
	public void deleteAdplandtl(String adplandtlid) {
		adplandtlMapper.deleteByPrimaryKey(adplandtlid);
	}

}
