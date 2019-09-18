package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Routeguidedtl;
import com.broadvideo.pixsignage.service.RouteguidedtlService;

@Scope("request")
@Controller("routeguidedtlAction")
public class RouteguidedtlAction extends BaseDatatableAction {
	@SuppressWarnings("unused")
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Routeguidedtl routeguidedtl;

	@Autowired
	private RouteguidedtlService routeguidedtlService;

	public String doList() {
		try {
			String routeguideid = getParameter("routeguideid");
			List<Object> aaData = new ArrayList<Object>();
			List<Routeguidedtl> routeguidedtldtlList = routeguidedtlService.selectList(routeguideid);
			for (int i = 0; i < routeguidedtldtlList.size(); i++) {
				aaData.add(routeguidedtldtlList.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RouteguidedtlAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			routeguidedtlService.addRouteguidedtl(routeguidedtl);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RouteguidedtlAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			routeguidedtlService.updateRouteguidedtl(routeguidedtl);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RouteguidedtlAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			routeguidedtlService.deleteRouteguidedtl("" + routeguidedtl.getRouteguidedtlid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("RouteguidedtlAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Routeguidedtl getRouteguidedtl() {
		return routeguidedtl;
	}

	public void setRouteguidedtl(Routeguidedtl routeguidedtl) {
		this.routeguidedtl = routeguidedtl;
	}

}
