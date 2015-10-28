package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Selfapply;
import com.broadvideo.pixsignage.service.SelfapplyService;

@Scope("request")
@Controller("selfapplyAction")
public class SelfapplyAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3050806437483601133L;

	private static final Logger log = Logger.getLogger(SelfapplyAction.class);

	private Selfapply selfapply;
	private int result;

	@Autowired
	private SelfapplyService selfapplyService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String status = getParameter("status");
			String search = getParameter("sSearch");

			int count = selfapplyService.selectCount(status, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Selfapply> selfapplyList = selfapplyService.selectList(status, search, start, length);
			for (int i = 0; i < selfapplyList.size(); i++) {
				aaData.add(selfapplyList.get(i));
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

	public String doApply() {
		try {
			selfapplyService.addSelfapply(selfapply);
			result = 0;
		} catch (Exception ex) {
			ex.printStackTrace();
			result = 2;
		}
		return SUCCESS;
	}

	public Selfapply getSelfapply() {
		return selfapply;
	}

	public void setSelfapply(Selfapply selfapply) {
		this.selfapply = selfapply;
	}

	public int getResult() {
		return result;
	}

	public void setResult(int result) {
		this.result = result;
	}

}
