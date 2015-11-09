package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Layoutschedule;
import com.broadvideo.pixsignage.service.LayoutscheduleService;

@Scope("request")
@Controller("layoutscheduleAction")
public class LayoutscheduleAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3643347555369768049L;

	private static final Logger log = Logger.getLogger(LayoutscheduleAction.class);

	private Layoutschedule layoutschedule;

	@Autowired
	private LayoutscheduleService layoutscheduleService;

	public String doList() {
		try {
			String bindtype = getParameter("bindtype");
			String bindid = getParameter("bindid");
			List<Object> aaData = new ArrayList<Object>();
			List<Layoutschedule> layoutscheduleList = layoutscheduleService.selectList(bindtype, bindid);
			for (int i = 0; i < layoutscheduleList.size(); i++) {
				aaData.add(layoutscheduleList.get(i));
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
			layoutscheduleService.addLayoutschedule(layoutschedule);
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
			layoutscheduleService.updateLayoutschedule(layoutschedule);
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
			layoutscheduleService.deleteLayoutschedule("" + layoutschedule.getLayoutscheduleid());
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Layoutschedule getLayoutschedule() {
		return layoutschedule;
	}

	public void setLayoutschedule(Layoutschedule layoutschedule) {
		this.layoutschedule = layoutschedule;
	}

}
