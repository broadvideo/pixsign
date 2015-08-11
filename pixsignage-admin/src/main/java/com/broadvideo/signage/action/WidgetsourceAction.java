package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Widgetsource;
import com.broadvideo.signage.service.WidgetsourceService;

@Scope("request")
@Controller("widgetsourceAction")
public class WidgetsourceAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1557389966669967260L;

	private static final Logger log = Logger.getLogger(WidgetsourceAction.class);

	private Widgetsource widgetsource;
	private String[] ids;
	
	@Autowired
	private WidgetsourceService widgetsourceService;
	
	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			List<Object> aaData = new ArrayList<Object>();
			int count = widgetsourceService.selectCount(""+getLoginStaff().getOrgid());
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Widgetsource> widgetsourceList = widgetsourceService.selectList(""+getLoginStaff().getOrgid(), start, length);
			for (int i = 0; i < widgetsourceList.size(); i++) {
				aaData.add(widgetsourceList.get(i));
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
			widgetsource.setOrgid(getLoginStaff().getOrgid());
			widgetsource.setCreatestaffid(getLoginStaff().getStaffid());
			widgetsourceService.addWidgetsource(widgetsource);
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
			widgetsourceService.updateWidgetsource(widgetsource);
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
				widgetsourceService.deleteWidgetsource(ids);
			}
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Widgetsource getWidgetsource() {
		return widgetsource;
	}

	public void setWidgetsource(Widgetsource widgetsource) {
		this.widgetsource = widgetsource;
	}

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}

}
