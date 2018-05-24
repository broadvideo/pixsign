package com.broadvideo.pixsignage.action.signage;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.domain.Cataitem;
import com.broadvideo.pixsignage.domain.Catalog;
import com.broadvideo.pixsignage.service.CatalogService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("catalogAction")
public class CatalogAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Catalog catalog;
	private Cataitem cataitem;
	private String[] detailids;

	@Autowired
	private CatalogService catalogService;

	public String doList() {
		try {
			String status = getParameter("status");
			List<Object> aaData = new ArrayList<Object>();
			List<Catalog> catalogList = catalogService.selectList("" + getLoginStaff().getOrgid(), status);
			for (int i = 0; i < catalogList.size(); i++) {
				aaData.add(catalogList.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("CatalogAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			catalogService.updateCatalog(catalog);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("CatalogAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAddItem() {
		try {
			catalogService.addCataitem(cataitem);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("CatalogAction doAddItem exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdateItem() {
		try {
			catalogService.updateCataitem(cataitem);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("CatalogAction doUpdateItem exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDeleteItem() {
		try {
			catalogService.deleteCataitem("" + cataitem.getCataitemid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("CatalogAction doDeleteItem exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAddDevices() {
		try {
			catalogService.addDevices(cataitem, detailids);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("CatalogAction doAddDevices exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Catalog getCatalog() {
		return catalog;
	}

	public void setCatalog(Catalog catalog) {
		this.catalog = catalog;
	}

	public Cataitem getCataitem() {
		return cataitem;
	}

	public void setCataitem(Cataitem cataitem) {
		this.cataitem = cataitem;
	}

	public String[] getDetailids() {
		return detailids;
	}

	public void setDetailids(String[] detailids) {
		this.detailids = detailids;
	}

}
