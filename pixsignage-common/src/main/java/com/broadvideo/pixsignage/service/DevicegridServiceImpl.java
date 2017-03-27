package com.broadvideo.pixsignage.service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegrid;
import com.broadvideo.pixsignage.domain.Gridlayout;
import com.broadvideo.pixsignage.domain.Gridschedule;
import com.broadvideo.pixsignage.domain.Gridscheduledtl;
import com.broadvideo.pixsignage.domain.Mediagrid;
import com.broadvideo.pixsignage.domain.Mediagriddtl;
import com.broadvideo.pixsignage.domain.Mmediadtl;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicegridMapper;
import com.broadvideo.pixsignage.persistence.GridlayoutMapper;
import com.broadvideo.pixsignage.persistence.GridscheduleMapper;
import com.broadvideo.pixsignage.persistence.GridscheduledtlMapper;
import com.broadvideo.pixsignage.persistence.MmediadtlMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;

@Service("devicegridService")
public class DevicegridServiceImpl implements DevicegridService {

	@Autowired
	private DevicegridMapper devicegridMapper;
	@Autowired
	private GridlayoutMapper gridlayoutMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private GridscheduleMapper gridscheduleMapper;
	@Autowired
	private GridscheduledtlMapper gridscheduledtlMapper;
	@Autowired
	private MmediadtlMapper mmediadtlMapper;
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;

	public int selectCount(String orgid, String branchid, String search) {
		return devicegridMapper.selectCount(orgid, branchid, search);
	}

	public List<Devicegrid> selectList(String orgid, String branchid, String search, String start, String length) {
		return devicegridMapper.selectList(orgid, branchid, search, start, length);
	}

	@Transactional
	public void design(Devicegrid devicegrid) {
		devicegridMapper.unbindDevices("" + devicegrid.getDevicegridid());
		List<Device> devices = devicegrid.getDevices();
		for (Device device : devices) {
			deviceMapper.updateByPrimaryKeySelective(device);
		}
	}

	@Transactional
	public void addDevicegrid(Devicegrid devicegrid) {
		Gridlayout gridlayout = gridlayoutMapper.selectByCode(devicegrid.getGridlayoutcode());
		devicegrid.setXcount(gridlayout.getXcount());
		devicegrid.setYcount(gridlayout.getYcount());
		devicegrid.setRatio(gridlayout.getRatio());
		devicegrid.setWidth(gridlayout.getWidth());
		devicegrid.setHeight(gridlayout.getHeight());
		devicegridMapper.insertSelective(devicegrid);
	}

	@Transactional
	public void updateDevicegrid(Devicegrid devicegrid) {
		devicegridMapper.updateByPrimaryKeySelective(devicegrid);
	}

	@Transactional
	public void deleteDevicegrid(String devicegridid) {
		devicegridMapper.unbindDevices(devicegridid);
		devicegridMapper.deleteByPrimaryKey(devicegridid);
	}

	@Transactional
	public void syncSchedule(String devicegridid) {
		List<Device> devices = deviceMapper.selectByDevicegrid(devicegridid);
		for (Device device : devices) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Grid_Schedule);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(device.getDeviceid());
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Grid_Schedule, Msgevent.ObjType_1_Device,
					"" + device.getDeviceid(), null, null, null);
			msgeventMapper.insertSelective(msgevent);
		}
	}

	@Transactional
	public void addSchedules(Gridschedule[] gridschedules) {
		if (gridschedules.length > 0) {
			String devicegridid = "" + gridschedules[0].getDevicegridid();
			gridscheduledtlMapper.deleteByDtl(devicegridid, null, null, null);
			gridscheduleMapper.deleteByDtl(devicegridid, null, null, null);
			for (int i = 0; i < gridschedules.length; i++) {
				gridscheduleMapper.insertSelective(gridschedules[i]);
				List<Gridscheduledtl> gridscheduledtls = gridschedules[i].getGridscheduledtls();
				for (Gridscheduledtl gridscheduledtl : gridscheduledtls) {
					gridscheduledtl.setGridscheduleid(gridschedules[i].getGridscheduleid());
					gridscheduledtlMapper.insertSelective(gridscheduledtl);
				}
			}
			// devicefileService.refreshDevicefiles(bindtype, bindid);
		}
	}

	public JSONObject generateScheduleJson(String deviceid) {
		JSONObject responseJson = new JSONObject();
		JSONArray scheduleJsonArray = new JSONArray();
		responseJson.put("schedules", scheduleJsonArray);

		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		String devicegridid = "" + device.getDevicegridid();
		int xpos = device.getXpos();
		int ypos = device.getYpos();

		if (device.getDevicegridid().intValue() == 0) {
			return responseJson;
		}

		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");

		// generate final json
		List<Gridschedule> gridscheduleList = gridscheduleMapper.selectList(devicegridid, Gridschedule.PlayMode_Daily,
				null, null);
		for (Gridschedule gridschedule : gridscheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJsonArray.put(scheduleJson);
			scheduleJson.put("schedule_id", gridschedule.getGridscheduleid());
			scheduleJson.put("playmode", "daily");
			scheduleJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(gridschedule.getStarttime()));
			scheduleJson.put("multi_flag", "1");
			JSONArray scheduledtlJsonArray = new JSONArray();
			scheduleJson.put("scheduledtls", scheduledtlJsonArray);
			for (Gridscheduledtl gridscheduledtl : gridschedule.getGridscheduledtls()) {
				Mediagrid mediagrid = gridscheduledtl.getMediagrid();
				if (!mediagrid.getStatus().equals(Mediagrid.Status_Active)) {
					continue;
				}
				List<Mediagriddtl> mediagriddtls = mediagrid.getMediagriddtls();
				for (Mediagriddtl mediagriddtl : mediagriddtls) {
					int x = xpos - mediagriddtl.getXpos().intValue();
					int y = ypos - mediagriddtl.getYpos().intValue();
					if (x >= 0 && x < mediagriddtl.getXcount().intValue() && y >= 0
							&& y < mediagriddtl.getYcount().intValue()) {
						if (mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Page)) {
							String zipPath = "/page/" + mediagriddtl.getObjid() + "/page-" + mediagriddtl.getObjid()
									+ ".zip";
							File zipFile = new File("/pixdata/pixsignage" + zipPath);
							if (zipFile.exists()) {
								JSONObject scheduledtlJson = new JSONObject();
								scheduledtlJsonArray.put(scheduledtlJson);
								scheduledtlJson.put("scheduledtl_id", gridscheduledtl.getGridscheduledtlid());
								scheduledtlJson.put("media_type", "page");
								scheduledtlJson.put("media_id", mediagriddtl.getObjid());
								scheduledtlJson.put("url",
										"http://" + serverip + ":" + serverport + "/pixsigdata" + zipPath);
								scheduledtlJson.put("file", zipFile.getName());
								scheduledtlJson.put("size", FileUtils.sizeOf(zipFile));
								scheduledtlJson.put("duration", 30);
							}
						} else {
							Mmediadtl mmediadtl = mmediadtlMapper.selectByPos("" + mediagriddtl.getMmediaid(), "" + x,
									"" + y);
							if (mmediadtl != null && mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Video)) {
								JSONObject scheduledtlJson = new JSONObject();
								scheduledtlJsonArray.put(scheduledtlJson);
								scheduledtlJson.put("scheduledtl_id", gridscheduledtl.getGridscheduledtlid());
								scheduledtlJson.put("media_type", "video");
								scheduledtlJson.put("media_id", mmediadtl.getMmediadtlid());
								scheduledtlJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata"
										+ mmediadtl.getFilepath());
								scheduledtlJson.put("file", mmediadtl.getFilename());
								scheduledtlJson.put("size", mmediadtl.getSize());
								scheduledtlJson.put("duration", 0);
							} else
								if (mmediadtl != null && mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Image)) {
								JSONObject scheduledtlJson = new JSONObject();
								scheduledtlJsonArray.put(scheduledtlJson);
								scheduledtlJson.put("scheduledtl_id", gridscheduledtl.getGridscheduledtlid());
								scheduledtlJson.put("media_type", "image");
								scheduledtlJson.put("media_id", mmediadtl.getMmediadtlid());
								scheduledtlJson.put("url", "http://" + serverip + ":" + serverport + "/pixsigdata"
										+ mmediadtl.getFilepath());
								scheduledtlJson.put("file", mmediadtl.getFilename());
								scheduledtlJson.put("size", mmediadtl.getSize());
								scheduledtlJson.put("duration", 10);
							}
						}
					}
				}

			}
		}

		return responseJson;
	}
}
