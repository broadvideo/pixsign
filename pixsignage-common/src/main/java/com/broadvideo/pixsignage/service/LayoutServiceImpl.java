package com.broadvideo.pixsignage.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Bundledtl;
import com.broadvideo.pixsignage.domain.Layout;
import com.broadvideo.pixsignage.domain.Layoutdtl;
import com.broadvideo.pixsignage.domain.Medialist;
import com.broadvideo.pixsignage.domain.Region;
import com.broadvideo.pixsignage.domain.Text;
import com.broadvideo.pixsignage.persistence.BundleMapper;
import com.broadvideo.pixsignage.persistence.BundledtlMapper;
import com.broadvideo.pixsignage.persistence.LayoutMapper;
import com.broadvideo.pixsignage.persistence.LayoutdtlMapper;
import com.broadvideo.pixsignage.persistence.MedialistMapper;
import com.broadvideo.pixsignage.persistence.TextMapper;

@Service("layoutService")
public class LayoutServiceImpl implements LayoutService {

	@Autowired
	private LayoutMapper layoutMapper;
	@Autowired
	private LayoutdtlMapper layoutdtlMapper;
	@Autowired
	private BundleMapper bundleMapper;
	@Autowired
	private BundledtlMapper bundledtlMapper;
	@Autowired
	private MedialistMapper medialistMapper;
	@Autowired
	private TextMapper textMapper;

	public Layout selectByPrimaryKey(String layoutid) {
		return layoutMapper.selectByPrimaryKey(layoutid);
	}

	public List<Layout> selectList(String orgid, String branchid) {
		return layoutMapper.selectList(orgid, branchid);
	}

	public List<Layout> selectPublicList(String orgid, String branchid) {
		return layoutMapper.selectPublicList(orgid, branchid);
	}

	public List<Layoutdtl> selectLayoutdtlList(String layoutid) {
		return layoutdtlMapper.selectList(layoutid);
	}

	@Transactional
	public void addLayout(Layout layout) {
		if (layout.getRatio().equals("1")) {
			// 16:9
			layout.setWidth(1920);
			layout.setHeight(1080);
		} else if (layout.getRatio().equals("2")) {
			// 9:16
			layout.setWidth(1080);
			layout.setHeight(1920);
		} else if (layout.getRatio().equals("3")) {
			// 4:3
			layout.setWidth(800);
			layout.setHeight(600);
		} else if (layout.getRatio().equals("4")) {
			// 3:4
			layout.setWidth(600);
			layout.setHeight(800);
		} else if (layout.getRatio().equals("5")) {
			// 32:9
			layout.setWidth(1920);
			layout.setHeight(540);
		}
		layoutMapper.insertSelective(layout);

		Layoutdtl layoutdtl = new Layoutdtl();
		layoutdtl.setLayoutid(layout.getLayoutid());
		layoutdtl.setType(Layoutdtl.Type_PLAY);
		layoutdtl.setMainflag("1");
		layoutdtl.setWidth(layout.getWidth());
		layoutdtl.setHeight(layout.getHeight());
		layoutdtl.setTopoffset(0);
		layoutdtl.setLeftoffset(0);
		layoutdtl.setBgcolor("#000000");
		if (layoutdtl.getBgimageid() != null && layoutdtl.getBgimageid() > 0) {
			layoutdtl.setOpacity(0);
		} else {
			layoutdtl.setOpacity(255);
		}
		layoutdtl.setZindex(0);
		layoutdtl.setSleeptime(0);
		layoutdtl.setIntervaltime(10);
		layoutdtl.setDirection("4");
		layoutdtl.setSpeed("2");
		layoutdtl.setColor("#FFFFFF");
		layoutdtl.setSize(50);
		layoutdtlMapper.insertSelective(layoutdtl);
	}

	@Transactional
	public void updateLayout(Layout layout) {
		layoutMapper.updateByPrimaryKeySelective(layout);
	}

	@Transactional
	public void deleteLayout(String layoutid) {
		layoutMapper.deleteByPrimaryKey(layoutid);
	}

	@Transactional
	public void addLayoutdtl(Layoutdtl layoutdtl) {
		if (layoutdtl.getType().equals(Layoutdtl.Type_STREAM)) {
			layoutdtl.setIntervaltime(30);
		}
		layoutdtlMapper.insertSelective(layoutdtl);
		List<Bundledtl> bundledtls = new ArrayList<Bundledtl>();
		List<Bundle> bundles = bundleMapper.selectByLayout("" + layoutdtl.getLayoutid());
		for (Bundle bundle : bundles) {
			Bundledtl bundledtl = new Bundledtl();
			bundledtl.setBundleid(bundle.getBundleid());
			if (bundle.getHomeflag().equals("0")) {
				bundledtl.setHomebundleid(bundle.getHomebundleid());
			} else {
				bundledtl.setHomebundleid(bundle.getBundleid());
			}
			bundledtl.setLayoutdtlid(layoutdtl.getLayoutdtlid());
			bundledtl.setType(Bundledtl.Type_Private);
			if (layoutdtl.getType().equals(Region.Type_PLAY)) {
				Medialist medialist = new Medialist();
				medialist.setOrgid(bundle.getOrgid());
				medialist.setBranchid(bundle.getBranchid());
				medialist.setName(bundle.getName() + "-" + layoutdtl.getLayoutdtlid());
				medialist.setType(Medialist.Type_Private);
				medialist.setCreatestaffid(bundle.getCreatestaffid());
				medialistMapper.insertSelective(medialist);
				bundledtl.setObjtype(Bundledtl.ObjType_Medialist);
				bundledtl.setObjid(medialist.getMedialistid());
			} else if (layoutdtl.getType().equals(Region.Type_TEXT)) {
				Text text = new Text();
				text.setOrgid(bundle.getOrgid());
				text.setBranchid(bundle.getBranchid());
				text.setName(bundle.getName() + "-" + layoutdtl.getLayoutdtlid());
				text.setType(Medialist.Type_Private);
				text.setCreatestaffid(bundle.getCreatestaffid());
				textMapper.insertSelective(text);
				bundledtl.setObjtype(Bundledtl.ObjType_Text);
				bundledtl.setObjid(text.getTextid());
			} else {
				bundledtl.setObjtype(Bundledtl.ObjType_NONE);
				bundledtl.setObjid(0);
			}
			bundledtls.add(bundledtl);
		}
		if (bundledtls.size() > 0) {
			bundledtlMapper.insertList(bundledtls);
		}
	}

	@Transactional
	public void deleteLayoutdtl(String layoutdtlid) {
		bundledtlMapper.deleteByLayoutdtl(layoutdtlid);
		layoutdtlMapper.deleteByPrimaryKey(layoutdtlid);
	}

	@Transactional
	public void design(Layout layout) {
		layoutMapper.updateByPrimaryKeySelective(layout);

		int layoutid = layout.getLayoutid();
		List<Layoutdtl> oldlayoutdtls = layoutdtlMapper.selectList("" + layoutid);
		HashMap<Integer, Layoutdtl> hash = new HashMap<Integer, Layoutdtl>();
		for (Layoutdtl layoutdtl : layout.getLayoutdtls()) {
			if (layoutdtl.getLayoutdtlid() > 0) {
				layoutdtlMapper.updateByPrimaryKeySelective(layoutdtl);
				hash.put(layoutdtl.getLayoutdtlid(), layoutdtl);
			}
		}
		for (int i = 0; i < oldlayoutdtls.size(); i++) {
			if (hash.get(oldlayoutdtls.get(i).getLayoutdtlid()) == null) {
				deleteLayoutdtl("" + oldlayoutdtls.get(i).getLayoutdtlid());
			}
		}
		for (Layoutdtl layoutdtl : layout.getLayoutdtls()) {
			if (layoutdtl.getLayoutdtlid() <= 0) {
				layoutdtl.setLayoutid(layoutid);
				addLayoutdtl(layoutdtl);
			}
		}
	}

}
