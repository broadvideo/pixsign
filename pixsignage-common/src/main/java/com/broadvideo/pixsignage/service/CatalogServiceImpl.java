package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Cataitem;
import com.broadvideo.pixsignage.domain.Catalog;
import com.broadvideo.pixsignage.persistence.CataitemMapper;
import com.broadvideo.pixsignage.persistence.CatalogMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;

@Service("catalogService")
public class CatalogServiceImpl implements CatalogService {

	@Autowired
	private CatalogMapper catalogMapper;
	@Autowired
	private CataitemMapper cataitemMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	public List<Catalog> selectList(String orgid, String status) {
		return catalogMapper.selectList(orgid, status);
	}

	@Transactional
	public void updateCatalog(Catalog catalog) {
		catalogMapper.updateByPrimaryKeySelective(catalog);
	}

	@Transactional
	public void addCataitem(Cataitem cataitem) {
		cataitemMapper.insertSelective(cataitem);
	}

	@Transactional
	public void updateCataitem(Cataitem cataitem) {
		cataitemMapper.updateByPrimaryKeySelective(cataitem);
	}

	@Transactional
	public void deleteCataitem(String cataitemid) {
		cataitemMapper.deleteByPrimaryKey(cataitemid);
	}

	@Transactional
	public void addDevices(Cataitem cataitem, String[] deviceids) {
		Catalog catalog = catalogMapper.selectByPrimaryKey("" + cataitem.getCatalogid());
		for (int i = 0; i < deviceids.length; i++) {
			if (catalog.getType().equals("1")) {
				deviceMapper.updateCataitemid1(deviceids[i], "" + cataitem.getCataitemid());
			} else if (catalog.getType().equals("2")) {
				deviceMapper.updateCataitemid2(deviceids[i], "" + cataitem.getCataitemid());
			}
		}
	}

}
