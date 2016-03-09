package com.broadvideo.pixsignage.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Bundledtl;
import com.broadvideo.pixsignage.domain.Bundleschedule;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Layout;
import com.broadvideo.pixsignage.domain.Layoutdtl;
import com.broadvideo.pixsignage.domain.Layoutschedule;
import com.broadvideo.pixsignage.domain.Medialist;
import com.broadvideo.pixsignage.domain.Medialistdtl;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Region;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.domain.Stream;
import com.broadvideo.pixsignage.domain.Text;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.domain.Widget;
import com.broadvideo.pixsignage.persistence.BundleMapper;
import com.broadvideo.pixsignage.persistence.BundledtlMapper;
import com.broadvideo.pixsignage.persistence.BundlescheduleMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicefileMapper;
import com.broadvideo.pixsignage.persistence.DvbMapper;
import com.broadvideo.pixsignage.persistence.LayoutMapper;
import com.broadvideo.pixsignage.persistence.LayoutdtlMapper;
import com.broadvideo.pixsignage.persistence.LayoutscheduleMapper;
import com.broadvideo.pixsignage.persistence.MedialistMapper;
import com.broadvideo.pixsignage.persistence.MedialistdtlMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.RegionMapper;
import com.broadvideo.pixsignage.persistence.RegionscheduleMapper;
import com.broadvideo.pixsignage.persistence.StreamMapper;
import com.broadvideo.pixsignage.persistence.TextMapper;
import com.broadvideo.pixsignage.persistence.WidgetMapper;
import com.broadvideo.pixsignage.util.ActiveMQUtil;
import com.broadvideo.pixsignage.util.CommonUtil;

@Service("bundleService")
public class BundleServiceImpl implements BundleService {

	@Autowired
	private BundleMapper bundleMapper;
	@Autowired
	private BundledtlMapper bundledtlMapper;
	@Autowired
	private LayoutMapper layoutMapper;
	@Autowired
	private LayoutdtlMapper layoutdtlMapper;
	@Autowired
	private BundlescheduleMapper bundlescheduleMapper;
	@Autowired
	private LayoutscheduleMapper layoutscheduleMapper;
	@Autowired
	private RegionscheduleMapper regionscheduleMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private DevicefileMapper devicefileMapper;
	@Autowired
	private RegionMapper regionMapper;
	@Autowired
	private MedialistMapper medialistMapper;
	@Autowired
	private MedialistdtlMapper medialistdtlMapper;
	@Autowired
	private TextMapper textMapper;
	@Autowired
	private StreamMapper streamMapper;
	@Autowired
	private DvbMapper dvbMapper;
	@Autowired
	private WidgetMapper widgetMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	protected ResourceBundleMessageSource messageSource;

	@Autowired
	private MedialistService medialistService;
	@Autowired
	private TextService textService;
	@Autowired
	private StreamService streamService;
	@Autowired
	private WidgetService widgetService;

	public int selectCount(String orgid, String search) {
		return bundleMapper.selectCount(orgid, search);
	}

	public List<Bundle> selectList(String orgid, String search, String start, String length) {
		List<Bundle> bundleList = bundleMapper.selectList(orgid, search, start, length);
		for (Bundle bundle : bundleList) {
			for (Layoutdtl layoutdtl : bundle.getLayout().getLayoutdtls()) {
				Region region = layoutdtl.getRegion();
				if (region != null) {
					region.translate(messageSource);
				}
			}
		}
		return bundleList;
	}

	@Transactional
	public void addBundle(Bundle bundle) {
		Layout layout = layoutMapper.selectByPrimaryKey("" + bundle.getLayoutid());
		List<Layoutdtl> layoutdtls = layout.getLayoutdtls();
		bundleMapper.insertSelective(bundle);
		for (Layoutdtl layoutdtl : layoutdtls) {
			Bundledtl bundledtl = new Bundledtl();
			bundledtl.setBundleid(bundle.getBundleid());
			bundledtl.setRegionid(layoutdtl.getRegionid());
			bundledtl.setType(Bundledtl.Type_Private);
			if (layoutdtl.getRegion().getType().equals(Region.Type_NONTEXT)) {
				Medialist medialist = new Medialist();
				medialist.setOrgid(bundle.getOrgid());
				medialist.setName(bundle.getName() + "-" + layoutdtl.getRegionid());
				medialist.setType(Medialist.Type_Private);
				medialist.setCreatestaffid(bundle.getCreatestaffid());
				medialistMapper.insertSelective(medialist);
				bundledtl.setObjtype(Bundledtl.ObjType_Medialist);
				bundledtl.setObjid(medialist.getMedialistid());
			} else if (layoutdtl.getRegion().getType().equals(Region.Type_TEXT)) {
				Text text = new Text();
				text.setOrgid(bundle.getOrgid());
				text.setName(bundle.getName() + "-" + layoutdtl.getRegionid());
				text.setType(Medialist.Type_Private);
				text.setCreatestaffid(bundle.getCreatestaffid());
				textMapper.insertSelective(text);
				bundledtl.setObjtype(Bundledtl.ObjType_Text);
				bundledtl.setObjid(text.getTextid());
			} else {
				bundledtl.setObjtype(Bundledtl.ObjType_NONE);
				bundledtl.setObjid(0);
			}
			bundledtlMapper.insertSelective(bundledtl);
		}
	}

	@Transactional
	public void updateBundle(Bundle bundle) {
		bundleMapper.updateByPrimaryKeySelective(bundle);
	}

	@Transactional
	public void deleteBundle(String bundleid) {
		bundleMapper.deleteByPrimaryKey(bundleid);
	}

	@Transactional
	public void design(Bundle bundle) {
		for (Bundledtl bundledtl : bundle.getBundledtls()) {
			Bundledtl oldBundledtl = bundledtlMapper.selectByRegion("" + bundle.getBundleid(),
					"" + bundledtl.getRegionid());
			bundledtl.setBundleid(bundle.getBundleid());
			if (oldBundledtl.getType().equals(Bundledtl.Type_Private)
					&& (!oldBundledtl.getObjtype().equals(bundledtl.getObjtype())
							|| oldBundledtl.getObjid().intValue() != bundledtl.getObjid().intValue())) {
				// Remove old private records
				if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Medialist)) {
					medialistService.deleteMedialist("" + oldBundledtl.getObjid());
				} else if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Text)) {
					textService.deleteText("" + oldBundledtl.getObjid());
				} else if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Stream)) {
					streamService.deleteStream("" + oldBundledtl.getObjid());
				} else if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Widget)) {
					widgetService.deleteWidget("" + oldBundledtl.getObjid());
				}
			}
			if (bundledtl.getType().equals(Bundledtl.Type_Private)) {
				if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Medialist)) {
					Medialist medialist = bundledtl.getMedialist();
					Medialist oldMedialist = medialistMapper.selectByPrimaryKey("" + bundledtl.getObjid());
					List<Medialistdtl> oldmedialistdtls;
					if (oldMedialist == null) {
						medialist.setOrgid(bundle.getOrgid());
						medialist.setName(bundle.getName() + "-" + bundledtl.getRegionid());
						medialist.setType(Medialist.Type_Private);
						medialist.setCreatestaffid(bundle.getCreatestaffid());
						medialistMapper.insertSelective(medialist);
						oldmedialistdtls = new ArrayList<Medialistdtl>();
					} else {
						oldmedialistdtls = oldMedialist.getMedialistdtls();
					}

					HashMap<Integer, Medialistdtl> hash = new HashMap<Integer, Medialistdtl>();
					for (Medialistdtl medialistdtl : medialist.getMedialistdtls()) {
						medialistdtl.setMedialistid(medialist.getMedialistid());
						if (medialistdtl.getMedialistdtlid() == 0) {
							medialistdtlMapper.insertSelective(medialistdtl);
						} else {
							medialistdtlMapper.updateByPrimaryKeySelective(medialistdtl);
							hash.put(medialistdtl.getMedialistdtlid(), medialistdtl);
						}
					}
					for (int i = 0; i < oldmedialistdtls.size(); i++) {
						if (hash.get(oldmedialistdtls.get(i).getMedialistdtlid()) == null) {
							medialistdtlMapper.deleteByPrimaryKey("" + oldmedialistdtls.get(i).getMedialistdtlid());
						}
					}

					bundledtl.setObjid(medialist.getMedialistid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Text)) {
					Text text = bundledtl.getText();
					Text oldText = textMapper.selectByPrimaryKey("" + bundledtl.getObjid());
					if (oldText == null) {
						text.setOrgid(bundle.getOrgid());
						text.setName(bundle.getName() + "-" + bundledtl.getRegionid());
						text.setType(Medialist.Type_Private);
						text.setCreatestaffid(bundle.getCreatestaffid());
						textMapper.insertSelective(text);
					} else {
						text.setTextid(bundledtl.getObjid());
						textMapper.updateByPrimaryKeySelective(text);
					}
					bundledtl.setObjid(text.getTextid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Stream)) {
					Stream stream = bundledtl.getStream();
					Stream oldStream = streamMapper.selectByPrimaryKey("" + bundledtl.getObjid());
					if (oldStream == null) {
						stream.setOrgid(bundle.getOrgid());
						stream.setName(bundle.getName() + "-" + bundledtl.getRegionid());
						stream.setType(Medialist.Type_Private);
						stream.setCreatestaffid(bundle.getCreatestaffid());
						streamMapper.insertSelective(stream);
					} else {
						stream.setStreamid(bundledtl.getObjid());
						streamMapper.updateByPrimaryKeySelective(stream);
					}
					bundledtl.setObjid(stream.getStreamid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Widget)) {
					Widget widget = bundledtl.getWidget();
					Widget oldWidget = widgetMapper.selectByPrimaryKey("" + bundledtl.getObjid());
					if (oldWidget == null) {
						widget.setOrgid(bundle.getOrgid());
						widget.setName(bundle.getName() + "-" + bundledtl.getRegionid());
						widget.setType(Medialist.Type_Private);
						widget.setCreatestaffid(bundle.getCreatestaffid());
						widgetMapper.insertSelective(widget);
					} else {
						widget.setWidgetid(bundledtl.getObjid());
						widgetMapper.updateByPrimaryKeySelective(widget);
					}
					bundledtl.setObjid(widget.getWidgetid());
				}
			}

			if (bundledtl.getBundledtlid() == 0) {
				bundledtlMapper.insertSelective(bundledtl);
			} else {
				bundledtlMapper.updateByPrimaryKeySelective(bundledtl);
			}
		}
	}

	@Transactional
	public void push(Bundle bundle, Device[] devices, Devicegroup[] devicegroups) throws Exception {
		// Handle device bundleschedule
		for (int i = 0; i < devices.length; i++) {
			Device device = devices[i];

			bundlescheduleMapper.deleteByDtl(Bundleschedule.BindType_Device, "" + device.getDeviceid(), null, null,
					null);
			Bundleschedule bundleschedule = new Bundleschedule();
			bundleschedule.setBindtype(Bundleschedule.BindType_Device);
			bundleschedule.setBindid(device.getDeviceid());
			bundleschedule.setBundleid(bundle.getBundleid());
			bundleschedule.setPlaymode(Bundleschedule.PlayMode_Daily);
			bundleschedule.setStarttime(CommonUtil.parseDate("00:00:00", CommonConstants.DateFormat_Time));
			bundlescheduleMapper.insertSelective(bundleschedule);

			/*
			 * layoutscheduleMapper.deleteByDtl(Layoutschedule.BindType_Device,
			 * "" + device.getDeviceid(), null, null, null); Layoutschedule
			 * layoutschedule = new Layoutschedule();
			 * layoutschedule.setBindtype(Layoutschedule.BindType_Device);
			 * layoutschedule.setBindid(device.getDeviceid());
			 * layoutschedule.setLayoutid(bundle.getLayoutid());
			 * layoutschedule.setPlaymode(Layoutschedule.PlayMode_Daily);
			 * layoutschedule.setStarttime(CommonUtil.parseDate("00:00:00",
			 * CommonConstants.DateFormat_Time));
			 * layoutscheduleMapper.insertSelective(layoutschedule);
			 * 
			 * regionscheduleMapper.deleteByDtl(Regionschedule.BindType_Device,
			 * "" + device.getDeviceid(), null, null, null, null); for
			 * (Bundledtl bundledtl : bundle.getBundledtls()) { Regionschedule
			 * regionschedule = new Regionschedule();
			 * regionschedule.setBindtype(Regionschedule.BindType_Device);
			 * regionschedule.setBindid(device.getDeviceid());
			 * regionschedule.setRegionid(bundledtl.getRegionid());
			 * regionschedule.setPlaymode(Regionschedule.PlayMode_Daily);
			 * regionschedule.setStarttime(CommonUtil.parseDate("00:00:00",
			 * CommonConstants.DateFormat_Time));
			 * regionschedule.setObjtype(bundledtl.getObjtype());
			 * regionschedule.setObjid(bundledtl.getObjid()); //
			 * regionschedule.setTaskid(task.getTaskid());
			 * regionscheduleMapper.insertSelective(regionschedule); }
			 */

			devicefileMapper.deleteDeviceVideoFiles("" + device.getDeviceid());
			devicefileMapper.deleteDeviceImageFiles("" + device.getDeviceid());
			devicefileMapper.insertDeviceVideoFiles("" + device.getDeviceid());
			devicefileMapper.insertDeviceImageFiles("" + device.getDeviceid());
		}

		// Handle devicegroup bundleschedule
		for (int i = 0; i < devicegroups.length; i++) {
			Devicegroup devicegroup = devicegroups[i];

			bundlescheduleMapper.deleteByDtl(Bundleschedule.BindType_DeviceGroup, "" + devicegroup.getDevicegroupid(),
					null, null, null);
			Bundleschedule bundleschedule = new Bundleschedule();
			bundleschedule.setBindtype(Bundleschedule.BindType_DeviceGroup);
			bundleschedule.setBindid(devicegroup.getDevicegroupid());
			bundleschedule.setBundleid(bundle.getBundleid());
			bundleschedule.setPlaymode(Bundleschedule.PlayMode_Daily);
			bundleschedule.setStarttime(CommonUtil.parseDate("00:00:00", CommonConstants.DateFormat_Time));
			bundlescheduleMapper.insertSelective(bundleschedule);

			/*
			 * layoutscheduleMapper.deleteByDtl(Layoutschedule.
			 * BindType_DeviceGroup, "" + devicegroup.getDevicegroupid(), null,
			 * null, null); Layoutschedule layoutschedule = new
			 * Layoutschedule();
			 * layoutschedule.setBindtype(Layoutschedule.BindType_DeviceGroup);
			 * layoutschedule.setBindid(devicegroup.getDevicegroupid());
			 * layoutschedule.setLayoutid(bundle.getLayoutid());
			 * layoutschedule.setPlaymode(Layoutschedule.PlayMode_Daily);
			 * layoutschedule.setStarttime(CommonUtil.parseDate("00:00:00",
			 * CommonConstants.DateFormat_Time));
			 * layoutscheduleMapper.insertSelective(layoutschedule);
			 * 
			 * regionscheduleMapper.deleteByDtl(Layoutschedule.
			 * BindType_DeviceGroup, "" + devicegroup.getDevicegroupid(), null,
			 * null, null, null); for (Bundledtl bundledtl :
			 * bundle.getBundledtls()) { Regionschedule regionschedule = new
			 * Regionschedule();
			 * regionschedule.setBindtype(Regionschedule.BindType_DeviceGroup);
			 * regionschedule.setBindid(devicegroup.getDevicegroupid());
			 * regionschedule.setRegionid(bundledtl.getRegionid());
			 * regionschedule.setPlaymode(Regionschedule.PlayMode_Daily);
			 * regionschedule.setStarttime(CommonUtil.parseDate("00:00:00",
			 * CommonConstants.DateFormat_Time));
			 * regionschedule.setObjtype(bundledtl.getObjtype());
			 * regionschedule.setObjid(bundledtl.getObjid()); //
			 * regionschedule.setTaskid(task.getTaskid());
			 * regionscheduleMapper.insertSelective(regionschedule); }
			 */

			devicefileMapper.deleteDevicegroupVideoFiles("" + devicegroup.getDevicegroupid());
			devicefileMapper.deleteDevicegroupImageFiles("" + devicegroup.getDevicegroupid());
			devicefileMapper.insertDevicegroupVideoFiles("" + devicegroup.getDevicegroupid());
			devicefileMapper.insertDevicegroupImageFiles("" + devicegroup.getDevicegroupid());
		}

		// Handle sync
		for (int i = 0; i < devices.length; i++) {
			syncBundleLayout("1", "" + devices[i].getDeviceid());
			syncBundleRegions("1", "" + devices[i].getDeviceid());
		}
		for (int i = 0; i < devicegroups.length; i++) {
			syncBundleLayout("2", "" + devicegroups[i].getDevicegroupid());
			syncBundleRegions("2", "" + devicegroups[i].getDevicegroupid());
		}
	}

	@Transactional
	public void handleWizard(Staff staff, Bundle bundle, Device[] devices, Devicegroup[] devicegroups)
			throws Exception {
		Layout layout = bundle.getLayout();
		List<Bundledtl> bundledtls = bundle.getBundledtls();

		// Handle layout design
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

		// Handle bundle
		bundleMapper.insertSelective(bundle);
		for (Bundledtl bundledtl : bundledtls) {
			bundledtl.setBundleid(bundle.getBundleid());
			if (bundledtl.getType().equals(Bundledtl.Type_Private)) {
				if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Medialist)) {
					Medialist medialist = bundledtl.getMedialist();
					medialist.setOrgid(bundle.getOrgid());
					medialist.setName(bundle.getName() + "-" + bundledtl.getRegionid());
					medialist.setType(Medialist.Type_Private);
					medialist.setCreatestaffid(staff.getStaffid());
					medialistMapper.insertSelective(medialist);
					for (Medialistdtl medialistdtl : medialist.getMedialistdtls()) {
						medialistdtl.setMedialistid(medialist.getMedialistid());
						medialistdtlMapper.insertSelective(medialistdtl);
					}
					bundledtl.setObjid(medialist.getMedialistid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Text)) {
					Text text = bundledtl.getText();
					text.setOrgid(bundle.getOrgid());
					text.setName(bundle.getName() + "-" + bundledtl.getRegionid());
					text.setType(Medialist.Type_Private);
					text.setCreatestaffid(staff.getStaffid());
					textMapper.insertSelective(text);
					bundledtl.setObjid(text.getTextid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Stream)) {
					Stream stream = bundledtl.getStream();
					stream.setOrgid(bundle.getOrgid());
					stream.setName(bundle.getName() + "-" + bundledtl.getRegionid());
					stream.setType(Medialist.Type_Private);
					stream.setCreatestaffid(staff.getStaffid());
					streamMapper.insertSelective(stream);
					bundledtl.setObjid(stream.getStreamid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Widget)) {
					Widget widget = bundledtl.getWidget();
					widget.setOrgid(bundle.getOrgid());
					widget.setName(bundle.getName() + "-" + bundledtl.getRegionid());
					widget.setType(Medialist.Type_Private);
					widget.setCreatestaffid(staff.getStaffid());
					widgetMapper.insertSelective(widget);
					bundledtl.setObjid(widget.getWidgetid());
				}
			}
			bundledtlMapper.insertSelective(bundledtl);
		}

		push(bundle, devices, devicegroups);
	}

	@Transactional
	public void addBundleschedules(Bundleschedule[] bundleschedules, Device[] devices) {
		for (int i = 0; i < devices.length; i++) {
			bundlescheduleMapper.deleteByDtl("1", "" + devices[i].getDeviceid(), null, null, null);
		}
		for (int i = 0; i < bundleschedules.length; i++) {
			bundlescheduleMapper.insertSelective(bundleschedules[i]);
			devicefileMapper.deleteDeviceVideoFiles("" + bundleschedules[i].getBindid());
			devicefileMapper.deleteDeviceImageFiles("" + bundleschedules[i].getBindid());
			devicefileMapper.insertDeviceVideoFiles("" + bundleschedules[i].getBindid());
			devicefileMapper.insertDeviceImageFiles("" + bundleschedules[i].getBindid());
		}
	}

	@Transactional
	public void addBundleschedules(Bundleschedule[] bundleschedules, Devicegroup[] devicegroups) {
		for (int i = 0; i < devicegroups.length; i++) {
			bundlescheduleMapper.deleteByDtl("2", "" + devicegroups[i].getDevicegroupid(), null, null, null);
		}
		for (int i = 0; i < bundleschedules.length; i++) {
			bundlescheduleMapper.insertSelective(bundleschedules[i]);
			devicefileMapper.deleteDevicegroupVideoFiles("" + bundleschedules[i].getBindid());
			devicefileMapper.deleteDevicegroupImageFiles("" + bundleschedules[i].getBindid());
			devicefileMapper.insertDevicegroupVideoFiles("" + bundleschedules[i].getBindid());
			devicefileMapper.insertDevicegroupImageFiles("" + bundleschedules[i].getBindid());
		}
	}

	private List<Bundleschedule> getBundlescheduleList48Hours(String bindtype, String bindid) {
		List<Bundleschedule> finalscheduleList = new ArrayList<Bundleschedule>();
		List<Bundleschedule> bundlescheduleList = bundlescheduleMapper.selectList(bindtype, bindid,
				Bundleschedule.PlayMode_Daily, null, null);
		String today = new SimpleDateFormat(CommonConstants.DateFormat_Date).format(Calendar.getInstance().getTime());
		String tomorrow = new SimpleDateFormat(CommonConstants.DateFormat_Date)
				.format(new Date(Calendar.getInstance().getTimeInMillis() + 24 * 3600 * 1000));

		// Add the first schedule from 00:00
		if (bundlescheduleList.size() > 0 && !new SimpleDateFormat(CommonConstants.DateFormat_Time)
				.format(bundlescheduleList.get(0).getStarttime()).equals("00:00:00")) {
			Bundleschedule newschedule = new Bundleschedule();
			newschedule.setBundleid(bundlescheduleList.get(bundlescheduleList.size() - 1).getBundleid());
			newschedule.setBundle(bundlescheduleList.get(bundlescheduleList.size() - 1).getBundle());
			String s = today + " 00:00:00";
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}
		// Add today schedules
		for (Bundleschedule bundleschedule : bundlescheduleList) {
			Bundleschedule newschedule = new Bundleschedule();
			newschedule.setBundleid(bundleschedule.getBundleid());
			newschedule.setBundle(bundleschedule.getBundle());
			String s = today + " "
					+ new SimpleDateFormat(CommonConstants.DateFormat_Time).format(bundleschedule.getStarttime());
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}
		// Add tomorrow schedules
		for (Bundleschedule bundleschedule : bundlescheduleList) {
			Bundleschedule newschedule = new Bundleschedule();
			newschedule.setBundleid(bundleschedule.getBundleid());
			newschedule.setBundle(bundleschedule.getBundle());
			String s = tomorrow + " "
					+ new SimpleDateFormat(CommonConstants.DateFormat_Time).format(bundleschedule.getStarttime());
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}
		return finalscheduleList;
	}

	@Transactional
	public void syncBundleLayout(String bindtype, String bindid) throws Exception {
		Msgevent msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Layout_Schedule);
		msgevent.setObjtype1(bindtype);
		msgevent.setObjid1(Integer.parseInt(bindid));
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Layout_Schedule, bindtype, bindid, null, null, null);
		msgeventMapper.insertSelective(msgevent);

		JSONObject msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "LAYOUT");
		JSONObject msgBodyJson = generateBundleLayoutJson(msgevent.getObjtype1(), "" + msgevent.getObjid1());
		msgJson.put("msg_body", msgBodyJson);

		String topic = "";
		if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_Device)) {
			topic = "device-" + msgevent.getObjid1();
		} else if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_DeviceGroup)) {
			topic = "group-" + msgevent.getObjid1();
		}

		ActiveMQUtil.publish(topic, msgJson.toString());
		msgevent.setStatus(Msgevent.Status_Sent);
		msgevent.setSendtime(Calendar.getInstance().getTime());
		msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}

	public JSONObject generateBundleLayoutJson(String bindtype, String bindid) {
		// bindtype: 1-device 2-devicegroup
		if (bindtype.equals("1")) {
			Device device = deviceMapper.selectByPrimaryKey(bindid);
			if (device.getDevicegroup() != null) {
				bindtype = "2";
				bindid = "" + device.getDevicegroupid();
			}
		}

		HashMap<Integer, JSONObject> layoutHash = new HashMap<Integer, JSONObject>();

		JSONObject responseJson = new JSONObject();
		JSONArray layoutJsonArray = new JSONArray();
		responseJson.put("layouts", layoutJsonArray);
		JSONArray scheduleJsonArray = new JSONArray();
		responseJson.put("layout_schedules", scheduleJsonArray);

		// generate final json
		List<Bundleschedule> finalscheduleList = getBundlescheduleList48Hours(bindtype, bindid);
		for (Bundleschedule bundleschedule : finalscheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJson.put("layout_id", bundleschedule.getBundleid());
			scheduleJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Full).format(bundleschedule.getTempstarttime()));
			scheduleJson.put("start_time_seconds", (long) (bundleschedule.getTempstarttime().getTime() / 1000));
			scheduleJsonArray.put(scheduleJson);

			if (layoutHash.get(bundleschedule.getBundleid()) == null) {
				Layout layout = layoutMapper.selectByPrimaryKey("" + bundleschedule.getBundle().getLayoutid());
				JSONObject layoutJson = new JSONObject();
				layoutJsonArray.put(layoutJson);

				layoutHash.put(layout.getLayoutid(), layoutJson);

				layoutJson.put("layout_id", layout.getLayoutid());
				layoutJson.put("width", layout.getWidth());
				layoutJson.put("height", layout.getHeight());
				layoutJson.put("bg_color", "#000000");
				JSONObject layoutBgImageJson = new JSONObject();
				layoutJson.put("bg_image", layoutBgImageJson);
				if (layout.getBgimage() != null) {
					layoutBgImageJson.put("id", layout.getBgimageid());
					layoutBgImageJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
							+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + layout.getBgimage().getFilepath());
					layoutBgImageJson.put("file", layout.getBgimage().getFilename());
					layoutBgImageJson.put("size", layout.getBgimage().getSize());
				} else {
					layoutBgImageJson.put("id", 0);
					layoutBgImageJson.put("url", "");
					layoutBgImageJson.put("file", "");
					layoutBgImageJson.put("size", 0);
				}

				JSONArray regionJsonArray = new JSONArray();
				layoutJson.put("regions", regionJsonArray);
				for (Layoutdtl layoutdtl : layout.getLayoutdtls()) {
					JSONObject regionJson = new JSONObject();
					regionJsonArray.put(regionJson);
					regionJson.put("region_id", layoutdtl.getRegionid());
					regionJson.put("width", layoutdtl.getWidth());
					regionJson.put("height", layoutdtl.getHeight());
					regionJson.put("top", layoutdtl.getTopoffset());
					regionJson.put("left", layoutdtl.getLeftoffset());
					regionJson.put("zindex", layoutdtl.getZindex());
					String opacity = Integer.toHexString(layoutdtl.getOpacity());
					if (opacity.length() == 1) {
						opacity = "0" + opacity;
					}
					regionJson.put("bgcolor", "#" + opacity + layoutdtl.getBgcolor().substring(1));
					regionJson.put("type", layoutdtl.getRegion().getType());
					regionJson.put("interval", layoutdtl.getIntervaltime());
					regionJson.put("fit_flag", Integer.parseInt(layoutdtl.getFitflag()));
					if (layoutdtl.getDirection().equals("1")) {
						regionJson.put("direction", "none");
					} else if (layoutdtl.getDirection().equals("2")) {
						regionJson.put("direction", "up");
					} else if (layoutdtl.getDirection().equals("3")) {
						regionJson.put("direction", "down");
					} else if (layoutdtl.getDirection().equals("4")) {
						regionJson.put("direction", "left");
					} else if (layoutdtl.getDirection().equals("5")) {
						regionJson.put("direction", "right");
					}
					regionJson.put("speed", "" + layoutdtl.getSpeed());
					regionJson.put("color", "" + layoutdtl.getColor());
					regionJson.put("size", layoutdtl.getSize());
					if (layoutdtl.getDateformat() == null) {
						regionJson.put("date_format", "yyyy-MM-dd");
					} else {
						regionJson.put("date_format", layoutdtl.getDateformat());
					}
					regionJson.put("volume", layoutdtl.getVolume());

					JSONObject regionBgImageJson = new JSONObject();
					regionJson.put("bg_image", regionBgImageJson);
					if (layoutdtl.getBgimage() != null) {
						regionBgImageJson.put("id", layoutdtl.getBgimageid());
						regionBgImageJson.put("url",
								"http://" + CommonConfig.CONFIG_SERVER_IP + ":" + CommonConfig.CONFIG_SERVER_PORT
										+ "/pixsigdata" + layoutdtl.getBgimage().getFilepath());
						regionBgImageJson.put("file", layoutdtl.getBgimage().getFilename());
						regionBgImageJson.put("size", layoutdtl.getBgimage().getSize());
					} else {
						regionBgImageJson.put("id", 0);
						regionBgImageJson.put("url", "");
						regionBgImageJson.put("file", "");
						regionBgImageJson.put("size", 0);
					}
				}
			}
		}

		return responseJson;
	}

	public void syncBundleRegions(String bindtype, String bindid) throws Exception {
		List<Region> regionList = regionMapper.selectActiveList();
		for (Region region : regionList) {
			if (region.getType().equals(Region.Type_NONTEXT) || region.getType().equals(Region.Type_TEXT)) {
				Msgevent msgevent = new Msgevent();
				msgevent.setMsgtype(Msgevent.MsgType_Region_Schedule);
				msgevent.setObjtype1(bindtype);
				msgevent.setObjid1(Integer.parseInt(bindid));
				msgevent.setObjtype2(Msgevent.ObjType_2_Region);
				msgevent.setObjid2(region.getRegionid());
				msgevent.setStatus(Msgevent.Status_Wait);
				msgeventMapper.deleteByDtl(Msgevent.MsgType_Region_Schedule, bindtype, bindid,
						Msgevent.ObjType_2_Region, "" + region.getRegionid(), null);
				msgeventMapper.insertSelective(msgevent);

				JSONObject msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "REGION");
				JSONObject msgBodyJson = generateBundleRegionJson(msgevent.getObjtype1(), "" + msgevent.getObjid1(),
						"" + msgevent.getObjid2());
				msgJson.put("msg_body", msgBodyJson);

				String topic = "";
				if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_Device)) {
					topic = "device-" + msgevent.getObjid1();
				} else if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_DeviceGroup)) {
					topic = "group-" + msgevent.getObjid1();
				}

				ActiveMQUtil.publish(topic, msgJson.toString());
				msgevent.setStatus(Msgevent.Status_Sent);
				msgevent.setSendtime(Calendar.getInstance().getTime());
				msgeventMapper.updateByPrimaryKeySelective(msgevent);
			}
		}
	}

	public JSONObject generateBundleRegionJson(String bindtype, String bindid, String regionid) {
		// bindtype: 1-device 2-devicegroup
		if (bindtype.equals("1")) {
			Device device = deviceMapper.selectByPrimaryKey(bindid);
			if (device.getDevicegroup() != null) {
				bindtype = "2";
				bindid = "" + device.getDevicegroupid();
			}
		}

		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> imageHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> textHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> streamHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> dvbHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> widgetHash = new HashMap<Integer, JSONObject>();

		JSONObject responseJson = new JSONObject();
		responseJson.put("region_id", regionid);
		JSONArray videoJsonArray = new JSONArray();
		responseJson.put("videos", videoJsonArray);
		JSONArray imageJsonArray = new JSONArray();
		responseJson.put("images", imageJsonArray);
		JSONArray textJsonArray = new JSONArray();
		responseJson.put("texts", textJsonArray);
		JSONArray streamJsonArray = new JSONArray();
		responseJson.put("streams", streamJsonArray);
		JSONArray dvbJsonArray = new JSONArray();
		responseJson.put("dvbs", dvbJsonArray);
		JSONArray widgetJsonArray = new JSONArray();
		responseJson.put("widgets", widgetJsonArray);
		JSONArray scheduleJsonArray = new JSONArray();
		responseJson.put("schedules", scheduleJsonArray);

		// generate final json
		List<Bundleschedule> finalscheduleList = getBundlescheduleList48Hours(bindtype, bindid);
		for (Bundleschedule bundleschedule : finalscheduleList) {
			Bundledtl bundledtl = bundleschedule.getBundle().getBundledtl(regionid);
			if (bundledtl == null) {
				continue;
			}
			JSONObject scheduleJson = new JSONObject();
			scheduleJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Full).format(bundleschedule.getTempstarttime()));
			scheduleJson.put("start_time_seconds", (long) (bundleschedule.getTempstarttime().getTime() / 1000));
			if (bundledtl.getObjtype().equals("1")) {
				scheduleJson.put("type", "list");
			} else if (bundledtl.getObjtype().equals("2")) {
				scheduleJson.put("type", "text");
			} else if (bundledtl.getObjtype().equals("3")) {
				scheduleJson.put("type", "stream");
			} else if (bundledtl.getObjtype().equals("4")) {
				scheduleJson.put("type", "dvb");
			} else if (bundledtl.getObjtype().equals("5")) {
				scheduleJson.put("type", "widget");
			}
			JSONArray playlistJsonArray = new JSONArray();
			scheduleJson.put("playlist", playlistJsonArray);
			scheduleJsonArray.put(scheduleJson);

			String objtype = bundledtl.getObjtype();
			if (objtype.equals(Bundledtl.ObjType_Medialist)) {
				List<Medialistdtl> medialistdtls = bundledtl.getMedialist().getMedialistdtls();
				for (Medialistdtl medialistdtl : medialistdtls) {
					if (medialistdtl.getVideo() != null) {
						Video video = medialistdtl.getVideo();
						playlistJsonArray.put(new JSONObject().put("type", "video").put("id", video.getVideoid()));
						if (videoHash.get(medialistdtl.getObjid()) == null) {
							JSONObject videoJson = new JSONObject();
							videoJson.put("id", video.getVideoid());
							videoJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
									+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + video.getFilepath());
							videoJson.put("file", video.getFilename());
							videoJson.put("size", video.getSize());
							videoHash.put(video.getVideoid(), videoJson);
							videoJsonArray.put(videoJson);
						}
					} else if (medialistdtl.getImage() != null) {
						Image image = medialistdtl.getImage();
						playlistJsonArray.put(new JSONObject().put("type", "image").put("id", image.getImageid()));
						if (imageHash.get(medialistdtl.getObjid()) == null) {
							JSONObject imageJson = new JSONObject();
							imageJson.put("id", image.getImageid());
							imageJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
									+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + image.getFilepath());
							imageJson.put("file", image.getFilename());
							imageJson.put("size", image.getSize());
							imageHash.put(image.getImageid(), imageJson);
							imageJsonArray.put(imageJson);
						}
					}
				}
			} else if (objtype.equals(Bundledtl.ObjType_Text)) {
				Text text = bundledtl.getText();
				if (text != null) {
					playlistJsonArray.put(new JSONObject().put("type", "text").put("id", text.getTextid()));
					if (textHash.get(text.getTextid()) == null) {
						JSONObject textJson = new JSONObject();
						textJson.put("id", text.getTextid());
						textJson.put("text", text.getText());
						textHash.put(text.getTextid(), textJson);
						textJsonArray.put(textJson);
					}
				}
			} else if (objtype.equals(Bundledtl.ObjType_Stream)) {
				Stream stream = bundledtl.getStream();
				if (stream != null) {
					playlistJsonArray.put(new JSONObject().put("type", "stream").put("id", stream.getStreamid()));
					if (streamHash.get(stream.getStreamid()) == null) {
						JSONObject streamJson = new JSONObject();
						streamJson.put("id", stream.getStreamid());
						streamJson.put("url", stream.getUrl());
						streamHash.put(stream.getStreamid(), streamJson);
						streamJsonArray.put(streamJson);
					}
				}
			} else if (objtype.equals(Bundledtl.ObjType_Dvb)) {
				Dvb dvb = bundledtl.getDvb();
				if (dvb != null) {
					playlistJsonArray.put(new JSONObject().put("type", "dvb").put("id", dvb.getDvbid()));
					if (dvbHash.get(dvb.getDvbid()) == null) {
						JSONObject dvbJson = new JSONObject();
						dvbJson.put("id", dvb.getDvbid());
						dvbJson.put("frequency", dvb.getFrequency());
						dvbHash.put(dvb.getDvbid(), dvbJson);
						dvbJsonArray.put(dvbJson);
					}
				}
			} else if (objtype.equals(Bundledtl.ObjType_Widget)) {
				Widget widget = bundledtl.getWidget();
				if (widget != null) {
					playlistJsonArray.put(new JSONObject().put("type", "widget").put("id", widget.getWidgetid()));
					if (widgetHash.get(widget.getWidgetid()) == null) {
						JSONObject widgetJson = new JSONObject();
						widgetJson.put("id", widget.getWidgetid());
						widgetJson.put("url", widget.getUrl());
						widgetHash.put(widget.getWidgetid(), widgetJson);
						widgetJsonArray.put(widgetJson);
					}
				}
			}
		}

		return responseJson;
	}

	public void syncBundleLayoutByLayout(String layoutid) throws Exception {
		List<HashMap<String, Object>> bindList = layoutscheduleMapper.selectBindListByLayout(layoutid);
		for (HashMap<String, Object> bindObj : bindList) {
			this.syncBundleLayout(bindObj.get("bindtype").toString(), bindObj.get("bindid").toString());
		}
	}

	/////////////////////////////////////////////////////////////////////////////////
	@Transactional
	public void syncLayoutschedule1(String bindtype, String bindid) throws Exception {
		Msgevent msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Layout_Schedule);
		msgevent.setObjtype1(bindtype);
		msgevent.setObjid1(Integer.parseInt(bindid));
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Layout_Schedule, bindtype, bindid, null, null, null);
		msgeventMapper.insertSelective(msgevent);

		JSONObject msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "LAYOUT");
		JSONObject msgBodyJson = generateLayoutScheduleJson1(msgevent.getObjtype1(), "" + msgevent.getObjid1());
		msgJson.put("msg_body", msgBodyJson);

		String topic = "";
		if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_Device)) {
			topic = "device-" + msgevent.getObjid1();
		} else if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_DeviceGroup)) {
			topic = "group-" + msgevent.getObjid1();
		}

		ActiveMQUtil.publish(topic, msgJson.toString());
		msgevent.setStatus(Msgevent.Status_Sent);
		msgevent.setSendtime(Calendar.getInstance().getTime());
		msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}

	public JSONObject generateLayoutScheduleJson1(String bindtype, String bindid) {
		// bindtype: 1-device 2-devicegroup
		if (bindtype.equals("1")) {
			Device device = deviceMapper.selectByPrimaryKey(bindid);
			if (device.getDevicegroup() != null) {
				bindtype = "2";
				bindid = "" + device.getDevicegroupid();
			}
		}

		HashMap<Integer, JSONObject> layoutHash = new HashMap<Integer, JSONObject>();

		JSONObject responseJson = new JSONObject();
		JSONArray layoutJsonArray = new JSONArray();
		responseJson.put("layouts", layoutJsonArray);
		JSONArray scheduleJsonArray = new JSONArray();
		responseJson.put("layout_schedules", scheduleJsonArray);

		List<Layoutschedule> finalscheduleList = new ArrayList<Layoutschedule>();
		List<Layoutschedule> layoutscheduleList = layoutscheduleMapper.selectList(bindtype, bindid, "2", null, null);
		String today = new SimpleDateFormat(CommonConstants.DateFormat_Date).format(Calendar.getInstance().getTime());
		String tomorrow = new SimpleDateFormat(CommonConstants.DateFormat_Date)
				.format(new Date(Calendar.getInstance().getTimeInMillis() + 24 * 3600 * 1000));

		// Add the first schedule from 00:00
		if (layoutscheduleList.size() > 0 && !new SimpleDateFormat(CommonConstants.DateFormat_Time)
				.format(layoutscheduleList.get(0).getStarttime()).equals("00:00:00")) {
			Layoutschedule newschedule = new Layoutschedule();
			newschedule.setLayoutid(layoutscheduleList.get(layoutscheduleList.size() - 1).getLayoutid());
			String s = today + " 00:00:00";
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}
		// Add today schedules
		for (Layoutschedule layoutschedule : layoutscheduleList) {
			Layoutschedule newschedule = new Layoutschedule();
			newschedule.setLayoutid(layoutschedule.getLayoutid());
			String s = today + " "
					+ new SimpleDateFormat(CommonConstants.DateFormat_Time).format(layoutschedule.getStarttime());
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}
		// Add tomorrow schedules
		for (Layoutschedule layoutschedule : layoutscheduleList) {
			Layoutschedule newschedule = new Layoutschedule();
			newschedule.setLayoutid(layoutschedule.getLayoutid());
			String s = tomorrow + " "
					+ new SimpleDateFormat(CommonConstants.DateFormat_Time).format(layoutschedule.getStarttime());
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}

		// generate final json
		for (Layoutschedule layoutschedule : finalscheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJson.put("layout_id", layoutschedule.getLayoutid());
			scheduleJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Full).format(layoutschedule.getTempstarttime()));
			scheduleJson.put("start_time_seconds", (long) (layoutschedule.getTempstarttime().getTime() / 1000));
			scheduleJsonArray.put(scheduleJson);

			if (layoutHash.get(layoutschedule.getLayoutid()) == null) {
				Layout layout = layoutMapper.selectByPrimaryKey("" + layoutschedule.getLayoutid());
				JSONObject layoutJson = new JSONObject();
				layoutJsonArray.put(layoutJson);

				layoutHash.put(layout.getLayoutid(), layoutJson);

				layoutJson.put("layout_id", layout.getLayoutid());
				layoutJson.put("width", layout.getWidth());
				layoutJson.put("height", layout.getHeight());
				layoutJson.put("bg_color", "#000000");
				JSONObject layoutBgImageJson = new JSONObject();
				layoutJson.put("bg_image", layoutBgImageJson);
				if (layout.getBgimage() != null) {
					layoutBgImageJson.put("id", layout.getBgimageid());
					layoutBgImageJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
							+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + layout.getBgimage().getFilepath());
					layoutBgImageJson.put("file", layout.getBgimage().getFilename());
					layoutBgImageJson.put("size", layout.getBgimage().getSize());
				} else {
					layoutBgImageJson.put("id", 0);
					layoutBgImageJson.put("url", "");
					layoutBgImageJson.put("file", "");
					layoutBgImageJson.put("size", 0);
				}

				JSONArray regionJsonArray = new JSONArray();
				layoutJson.put("regions", regionJsonArray);
				for (Layoutdtl layoutdtl : layout.getLayoutdtls()) {
					JSONObject regionJson = new JSONObject();
					regionJsonArray.put(regionJson);
					regionJson.put("region_id", layoutdtl.getRegionid());
					regionJson.put("width", layoutdtl.getWidth());
					regionJson.put("height", layoutdtl.getHeight());
					regionJson.put("top", layoutdtl.getTopoffset());
					regionJson.put("left", layoutdtl.getLeftoffset());
					regionJson.put("zindex", layoutdtl.getZindex());
					String opacity = Integer.toHexString(layoutdtl.getOpacity());
					if (opacity.length() == 1) {
						opacity = "0" + opacity;
					}
					regionJson.put("bgcolor", "#" + opacity + layoutdtl.getBgcolor().substring(1));
					regionJson.put("type", layoutdtl.getRegion().getType());
					regionJson.put("interval", layoutdtl.getIntervaltime());
					regionJson.put("fit_flag", Integer.parseInt(layoutdtl.getFitflag()));
					if (layoutdtl.getDirection().equals("1")) {
						regionJson.put("direction", "none");
					} else if (layoutdtl.getDirection().equals("2")) {
						regionJson.put("direction", "up");
					} else if (layoutdtl.getDirection().equals("3")) {
						regionJson.put("direction", "down");
					} else if (layoutdtl.getDirection().equals("4")) {
						regionJson.put("direction", "left");
					} else if (layoutdtl.getDirection().equals("5")) {
						regionJson.put("direction", "right");
					}
					regionJson.put("speed", "" + layoutdtl.getSpeed());
					regionJson.put("color", "" + layoutdtl.getColor());
					regionJson.put("size", layoutdtl.getSize());
					if (layoutdtl.getDateformat() == null) {
						regionJson.put("date_format", "yyyy-MM-dd");
					} else {
						regionJson.put("date_format", layoutdtl.getDateformat());
					}
					regionJson.put("volume", layoutdtl.getVolume());

					JSONObject regionBgImageJson = new JSONObject();
					regionJson.put("bg_image", regionBgImageJson);
					if (layoutdtl.getBgimage() != null) {
						regionBgImageJson.put("id", layoutdtl.getBgimageid());
						regionBgImageJson.put("url",
								"http://" + CommonConfig.CONFIG_SERVER_IP + ":" + CommonConfig.CONFIG_SERVER_PORT
										+ "/pixsigdata" + layoutdtl.getBgimage().getFilepath());
						regionBgImageJson.put("file", layoutdtl.getBgimage().getFilename());
						regionBgImageJson.put("size", layoutdtl.getBgimage().getSize());
					} else {
						regionBgImageJson.put("id", 0);
						regionBgImageJson.put("url", "");
						regionBgImageJson.put("file", "");
						regionBgImageJson.put("size", 0);
					}
				}
			}
		}

		return responseJson;
	}

	@Transactional
	public void syncRegionschedule1(String bindtype, String bindid) throws Exception {
		List<Region> regionList = regionMapper.selectActiveList();
		for (Region region : regionList) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Region_Schedule);
			msgevent.setObjtype1(bindtype);
			msgevent.setObjid1(Integer.parseInt(bindid));
			msgevent.setObjtype2(Msgevent.ObjType_2_Region);
			msgevent.setObjid2(region.getRegionid());
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Region_Schedule, bindtype, bindid, Msgevent.ObjType_2_Region,
					"" + region.getRegionid(), null);
			msgeventMapper.insertSelective(msgevent);

			JSONObject msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "REGION");
			JSONObject msgBodyJson = generateRegionScheduleJson1(msgevent.getObjtype1(), "" + msgevent.getObjid1(),
					"" + msgevent.getObjid2());
			msgJson.put("msg_body", msgBodyJson);

			String topic = "";
			if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_Device)) {
				topic = "device-" + msgevent.getObjid1();
			} else if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_DeviceGroup)) {
				topic = "group-" + msgevent.getObjid1();
			}

			ActiveMQUtil.publish(topic, msgJson.toString());
			msgevent.setStatus(Msgevent.Status_Sent);
			msgevent.setSendtime(Calendar.getInstance().getTime());
			msgeventMapper.updateByPrimaryKeySelective(msgevent);
		}
	}

	public JSONObject generateRegionScheduleJson1(String bindtype, String bindid, String regionid) {
		// bindtype: 1-device 2-devicegroup
		if (bindtype.equals("1")) {
			Device device = deviceMapper.selectByPrimaryKey(bindid);
			if (device.getDevicegroup() != null) {
				bindtype = "2";
				bindid = "" + device.getDevicegroupid();
			}
		}

		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> imageHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> textHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> streamHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> dvbHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> widgetHash = new HashMap<Integer, JSONObject>();

		JSONObject responseJson = new JSONObject();
		responseJson.put("region_id", regionid);
		JSONArray videoJsonArray = new JSONArray();
		responseJson.put("videos", videoJsonArray);
		JSONArray imageJsonArray = new JSONArray();
		responseJson.put("images", imageJsonArray);
		JSONArray textJsonArray = new JSONArray();
		responseJson.put("texts", textJsonArray);
		JSONArray streamJsonArray = new JSONArray();
		responseJson.put("streams", streamJsonArray);
		JSONArray dvbJsonArray = new JSONArray();
		responseJson.put("dvbs", dvbJsonArray);
		JSONArray widgetJsonArray = new JSONArray();
		responseJson.put("widgets", widgetJsonArray);
		JSONArray scheduleJsonArray = new JSONArray();
		responseJson.put("schedules", scheduleJsonArray);

		List<Regionschedule> finalscheduleList = new ArrayList<Regionschedule>();
		String today = new SimpleDateFormat(CommonConstants.DateFormat_Date).format(Calendar.getInstance().getTime());
		String tomorrow = new SimpleDateFormat(CommonConstants.DateFormat_Date)
				.format(new Date(Calendar.getInstance().getTimeInMillis() + 24 * 3600 * 1000));
		List<Regionschedule> regionscheduleList1 = regionscheduleMapper.selectList(bindtype, bindid, regionid, "2",
				null, null);
		List<Regionschedule> regionscheduleList2 = regionscheduleMapper.selectList(bindtype, bindid, regionid, "1",
				today, tomorrow);

		// Add the first schedule from 00:00
		if (regionscheduleList1.size() > 0 && !new SimpleDateFormat(CommonConstants.DateFormat_Time)
				.format(regionscheduleList1.get(0).getStarttime()).equals("00:00:00")) {
			Regionschedule newschedule = new Regionschedule();
			newschedule.setObjtype(regionscheduleList1.get(regionscheduleList1.size() - 1).getObjtype());
			newschedule.setObjid(regionscheduleList1.get(regionscheduleList1.size() - 1).getObjid());
			String s = today + " 00:00:00";
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}
		// Add today schedules
		for (Regionschedule regionschedule : regionscheduleList1) {
			Regionschedule newschedule = new Regionschedule();
			newschedule.setObjtype(regionschedule.getObjtype());
			newschedule.setObjid(regionschedule.getObjid());
			String s = today + " "
					+ new SimpleDateFormat(CommonConstants.DateFormat_Time).format(regionschedule.getStarttime());
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}
		// Add tomorrow schedules
		for (Regionschedule regionschedule : regionscheduleList1) {
			Regionschedule newschedule = new Regionschedule();
			newschedule.setObjtype(regionschedule.getObjtype());
			newschedule.setObjid(regionschedule.getObjid());
			String s = tomorrow + " "
					+ new SimpleDateFormat(CommonConstants.DateFormat_Time).format(regionschedule.getStarttime());
			newschedule.setTempstarttime(CommonUtil.parseDate(s, CommonConstants.DateFormat_Full));
			finalscheduleList.add(newschedule);
		}

		// merge
		for (Regionschedule regionschedule : regionscheduleList2) {
			String s = new SimpleDateFormat(CommonConstants.DateFormat_Date).format(regionschedule.getPlaydate()) + " "
					+ new SimpleDateFormat(CommonConstants.DateFormat_Time).format(regionschedule.getStarttime());
			Date starttime = CommonUtil.parseDate(s, CommonConstants.DateFormat_Full);
			s = new SimpleDateFormat(CommonConstants.DateFormat_Date).format(regionschedule.getPlaydate()) + " "
					+ new SimpleDateFormat(CommonConstants.DateFormat_Time).format(regionschedule.getEndtime());
			Date endtime = CommonUtil.parseDate(s, CommonConstants.DateFormat_Full);
			Regionschedule newschedule = new Regionschedule();
			newschedule.setObjtype(regionschedule.getObjtype());
			newschedule.setObjid(regionschedule.getObjid());
			newschedule.setTempstarttime(starttime);

			Iterator<Regionschedule> it = finalscheduleList.iterator();
			Regionschedule lastClosedSchedule = null;
			Regionschedule lastRemoveSchedule = null;
			int index = 0;
			while (it.hasNext()) {
				Regionschedule temp = it.next();
				if (temp.getTempstarttime().before(starttime)) {
					lastClosedSchedule = temp;
					index++;
				}
				if (temp.getTempstarttime().equals(starttime) || temp.getTempstarttime().equals(endtime)
						|| temp.getTempstarttime().after(starttime) && temp.getTempstarttime().before(endtime)) {
					lastRemoveSchedule = temp;
					it.remove();
				}
			}
			if (lastRemoveSchedule != null) {
				lastRemoveSchedule.setTempstarttime(endtime);
				finalscheduleList.add(index, newschedule);
				finalscheduleList.add(index + 1, lastRemoveSchedule);
			} else if (lastClosedSchedule != null) {
				lastRemoveSchedule = new Regionschedule();
				lastRemoveSchedule.setObjtype(lastClosedSchedule.getObjtype());
				lastRemoveSchedule.setObjid(lastClosedSchedule.getObjid());
				lastRemoveSchedule.setTempstarttime(endtime);
				finalscheduleList.add(index, newschedule);
				finalscheduleList.add(index + 1, lastRemoveSchedule);
			} else {
				finalscheduleList.add(index, newschedule);
			}
		}

		// generate final json
		for (Regionschedule regionschedule : finalscheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Full).format(regionschedule.getTempstarttime()));
			scheduleJson.put("start_time_seconds", (long) (regionschedule.getTempstarttime().getTime() / 1000));
			if (regionschedule.getObjtype().equals("1")) {
				scheduleJson.put("type", "list");
			} else if (regionschedule.getObjtype().equals("2")) {
				scheduleJson.put("type", "text");
			} else if (regionschedule.getObjtype().equals("3")) {
				scheduleJson.put("type", "stream");
			} else if (regionschedule.getObjtype().equals("4")) {
				scheduleJson.put("type", "dvb");
			} else if (regionschedule.getObjtype().equals("5")) {
				scheduleJson.put("type", "widget");
			}
			JSONArray playlistJsonArray = new JSONArray();
			scheduleJson.put("playlist", playlistJsonArray);
			scheduleJsonArray.put(scheduleJson);

			String objtype = regionschedule.getObjtype();
			String objid = "" + regionschedule.getObjid();
			if (objtype.equals("1")) {
				List<Medialistdtl> medialistdtls = medialistdtlMapper.selectList(objid);
				for (Medialistdtl medialistdtl : medialistdtls) {
					if (medialistdtl.getVideo() != null) {
						Video video = medialistdtl.getVideo();
						playlistJsonArray.put(new JSONObject().put("type", "video").put("id", video.getVideoid()));
						if (videoHash.get(medialistdtl.getObjid()) == null) {
							JSONObject videoJson = new JSONObject();
							videoJson.put("id", video.getVideoid());
							videoJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
									+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + video.getFilepath());
							videoJson.put("file", video.getFilename());
							videoJson.put("size", video.getSize());
							videoHash.put(video.getVideoid(), videoJson);
							videoJsonArray.put(videoJson);
						}
					} else if (medialistdtl.getImage() != null) {
						Image image = medialistdtl.getImage();
						playlistJsonArray.put(new JSONObject().put("type", "image").put("id", image.getImageid()));
						if (imageHash.get(medialistdtl.getObjid()) == null) {
							JSONObject imageJson = new JSONObject();
							imageJson.put("id", image.getImageid());
							imageJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
									+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + image.getFilepath());
							imageJson.put("file", image.getFilename());
							imageJson.put("size", image.getSize());
							imageHash.put(image.getImageid(), imageJson);
							imageJsonArray.put(imageJson);
						}
					}
				}
			} else if (objtype.equals("2")) {
				Text text = textMapper.selectByPrimaryKey(objid);
				if (text != null) {
					playlistJsonArray.put(new JSONObject().put("type", "text").put("id", text.getTextid()));
					if (textHash.get(text.getTextid()) == null) {
						JSONObject textJson = new JSONObject();
						textJson.put("id", text.getTextid());
						textJson.put("text", text.getText());
						textHash.put(text.getTextid(), textJson);
						textJsonArray.put(textJson);
					}
				}
			} else if (objtype.equals("3")) {
				Stream stream = streamMapper.selectByPrimaryKey(objid);
				if (stream != null) {
					playlistJsonArray.put(new JSONObject().put("type", "stream").put("id", stream.getStreamid()));
					if (streamHash.get(stream.getStreamid()) == null) {
						JSONObject streamJson = new JSONObject();
						streamJson.put("id", stream.getStreamid());
						streamJson.put("url", stream.getUrl());
						streamHash.put(stream.getStreamid(), streamJson);
						streamJsonArray.put(streamJson);
					}
				}
			} else if (objtype.equals("4")) {
				Dvb dvb = dvbMapper.selectByPrimaryKey(objid);
				if (dvb != null) {
					playlistJsonArray.put(new JSONObject().put("type", "dvb").put("id", dvb.getDvbid()));
					if (dvbHash.get(dvb.getDvbid()) == null) {
						JSONObject dvbJson = new JSONObject();
						dvbJson.put("id", dvb.getDvbid());
						dvbJson.put("frequency", dvb.getFrequency());
						dvbHash.put(dvb.getDvbid(), dvbJson);
						dvbJsonArray.put(dvbJson);
					}
				}
			} else if (objtype.equals("5")) {
				Widget widget = widgetMapper.selectByPrimaryKey(objid);
				if (widget != null) {
					playlistJsonArray.put(new JSONObject().put("type", "widget").put("id", widget.getWidgetid()));
					if (widgetHash.get(widget.getWidgetid()) == null) {
						JSONObject widgetJson = new JSONObject();
						widgetJson.put("id", widget.getWidgetid());
						widgetJson.put("url", widget.getUrl());
						widgetHash.put(widget.getWidgetid(), widgetJson);
						widgetJsonArray.put(widgetJson);
					}
				}
			}
		}

		return responseJson;
	}

	public void syncLayoutscheduleByLayout1(String layoutid) throws Exception {
		List<HashMap<String, Object>> bindList = layoutscheduleMapper.selectBindListByLayout(layoutid);
		for (HashMap<String, Object> bindObj : bindList) {
			syncLayoutschedule1(bindObj.get("bindtype").toString(), bindObj.get("bindid").toString());
		}
	}
}