package com.broadvideo.pixsign.service;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsign.common.CommonConfig;
import com.broadvideo.pixsign.domain.Templet;
import com.broadvideo.pixsign.domain.Templetzone;
import com.broadvideo.pixsign.domain.Templetzonedtl;
import com.broadvideo.pixsign.persistence.TempletMapper;
import com.broadvideo.pixsign.persistence.TempletzoneMapper;
import com.broadvideo.pixsign.persistence.TempletzonedtlMapper;

@Service("templetService")
public class TempletServiceImpl implements TempletService {

	@Autowired
	private TempletMapper templetMapper;
	@Autowired
	private TempletzoneMapper templetzoneMapper;
	@Autowired
	private TempletzonedtlMapper templetzonedtlMapper;

	public Templet selectByPrimaryKey(String templetid) {
		return templetMapper.selectByPrimaryKey(templetid);
	}

	public int selectCount(String orgid, String ratio, String touchflag, String homeflag, String publicflag,
			String search) {
		return templetMapper.selectCount(orgid, ratio, touchflag, homeflag, publicflag, search);
	}

	public List<Templet> selectList(String orgid, String ratio, String touchflag, String homeflag, String publicflag,
			String search, String start, String length) {
		return templetMapper.selectList(orgid, ratio, touchflag, homeflag, publicflag, search, start, length);
	}

	@Transactional
	public void addTemplet(Templet templet) {
		if (templet.getName() == null || templet.getName().equals("")) {
			templet.setName("UNKNOWN");
		}
		if (templet.getRatio().equals("1")) {
			// 16:9
			templet.setWidth(1920);
			templet.setHeight(1080);
		} else if (templet.getRatio().equals("2")) {
			// 9:16
			templet.setWidth(1080);
			templet.setHeight(1920);
		} else if (templet.getRatio().equals("3")) {
			// 4:3
			templet.setWidth(1920);
			templet.setHeight(1440);
		} else if (templet.getRatio().equals("4")) {
			// 3:4
			templet.setWidth(1440);
			templet.setHeight(1920);
		} else if (templet.getRatio().equals("5")) {
			// 16:3
			templet.setWidth(1920);
			templet.setHeight(360);
		} else if (templet.getRatio().equals("6")) {
			// 3:16
			templet.setWidth(360);
			templet.setHeight(1920);
		} else if (templet.getRatio().equals("7")) {
			// 1920x313
			templet.setWidth(1920);
			templet.setHeight(313);
		} else if (templet.getRatio().equals("8")) {
			// 313x1920
			templet.setWidth(313);
			templet.setHeight(1920);
		}
		templetMapper.insertSelective(templet);

		if (templet.getName().equals("UNKNOWN")) {
			templet.setName("TEMPLET-" + templet.getTempletid());
		}
		templetMapper.updateByPrimaryKeySelective(templet);
	}

	@Transactional
	public void copyTemplet(String fromtempletid, Templet templet) throws Exception {
		if (templet.getName() == null || templet.getName().equals("")) {
			templet.setName("UNKNOWN");
		}
		Templet fromtemplet = templetMapper.selectByPrimaryKey(fromtempletid);
		if (fromtemplet == null) {
			// Create templet from blank
			if (templet.getRatio().equals("1")) {
				// 16:9
				templet.setWidth(1920);
				templet.setHeight(1080);
			} else if (templet.getRatio().equals("2")) {
				// 9:16
				templet.setWidth(1080);
				templet.setHeight(1920);
			} else if (templet.getRatio().equals("3")) {
				// 4:3
				templet.setWidth(1920);
				templet.setHeight(1440);
			} else if (templet.getRatio().equals("4")) {
				// 3:4
				templet.setWidth(1440);
				templet.setHeight(1920);
			} else if (templet.getRatio().equals("5")) {
				// 16:3
				templet.setWidth(1920);
				templet.setHeight(360);
			} else if (templet.getRatio().equals("6")) {
				// 3:16
				templet.setWidth(360);
				templet.setHeight(1920);
			} else if (templet.getRatio().equals("7")) {
				// 1920x313
				templet.setWidth(1920);
				templet.setHeight(313);
			} else if (templet.getRatio().equals("8")) {
				// 313x1920
				templet.setWidth(313);
				templet.setHeight(1920);
			}
			templetMapper.insertSelective(templet);

			if (templet.getName().equals("UNKNOWN")) {
				templet.setName("TEMPLET-" + templet.getTempletid());
			}
			templetMapper.updateByPrimaryKeySelective(templet);
		} else {
			// Copy templet
			templet.setTempletid(fromtemplet.getTempletid());
			templet.setRatio(fromtemplet.getRatio());
			templet.setHeight(fromtemplet.getHeight());
			templet.setWidth(fromtemplet.getWidth());
			templet.setBgcolor(fromtemplet.getBgcolor());
			templet.setBgimageid(fromtemplet.getBgimageid());
			templet.setHomeidletime(fromtemplet.getHomeidletime());
			templetMapper.insertSelective(templet);
			if (templet.getName().equals("UNKNOWN")) {
				templet.setName("TEMPLET-" + templet.getTempletid());
			}
			if (fromtemplet.getSnapshot() != null) {
				String snapshotFilePath = "/templet/" + templet.getTempletid() + "/snapshot/" + templet.getTempletid()
						+ ".jpg";
				File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
				FileUtils.copyFile(new File(CommonConfig.CONFIG_PIXDATA_HOME + fromtemplet.getSnapshot()),
						snapshotFile);
				templet.setSnapshot(snapshotFilePath);
			}
			templetMapper.updateByPrimaryKeySelective(templet);

			List<Templetzone> fromtempletzones = fromtemplet.getTempletzones();
			for (Templetzone fromtempletzone : fromtempletzones) {
				Templetzone templetzone = new Templetzone();
				templetzone.setTempletid(templet.getTempletid());
				if (templet.getHomeflag().equals("0")) {
					templetzone.setHometempletid(templet.getHometempletid());
				} else {
					templetzone.setHometempletid(templet.getTempletid());
				}
				templetzone.setTempletzoneid(fromtempletzone.getTempletzoneid());
				templetzone.setType(fromtempletzone.getType());
				templetzone.setMainflag(fromtempletzone.getMainflag());
				templetzone.setHeight(fromtempletzone.getHeight());
				templetzone.setWidth(fromtempletzone.getWidth());
				templetzone.setTopoffset(fromtempletzone.getTopoffset());
				templetzone.setLeftoffset(fromtempletzone.getLeftoffset());
				templetzone.setZindex(fromtempletzone.getZindex());
				templetzone.setBgcolor(fromtempletzone.getBgcolor());
				templetzone.setBgopacity(fromtempletzone.getBgopacity());
				templetzone.setBgimageid(fromtempletzone.getBgimageid());
				templetzone.setSleeptime(fromtempletzone.getSleeptime());
				templetzone.setIntervaltime(fromtempletzone.getIntervaltime());
				templetzone.setAnimation(fromtempletzone.getAnimation());
				templetzone.setSpeed(fromtempletzone.getSpeed());
				templetzone.setColor(fromtempletzone.getColor());
				templetzone.setSize(fromtempletzone.getSize());
				templetzone.setDateformat(fromtempletzone.getDateformat());
				templetzone.setFitflag(fromtempletzone.getFitflag());
				templetzone.setVolume(fromtempletzone.getVolume());
				templetzone.setTouchlabel(fromtempletzone.getTouchlabel());
				templetzone.setTouchtype(fromtempletzone.getTouchtype());
				templetzone.setTouchobjid(fromtempletzone.getTouchobjid());
				templetzone.setContent(fromtempletzone.getContent());
				templetzoneMapper.insertSelective(templetzone);
				for (Templetzonedtl fromtempletzonedtl : fromtempletzone.getTempletzonedtls()) {
					Templetzonedtl templetzonedtl = new Templetzonedtl();
					templetzonedtl.setTempletzoneid(templetzone.getTempletzoneid());
					templetzonedtl.setObjtype(fromtempletzonedtl.getObjtype());
					templetzonedtl.setObjid(fromtempletzonedtl.getObjid());
					templetzonedtl.setSequence(fromtempletzonedtl.getSequence());
					templetzonedtlMapper.insertSelective(templetzonedtl);
				}
			}
		}
	}

	@Transactional
	public void updateTemplet(Templet templet) {
		templetMapper.updateByPrimaryKeySelective(templet);
	}

	@Transactional
	public void deleteTemplet(String templetid) {
		Templet templet = templetMapper.selectByPrimaryKey(templetid);
		if (templet != null) {
			for (Templet subtemplet : templet.getSubtemplets()) {
				templetMapper.deleteByPrimaryKey("" + subtemplet.getTempletid());
			}
		}
		templetMapper.deleteByPrimaryKey(templetid);
	}

	@Transactional
	public void design(Templet templet) throws Exception {
		if (templet.getName() == null || templet.getName().equals("")) {
			templet.setName("UNKNOWN");
		}

		templetMapper.updateByPrimaryKeySelective(templet);
		int templetid = templet.getTempletid();
		List<Templetzone> templetzones = templet.getTempletzones();
		List<Templetzone> oldtempletzones = templetzoneMapper.selectList("" + templetid);
		HashMap<Integer, Templetzone> hash = new HashMap<Integer, Templetzone>();
		for (Templetzone templetzone : templetzones) {
			if (templetzone.getTempletzoneid() > 0) {
				hash.put(templetzone.getTempletzoneid(), templetzone);
			}
		}
		for (int i = 0; i < oldtempletzones.size(); i++) {
			Templetzone oldTempletzone = oldtempletzones.get(i);
			if (hash.get(oldTempletzone.getTempletzoneid()) == null) {
				templetzonedtlMapper.deleteByTempletzone("" + oldtempletzones.get(i).getTempletzoneid());
				templetzoneMapper.deleteByPrimaryKey("" + oldtempletzones.get(i).getTempletzoneid());
			}
		}
		for (Templetzone templetzone : templetzones) {
			if (templet.getHomeflag().equals("0")) {
				templetzone.setHometempletid(templet.getHometempletid());
			} else {
				templetzone.setHometempletid(templet.getTempletid());
			}
			if (templetzone.getTempletzoneid() <= 0) {
				templetzone.setTempletid(templetid);
				templetzoneMapper.insertSelective(templetzone);
			} else {
				templetzoneMapper.updateByPrimaryKeySelective(templetzone);
				templetzonedtlMapper.deleteByTempletzone("" + templetzone.getTempletzoneid());
			}
			if (templetzone.getTempletzonedtls() != null) {
				for (Templetzonedtl templetzonedtl : templetzone.getTempletzonedtls()) {
					templetzonedtl.setTempletzoneid(templetzone.getTempletzoneid());
					templetzonedtlMapper.insertSelective(templetzonedtl);
				}
			}
		}

		String snapshotdtl = templet.getSnapshotdtl();
		if (snapshotdtl != null && snapshotdtl.startsWith("data:image/jpeg;base64,")) {
			snapshotdtl = snapshotdtl.substring(23);
			String snapshotFilePath = "/templet/" + templet.getTempletid() + "/snapshot/" + templet.getTempletid()
					+ ".jpg";
			File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
			FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
			templet.setSnapshot(snapshotFilePath);
			templetMapper.updateByPrimaryKeySelective(templet);
		}
	}

}
