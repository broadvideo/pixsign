package com.broadvideo.signage.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.signage.domain.Devicefile;
import com.broadvideo.signage.domain.Layout;
import com.broadvideo.signage.domain.Media;
import com.broadvideo.signage.domain.Region;
import com.broadvideo.signage.domain.Regiondtl;
import com.broadvideo.signage.persistence.DeviceMapper;
import com.broadvideo.signage.persistence.DevicefileMapper;
import com.broadvideo.signage.persistence.LayoutMapper;
import com.broadvideo.signage.persistence.MediaMapper;

@Service("devicefileService")
public class DevicefileServiceImpl implements DevicefileService {

	private static final Logger log = Logger.getLogger(DevicefileServiceImpl.class);

	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private DevicefileMapper devicefileMapper;
	@Autowired
	private LayoutMapper layoutMapper;
	@Autowired
	private MediaMapper mediaMapper;

	public int selectCountByDevice(String filetype, String deviceid) {
		return devicefileMapper.selectCountByDevice(filetype, deviceid);
	}

	public List<Devicefile> selectByDevice(String deviceid, String filetype, String syncstatus, String start,
			String length) {
		return devicefileMapper.selectByDevice(deviceid, filetype, syncstatus, start, length);
	}

	public List<Devicefile> selectByFile(String deviceid, String filetype, String fileid) {
		return devicefileMapper.selectByFile(deviceid, filetype, fileid);
	}

	public List<Devicefile> selectDownloadingFileByDevice(String deviceid) {
		return devicefileMapper.selectDownloadingFileByDevice(deviceid);
	}

	public void addDevicefile(Devicefile devicefile) {
		devicefileMapper.insert(devicefile);
	}

	public void updateDevicefile(Devicefile devicefile) {
		devicefileMapper.updateByPrimaryKeySelective(devicefile);
	}

	public void deleteDevicefile(String[] ids) {
		String s = "";
		if (ids.length > 0)
			s = ids[0];
		for (int i = 1; i < ids.length; i++) {
			s += "," + ids[i];
		}
		devicefileMapper.deleteByKeys(s);
	}

	public void updateDevicefileByDevice(String deviceid) {
		int ideviceid = Integer.parseInt(deviceid);

		List<Devicefile> layoutfiles = devicefileMapper.selectByDevice(deviceid, "0", null, null, null);
		List<Devicefile> imagefiles = devicefileMapper.selectByDevice(deviceid, "1", null, null, null);
		List<Devicefile> videofiles = devicefileMapper.selectByDevice(deviceid, "2", null, null, null);
		List<Devicefile> advertfiles = devicefileMapper.selectByDevice(deviceid, "4", null, null, null);

		Map<String, Devicefile> layoutfileHash = new HashMap<String, Devicefile>();
		Map<String, Devicefile> mediafileHash = new HashMap<String, Devicefile>();
		for (int i = 0; i < layoutfiles.size(); i++) {
			layoutfileHash.put("" + layoutfiles.get(i).getFileid(), layoutfiles.get(i));
		}
		for (int i = 0; i < imagefiles.size(); i++) {
			mediafileHash.put("" + imagefiles.get(i).getFileid(), imagefiles.get(i));
		}
		for (int i = 0; i < videofiles.size(); i++) {
			mediafileHash.put("" + videofiles.get(i).getFileid(), videofiles.get(i));
		}
		for (int i = 0; i < advertfiles.size(); i++) {
			mediafileHash.put("" + advertfiles.get(i).getFileid(), advertfiles.get(i));
		}

		Map<String, Devicefile> newLayoutfileHash = new HashMap<String, Devicefile>();
		Map<String, Devicefile> newMediafileHash = new HashMap<String, Devicefile>();

		List<Layout> layouts = layoutMapper.selectByDevice(deviceid);
		for (int i = 0; i < layouts.size(); i++) {
			Layout layout = layouts.get(i);
			Devicefile layoutfile = new Devicefile();
			layoutfile.setDeviceid(ideviceid);
			layoutfile.setUploadtype("0");
			layoutfile.setFiletype("0"); // Layout
			layoutfile.setFileid(layout.getLayoutid());
			layoutfile.setName(layout.getName());
			layoutfile.setFilename(layout.getLayoutid() + ".xlf");
			layoutfile.setFilesize((long) layout.getXmlsize());
			layoutfile.setMd5(layout.getXmlmd5());
			layoutfile.setComplete(0);
			layoutfile.setUpdatetime(Calendar.getInstance().getTime());
			newLayoutfileHash.put("" + layout.getLayoutid(), layoutfile);

			for (int j = 0; j < layout.getRegions().size(); j++) {
				Region region = layout.getRegions().get(j);
				for (int m = 0; m < region.getRegiondtls().size(); m++) {
					Regiondtl regiondtl = region.getRegiondtls().get(m);
					if (regiondtl.getMediatype().equals("1")) { // Image
						Media media = regiondtl.getMedia();
						Devicefile imagefile = new Devicefile();
						imagefile.setDeviceid(ideviceid);
						imagefile.setUploadtype("0");
						imagefile.setFiletype("1"); // Image
						imagefile.setFileid(media.getMediaid());
						imagefile.setName(media.getName());
						imagefile.setFilename(media.getFilename());
						imagefile.setFilesize(media.getSize());
						imagefile.setMd5(media.getMd5());
						imagefile.setComplete(0);
						imagefile.setUpdatetime(Calendar.getInstance().getTime());
						if (newMediafileHash.get("" + media.getMediaid()) == null) {
							newMediafileHash.put("" + media.getMediaid(), imagefile);
						}
					} else if (regiondtl.getMediatype().equals("2")) { // Video
						Media media = regiondtl.getMedia();
						Devicefile videofile = new Devicefile();
						videofile.setDeviceid(ideviceid);
						videofile.setUploadtype(media.getUploadtype());
						videofile.setFiletype("2"); // Video
						videofile.setFileid(media.getMediaid());
						videofile.setName(media.getName());
						videofile.setFilename(media.getFilename());
						videofile.setFileuri(media.getUri());
						videofile.setFilesize(media.getSize());
						videofile.setMd5(media.getMd5());
						videofile.setComplete(0);
						videofile.setUpdatetime(Calendar.getInstance().getTime());
						if (newMediafileHash.get("" + media.getMediaid()) == null) {
							newMediafileHash.put("" + media.getMediaid(), videofile);
						}
					} else if (regiondtl.getMediatype().equals("6")) { // Advert
						Media media = regiondtl.getMedia();
						Devicefile videofile = new Devicefile();
						videofile.setDeviceid(ideviceid);
						videofile.setUploadtype(media.getUploadtype());
						videofile.setFiletype("4"); // Advert
						videofile.setFileid(media.getMediaid());
						videofile.setName(media.getName());
						videofile.setFilename(media.getFilename());
						videofile.setFileuri(media.getUri());
						videofile.setFilesize(media.getSize());
						videofile.setMd5(media.getMd5());
						videofile.setComplete(0);
						videofile.setUpdatetime(Calendar.getInstance().getTime());
						if (newMediafileHash.get("" + media.getMediaid()) == null) {
							newMediafileHash.put("" + media.getMediaid(), videofile);
						}
					}
				}
			}
		}

		List<Devicefile> addDevicefiles = new ArrayList<Devicefile>();
		List<Devicefile> updateDevicefiles = new ArrayList<Devicefile>();
		List<Devicefile> deleteDevicefiles = new ArrayList<Devicefile>();

		// Compare hashmap
		for (Iterator<String> it = layoutfileHash.keySet().iterator(); it.hasNext();) {
			String key = it.next();
			Devicefile devicefile = layoutfileHash.get(key);
			Devicefile newDevicefile = newLayoutfileHash.get(key);
			if (newDevicefile == null) {
				deleteDevicefiles.add(devicefile);
			} else {
				if (!devicefile.getMd5().equals(newDevicefile.getMd5())) {
					newDevicefile.setDevicefileid(devicefile.getDevicefileid());
					updateDevicefiles.add(newDevicefile);
				}
			}
		}
		for (Iterator<String> it = newLayoutfileHash.keySet().iterator(); it.hasNext();) {
			String key = it.next();
			Devicefile devicefile = layoutfileHash.get(key);
			Devicefile newDevicefile = newLayoutfileHash.get(key);
			if (devicefile == null) {
				addDevicefiles.add(newDevicefile);
			}
		}

		for (Iterator<String> it = mediafileHash.keySet().iterator(); it.hasNext();) {
			String key = it.next();
			Devicefile devicefile = mediafileHash.get(key);
			Devicefile newDevicefile = newMediafileHash.get(key);
			if (newDevicefile == null) {
				deleteDevicefiles.add(devicefile);
			} else {
				if (!devicefile.getMd5().equals(newDevicefile.getMd5())) {
					newDevicefile.setDevicefileid(devicefile.getDevicefileid());
					updateDevicefiles.add(newDevicefile);
				}
			}
		}
		for (Iterator<String> it = newMediafileHash.keySet().iterator(); it.hasNext();) {
			String key = it.next();
			Devicefile devicefile = mediafileHash.get(key);
			Devicefile newDevicefile = newMediafileHash.get(key);
			if (devicefile == null) {
				addDevicefiles.add(newDevicefile);
			}
		}

		// Update DB
		for (int i = 0; i < addDevicefiles.size(); i++) {
			List<Devicefile> tempDevicefiles = devicefileMapper.selectByFile("" + addDevicefiles.get(i).getDeviceid(),
					addDevicefiles.get(i).getFiletype(), "" + addDevicefiles.get(i).getFileid());
			if (tempDevicefiles.size() == 0) {
				devicefileMapper.insert(addDevicefiles.get(i));
			}
		}
		for (int i = 0; i < updateDevicefiles.size(); i++) {
			devicefileMapper.updateByPrimaryKey(updateDevicefiles.get(i));
		}
		for (int i = 0; i < deleteDevicefiles.size(); i++) {
			devicefileMapper.deleteByKeys("" + deleteDevicefiles.get(i).getDevicefileid());
		}
	}

}
