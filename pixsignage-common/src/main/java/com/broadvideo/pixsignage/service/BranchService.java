package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Branch;

public interface BranchService {
	public Branch selectByPrimaryKey(String branchid);

	public List<Branch> selectRoot(String orgid);

	public void addDevices(Branch branch, String[] deviceids);

	public void addBranch(Branch branch);

	public void updateBranch(Branch branch);

	public void deleteBranch(String branchid);

	public boolean validateName(Branch branch, String orgid);
}
