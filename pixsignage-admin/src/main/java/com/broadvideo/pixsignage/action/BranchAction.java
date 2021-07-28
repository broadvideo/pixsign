package com.broadvideo.pixsignage.action;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.service.BranchService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

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
			String parentid = getParameter("parentid");
			List<Object> aaData = new ArrayList<Object>();
			List<Branch> branches = branchService.selectChild(parentid);
			for (int i = 0; i < branches.size(); i++) {
				aaData.add(branches.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doList exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public void doListNode() throws IOException {
		String id = getParameter("id");
		JSONArray branchArray = new JSONArray();
		if (id.equals("#")) {
			Branch branch = branchService.selectByPrimaryKey("" + getLoginStaff().getBranchid());
			JSONObject branchJson = new JSONObject();
			branchJson.put("id", branch.getBranchid());
			branchJson.put("parent", "#");
			if (branch.getMaxstorage() > 0) {
				branchJson.put("text", branch.getName() + "(" + branch.getMaxstorage() + "M)");
			} else {
				branchJson.put("text", branch.getName());
			}
			int full = 0;
			if (branch.getMaxstorage() > 0 && branch.getMaxstorage() < branch.getCurrentstorage()) {
				full = 1;
			}
			branchJson.put("full", full);
			branchJson.put("branch", branch);
			if (branch.getChildcount().intValue() == 0) {
				branchJson.put("children", false);
			} else {
				branchJson.put("children", true);
			}
			branchArray.add(branchJson);
		} else {
			List<Branch> branches = branchService.selectChild(id);
			for (Branch branch : branches) {
				JSONObject branchJson = new JSONObject();
				branchJson.put("id", branch.getBranchid());
				branchJson.put("parent", id);
				if (branch.getMaxstorage() > 0) {
					branchJson.put("text", branch.getName() + "(" + branch.getMaxstorage() + "M)");
				} else {
					branchJson.put("text", branch.getName());
				}
				int full = 0;
				if (branch.getMaxstorage() > 0 && branch.getMaxstorage() < branch.getCurrentstorage()) {
					full = 1;
				} else {
					Branch b1 = branchService.selectByPrimaryKey("" + branch.getParentid());
					if (b1 != null && b1.getMaxstorage() > 0 && b1.getMaxstorage() < b1.getCurrentstorage()) {
						full = 1;
					} else {
						Branch b2 = branchService.selectByPrimaryKey("" + branch.getParentid2());
						if (b2 != null && b2.getMaxstorage() > 0 && b2.getMaxstorage() < b2.getCurrentstorage()) {
							full = 1;
						} else {
							Branch b3 = branchService.selectByPrimaryKey("" + branch.getParentid3());
							if (b3 != null && b3.getMaxstorage() > 0 && b3.getMaxstorage() < b3.getCurrentstorage()) {
								full = 1;
							}
						}
					}
				}
				branchJson.put("full", full);
				branchJson.put("branch", branch);
				if (branch.getChildcount().intValue() == 0) {
					branchJson.put("children", false);
				} else {
					branchJson.put("children", true);
				}
				branchArray.add(branchJson);
			}
		}

		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("application/json;charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		out.println(branchArray.toString());
		out.flush();
		out.close();
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
