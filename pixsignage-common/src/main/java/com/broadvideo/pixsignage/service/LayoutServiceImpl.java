package com.broadvideo.pixsignage.service;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.broadvideo.pixsignage.persistence.RegionMapper;
import com.broadvideo.pixsignage.persistence.RegionscheduleMapper;
import com.broadvideo.pixsignage.persistence.TaskMapper;

@Service("layoutService")
public class LayoutServiceImpl implements LayoutService {

	@Autowired
	private LayoutMapper layoutMapper;
	@Autowired
	private LayoutdtlMapper layoutdtlMapper;
	@Autowired
	private RegionMapper regionMapper;
	@Autowired
	private TaskMapper taskMapper;
	@Autowired
	private LayoutscheduleMapper layoutscheduleMapper;
	@Autowired
	private RegionscheduleMapper regionscheduleMapper;
	@Autowired
	private DevicefileMapper devicefileMapper;

	public Layout selectByPrimaryKey(String layoutid) {
		return layoutMapper.selectByPrimaryKey(layoutid);
	}

	public List<Layout> selectList(String orgid, String type) {
		return layoutMapper.selectList(orgid, type);
	}

	public List<Layoutdtl> selectLayoutdtlList(String layoutid) {
		return layoutdtlMapper.selectList(layoutid);
	}

	public List<Region> selectRegionList() {
		return regionMapper.selectList();
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
		layoutdtl.setZindex(0);
		layoutdtl.setIntervaltime(10);
		layoutdtl.setDirection("4");
		layoutdtl.setSpeed("2");
		layoutdtl.setColor("#FFFFFF");
		layoutdtl.setSize(30);
		layoutdtl.setOpacity(100);
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
	public void syncLayoutdtlList(Layout layout, Layoutdtl[] layoutdtls) {
		int layoutid = layout.getLayoutid();
		List<Layoutdtl> oldlayoutdtls = layoutdtlMapper.selectList("" + layoutid);
		HashMap<Integer, Layoutdtl> hash = new HashMap<Integer, Layoutdtl>();
		for (int i = 0; i < layoutdtls.length; i++) {
			Layoutdtl layoutdtl = layoutdtls[i];
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
	public String handleWizard(Staff staff, Layout layout, Device[] devices, Devicegroup[] devicegroups) {
		SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat timeformat = new SimpleDateFormat("HH:mm:ss");

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
			layoutscheduleMapper.deleteByBind("1", "" + device.getDeviceid());
			Layoutschedule layoutschedule = new Layoutschedule();
			layoutschedule.setBindtype("1");
			layoutschedule.setBindid(device.getDeviceid());
			layoutschedule.setLayoutid(layout.getLayoutid());
			layoutscheduleMapper.insertSelective(layoutschedule);

			regionscheduleMapper.deleteByBind("1", "" + device.getDeviceid());
			for (Layoutdtl layoutdtl : layoutdtls) {
				List<HashMap<String, String>> regiondtls = layoutdtl.getRegiondtls();
				for (HashMap<String, String> regiondtl : regiondtls) {
					Regionschedule regionschedule = new Regionschedule();
					regionschedule.setBindtype("1");
					regionschedule.setBindid(device.getDeviceid());
					regionschedule.setRegionid(layoutdtl.getRegionid());
					regionschedule.setPlaymode(regiondtl.get("playmode"));
					if (regiondtl.get("playdate") != null) {
						try {
							regionschedule.setPlaydate(dateformat.parse(regiondtl.get("playdate")));
						} catch (Exception e) {
						}
					}
					if (regiondtl.get("starttime") != null) {
						try {
							regionschedule.setStarttime(timeformat.parse(regiondtl.get("starttime")));
						} catch (Exception e) {
						}
					}
					if (regiondtl.get("endtime") != null) {
						try {
							regionschedule.setEndtime(timeformat.parse(regiondtl.get("endtime")));
						} catch (Exception e) {
						}
					}
					regionschedule.setObjtype(regiondtl.get("objtype"));
					regionschedule.setObjid(Integer.parseInt(regiondtl.get("objid")));
					regionschedule.setTaskid(task.getTaskid());
					regionscheduleMapper.insertSelective(regionschedule);
				}
			}

			devicefileMapper.deleteDeviceVideoFiles("" + device.getDeviceid());
			devicefileMapper.deleteDeviceImageFiles("" + device.getDeviceid());
			devicefileMapper.insertDeviceVideoFiles("" + device.getDeviceid(), "" + task.getTaskid());
			devicefileMapper.insertDeviceImageFiles("" + device.getDeviceid(), "" + task.getTaskid());
		}

		for (int i = 0; i < devicegroups.length; i++) {
			Devicegroup devicegroup = devicegroups[i];
			layoutscheduleMapper.deleteByBind("2", "" + devicegroup.getDevicegroupid());
			Layoutschedule layoutschedule = new Layoutschedule();
			layoutschedule.setBindtype("2");
			layoutschedule.setBindid(devicegroup.getDevicegroupid());
			layoutschedule.setLayoutid(layout.getLayoutid());
			layoutscheduleMapper.insertSelective(layoutschedule);

			regionscheduleMapper.deleteByBind("2", "" + devicegroup.getDevicegroupid());
			for (Layoutdtl layoutdtl : layoutdtls) {
				List<HashMap<String, String>> regiondtls = layoutdtl.getRegiondtls();
				for (HashMap<String, String> regiondtl : regiondtls) {
					Regionschedule regionschedule = new Regionschedule();
					regionschedule.setBindtype("2");
					regionschedule.setBindid(devicegroup.getDevicegroupid());
					regionschedule.setRegionid(layoutdtl.getRegionid());
					regionschedule.setPlaymode(regiondtl.get("playmode"));
					if (regiondtl.get("playdate") != null) {
						try {
							regionschedule.setPlaydate(dateformat.parse(regiondtl.get("playdate")));
						} catch (Exception e) {
						}
					}
					if (regiondtl.get("starttime") != null) {
						try {
							regionschedule.setStarttime(timeformat.parse(regiondtl.get("starttime")));
						} catch (Exception e) {
						}
					}
					if (regiondtl.get("endtime") != null) {
						try {
							regionschedule.setEndtime(timeformat.parse(regiondtl.get("endtime")));
						} catch (Exception e) {
						}
					}
					regionschedule.setObjtype(regiondtl.get("objtype"));
					regionschedule.setObjid(Integer.parseInt(regiondtl.get("objid")));
					regionschedule.setTaskid(task.getTaskid());
					regionscheduleMapper.insertSelective(regionschedule);
				}
			}

			devicefileMapper.deleteDevicegroupVideoFiles("" + devicegroup.getDevicegroupid());
			devicefileMapper.deleteDevicegroupImageFiles("" + devicegroup.getDevicegroupid());
			devicefileMapper.insertDevicegroupVideoFiles("" + devicegroup.getDevicegroupid(), "" + task.getTaskid());
			devicefileMapper.insertDevicegroupImageFiles("" + devicegroup.getDevicegroupid(), "" + task.getTaskid());
		}

		return "" + task.getTaskid();
	}

}
