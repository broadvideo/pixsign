package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Branch;

public interface BranchService {
	public int selectCount(int orgid);
	public List<Branch> selectList(int orgid);
	public List<Branch> selectByCode(String code, String orgid);
	public List<Branch> selectRoot(int orgid);
	
	public void addBranch(Branch branch);
	public void updateBranch(Branch branch);
	public void deleteBranch(String[] ids);
	
	public boolean validateName(Branch branch, String orgid);
	public boolean validateCode(Branch branch, String orgid);
}
