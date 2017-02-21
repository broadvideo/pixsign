package com.broadvideo.pixsignage.service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Audio;
import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Bundledtl;
import com.broadvideo.pixsignage.domain.Bundleschedule;
import com.broadvideo.pixsignage.domain.Bundlescheduledtl;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Dvb;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Layout;
import com.broadvideo.pixsignage.domain.Layoutdtl;
import com.broadvideo.pixsignage.domain.Medialist;
import com.broadvideo.pixsignage.domain.Medialistdtl;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Rss;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.domain.Stream;
import com.broadvideo.pixsignage.domain.Text;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.domain.Widget;
import com.broadvideo.pixsignage.persistence.BundleMapper;
import com.broadvideo.pixsignage.persistence.BundledtlMapper;
import com.broadvideo.pixsignage.persistence.BundlescheduleMapper;
import com.broadvideo.pixsignage.persistence.BundlescheduledtlMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.LayoutMapper;
import com.broadvideo.pixsignage.persistence.LayoutdtlMapper;
import com.broadvideo.pixsignage.persistence.MedialistMapper;
import com.broadvideo.pixsignage.persistence.MedialistdtlMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.RssMapper;
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
	private BundlescheduledtlMapper bundlescheduledtlMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private MedialistMapper medialistMapper;
	@Autowired
	private MedialistdtlMapper medialistdtlMapper;
	@Autowired
	private TextMapper textMapper;
	@Autowired
	private StreamMapper streamMapper;
	@Autowired
	private WidgetMapper widgetMapper;
	@Autowired
	private RssMapper rssMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private ConfigMapper configMapper;

	@Autowired
	private MedialistService medialistService;
	@Autowired
	private TextService textService;
	@Autowired
	private StreamService streamService;
	@Autowired
	private WidgetService widgetService;
	@Autowired
	private RssService rssService;
	@Autowired
	private LayoutService layoutService;
	@Autowired
	private DevicefileService devicefileService;

	public int selectCount(String orgid, String branchid, String reviewflag, String touchflag, String homeflag,
			String search) {
		return bundleMapper.selectCount(orgid, branchid, reviewflag, touchflag, homeflag, search);
	}

	public List<Bundle> selectList(String orgid, String branchid, String reviewflag, String touchflag, String homeflag,
			String search, String start, String length) {
		return bundleMapper.selectList(orgid, branchid, reviewflag, touchflag, homeflag, search, start, length);
	}

	@Transactional
	public void addBundle(Bundle bundle) {
		if (bundle.getName() == null || bundle.getName().equals("")) {
			bundle.setName("UNKNOWN");
		}
		Layout layout = layoutMapper.selectByPrimaryKey("" + bundle.getLayoutid());
		List<Layoutdtl> layoutdtls = layout.getLayoutdtls();
		bundle.setHeight(layout.getHeight());
		bundle.setWidth(layout.getWidth());
		bundleMapper.insertSelective(bundle);
		if (bundle.getName().equals("UNKNOWN")) {
			bundle.setName("BUNDLE-" + bundle.getBundleid());
		}
		bundleMapper.updateByPrimaryKeySelective(bundle);
		for (Layoutdtl layoutdtl : layoutdtls) {
			Bundledtl bundledtl = new Bundledtl();
			bundledtl.setBundleid(bundle.getBundleid());
			if (bundle.getHomeflag().equals("0")) {
				bundledtl.setHomebundleid(bundle.getHomebundleid());
			} else {
				bundledtl.setHomebundleid(bundle.getBundleid());
			}
			bundledtl.setLayoutdtlid(layoutdtl.getLayoutdtlid());
			bundledtl.setType(Bundledtl.Type_Private);
			if (layoutdtl.getType().equals(Layoutdtl.Type_PLAY)) {
				Medialist medialist = new Medialist();
				medialist.setOrgid(bundle.getOrgid());
				medialist.setBranchid(bundle.getBranchid());
				medialist.setName(bundle.getName() + "-" + layoutdtl.getLayoutdtlid());
				medialist.setType(Medialist.Type_Private);
				medialist.setCreatestaffid(bundle.getCreatestaffid());
				medialistMapper.insertSelective(medialist);
				bundledtl.setObjtype(Bundledtl.ObjType_Medialist);
				bundledtl.setObjid(medialist.getMedialistid());
			} else if (layoutdtl.getType().equals(Layoutdtl.Type_TEXT)) {
				Text text = new Text();
				text.setOrgid(bundle.getOrgid());
				text.setBranchid(bundle.getBranchid());
				text.setName(bundle.getName() + "-" + layoutdtl.getLayoutdtlid());
				text.setType(Medialist.Type_Private);
				text.setCreatestaffid(bundle.getCreatestaffid());
				textMapper.insertSelective(text);
				bundledtl.setObjtype(Bundledtl.ObjType_Text);
				bundledtl.setObjid(text.getTextid());
			} else if (layoutdtl.getType().equals(Layoutdtl.Type_STREAM)) {
				Medialist medialist = new Medialist();
				medialist.setOrgid(bundle.getOrgid());
				medialist.setBranchid(bundle.getBranchid());
				medialist.setName(bundle.getName() + "-" + layoutdtl.getLayoutdtlid());
				medialist.setType(Medialist.Type_Private);
				medialist.setCreatestaffid(bundle.getCreatestaffid());
				medialistMapper.insertSelective(medialist);
				bundledtl.setObjtype(Bundledtl.ObjType_Medialist);
				bundledtl.setObjid(medialist.getMedialistid());
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
	public void design(Bundle bundle) throws Exception {
		for (Bundledtl bundledtl : bundle.getBundledtls()) {
			Bundledtl oldBundledtl = bundledtlMapper.selectByLayoutdtl("" + bundle.getBundleid(),
					"" + bundledtl.getLayoutdtlid());
			bundledtl.setBundleid(bundle.getBundleid());
			if (bundle.getHomeflag().equals("0")) {
				bundledtl.setHomebundleid(bundle.getHomebundleid());
			} else {
				bundledtl.setHomebundleid(bundle.getBundleid());
			}
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
				} else if (oldBundledtl.getObjtype().equals(Bundledtl.ObjType_Rss)) {
					rssService.deleteRss("" + oldBundledtl.getObjid());
				}
			}
			if (bundledtl.getType().equals(Bundledtl.Type_Private)) {
				if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Medialist)) {
					Medialist medialist = bundledtl.getMedialist();
					Medialist oldMedialist = medialistMapper.selectByPrimaryKey("" + bundledtl.getObjid());
					List<Medialistdtl> oldmedialistdtls;
					if (oldMedialist == null) {
						medialist.setOrgid(bundle.getOrgid());
						medialist.setBranchid(bundle.getBranchid());
						medialist.setName(bundle.getName() + "-" + bundledtl.getLayoutdtlid());
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
						text.setBranchid(bundle.getBranchid());
						text.setName(bundle.getName() + "-" + bundledtl.getLayoutdtlid());
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
						stream.setBranchid(bundle.getBranchid());
						stream.setName(bundle.getName() + "-" + bundledtl.getLayoutdtlid());
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
						widget.setBranchid(bundle.getBranchid());
						widget.setName(bundle.getName() + "-" + bundledtl.getLayoutdtlid());
						widget.setType(Medialist.Type_Private);
						widget.setCreatestaffid(bundle.getCreatestaffid());
						widgetMapper.insertSelective(widget);
					} else {
						widget.setWidgetid(bundledtl.getObjid());
						widgetMapper.updateByPrimaryKeySelective(widget);
					}
					bundledtl.setObjid(widget.getWidgetid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Rss)) {
					Rss rss = bundledtl.getRss();
					Rss oldRss = rssMapper.selectByPrimaryKey("" + bundledtl.getObjid());
					if (oldRss == null) {
						rss.setOrgid(bundle.getOrgid());
						rss.setBranchid(bundle.getBranchid());
						rss.setName(bundle.getName() + "-" + bundledtl.getLayoutdtlid());
						rss.setType(Medialist.Type_Private);
						rss.setCreatestaffid(bundle.getCreatestaffid());
						rssMapper.insertSelective(rss);
					} else {
						rss.setRssid(bundledtl.getObjid());
						rssMapper.updateByPrimaryKeySelective(rss);
					}
					bundledtl.setObjid(rss.getRssid());
				}
			}

			if (bundledtl.getBundledtlid() <= 0) {
				bundledtlMapper.insertSelective(bundledtl);
			} else {
				bundledtlMapper.updateByPrimaryKeySelective(bundledtl);
			}
		}

		List<HashMap<String, Object>> bindList = bundlescheduleMapper.selectBindListByBundle("" + bundle.getBundleid());
		if (bundle.getHomeflag().equals("0")) {
			bindList = bundlescheduleMapper.selectBindListByBundle("" + bundle.getHomebundleid());
		}
		for (HashMap<String, Object> bindObj : bindList) {
			devicefileService.refreshDevicefiles(bindObj.get("bindtype").toString(), bindObj.get("bindid").toString());
		}

		String snapshotdtl = bundle.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
		}
		String snapshotFilePath = "/bundle/" + bundle.getBundleid() + "/snapshot/" + bundle.getBundleid() + ".png";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		bundle.setSnapshot(snapshotFilePath);
		bundleMapper.updateByPrimaryKeySelective(bundle);
	}

	@Transactional
	public void push(Bundle bundle, Device[] devices, Devicegroup[] devicegroups) throws Exception {
		// Handle device bundleschedule
		for (int i = 0; i < devices.length; i++) {
			Device device = devices[i];

			bundlescheduledtlMapper.deleteByDtl(Bundleschedule.BindType_Device, "" + device.getDeviceid(), null, null,
					null);
			bundlescheduleMapper.deleteByDtl(Bundleschedule.BindType_Device, "" + device.getDeviceid(), null, null,
					null);
			Bundleschedule bundleschedule = new Bundleschedule();
			bundleschedule.setBindtype(Bundleschedule.BindType_Device);
			bundleschedule.setBindid(device.getDeviceid());
			bundleschedule.setBundleid(bundle.getBundleid());
			bundleschedule.setPlaymode(Bundleschedule.PlayMode_Daily);
			bundleschedule.setStarttime(CommonUtil.parseDate("00:00:00", CommonConstants.DateFormat_Time));
			bundlescheduleMapper.insertSelective(bundleschedule);

			Bundlescheduledtl bundlescheduledtl = new Bundlescheduledtl();
			bundlescheduledtl.setBundlescheduleid(bundleschedule.getBundlescheduleid());
			bundlescheduledtl.setBundleid(bundle.getBundleid());
			bundlescheduledtl.setSequence(1);
			bundlescheduledtlMapper.insertSelective(bundlescheduledtl);

			devicefileService.refreshDevicefiles(Bundleschedule.BindType_Device, "" + device.getDeviceid());
		}

		// Handle devicegroup bundleschedule
		for (int i = 0; i < devicegroups.length; i++) {
			Devicegroup devicegroup = devicegroups[i];

			bundlescheduledtlMapper.deleteByDtl(Bundleschedule.BindType_DeviceGroup,
					"" + devicegroup.getDevicegroupid(), null, null, null);
			bundlescheduleMapper.deleteByDtl(Bundleschedule.BindType_DeviceGroup, "" + devicegroup.getDevicegroupid(),
					null, null, null);
			Bundleschedule bundleschedule = new Bundleschedule();
			bundleschedule.setBindtype(Bundleschedule.BindType_DeviceGroup);
			bundleschedule.setBindid(devicegroup.getDevicegroupid());
			bundleschedule.setBundleid(bundle.getBundleid());
			bundleschedule.setPlaymode(Bundleschedule.PlayMode_Daily);
			bundleschedule.setStarttime(CommonUtil.parseDate("00:00:00", CommonConstants.DateFormat_Time));
			bundlescheduleMapper.insertSelective(bundleschedule);

			Bundlescheduledtl bundlescheduledtl = new Bundlescheduledtl();
			bundlescheduledtl.setBundlescheduleid(bundleschedule.getBundlescheduleid());
			bundlescheduledtl.setBundleid(bundle.getBundleid());
			bundlescheduledtl.setSequence(1);
			bundlescheduledtlMapper.insertSelective(bundlescheduledtl);

			devicefileService.refreshDevicefiles(Bundleschedule.BindType_DeviceGroup,
					"" + devicegroup.getDevicegroupid());
		}

		// Handle sync
		for (int i = 0; i < devices.length; i++) {
			syncBundleSchedule("1", "" + devices[i].getDeviceid());
		}
		for (int i = 0; i < devicegroups.length; i++) {
			syncBundleSchedule("2", "" + devicegroups[i].getDevicegroupid());
		}
	}

	@Transactional
	public void handleWizard(Staff staff, Bundle bundle, Device[] devices, Devicegroup[] devicegroups)
			throws Exception {
		if (bundle.getName() == null || bundle.getName().equals("")) {
			bundle.setName("UNKNOWN");
		}
		Layout layout = bundle.getLayout();
		List<Bundledtl> bundledtls = bundle.getBundledtls();

		// Handle layout design
		layoutMapper.updateByPrimaryKeySelective(layout);
		int layoutid = layout.getLayoutid();
		List<Layoutdtl> oldlayoutdtls = layoutdtlMapper.selectList("" + layoutid);
		HashMap<Integer, Layoutdtl> hash = new HashMap<Integer, Layoutdtl>();
		for (Layoutdtl layoutdtl : layout.getLayoutdtls()) {
			if (layoutdtl.getLayoutdtlid() <= 0) {
				int oldlayoutdtlid = layoutdtl.getLayoutdtlid();
				layoutdtl.setLayoutid(layoutid);
				layoutService.addLayoutdtl(layoutdtl);
				// Refresh bundledtl.layoutdtlid
				for (Bundledtl bundledtl : bundledtls) {
					if (bundledtl.getLayoutdtlid() == oldlayoutdtlid) {
						bundledtl.setLayoutdtlid(layoutdtl.getLayoutdtlid());
					}
				}
			} else {
				layoutdtlMapper.updateByPrimaryKeySelective(layoutdtl);
				hash.put(layoutdtl.getLayoutdtlid(), layoutdtl);
			}
		}
		for (int i = 0; i < oldlayoutdtls.size(); i++) {
			if (hash.get(oldlayoutdtls.get(i).getLayoutdtlid()) == null) {
				layoutService.deleteLayoutdtl("" + oldlayoutdtls.get(i).getLayoutdtlid());
			}
		}

		// Handle bundle
		bundle.setHeight(layout.getHeight());
		bundle.setWidth(layout.getWidth());
		bundleMapper.insertSelective(bundle);
		if (bundle.getName().equals("UNKNOWN")) {
			bundle.setName("BUNDLE-" + bundle.getBundleid());
		}
		for (Bundledtl bundledtl : bundledtls) {
			bundledtl.setBundleid(bundle.getBundleid());
			if (bundle.getHomeflag().equals("0")) {
				bundledtl.setHomebundleid(bundle.getHomebundleid());
			} else {
				bundledtl.setHomebundleid(bundle.getBundleid());
			}
			if (bundledtl.getType().equals(Bundledtl.Type_Private)) {
				if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Medialist)) {
					Medialist medialist = bundledtl.getMedialist();
					medialist.setOrgid(bundle.getOrgid());
					medialist.setBranchid(bundle.getBranchid());
					medialist.setName(bundle.getName() + "-" + bundledtl.getLayoutdtlid());
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
					text.setBranchid(bundle.getBranchid());
					text.setName(bundle.getName() + "-" + bundledtl.getLayoutdtlid());
					text.setType(Medialist.Type_Private);
					text.setCreatestaffid(staff.getStaffid());
					textMapper.insertSelective(text);
					bundledtl.setObjid(text.getTextid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Stream)) {
					Stream stream = bundledtl.getStream();
					stream.setOrgid(bundle.getOrgid());
					stream.setBranchid(bundle.getBranchid());
					stream.setName(bundle.getName() + "-" + bundledtl.getLayoutdtlid());
					stream.setType(Medialist.Type_Private);
					stream.setCreatestaffid(staff.getStaffid());
					streamMapper.insertSelective(stream);
					bundledtl.setObjid(stream.getStreamid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Widget)) {
					Widget widget = bundledtl.getWidget();
					widget.setOrgid(bundle.getOrgid());
					widget.setBranchid(bundle.getBranchid());
					widget.setName(bundle.getName() + "-" + bundledtl.getLayoutdtlid());
					widget.setType(Medialist.Type_Private);
					widget.setCreatestaffid(staff.getStaffid());
					widgetMapper.insertSelective(widget);
					bundledtl.setObjid(widget.getWidgetid());
				} else if (bundledtl.getObjtype().equals(Bundledtl.ObjType_Rss)) {
					Rss rss = bundledtl.getRss();
					rss.setOrgid(bundle.getOrgid());
					rss.setBranchid(bundle.getBranchid());
					rss.setName(bundle.getName() + "-" + bundledtl.getLayoutdtlid());
					rss.setType(Medialist.Type_Private);
					rss.setCreatestaffid(staff.getStaffid());
					rssMapper.insertSelective(rss);
					bundledtl.setObjid(rss.getRssid());
				}
			}
			bundledtlMapper.insertSelective(bundledtl);
		}

		String snapshotdtl = bundle.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
		}
		String snapshotFilePath = "/bundle/" + bundle.getBundleid() + "/snapshot/" + bundle.getBundleid() + ".png";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		bundle.setSnapshot(snapshotFilePath);
		bundleMapper.updateByPrimaryKeySelective(bundle);

		push(bundle, devices, devicegroups);
	}

	@Transactional
	public void addBundleschedules(Bundleschedule[] bundleschedules) {
		if (bundleschedules.length > 0) {
			String bindtype = bundleschedules[0].getBindtype();
			String bindid = "" + bundleschedules[0].getBindid();
			bundlescheduledtlMapper.deleteByDtl(bindtype, bindid, null, null, null);
			bundlescheduleMapper.deleteByDtl(bindtype, bindid, null, null, null);
			for (int i = 0; i < bundleschedules.length; i++) {
				bundlescheduleMapper.insertSelective(bundleschedules[i]);
				List<Bundlescheduledtl> bundlescheduledtls = bundleschedules[i].getBundlescheduledtls();
				for (Bundlescheduledtl bundlescheduledtl : bundlescheduledtls) {
					bundlescheduledtl.setBundlescheduleid(bundleschedules[i].getBundlescheduleid());
					bundlescheduledtlMapper.insertSelective(bundlescheduledtl);
				}
			}
			devicefileService.refreshDevicefiles(bindtype, bindid);
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

	public void syncBundleByLayout(String layoutid) throws Exception {
		List<HashMap<String, Object>> bindList = bundlescheduleMapper.selectBindListByLayout(layoutid);
		for (HashMap<String, Object> bindObj : bindList) {
			this.syncBundleSchedule(bindObj.get("bindtype").toString(), bindObj.get("bindid").toString());
		}
	}

	public void syncBundle(String bundleid) throws Exception {
		List<HashMap<String, Object>> bindList = bundlescheduleMapper.selectBindListByBundle(bundleid);
		for (HashMap<String, Object> bindObj : bindList) {
			syncBundleSchedule(bindObj.get("bindtype").toString(), bindObj.get("bindid").toString());
		}
	}

	public void setBundleReviewWait(String bundleid) {
		Bundle bundle = bundleMapper.selectByPrimaryKey(bundleid);
		if (bundle != null && bundle.getHomebundleid() > 0) {
			bundle = bundleMapper.selectByPrimaryKey("" + bundle.getHomebundleid());
		}
		if (bundle != null) {
			bundle.setReviewflag(Bundle.REVIEW_WAIT);
			if (bundle.getReviewflag().equals(Bundle.REVIEW_PASSED)) {
				JSONObject bundleJson = generateBundleJson("" + bundle.getBundleid());
				bundle.setJson(bundleJson.toString());
			}
			bundleMapper.updateByPrimaryKeySelective(bundle);
			List<Bundle> subbundles = bundle.getSubbundles();
			if (subbundles != null) {
				for (Bundle b : subbundles) {
					b.setReviewflag(Bundle.REVIEW_WAIT);
					if (b.getReviewflag().equals(Bundle.REVIEW_PASSED)) {
						JSONObject bundleJson = generateBundleJson("" + b.getBundleid());
						b.setJson(bundleJson.toString());
					}
					bundleMapper.updateByPrimaryKeySelective(b);
				}
			}
		}
	}

	public void setBundleReviewResut(String bundleid, String reviewflag, String comment) {
		Bundle bundle = bundleMapper.selectByPrimaryKey(bundleid);
		if (bundle != null && bundle.getHomebundleid() > 0) {
			bundle = bundleMapper.selectByPrimaryKey("" + bundle.getHomebundleid());
		}
		if (bundle != null) {
			bundle.setReviewflag(reviewflag);
			bundle.setComment(comment);
			bundleMapper.updateByPrimaryKeySelective(bundle);
			List<Bundle> subbundles = bundle.getSubbundles();
			if (subbundles != null) {
				for (Bundle b : subbundles) {
					b.setReviewflag(reviewflag);
					b.setComment(comment);
					bundleMapper.updateByPrimaryKeySelective(b);
				}
			}
		}
	}

	public JSONObject generateBundleJson(String bundleid) {
		String serverip = configMapper.selectValueByCode("ServerIP");
		String serverport = configMapper.selectValueByCode("ServerPort");
		Bundle bundle = bundleMapper.selectByPrimaryKey(bundleid);

		if (!bundle.getReviewflag().equals(Bundle.REVIEW_PASSED) && bundle.getJson() != null) {
			return new JSONObject(bundle.getJson());
		}

		HashMap<Integer, JSONObject> videoHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> imageHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> textHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> streamHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> dvbHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> widgetHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> rssHash = new HashMap<Integer, JSONObject>();
		HashMap<Integer, JSONObject> audioHash = new HashMap<Integer, JSONObject>();

		JSONObject responseJson = new JSONObject();
		responseJson.put("bundle_id", bundle.getBundleid());
		responseJson.put("name", bundle.getName());
		responseJson.put("thumbnail", "http://" + serverip + ":" + serverport + "/pixsigdata" + bundle.getSnapshot());
		responseJson.put("touch_flag", bundle.getTouchflag());
		responseJson.put("home_flag", bundle.getHomeflag());
		responseJson.put("home_bundle_id", bundle.getHomebundleid());
		responseJson.put("home_idle", bundle.getHomeidletime());

		JSONArray videoJsonArray = new JSONArray();
		responseJson.put("videos", videoJsonArray);
		JSONArray imageJsonArray = new JSONArray();
		responseJson.put("images", imageJsonArray);
		JSONArray textJsonArray = new JSONArray();
		responseJson.put("texts", textJsonArray);
		JSONArray streamJsonArray = new JSONArray();
		responseJson.put("streams", streamJsonArray);
		JSONArray widgetJsonArray = new JSONArray();
		responseJson.put("widgets", widgetJsonArray);
		JSONArray dvbJsonArray = new JSONArray();
		responseJson.put("dvbs", dvbJsonArray);
		JSONArray rssJsonArray = new JSONArray();
		responseJson.put("rsses", rssJsonArray);
		JSONArray audioJsonArray = new JSONArray();
		responseJson.put("audios", audioJsonArray);

		Layout layout = bundle.getLayout();
		responseJson.put("layout_id", layout.getLayoutid());
		responseJson.put("width", layout.getWidth());
		responseJson.put("height", layout.getHeight());
		responseJson.put("bg_color", "#000000");
		JSONObject layoutBgImageJson = new JSONObject();
		responseJson.put("bg_image", layoutBgImageJson);
		if (layout.getBgimage() != null) {
			layoutBgImageJson.put("id", layout.getBgimageid());
			layoutBgImageJson.put("name", layout.getBgimage().getName());
			layoutBgImageJson.put("url",
					"http://" + serverip + ":" + serverport + "/pixsigdata" + layout.getBgimage().getFilepath());
			layoutBgImageJson.put("file", layout.getBgimage().getFilename());
			layoutBgImageJson.put("size", layout.getBgimage().getSize());
			layoutBgImageJson.put("thumbnail",
					"http://" + serverip + ":" + serverport + "/pixsigdata" + layout.getBgimage().getThumbnail());
			if (imageHash.get(layout.getBgimageid()) == null) {
				imageHash.put(layout.getBgimageid(), layoutBgImageJson);
				imageJsonArray.put(layoutBgImageJson);
			}
		} else {
			layoutBgImageJson.put("id", 0);
			layoutBgImageJson.put("name", "");
			layoutBgImageJson.put("url", "");
			layoutBgImageJson.put("file", "");
			layoutBgImageJson.put("size", 0);
			layoutBgImageJson.put("thumbnail", "");
		}

		List<Video> videoList = new ArrayList<Video>();
		JSONArray regionJsonArray = new JSONArray();
		responseJson.put("regions", regionJsonArray);
		for (Bundledtl bundledtl : bundle.getBundledtls()) {
			Layoutdtl layoutdtl = bundledtl.getLayoutdtl();
			JSONObject regionJson = new JSONObject();
			regionJsonArray.put(regionJson);
			if (layoutdtl.getMainflag().equals("1")) {
				regionJson.put("region_id", 1);
			} else {
				regionJson.put("region_id", layoutdtl.getLayoutdtlid());
			}
			regionJson.put("main_flag", layoutdtl.getMainflag());
			regionJson.put("width", layoutdtl.getWidth());
			regionJson.put("height", layoutdtl.getHeight());
			regionJson.put("top", layoutdtl.getTopoffset());
			regionJson.put("left", layoutdtl.getLeftoffset());
			regionJson.put("zindex", layoutdtl.getZindex());
			String opacity = Integer.toHexString(layoutdtl.getOpacity());
			if (opacity.length() == 1) {
				opacity = "0" + opacity;
			}
			regionJson.put("bgcolor", "#" + opacity + layoutdtl.getBgcolor().trim().substring(1));
			regionJson.put("type", layoutdtl.getType());
			regionJson.put("sleep", layoutdtl.getSleeptime());
			regionJson.put("interval", layoutdtl.getIntervaltime());
			regionJson.put("animation", layoutdtl.getAnimation());
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
			regionJson.put("speed", Integer.parseInt(layoutdtl.getSpeed()));
			regionJson.put("color", "" + layoutdtl.getColor());
			regionJson.put("size", layoutdtl.getSize());
			if (layoutdtl.getDateformat() == null) {
				regionJson.put("date_format", "yyyy-MM-dd");
			} else {
				regionJson.put("date_format", layoutdtl.getDateformat());
			}
			regionJson.put("volume", layoutdtl.getVolume());
			regionJson.put("calendar_type", layoutdtl.getCalendartype());

			if (layoutdtl.getType().equals(Layoutdtl.Type_TOUCH)) {
				regionJson.put("touch_label", bundledtl.getTouchlabel());
				regionJson.put("touch_type", bundledtl.getTouchtype());
				regionJson.put("touch_bundle_id", bundledtl.getTouchbundleid());
				regionJson.put("touch_apk", bundledtl.getTouchapk());
			}

			JSONObject regionBgImageJson = new JSONObject();
			regionJson.put("bg_image", regionBgImageJson);
			if (layoutdtl.getBgimage() != null) {
				regionBgImageJson.put("id", layoutdtl.getBgimageid());
				regionBgImageJson.put("name", layoutdtl.getBgimage().getName());
				regionBgImageJson.put("url",
						"http://" + serverip + ":" + serverport + "/pixsigdata" + layoutdtl.getBgimage().getFilepath());
				regionBgImageJson.put("file", layoutdtl.getBgimage().getFilename());
				regionBgImageJson.put("size", layoutdtl.getBgimage().getSize());
				regionBgImageJson.put("thumbnail", "http://" + serverip + ":" + serverport + "/pixsigdata"
						+ layoutdtl.getBgimage().getThumbnail());
				if (imageHash.get(layoutdtl.getBgimageid()) == null) {
					imageHash.put(layoutdtl.getBgimageid(), regionBgImageJson);
					imageJsonArray.put(regionBgImageJson);
				}
			} else {
				regionBgImageJson.put("id", 0);
				regionBgImageJson.put("name", "");
				regionBgImageJson.put("url", "");
				regionBgImageJson.put("file", "");
				regionBgImageJson.put("size", 0);
				regionBgImageJson.put("thumbnail", "");
			}

			JSONArray playlistJsonArray = new JSONArray();
			regionJson.put("playlist", playlistJsonArray);

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
							videoJson.put("name", video.getName());
							videoJson.put("url",
									"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getFilepath());
							videoJson.put("file", video.getFilename());
							videoJson.put("size", video.getSize());
							videoJson.put("thumbnail",
									"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getThumbnail());
							if (video.getRelate() != null) {
								videoJson.put("relate_id", video.getRelateid());
							} else {
								videoJson.put("relate_id", 0);
							}
							videoHash.put(video.getVideoid(), videoJson);
							videoJsonArray.put(videoJson);
							videoList.add(video);
						}
					} else if (medialistdtl.getImage() != null) {
						Image image = medialistdtl.getImage();
						playlistJsonArray.put(new JSONObject().put("type", "image").put("id", image.getImageid()));
						if (imageHash.get(medialistdtl.getObjid()) == null) {
							JSONObject imageJson = new JSONObject();
							imageJson.put("id", image.getImageid());
							imageJson.put("name", image.getName());
							imageJson.put("url",
									"http://" + serverip + ":" + serverport + "/pixsigdata" + image.getFilepath());
							imageJson.put("file", image.getFilename());
							imageJson.put("size", image.getSize());
							imageJson.put("thumbnail",
									"http://" + serverip + ":" + serverport + "/pixsigdata" + image.getThumbnail());
							imageHash.put(image.getImageid(), imageJson);
							imageJsonArray.put(imageJson);
						}
					} else if (medialistdtl.getStream() != null) {
						Stream stream = medialistdtl.getStream();
						playlistJsonArray.put(new JSONObject().put("type", "stream").put("id", stream.getStreamid()));
						if (streamHash.get(medialistdtl.getObjid()) == null) {
							JSONObject streamJson = new JSONObject();
							streamJson.put("id", stream.getStreamid());
							streamJson.put("url", stream.getUrl());
							streamHash.put(stream.getStreamid(), streamJson);
							streamJsonArray.put(streamJson);
						}
					} else if (medialistdtl.getAudio() != null) {
						Audio audio = medialistdtl.getAudio();
						playlistJsonArray.put(new JSONObject().put("type", "audio").put("id", audio.getAudioid()));
						if (audioHash.get(medialistdtl.getObjid()) == null) {
							JSONObject audioJson = new JSONObject();
							audioJson.put("id", audio.getAudioid());
							audioJson.put("name", audio.getName());
							audioJson.put("url",
									"http://" + serverip + ":" + serverport + "/pixsigdata" + audio.getFilepath());
							audioJson.put("file", audio.getFilename());
							audioJson.put("size", audio.getSize());
							audioHash.put(audio.getAudioid(), audioJson);
							audioJsonArray.put(audioJson);
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
			} else if (objtype.equals(Bundledtl.ObjType_Dvb)) {
				Dvb dvb = bundledtl.getDvb();
				if (dvb != null) {
					playlistJsonArray.put(new JSONObject().put("type", "dvb").put("id", dvb.getDvbid()));
					if (dvbHash.get(dvb.getDvbid()) == null) {
						JSONObject dvbJson = new JSONObject();
						dvbJson.put("id", dvb.getDvbid());
						dvbJson.put("number", dvb.getNumber());
						dvbHash.put(dvb.getDvbid(), dvbJson);
						dvbJsonArray.put(dvbJson);
					}
				}
			} else if (objtype.equals(Bundledtl.ObjType_Rss)) {
				Rss rss = bundledtl.getRss();
				if (rss != null) {
					playlistJsonArray.put(new JSONObject().put("type", "rss").put("id", rss.getRssid()));
					if (rssHash.get(rss.getRssid()) == null) {
						JSONObject rssJson = new JSONObject();
						rssJson.put("id", rss.getRssid());
						rssJson.put("url", rss.getUrl());
						rssHash.put(rss.getRssid(), rssJson);
						rssJsonArray.put(rssJson);
					}
				}
			}

		}

		for (Video video : videoList) {
			if (video.getRelate() != null && videoHash.get(video.getRelateid()) == null) {
				JSONObject videoJson = new JSONObject();
				videoJson.put("id", video.getRelateid());
				videoJson.put("name", video.getRelate().getName());
				videoJson.put("url",
						"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getRelate().getFilepath());
				videoJson.put("file", video.getRelate().getFilename());
				videoJson.put("size", video.getRelate().getSize());
				videoJson.put("thumbnail",
						"http://" + serverip + ":" + serverport + "/pixsigdata" + video.getRelate().getThumbnail());
				videoJson.put("relate_id", 0);
				videoHash.put(video.getRelateid(), videoJson);
				videoJsonArray.put(videoJson);
			}
		}

		String checksum = DigestUtils.md5Hex(responseJson.toString());
		responseJson.put("checksum", checksum);

		return responseJson;
	}

	@Transactional
	public void syncBundleSchedule(String bindtype, String bindid) throws Exception {
		if (bindtype.equals(Msgevent.ObjType_1_Device)) {
			Device device = deviceMapper.selectByPrimaryKey(bindid);
			if (device.getOnlineflag().equals("1")) {
				Msgevent msgevent = new Msgevent();
				msgevent.setMsgtype(Msgevent.MsgType_Bundle_Schedule);
				msgevent.setObjtype1(Msgevent.ObjType_1_Device);
				msgevent.setObjid1(Integer.parseInt(bindid));
				msgevent.setObjtype2(Msgevent.ObjType_2_None);
				msgevent.setObjid2(0);
				msgevent.setStatus(Msgevent.Status_Wait);
				msgeventMapper.deleteByDtl(Msgevent.MsgType_Bundle_Schedule, Msgevent.ObjType_1_Device, bindid, null,
						null, null);
				msgeventMapper.insertSelective(msgevent);
			}
		} else if (bindtype.equals(Msgevent.ObjType_1_Devicegroup)) {
			List<Device> devices = deviceMapper.selectByDevicegroup(bindid);
			for (Device device : devices) {
				if (device.getOnlineflag().equals("1")) {
					Msgevent msgevent = new Msgevent();
					msgevent.setMsgtype(Msgevent.MsgType_Bundle_Schedule);
					msgevent.setObjtype1(Msgevent.ObjType_1_Device);
					msgevent.setObjid1(device.getDeviceid());
					msgevent.setObjtype2(Msgevent.ObjType_2_None);
					msgevent.setObjid2(0);
					msgevent.setStatus(Msgevent.Status_Wait);
					msgeventMapper.deleteByDtl(Msgevent.MsgType_Bundle_Schedule, Msgevent.ObjType_1_Device,
							"" + device.getDeviceid(), null, null, null);
					msgeventMapper.insertSelective(msgevent);
				}
			}
		}

		JSONObject msgJson = new JSONObject().put("msg_id", 1).put("msg_type", "BUNDLE");
		JSONObject msgBodyJson = generateBundleScheduleJson(bindtype, bindid);
		msgJson.put("msg_body", msgBodyJson);
		String topic = "";
		if (bindtype.equals(Msgevent.ObjType_1_Device)) {
			topic = "device-" + bindid;
		} else if (bindtype.equals(Msgevent.ObjType_1_Devicegroup)) {
			topic = "group-" + bindid;
		}
		ActiveMQUtil.publish(topic, msgJson.toString());
	}

	public JSONObject generateBundleScheduleJson(String bindtype, String bindid) {
		// bindtype: 1-device 2-devicegroup
		if (bindtype.equals("1")) {
			Device device = deviceMapper.selectByPrimaryKey(bindid);
			if (device.getDevicegroup() != null) {
				bindtype = "2";
				bindid = "" + device.getDevicegroupid();
			}
		}

		HashMap<Integer, JSONObject> bundleHash = new HashMap<Integer, JSONObject>();

		JSONObject responseJson = new JSONObject();
		JSONArray bundleJsonArray = new JSONArray();
		responseJson.put("bundles", bundleJsonArray);
		JSONArray scheduleJsonArray = new JSONArray();
		responseJson.put("bundle_schedules", scheduleJsonArray);

		// generate final json
		List<Bundleschedule> bundlescheduleList = bundlescheduleMapper.selectList(bindtype, bindid, "2", null, null);
		for (Bundleschedule bundleschedule : bundlescheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJson.put("bundle_id", bundleschedule.getBundle().getBundleid());
			scheduleJson.put("playmode", "daily");
			scheduleJson.put("start_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(bundleschedule.getStarttime()));
			JSONArray bundleidJsonArray = new JSONArray();
			scheduleJson.put("bundles", bundleidJsonArray);
			for (Bundlescheduledtl bundlescheduledtl : bundleschedule.getBundlescheduledtls()) {
				bundleidJsonArray.put(bundlescheduledtl.getBundleid());
				if (bundleHash.get(bundlescheduledtl.getBundleid()) == null) {
					JSONObject bundleJson = generateBundleJson("" + bundlescheduledtl.getBundleid());
					bundleJsonArray.put(bundleJson);
					bundleHash.put(bundlescheduledtl.getBundleid(), bundleJson);
				}
				List<Bundle> subbundles = bundleMapper.selectSubList("" + bundlescheduledtl.getBundleid());
				for (Bundle subbundle : subbundles) {
					if (bundleHash.get(subbundle.getBundleid()) == null) {
						JSONObject bundleJson = generateBundleJson("" + subbundle.getBundleid());
						bundleJsonArray.put(bundleJson);
						bundleHash.put(subbundle.getBundleid(), bundleJson);
					}
				}
			}
			scheduleJsonArray.put(scheduleJson);
		}

		return responseJson;
	}

}
