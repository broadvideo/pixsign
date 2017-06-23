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
import com.broadvideo.pixsignage.domain.Ptemplet;
import com.broadvideo.pixsignage.domain.Ptempletzone;
import com.broadvideo.pixsignage.persistence.PtempletMapper;
import com.broadvideo.pixsignage.persistence.PtempletzoneMapper;

@Service("ptempletService")
public class PtempletServiceImpl implements PtempletService {

	@Autowired
	private PtempletMapper ptempletMapper;
	@Autowired
	private PtempletzoneMapper ptempletzoneMapper;

	public Ptemplet selectByPrimaryKey(String ptempletid) {
		return ptempletMapper.selectByPrimaryKey(ptempletid);
	}

	public int selectCount(String orgid, String ratio, String publicflag, String search) {
		return ptempletMapper.selectCount(orgid, ratio, publicflag, search);
	}

	public List<Ptemplet> selectList(String orgid, String ratio, String publicflag, String search, String start,
			String length) {
		return ptempletMapper.selectList(orgid, ratio, publicflag, search, start, length);
	}

	@Transactional
	public void addPtemplet(Ptemplet ptemplet) {
		if (ptemplet.getName() == null || ptemplet.getName().equals("")) {
			ptemplet.setName("UNKNOWN");
		}
		if (ptemplet.getRatio().equals("1")) {
			// 16:9
			ptemplet.setWidth(1920);
			ptemplet.setHeight(1080);
		} else if (ptemplet.getRatio().equals("2")) {
			// 9:16
			ptemplet.setWidth(1080);
			ptemplet.setHeight(1920);
		}
		ptempletMapper.insertSelective(ptemplet);

		if (ptemplet.getName().equals("UNKNOWN")) {
			ptemplet.setName("TEMPLET-" + ptemplet.getPtempletid());
		}
		ptempletMapper.updateByPrimaryKeySelective(ptemplet);
	}

	@Transactional
	public void copyPtemplet(String fromptempletid, Ptemplet ptemplet) throws Exception {
		if (ptemplet.getName() == null || ptemplet.getName().equals("")) {
			ptemplet.setName("UNKNOWN");
		}
		Ptemplet fromptemplet = ptempletMapper.selectByPrimaryKey(fromptempletid);
		if (fromptemplet == null) {
			// Create ptemplet from blank
			if (ptemplet.getRatio().equals("1")) {
				// 16:9
				ptemplet.setWidth(1920);
				ptemplet.setHeight(1080);
			} else if (ptemplet.getRatio().equals("2")) {
				// 9:16
				ptemplet.setWidth(1080);
				ptemplet.setHeight(1920);
			}
			ptempletMapper.insertSelective(ptemplet);

			if (ptemplet.getName().equals("UNKNOWN")) {
				ptemplet.setName("TEMPLET-" + ptemplet.getPtempletid());
			}
			ptempletMapper.updateByPrimaryKeySelective(ptemplet);
		} else {
			// Copy ptemplet
			ptemplet.setPtempletid(fromptemplet.getPtempletid());
			ptemplet.setRatio(fromptemplet.getRatio());
			ptemplet.setHeight(fromptemplet.getHeight());
			ptemplet.setWidth(fromptemplet.getWidth());
			ptempletMapper.insertSelective(ptemplet);
			if (ptemplet.getName().equals("UNKNOWN")) {
				ptemplet.setName("TEMPLET-" + ptemplet.getPtempletid());
			}
			if (fromptemplet.getSnapshot() != null) {
				String snapshotFilePath = "/ptemplet/" + ptemplet.getPtempletid() + "/snapshot/"
						+ ptemplet.getPtempletid() + ".png";
				File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + fromptemplet.getSnapshot()),
						snapshotFile);
				ptemplet.setSnapshot(snapshotFilePath);
			}
			ptempletMapper.updateByPrimaryKeySelective(ptemplet);

			List<Ptempletzone> fromptempletzones = fromptemplet.getPtempletzones();
			for (Ptempletzone fromptempletzone : fromptempletzones) {
				Ptempletzone ptempletzone = new Ptempletzone();
				ptempletzone.setPtempletid(ptemplet.getPtempletid());
				ptempletzone.setType(fromptempletzone.getType());
				ptempletzone.setHeight(fromptempletzone.getHeight());
				ptempletzone.setWidth(fromptempletzone.getWidth());
				ptempletzone.setTopoffset(fromptempletzone.getTopoffset());
				ptempletzone.setLeftoffset(fromptempletzone.getLeftoffset());
				ptempletzone.setZindex(fromptempletzone.getZindex());
				ptempletzone.setTransform(fromptempletzone.getTransform());
				ptempletzone.setBdcolor(fromptempletzone.getBdcolor());
				ptempletzone.setBdstyle(fromptempletzone.getBdstyle());
				ptempletzone.setBdwidth(fromptempletzone.getBdwidth());
				ptempletzone.setBdtl(fromptempletzone.getBdtl());
				ptempletzone.setBdtr(fromptempletzone.getBdtr());
				ptempletzone.setBdbl(fromptempletzone.getBdbl());
				ptempletzone.setBdbr(fromptempletzone.getBdbr());
				ptempletzone.setBgcolor(fromptempletzone.getBgcolor());
				ptempletzone.setBgopacity(fromptempletzone.getBgopacity());
				ptempletzone.setOpacity(fromptempletzone.getOpacity());
				ptempletzone.setPadding(fromptempletzone.getPadding());
				ptempletzone.setShadowh(fromptempletzone.getShadowh());
				ptempletzone.setShadowv(fromptempletzone.getShadowv());
				ptempletzone.setShadowblur(fromptempletzone.getShadowblur());
				ptempletzone.setShadowcolor(fromptempletzone.getShadowcolor());
				ptempletzone.setColor(fromptempletzone.getColor());
				ptempletzone.setFontfamily(fromptempletzone.getFontfamily());
				ptempletzone.setFontsize(fromptempletzone.getFontsize());
				ptempletzone.setFontweight(fromptempletzone.getFontweight());
				ptempletzone.setFontstyle(fromptempletzone.getFontstyle());
				ptempletzone.setDecoration(fromptempletzone.getDecoration());
				ptempletzone.setAlign(fromptempletzone.getAlign());
				ptempletzone.setLineheight(fromptempletzone.getLineheight());
				ptempletzone.setContent(fromptempletzone.getContent());
				ptempletzone.setObjid(fromptempletzone.getObjid());

				ptempletzoneMapper.insertSelective(ptempletzone);
			}
		}
	}

	@Transactional
	public void updatePtemplet(Ptemplet ptemplet) {
		ptempletMapper.updateByPrimaryKeySelective(ptemplet);
	}

	@Transactional
	public void deletePtemplet(String ptempletid) {
		ptempletMapper.deleteByPrimaryKey(ptempletid);
	}

	@Transactional
	public void design(Ptemplet ptemplet) throws Exception {
		if (ptemplet.getName() == null || ptemplet.getName().equals("")) {
			ptemplet.setName("UNKNOWN");
		}

		ptempletMapper.updateByPrimaryKeySelective(ptemplet);
		int ptempletid = ptemplet.getPtempletid();
		List<Ptempletzone> ptempletzones = ptemplet.getPtempletzones();
		List<Ptempletzone> oldptempletzones = ptempletzoneMapper.selectList("" + ptempletid);
		HashMap<Integer, Ptempletzone> hash = new HashMap<Integer, Ptempletzone>();
		for (Ptempletzone ptempletzone : ptempletzones) {
			if (ptempletzone.getPtempletzoneid() <= 0) {
				ptempletzone.setPtempletid(ptempletid);
				ptempletzoneMapper.insertSelective(ptempletzone);
			} else {
				ptempletzoneMapper.updateByPrimaryKeySelective(ptempletzone);
				hash.put(ptempletzone.getPtempletzoneid(), ptempletzone);
			}
		}
		for (int i = 0; i < oldptempletzones.size(); i++) {
			Ptempletzone oldPtempletzone = oldptempletzones.get(i);
			if (hash.get(oldPtempletzone.getPtempletzoneid()) == null) {
				ptempletzoneMapper.deleteByPrimaryKey("" + oldptempletzones.get(i).getPtempletzoneid());
			}
		}

		String snapshotdtl = ptemplet.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
		}
		String snapshotFilePath = "/ptemplet/" + ptemplet.getPtempletid() + "/snapshot/" + ptemplet.getPtempletid()
				+ ".png";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		ptemplet.setSnapshot(snapshotFilePath);
		ptempletMapper.updateByPrimaryKeySelective(ptemplet);
	}

}
