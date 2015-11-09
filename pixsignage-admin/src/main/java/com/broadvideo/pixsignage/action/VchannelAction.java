package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Vchannel;
import com.broadvideo.pixsignage.service.VchannelService;

@Scope("request")
@Controller("vchannelAction")
public class VchannelAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5803307895903946107L;

	private static final Logger log = Logger.getLogger(VchannelAction.class);

	private Vchannel vchannel;

	@Autowired
	private VchannelService vchannelService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");

			int count = vchannelService.selectCount("" + getLoginStaff().getOrgid(), search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Vchannel> vchannelList = vchannelService.selectList("" + getLoginStaff().getOrgid(), search, start,
					length);
			for (int i = 0; i < vchannelList.size(); i++) {
				aaData.add(vchannelList.get(i));
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
			vchannel.setOrgid(getLoginStaff().getOrgid());
			vchannelService.addVchannel(vchannel);
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
			vchannelService.updateVchannel(vchannel);
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
			vchannelService.deleteVchannel("" + vchannel.getVchannelid());
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Vchannel getVchannel() {
		return vchannel;
	}

	public void setVchannel(Vchannel vchannel) {
		this.vchannel = vchannel;
	}

}
