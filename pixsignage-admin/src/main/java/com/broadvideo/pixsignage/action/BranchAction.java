package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.service.BranchService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("branchAction")
public class BranchAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Branch branch;
	private String[] deviceids;

	@Autowired
	private BranchService branchService;

	public String doList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			Branch branch = branchService.selectByPrimaryKey("" + getLoginStaff().getBranchid());
			aaData.add(branch);
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doList exception", ex);
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
			logger.error("doAdd exception", ex);
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
			logger.error("doUpdate exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			branchService.deleteBranch(getLoginStaff().getOrg(), "" + branch.getBranchid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doDelete exception", ex);
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
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doValidate exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAddDevices() {
		try {
			branchService.addDevices(branch, deviceids);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doAddDevices exception", ex);
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

	public String[] getDeviceids() {
		return deviceids;
	}

	public void setDeviceids(String[] deviceids) {
		this.deviceids = deviceids;
	}
}
