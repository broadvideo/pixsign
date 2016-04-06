package com.broadvideo.pixsignage.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Bundledtl;
import com.broadvideo.pixsignage.domain.Medialist;
import com.broadvideo.pixsignage.domain.Medialistdtl;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.persistence.BundledtlMapper;
import com.broadvideo.pixsignage.persistence.MedialistMapper;
import com.broadvideo.pixsignage.persistence.MedialistdtlMapper;
import com.broadvideo.pixsignage.persistence.RegionscheduleMapper;

@Service("medialistService")
public class MedialistServiceImpl implements MedialistService {

	@Autowired
	private MedialistMapper medialistMapper;
	@Autowired
	private MedialistdtlMapper medialistdtlMapper;
	@Autowired
	private BundledtlMapper bundledtlMapper;
	@Autowired
	private RegionscheduleMapper regionscheduleMapper;

	public int selectCount(int orgid, String branchid, String search) {
		return medialistMapper.selectCount(orgid, branchid, search);
	}

	public List<Medialist> selectList(int orgid, String branchid, String search, String start, String length) {
		return medialistMapper.selectList(orgid, branchid, search, start, length);
	}

	public List<Medialistdtl> selectMedialistdtlList(String medialistid) {
		return medialistdtlMapper.selectList(medialistid);
	}

	@Transactional
	public void addMedialist(Medialist medialist) {
		medialistMapper.insertSelective(medialist);
	}

	@Transactional
	public void updateMedialist(Medialist medialist) {
		medialistMapper.updateByPrimaryKeySelective(medialist);
	}

	@Transactional
	public void deleteMedialist(String medialistid) {
		medialistdtlMapper.deleteByMedialist(medialistid);
		bundledtlMapper.clearByObj(Bundledtl.ObjType_Medialist, medialistid);
		regionscheduleMapper.deleteByObj(Regionschedule.ObjType_Medialist, medialistid);
		medialistMapper.deleteByPrimaryKey(medialistid);
	}

	@Transactional
	public void syncMedialistdtlList(Medialist medialist, Medialistdtl[] medialistdtls) {
		int medialistid = medialist.getMedialistid();
		List<Medialistdtl> oldmedialistdtls = medialistdtlMapper.selectList("" + medialistid);
		HashMap<Integer, Medialistdtl> hash = new HashMap<Integer, Medialistdtl>();
		for (int i = 0; i < medialistdtls.length; i++) {
			Medialistdtl medialistdtl = medialistdtls[i];
			if (medialistdtl.getMedialistdtlid() == 0) {
				medialistdtl.setMedialistid(medialistid);
				medialistdtlMapper.insertSelective(medialistdtl);
			} else {
				medialistdtlMapper.updateByPrimaryKeySelective(medialistdtl);
				hash.put(medialistdtl.getMedialistdtlid(), medialistdtl);
			}
		}
		for (int i = 0; i < oldmedialistdtls.size(); i++) {
			if (hash.get(oldmedialistdtls.get(i).getMedialistdtlid()) == null) {
				medialistdtlMapper.deleteByPrimaryKey("" + oldmedialistdtls.get(i).getMedialistdtlid());
			}
		}
	}
}
