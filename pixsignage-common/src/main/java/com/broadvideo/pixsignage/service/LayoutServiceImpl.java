package com.broadvideo.pixsignage.service;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Layout;
import com.broadvideo.pixsignage.domain.Layoutdtl;
import com.broadvideo.pixsignage.domain.Layoutschedule;
import com.broadvideo.pixsignage.domain.Region;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.domain.Task;
import com.broadvideo.pixsignage.persistence.DevicefileMapper;
import com.broadvideo.pixsignage.persistence.LayoutMapper;
import com.broadvideo.pixsignage.persistence.LayoutdtlMapper;
import com.broadvideo.pixsignage.persistence.LayoutscheduleMapper;
import com.broadvideo.pixsignage.persistence.RegionscheduleMapper;
import com.broadvideo.pixsignage.persistence.TaskMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

@Service("layoutService")
public class LayoutServiceImpl implements LayoutService {

	@Autowired
	private LayoutMapper layoutMapper;
	@Autowired
	private LayoutdtlMapper layoutdtlMapper;
	@Autowired
	private TaskMapper taskMapper;
	@Autowired
	private LayoutscheduleMapper layoutscheduleMapper;
	@Autowired
	private RegionscheduleMapper regionscheduleMapper;
	@Autowired
	private DevicefileMapper devicefileMapper;
	@Autowired
	protected ResourceBundleMessageSource messageSource;
	@Autowired
	private BundleService bundleService;

	public Layout selectByPrimaryKey(String layoutid) {
		return layoutMapper.selectByPrimaryKey(layoutid);
	}

	public List<Layout> selectList(String orgid, String type) {
		List<Layout> layoutList = layoutMapper.selectList(orgid, type);
		for (Layout layout : layoutList) {
			for (Layoutdtl layoutdtl : layout.getLayoutdtls()) {
				Region region = layoutdtl.getRegion();
				if (region != null) {
					region.translate(messageSource);
				}
			}
		}
		return layoutList;
	}

	public List<Layoutdtl> selectLayoutdtlList(String layoutid) {
		List<Layoutdtl> layoutdtlList = layoutdtlMapper.selectList(layoutid);
		for (Layoutdtl layoutdtl : layoutdtlList) {
			Region region = layoutdtl.getRegion();
			if (region != null) {
				region.translate(messageSource);
			}
		}
		return layoutdtlList;
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
		}
		layoutMapper.insertSelective(layout);

		Layoutdtl layoutdtl = new Layoutdtl();
		layoutdtl.setLayoutid(layout.getLayoutid());
		layoutdtl.setRegionid(1);
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
	public void design(Layout layout) {
		layoutMapper.updateByPrimaryKeySelective(layout);

		int layoutid = layout.getLayoutid();
		List<Layoutdtl> oldlayoutdtls = layoutdtlMapper.selectList("" + layoutid);
		HashMap<Integer, Layoutdtl> hash = new HashMap<Integer, Layoutdtl>();
		for (Layoutdtl layoutdtl : layout.getLayoutdtls()) {
			if (layoutdtl.getLayoutdtlid() == 0) {
				layoutdtl.setLayoutid(layoutid);
				layoutdtlMapper.insertSelective(layoutdtl);
			} else {
				layoutdtlMapper.updateByPrimaryKeySelective(layoutdtl);
				hash.put(layoutdtl.getLayoutdtlid(), layoutdtl);
			}
		}
		for (int i = 0; i < oldlayoutdtls.size(); i++) {
			if (hash.get(oldlayoutdtls.get(i).getLayoutdtlid()) == null) {
				layoutdtlMapper.deleteByPrimaryKey("" + oldlayoutdtls.get(i).getLayoutdtlid());
			}
		}
	}

	@Transactional
	public String handleWizard(Staff staff, Layout layout, Device[] devices, Devicegroup[] devicegroups)
			throws Exception {
		Task task = new Task();
		task.setOrgid(staff.getOrgid());
		task.setBranchid(staff.getBranchid());
		task.setCreatestaffid(staff.getStaffid());
		task.setName(staff.getName() + "-" + layout.getName() + "-"
				+ new SimpleDateFormat("yyyyMMdd").format(System.currentTimeMillis()) + "-"
				+ new SimpleDateFormat("HHmm").format(System.currentTimeMillis()));
		taskMapper.insertSelective(task);

		List<Layoutdtl> layoutdtls = layout.getLayoutdtls();

		for (int i = 0; i < devices.length; i++) {
			Device device = devices[i];
			layoutscheduleMapper.deleteByDtl("1", "" + device.getDeviceid(), null, null, null);
			Layoutschedule layoutschedule = new Layoutschedule();
			layoutschedule.setBindtype("1");
			layoutschedule.setBindid(device.getDeviceid());
			layoutschedule.setLayoutid(layout.getLayoutid());
			layoutschedule.setPlaymode("2");
			layoutschedule.setStarttime(CommonUtil.parseDate("00:00:00", CommonConstants.DateFormat_Time));
			layoutscheduleMapper.insertSelective(layoutschedule);

			regionscheduleMapper.deleteByDtl("1", "" + device.getDeviceid(), null, null, null, null);
			for (Layoutdtl layoutdtl : layoutdtls) {
				List<HashMap<String, String>> regiondtls = layoutdtl.getRegiondtls();
				for (HashMap<String, String> regiondtl : regiondtls) {
					Regionschedule regionschedule = new Regionschedule();
					regionschedule.setBindtype("1");
					regionschedule.setBindid(device.getDeviceid());
					regionschedule.setRegionid(layoutdtl.getRegionid());
					regionschedule.setPlaymode(regiondtl.get("playmode"));
					if (regiondtl.get("playdate") != null) {
						regionschedule.setPlaydate(
								CommonUtil.parseDate(regiondtl.get("playdate"), CommonConstants.DateFormat_Date));
					}
					if (regiondtl.get("starttime") != null) {
						regionschedule.setStarttime(
								CommonUtil.parseDate(regiondtl.get("starttime"), CommonConstants.DateFormat_Time));
					}
					if (regiondtl.get("endtime") != null) {
						regionschedule.setEndtime(
								CommonUtil.parseDate(regiondtl.get("endtime"), CommonConstants.DateFormat_Time));
					}
					regionschedule.setObjtype(regiondtl.get("objtype"));
					regionschedule.setObjid(Integer.parseInt(regiondtl.get("objid")));
					regionschedule.setTaskid(task.getTaskid());
					regionscheduleMapper.insertSelective(regionschedule);
				}
			}

			devicefileMapper.deleteDeviceVideoFiles("" + device.getDeviceid());
			devicefileMapper.deleteDeviceImageFiles("" + device.getDeviceid());
			devicefileMapper.insertDeviceVideoFiles("" + device.getDeviceid());
			devicefileMapper.insertDeviceImageFiles("" + device.getDeviceid());

			bundleService.syncBundleLayout("1", "" + device.getDeviceid());
			bundleService.syncBundleRegions("1", "" + device.getDeviceid());
		}

		for (int i = 0; i < devicegroups.length; i++) {
			Devicegroup devicegroup = devicegroups[i];
			layoutscheduleMapper.deleteByDtl("2", "" + devicegroup.getDevicegroupid(), null, null, null);
			Layoutschedule layoutschedule = new Layoutschedule();
			layoutschedule.setBindtype("2");
			layoutschedule.setBindid(devicegroup.getDevicegroupid());
			layoutschedule.setLayoutid(layout.getLayoutid());
			layoutschedule.setPlaymode("2");
			layoutschedule.setStarttime(CommonUtil.parseDate("00:00:00", CommonConstants.DateFormat_Time));
			layoutscheduleMapper.insertSelective(layoutschedule);

			regionscheduleMapper.deleteByDtl("2", "" + devicegroup.getDevicegroupid(), null, null, null, null);
			for (Layoutdtl layoutdtl : layoutdtls) {
				List<HashMap<String, String>> regiondtls = layoutdtl.getRegiondtls();
				for (HashMap<String, String> regiondtl : regiondtls) {
					Regionschedule regionschedule = new Regionschedule();
					regionschedule.setBindtype("2");
					regionschedule.setBindid(devicegroup.getDevicegroupid());
					regionschedule.setRegionid(layoutdtl.getRegionid());
					regionschedule.setPlaymode(regiondtl.get("playmode"));
					if (regiondtl.get("playdate") != null) {
						regionschedule.setPlaydate(
								CommonUtil.parseDate(regiondtl.get("playdate"), CommonConstants.DateFormat_Date));
					}
					if (regiondtl.get("starttime") != null) {
						regionschedule.setStarttime(
								CommonUtil.parseDate(regiondtl.get("starttime"), CommonConstants.DateFormat_Time));
					}
					if (regiondtl.get("endtime") != null) {
						regionschedule.setEndtime(
								CommonUtil.parseDate(regiondtl.get("endtime"), CommonConstants.DateFormat_Time));
					}
					regionschedule.setObjtype(regiondtl.get("objtype"));
					regionschedule.setObjid(Integer.parseInt(regiondtl.get("objid")));
					regionschedule.setTaskid(task.getTaskid());
					regionscheduleMapper.insertSelective(regionschedule);
				}
			}

			devicefileMapper.deleteDevicegroupVideoFiles("" + devicegroup.getDevicegroupid());
			devicefileMapper.deleteDevicegroupImageFiles("" + devicegroup.getDevicegroupid());
			devicefileMapper.insertDevicegroupVideoFiles("" + devicegroup.getDevicegroupid());
			devicefileMapper.insertDevicegroupImageFiles("" + devicegroup.getDevicegroupid());

			bundleService.syncBundleLayout("2", "" + devicegroup.getDevicegroupid());
			bundleService.syncBundleRegions("2", "" + devicegroup.getDevicegroupid());
		}

		return "" + task.getTaskid();
	}

	@Transactional
	public void addLayoutschedules(Layoutschedule[] layoutschedules, Device[] devices) {
		for (int i = 0; i < devices.length; i++) {
			layoutscheduleMapper.deleteByDtl("1", "" + devices[i].getDeviceid(), null, null, null);
		}
		for (int i = 0; i < layoutschedules.length; i++) {
			layoutscheduleMapper.insertSelective(layoutschedules[i]);
		}
	}

	@Transactional
	public void addLayoutschedules(Layoutschedule[] layoutschedules, Devicegroup[] devicegroups) {
		for (int i = 0; i < devicegroups.length; i++) {
			layoutscheduleMapper.deleteByDtl("2", "" + devicegroups[i].getDevicegroupid(), null, null, null);
		}
		for (int i = 0; i < layoutschedules.length; i++) {
			layoutscheduleMapper.insertSelective(layoutschedules[i]);
		}
	}

	@Transactional
	public void addRegionschedules(Regionschedule[] regionschedules, Device[] devices) {
		for (int i = 0; i < devices.length; i++) {
			regionscheduleMapper.deleteByDtl("1", "" + devices[i].getDeviceid(), null, null, null, null);
		}
		for (int i = 0; i < regionschedules.length; i++) {
			regionscheduleMapper.insertSelective(regionschedules[i]);
			devicefileMapper.deleteDeviceVideoFiles("" + regionschedules[i].getBindid());
			devicefileMapper.deleteDeviceImageFiles("" + regionschedules[i].getBindid());
			devicefileMapper.insertDeviceVideoFiles("" + regionschedules[i].getBindid());
			devicefileMapper.insertDeviceImageFiles("" + regionschedules[i].getBindid());
		}
	}

	@Transactional
	public void addRegionschedules(Regionschedule[] regionschedules, Devicegroup[] devicegroups) {
		for (int i = 0; i < devicegroups.length; i++) {
			regionscheduleMapper.deleteByDtl("2", "" + devicegroups[i].getDevicegroupid(), null, null, null, null);
		}
		for (int i = 0; i < regionschedules.length; i++) {
			regionscheduleMapper.insertSelective(regionschedules[i]);
			devicefileMapper.deleteDevicegroupVideoFiles("" + regionschedules[i].getBindid());
			devicefileMapper.deleteDevicegroupImageFiles("" + regionschedules[i].getBindid());
			devicefileMapper.insertDevicegroupVideoFiles("" + regionschedules[i].getBindid());
			devicefileMapper.insertDevicegroupImageFiles("" + regionschedules[i].getBindid());
		}
	}

}
