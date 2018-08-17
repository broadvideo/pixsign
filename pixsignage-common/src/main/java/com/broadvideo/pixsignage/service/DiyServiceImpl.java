package com.broadvideo.pixsignage.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Diy;
import com.broadvideo.pixsignage.domain.Diyaction;
import com.broadvideo.pixsignage.persistence.DiyMapper;
import com.broadvideo.pixsignage.persistence.DiyactionMapper;

@Service("diyService")
public class DiyServiceImpl implements DiyService {

	@Autowired
	private DiyMapper diyMapper;
	@Autowired
	private DiyactionMapper diyactionMapper;

	public Diy selectByPrimaryKey(String diyid) {
		return diyMapper.selectByPrimaryKey(diyid);
	}

	public int selectCount(String orgid, String branchid, String search) {
		return diyMapper.selectCount(orgid, branchid, search);
	}

	public List<Diy> selectList(String orgid, String branchid, String search, String start, String length) {
		return diyMapper.selectList(orgid, branchid, search, start, length);
	}

	public Diy selectByCode(String code) {
		return diyMapper.selectByCode(code);
	}

	public Diyaction selectByActionCode(String diyid, String actioncode) {
		return diyactionMapper.selectByCode(diyid, actioncode);
	}

	@Transactional
	public void uploadDiy(Diy diy) {
		String code = diy.getCode();
		Diy oldDiy = diyMapper.selectByCode(code);
		if (oldDiy == null) {
			diyMapper.insertSelective(diy);
		} else {
			diy.setDiyid(oldDiy.getDiyid());
			diyMapper.updateByPrimaryKeySelective(diy);
		}

		List<Diyaction> olddiyactions = diyactionMapper.selectList("" + diy.getDiyid());
		List<Diyaction> newdiyactions = diy.getDiyactions();
		HashMap<String, Diyaction> oldHash = new HashMap<String, Diyaction>();
		for (Diyaction diyaction : olddiyactions) {
			oldHash.put(diyaction.getCode(), diyaction);
		}
		HashMap<String, Diyaction> newHash = new HashMap<String, Diyaction>();
		for (Diyaction diyaction : newdiyactions) {
			Diyaction olddiyaction = oldHash.get(diyaction.getCode());
			if (olddiyaction == null) {
				diyaction.setDiyid(diy.getDiyid());
				diyactionMapper.insertSelective(diyaction);
			} else {
				diyaction.setDiyactionid(olddiyaction.getDiyactionid());
				diyaction.setDiyid(diy.getDiyid());
				diyactionMapper.updateByPrimaryKeySelective(diyaction);
			}
			newHash.put(diyaction.getCode(), diyaction);
		}
		for (Diyaction diyaction : olddiyactions) {
			if (newHash.get(diyaction.getCode()) == null) {
				diyactionMapper.deleteByPrimaryKey("" + diyaction.getDiyactionid());
			}
		}
	}

	@Transactional
	public void updateDiy(Diy diy) {
		diyMapper.updateByPrimaryKeySelective(diy);
	}

	@Transactional
	public void deleteDiy(String diyid) {
		diyMapper.deleteByPrimaryKey(diyid);
	}

}
