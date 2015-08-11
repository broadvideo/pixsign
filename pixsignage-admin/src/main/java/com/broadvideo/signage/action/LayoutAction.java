package com.broadvideo.signage.action;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Layout;
import com.broadvideo.signage.domain.Task;
import com.broadvideo.signage.service.LayoutService;

@Scope("request")
@Controller("layoutAction")
public class LayoutAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -344695895112891544L;

	private static final Logger log = Logger.getLogger(LayoutAction.class);

	private Layout layout;
	private int tpllayoutid;
	private String[] ids;
	private Task task;

	private int layoutid;
	private String xlfname;
	private InputStream inputStream;

	@Autowired
	private LayoutService layoutService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = null;
			if (getParameter("sSearch") != null) {
				search = new String(getParameter("sSearch").trim().getBytes("ISO-8859-1"), "utf-8");
			}

			int count = layoutService.selectCount(getLoginStaff().getOrgid(), getLoginStaff().getBranchid(), search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Layout> layoutList = layoutService.selectList(getLoginStaff().getOrgid(), getLoginStaff()
					.getBranchid(), search, start, length);
			for (int i = 0; i < layoutList.size(); i++) {
				aaData.add(layoutList.get(i));
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
			layout.setOrgid(getLoginStaff().getOrgid());
			layout.setBranchid(getLoginStaff().getBranchid());
			layout.setCreatestaffid(getLoginStaff().getStaffid());

			layoutService.addLayout(layout, tpllayoutid);
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
			layoutService.updateLayout(layout);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdateWithRegion() {
		try {
			layoutService.updateLayoutWithRegion(layout);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doWizard() {
		try {
			if (layout.getOrgid() == null || layout.getOrgid() == 0) {
				layout.setOrgid(getLoginStaff().getOrgid());
			}
			if (layout.getBranchid() == null || layout.getBranchid() == 0) {
				layout.setBranchid(getLoginStaff().getBranchid());
			}
			if (layout.getCreatestaffid() == null || layout.getCreatestaffid() == 0) {
				layout.setCreatestaffid(getLoginStaff().getStaffid());
			}
			task.setOrgid(getLoginStaff().getOrgid());
			task.setBranchid(getLoginStaff().getBranchid());
			task.setCreatestaffid(getLoginStaff().getStaffid());

			layoutService.handleWizard(layout, task);
			setDataid("" + task.getTaskid());
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
				layoutService.deleteLayout(ids);
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
			int layoutid = layout.getLayoutid();
			layout = layoutService.selectByPrimaryKey("" + layoutid);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDownload() {
		try {
			Layout layout = layoutService.selectWithXmlByPrimaryKey("" + layoutid);
			StringBuffer sb = new StringBuffer(layout.getXml());
			inputStream = new ByteArrayInputStream(sb.toString().getBytes("UTF-8"));
			xlfname = "" + layout.getLayoutid() + ".xlf";

			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Layout getLayout() {
		return layout;
	}

	public void setLayout(Layout layout) {
		this.layout = layout;
	}

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}

	public Task getTask() {
		return task;
	}

	public void setTask(Task task) {
		this.task = task;
	}

	public int getTpllayoutid() {
		return tpllayoutid;
	}

	public void setTpllayoutid(int tpllayoutid) {
		this.tpllayoutid = tpllayoutid;
	}

	public int getLayoutid() {
		return layoutid;
	}

	public void setLayoutid(int layoutid) {
		this.layoutid = layoutid;
	}

	public InputStream getInputStream() {
		return inputStream;
	}

	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}

	public String getXlfname() {
		return xlfname;
	}

	public void setXlfname(String xlfname) {
		this.xlfname = xlfname;
	}

}
