package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.service.OrgService;

@Scope("request")
@Controller("orgAction")
public class OrgAction extends BaseDatatableAction {
	@SuppressWarnings("unused")
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Org org;

	@Autowired
	private OrgService orgService;

	public String doList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			List<Org> orgList;
			if (getLoginStaff().getVspid() == null) {
				orgList = orgService.selectList(null, "" + getLoginStaff().getOrgid());
			} else {
				orgList = orgService.selectList("" + getLoginStaff().getVspid(), null);
			}
			for (int i = 0; i < orgList.size(); i++) {
				aaData.add(orgList.get(i));
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
			orgService.deleteOrg("" + org.getOrgid());
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
			org = orgService.selectByPrimaryKey("" + getLoginStaff().getOrgid());
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
}
