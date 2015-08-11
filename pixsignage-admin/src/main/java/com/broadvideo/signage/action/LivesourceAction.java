package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Livesource;
import com.broadvideo.signage.service.LivesourceService;

@Scope("request")
@Controller("livesourceAction")
public class LivesourceAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4304469915361193060L;

	private static final Logger log = Logger.getLogger(LivesourceAction.class);

	private Livesource livesource;
	private String[] ids;
	
	@Autowired
	private LivesourceService livesourceService;
	
	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			List<Object> aaData = new ArrayList<Object>();
			int count = livesourceService.selectCount(""+getLoginStaff().getOrgid());
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Livesource> livesourceList = livesourceService.selectList(""+getLoginStaff().getOrgid(), start, length);
			for (int i = 0; i < livesourceList.size(); i++) {
				aaData.add(livesourceList.get(i));
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
			livesource.setOrgid(getLoginStaff().getOrgid());
			livesource.setCreatestaffid(getLoginStaff().getStaffid());
			livesourceService.addLivesource(livesource);
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
			livesourceService.updateLivesource(livesource);
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
				livesourceService.deleteLivesource(ids);
			}
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Livesource getLivesource() {
		return livesource;
	}

	public void setLivesource(Livesource livesource) {
		this.livesource = livesource;
	}

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}

}
