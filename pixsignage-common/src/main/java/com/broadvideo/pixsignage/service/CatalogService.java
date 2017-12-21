package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Cataitem;
import com.broadvideo.pixsignage.domain.Catalog;

public interface CatalogService {
	public List<Catalog> selectList(String orgid, String status);

	public void updateCatalog(Catalog catalog);

	public void addCataitem(Cataitem cataitem);

	public void updateCataitem(Cataitem cataitem);

	public void deleteCataitem(String cataitemid);

	public void addDevices(Cataitem cataitem, String[] deviceids);
}
