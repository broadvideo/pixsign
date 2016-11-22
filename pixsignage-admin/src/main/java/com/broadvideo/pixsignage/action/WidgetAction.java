package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Widget;
import com.broadvideo.pixsignage.service.WidgetService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("widgetAction")
public class WidgetAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Widget widget;

	@Autowired
	private WidgetService widgetService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			List<Object> aaData = new ArrayList<Object>();
			int count = widgetService.selectCount("" + getLoginStaff().getOrgid(), branchid);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Widget> widgetList = widgetService.selectList("" + getLoginStaff().getOrgid(), branchid, start,
					length);
			for (int i = 0; i < widgetList.size(); i++) {
				aaData.add(widgetList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("WidgetAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			widget.setOrgid(getLoginStaff().getOrgid());
			widget.setBranchid(getLoginStaff().getBranchid());
			widget.setCreatestaffid(getLoginStaff().getStaffid());
			widgetService.addWidget(widget);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("WidgetAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			widgetService.updateWidget(widget);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("WidgetAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			widgetService.deleteWidget("" + widget.getWidgetid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("WidgetAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Widget getWidget() {
		return widget;
	}

	public void setWidget(Widget widget) {
		this.widget = widget;
	}

}
