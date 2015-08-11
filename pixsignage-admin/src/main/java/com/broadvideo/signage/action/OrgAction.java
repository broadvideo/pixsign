package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Org;
import com.broadvideo.signage.service.OrgService;

@Scope("request")
@Controller("orgAction")
public class OrgAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8144326256812580850L;

	private static final Logger log = Logger.getLogger(OrgAction.class);

	private Org org;
	private String[] ids;

	@Autowired
	private OrgService orgService;

	public String doList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			List<Org> orgList = orgService.selectList();
			for (int i = 0; i < orgList.size(); i++) {
				if (getLoginStaff().getSubsystem().equals("1")) {
					aaData.add(orgList.get(i));
				} else if (getLoginStaff().getSubsystem().equals("2")
						&& getLoginStaff().getOrgid() == orgList.get(i).getOrgid()) {
					aaData.add(orgList.get(i));
				}
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
			org.setCreatestaffid(getLoginStaff().getStaffid());
			org.setVspid(getLoginStaff().getVspid());
			org.setCurrentdevices(0);
			org.setCurrentstorage((long) 0);
			orgService.addOrg(org);
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
			orgService.updateOrg(org);
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
			if (ids != null) {
				orgService.deleteOrg(ids);
			}
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
			if (org.getName() != null) {
				if (orgService.validateName(org)) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					setErrormsg("名称已存在");
					return ERROR;
				}
			}
			if (org.getCode() != null) {
				if (orgService.validateCode(org)) {
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

	public String doGet() {
		try {
			org = orgService.selectByPrimaryKey(getLoginStaff().getOrgid());
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Org getOrg() {
		return org;
	}

	public void setOrg(Org org) {
		this.org = org;
	}

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}

}
