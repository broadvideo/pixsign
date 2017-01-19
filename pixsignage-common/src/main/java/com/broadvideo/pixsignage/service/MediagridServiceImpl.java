package com.broadvideo.pixsignage.service;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Gridlayout;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Mediagrid;
import com.broadvideo.pixsignage.domain.Mediagriddtl;
import com.broadvideo.pixsignage.domain.Mmedia;
import com.broadvideo.pixsignage.domain.Mmediadtl;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.GridlayoutMapper;
import com.broadvideo.pixsignage.persistence.GridscheduleMapper;
import com.broadvideo.pixsignage.persistence.ImageMapper;
import com.broadvideo.pixsignage.persistence.MediagridMapper;
import com.broadvideo.pixsignage.persistence.MediagriddtlMapper;
import com.broadvideo.pixsignage.persistence.MmediaMapper;
import com.broadvideo.pixsignage.persistence.MmediadtlMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.VideoMapper;

@Service("mediagridService")
public class MediagridServiceImpl implements MediagridService {

	@Autowired
	private MediagridMapper mediagridMapper;
	@Autowired
	private GridlayoutMapper gridlayoutMapper;
	@Autowired
	private MediagriddtlMapper mediagriddtlMapper;
	@Autowired
	private MmediaMapper mmediaMapper;
	@Autowired
	private MmediadtlMapper mmediadtlMapper;
	@Autowired
	private VideoMapper videoMapper;
	@Autowired
	private ImageMapper imageMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private GridscheduleMapper gridscheduleMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;

	public Mediagrid selectByPrimaryKey(String mediagridid) {
		return mediagridMapper.selectByPrimaryKey(mediagridid);
	}

	public int selectCount(String orgid, String branchid, String status, String gridlayoutcode, String search) {
		return mediagridMapper.selectCount(orgid, branchid, status, gridlayoutcode, search);
	}

	public List<Mediagrid> selectList(String orgid, String branchid, String status, String gridlayoutcode,
			String search, String start, String length) {
		return mediagridMapper.selectList(orgid, branchid, status, gridlayoutcode, search, start, length);
	}

	public List<Mediagriddtl> selectMediagriddtlList(String mediagridid) {
		return mediagriddtlMapper.selectList(mediagridid);
	}

	@Transactional
	public void addMediagrid(Mediagrid mediagrid) {
		Gridlayout gridlayout = gridlayoutMapper.selectByCode(mediagrid.getGridlayoutcode());
		mediagrid.setXcount(gridlayout.getXcount());
		mediagrid.setYcount(gridlayout.getYcount());
		mediagrid.setRatio(gridlayout.getRatio());
		mediagrid.setWidth(gridlayout.getWidth());
		mediagrid.setHeight(gridlayout.getHeight());
		mediagrid.setStatus(Mediagrid.Status_Waiting);
		mediagridMapper.insertSelective(mediagrid);

		Mediagriddtl mediagriddtl = new Mediagriddtl();
		mediagriddtl.setMediagridid(mediagrid.getMediagridid());
		mediagriddtl.setXcount(gridlayout.getXcount());
		mediagriddtl.setYcount(gridlayout.getYcount());
		mediagriddtl.setXpos(0);
		mediagriddtl.setYpos(0);
		mediagriddtl.setObjtype(Mediagriddtl.ObjType_Video);
		mediagriddtl.setObjid(0);
		mediagriddtl.setMmediaid(0);
		mediagriddtlMapper.insertSelective(mediagriddtl);
	}

	@Transactional
	public void updateMediagrid(Mediagrid mediagrid) {
		mediagridMapper.updateByPrimaryKeySelective(mediagrid);
	}

	@Transactional
	public void deleteMediagrid(String mediagridid) {
		mediagridMapper.deleteByPrimaryKey(mediagridid);
	}

	private void checkMmedia(Mediagriddtl mediagriddtl) {
		if (mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Page)) {
			return;
		}
		if (mediagriddtl.getObjid().intValue() > 0) {
			String objtype = mediagriddtl.getObjtype();
			int objid = mediagriddtl.getObjid();
			int xcount = mediagriddtl.getXcount();
			int ycount = mediagriddtl.getYcount();
			Mmedia mmedia = mmediaMapper.select(objtype, "" + objid, "" + xcount, "" + ycount);
			if (mmedia == null) {
				mmedia = new Mmedia();
				mmedia.setObjtype(objtype);
				mmedia.setObjid(objid);
				mmedia.setXcount(xcount);
				mmedia.setYcount(ycount);
				mmedia.setStatus(Mmedia.Status_Waiting);
				if (xcount == 1 && ycount == 1) {
					mmedia.setStatus(Mmedia.Status_Active);
				}
				mmediaMapper.insertSelective(mmedia);

				for (int i = 0; i < xcount; i++) {
					for (int j = 0; j < ycount; j++) {
						Mmediadtl mmediadtl = new Mmediadtl();
						mmediadtl.setMmediaid(mmedia.getMmediaid());
						mmediadtl.setXpos(i);
						mmediadtl.setYpos(j);
						if (i == 0 && j == 0 && xcount == 1 && ycount == 1) {
							if (objtype.equals(Mediagriddtl.ObjType_Video)) {
								Video video = videoMapper.selectByPrimaryKey("" + objid);
								mmediadtl.setFilepath(video.getFilepath());
								mmediadtl.setFilename(video.getFilename());
								mmediadtl.setSize(video.getSize());
							} else {
								Image image = imageMapper.selectByPrimaryKey("" + objid);
								mmediadtl.setFilepath(image.getFilepath());
								mmediadtl.setFilename(image.getFilename());
								mmediadtl.setSize(image.getSize());
							}
							mmediadtl.setFileidx("");
						} else {
							mmediadtl.setFileidx("" + xcount + "-" + ycount + "-" + i + "-" + j);
							mmediadtl.setFilepath("");
							mmediadtl.setFilename("");
							mmediadtl.setSize(0L);
						}
						mmediadtlMapper.insertSelective(mmediadtl);
					}
				}
			}
			mediagriddtl.setMmediaid(mmedia.getMmediaid());
		}
	}

	@Transactional
	private void addMediagriddtl(Mediagriddtl mediagriddtl) {
		checkMmedia(mediagriddtl);
		mediagriddtlMapper.insertSelective(mediagriddtl);
	}

	@Transactional
	private void updateMediagriddtl(Mediagriddtl mediagriddtl) {
		checkMmedia(mediagriddtl);
		mediagriddtlMapper.updateByPrimaryKeySelective(mediagriddtl);
	}

	@Transactional
	private void deleteMediagriddtl(Mediagriddtl mediagriddtl) {
		checkMmedia(mediagriddtl);
		mediagriddtlMapper.deleteByPrimaryKey("" + mediagriddtl.getMediagriddtlid());
	}

	@Transactional
	public void design(Mediagrid mediagrid) throws Exception {
		int mediagridid = mediagrid.getMediagridid();
		List<Mediagriddtl> oldmediagriddtls = mediagriddtlMapper.selectList("" + mediagridid);
		HashMap<Integer, Mediagriddtl> hash = new HashMap<Integer, Mediagriddtl>();
		mediagrid.setStatus(Mediagrid.Status_Active);
		for (Mediagriddtl mediagriddtl : mediagrid.getMediagriddtls()) {
			if (mediagriddtl.getMediagriddtlid() > 0) {
				updateMediagriddtl(mediagriddtl);
				hash.put(mediagriddtl.getMediagriddtlid(), mediagriddtl);
			}
			if (mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Video)
					|| mediagriddtl.getObjtype().equals(Mediagriddtl.ObjType_Image)) {
				mediagrid.setStatus(Mediagrid.Status_Waiting);
			}
		}
		for (int i = 0; i < oldmediagriddtls.size(); i++) {
			if (hash.get(oldmediagriddtls.get(i).getMediagriddtlid()) == null) {
				deleteMediagriddtl(oldmediagriddtls.get(i));
			}
		}
		for (Mediagriddtl mediagriddtl : mediagrid.getMediagriddtls()) {
			if (mediagriddtl.getMediagriddtlid() <= 0) {
				mediagriddtl.setMediagridid(mediagridid);
				addMediagriddtl(mediagriddtl);
			}
		}

		String snapshotdtl = mediagrid.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
		}
		String snapshotFilePath = "/mediagrid/" + mediagrid.getMediagridid() + "/snapshot/" + mediagrid.getMediagridid()
				+ ".png";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		mediagrid.setSnapshot(snapshotFilePath);
		mediagridMapper.updateByPrimaryKeySelective(mediagrid);
		checkStatus();
	}

	@Transactional
	public void syncSchedule(String mediagridid) {
		List<Integer> devicegridids = gridscheduleMapper.selectDevicegridByMediagrid(mediagridid);
		for (int devicegridid : devicegridids) {
			List<Device> devices = deviceMapper.selectByDevicegrid("" + devicegridid);
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
	}

	@Transactional
	public void checkStatus() {
		List<Mediagrid> mediagrids = mediagridMapper.selectWaiting2ActiveList();
		for (Mediagrid mediagrid : mediagrids) {
			mediagrid.setStatus(Mediagrid.Status_Active);
			mediagridMapper.updateByPrimaryKeySelective(mediagrid);
		}
		mediagrids = mediagridMapper.selectWaiting2ErrorList();
		for (Mediagrid mediagrid : mediagrids) {
			mediagrid.setStatus(Mediagrid.Status_Error);
			mediagridMapper.updateByPrimaryKeySelective(mediagrid);
		}
	}

}
