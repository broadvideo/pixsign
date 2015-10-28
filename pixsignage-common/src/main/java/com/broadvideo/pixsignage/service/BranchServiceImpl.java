package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.persistence.BranchMapper;

@Service("branchService")
public class BranchServiceImpl implements BranchService {

	@Autowired
	private BranchMapper branchMapper;

	public int selectCount(int orgid) {
		return branchMapper.selectCount(orgid);
	}

	public List<Branch> selectList(int orgid) {
		return branchMapper.selectList(orgid);
	}

	public List<Branch> selectByCode(String code, String orgid) {
		return branchMapper.selectByCode(code, orgid);
	}

	public List<Branch> selectRoot(int orgid) {
		return branchMapper.selectRoot(orgid);
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

	public boolean validateCode(Branch branch, String orgid) {
		List<Branch> list = branchMapper.selectByCode(branch.getCode(), orgid);
		if (list.size() == 0) {
			return true;
		} else {
			return (branch.getBranchid() == list.get(0).getBranchid());
		}
	}
}
