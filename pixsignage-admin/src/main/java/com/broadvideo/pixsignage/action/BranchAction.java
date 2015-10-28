package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.service.BranchService;

@Scope("request")
@Controller("branchAction")
public class BranchAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5562422398118605701L;

	private static final Logger log = Logger.getLogger(BranchAction.class);

	private Branch branch;

	@Autowired
	private BranchService branchService;

	public String doList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			List<Branch> branchList = branchService.selectRoot(getLoginStaff().getOrgid());
			for (int i = 0; i < branchList.size(); i++) {
				aaData.add(branchList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			branch.setCreatestaffid(getLoginStaff().getStaffid());
			branch.setOrgid(getLoginStaff().getOrgid());
			branchService.addBranch(branch);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			branchService.updateBranch(branch);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			branchService.deleteBranch("" + branch.getBranchid());
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doValidate() {
		try {
			if (branch.getName() != null) {
				String orgid = "" + getLoginStaff().getOrgid();
				if (branchService.validateName(branch, orgid)) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					setErrormsg("名称已存在");
					return ERROR;
				}
			}
			if (branch.getCode() != null) {
				String orgid = "" + getLoginStaff().getOrgid();
				if (branchService.validateCode(branch, orgid)) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					setErrormsg("编码已存在");
					return ERROR;
				}
			}
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Branch getBranch() {
		return branch;
	}

	public void setBranch(Branch branch) {
		this.branch = branch;
	}
}
