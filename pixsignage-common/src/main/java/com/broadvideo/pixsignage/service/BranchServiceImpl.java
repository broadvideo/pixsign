package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.persistence.BranchMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;

@Service("branchService")
public class BranchServiceImpl implements BranchService {

	@Autowired
	private BranchMapper branchMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	public Branch selectByPrimaryKey(String branchid) {
		return branchMapper.selectByPrimaryKey(branchid);
	}

	public List<Branch> selectRoot(String orgid) {
		return branchMapper.selectRoot(orgid);
	}

	@Transactional
	public void addDevices(Branch branch, String[] deviceids) {
		for (int i = 0; i < deviceids.length; i++) {
			deviceMapper.updateBranch(deviceids[i], "" + branch.getBranchid());
		}
		deviceMapper.checkDevicegroup();
	}

	@Transactional
	public void addBranch(Branch branch) {
		branchMapper.insertSelective(branch);
	}

	@Transactional
	public void updateBranch(Branch branch) {
		branchMapper.updateByPrimaryKeySelective(branch);
	}

	@Transactional
	public void deleteBranch(String branchid) {
		branchMapper.deleteByPrimaryKey(branchid);
	}

	public boolean validateName(Branch branch, String orgid) {
		List<Branch> list = branchMapper.selectByName(branch.getName(), orgid);
		if (list.size() == 0) {
			return true;
		} else {
			return (branch.getBranchid() == list.get(0).getBranchid());
		}
	}
}
