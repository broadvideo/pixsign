package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Tpllayout;
import com.broadvideo.signage.service.TpllayoutService;

@Scope("request")
@Controller("tpllayoutAction")
public class TpllayoutAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8023500547905441044L;

	private static final Logger log = Logger.getLogger(TpllayoutAction.class);

	private Tpllayout tpllayout;
	private String[] ids;

	@Autowired
	private TpllayoutService tpllayoutService;
	
	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			
			String type = getParameter("type");
			
			List<Object> aaData = new ArrayList<Object>();
			List<Tpllayout> tpllayoutList = tpllayoutService.selectList(type);
			for (int i = 0; i < tpllayoutList.size(); i++) {
				aaData.add(tpllayoutList.get(i));
			}
			this.setAaData(aaData);
			this.setiTotalRecords(tpllayoutList.size());
			this.setiTotalDisplayRecords(tpllayoutList.size());

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
			tpllayoutService.addTpllayout(tpllayout);
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
			tpllayoutService.updateTpllayout(tpllayout);
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
			tpllayoutService.updateTpllayoutWithRegion(tpllayout);
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
				tpllayoutService.deleteTpllayout(ids);
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
			int tpllayoutid = tpllayout.getTpllayoutid();
			tpllayout = tpllayoutService.selectByPrimaryKey("" + tpllayoutid);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Tpllayout getTpllayout() {
		return tpllayout;
	}

	public void setTpllayout(Tpllayout tpllayout) {
		this.tpllayout = tpllayout;
	}

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}
}
