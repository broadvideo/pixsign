package com.broadvideo.pixsignage.action.signage;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.domain.Gridlayout;
import com.broadvideo.pixsignage.persistence.GridlayoutMapper;

@SuppressWarnings("serial")
@Scope("request")
@Controller("gridlayoutAction")
public class GridlayoutAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Gridlayout gridlayout;

	@Autowired
	private GridlayoutMapper gridlayoutMapper;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));

			List<Object> aaData = new ArrayList<Object>();
			List<Gridlayout> gridlayoutList = gridlayoutMapper.selectList();
			for (int i = 0; i < gridlayoutList.size(); i++) {
				aaData.add(gridlayoutList.get(i));
			}
			this.setAaData(aaData);
			this.setiTotalRecords(gridlayoutList.size());
			this.setiTotalDisplayRecords(gridlayoutList.size());

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("GridlayoutAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Gridlayout getGridlayout() {
		return gridlayout;
	}

	public void setGridlayout(Gridlayout gridlayout) {
		this.gridlayout = gridlayout;
	}
}
