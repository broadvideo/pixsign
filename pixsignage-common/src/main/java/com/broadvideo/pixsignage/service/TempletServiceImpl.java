package com.broadvideo.pixsignage.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Bundledtl;
import com.broadvideo.pixsignage.domain.Medialist;
import com.broadvideo.pixsignage.domain.Medialistdtl;
import com.broadvideo.pixsignage.domain.Rss;
import com.broadvideo.pixsignage.domain.Stream;
import com.broadvideo.pixsignage.domain.Templet;
import com.broadvideo.pixsignage.domain.Templetdtl;
import com.broadvideo.pixsignage.domain.Text;
import com.broadvideo.pixsignage.domain.Widget;
import com.broadvideo.pixsignage.persistence.MedialistMapper;
import com.broadvideo.pixsignage.persistence.MedialistdtlMapper;
import com.broadvideo.pixsignage.persistence.RssMapper;
import com.broadvideo.pixsignage.persistence.StreamMapper;
import com.broadvideo.pixsignage.persistence.TempletMapper;
import com.broadvideo.pixsignage.persistence.TempletdtlMapper;
import com.broadvideo.pixsignage.persistence.TextMapper;
import com.broadvideo.pixsignage.persistence.WidgetMapper;

@Service("templetService")
public class TempletServiceImpl implements TempletService {

	@Autowired
	private TempletMapper templetMapper;
	@Autowired
	private TempletdtlMapper templetdtlMapper;
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
	private MedialistService medialistService;
	@Autowired
	private TextService textService;
	@Autowired
	private StreamService streamService;
	@Autowired
	private WidgetService widgetService;
	@Autowired
	private RssService rssService;

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
			// 32:9
			templet.setWidth(1920);
			templet.setHeight(540);
		}
		templetMapper.insertSelective(templet);

		if (templet.getName().equals("UNKNOWN")) {
			templet.setName("TEMPLET-" + templet.getTempletid());
		}
		templetMapper.updateByPrimaryKeySelective(templet);

		Templetdtl templetdtl = new Templetdtl();
		templetdtl.setTempletid(templet.getTempletid());
		templetdtl.setType(Templetdtl.Type_PLAY);
		templetdtl.setMainflag("1");
		if (templet.getHomeflag().equals("0")) {
			templetdtl.setHometempletid(templet.getHometempletid());
		} else {
			templetdtl.setHometempletid(templet.getTempletid());
		}
		templetdtl.setWidth((int) (templet.getWidth() / 2));
		templetdtl.setHeight((int) (templet.getHeight() / 2));
		templetdtl.setTopoffset((int) (templet.getHeight() / 4));
		templetdtl.setLeftoffset((int) (templet.getWidth() / 4));
		templetdtl.setBgcolor("#000000");
		if (templetdtl.getBgimageid() != null && templetdtl.getBgimageid() > 0) {
			templetdtl.setOpacity(0);
		} else {
			templetdtl.setOpacity(255);
		}
		templetdtl.setZindex(0);
		templetdtl.setSleeptime(0);
		templetdtl.setIntervaltime(10);
		templetdtl.setDirection("4");
		templetdtl.setSpeed("2");
		templetdtl.setColor("#FFFFFF");
		templetdtl.setSize(50);
		templetdtl.setObjtype(Bundledtl.ObjType_NONE);
		templetdtl.setObjid(0);
		templetdtlMapper.insertSelective(templetdtl);

		Medialist medialist = new Medialist();
		medialist.setOrgid(templet.getOrgid());
		medialist.setBranchid(0);
		medialist.setName(templet.getName() + "-" + templetdtl.getTempletdtlid());
		medialist.setType(Medialist.Type_Private);
		medialist.setCreatestaffid(templet.getCreatestaffid());
		medialistMapper.insertSelective(medialist);
		templetdtl.setObjtype(Bundledtl.ObjType_Medialist);
		templetdtl.setObjid(medialist.getMedialistid());
		templetdtlMapper.updateByPrimaryKeySelective(templetdtl);
	}

	@Transactional
	public void updateTemplet(Templet templet) {
		templetMapper.updateByPrimaryKeySelective(templet);
	}

	@Transactional
	public void deleteTemplet(String templetid) {
		templetMapper.deleteByPrimaryKey(templetid);
	}

	@Transactional
	public void design(Templet templet) throws Exception {
		if (templet.getName() == null || templet.getName().equals("")) {
			templet.setName("UNKNOWN");
		}

		templetMapper.updateByPrimaryKeySelective(templet);
		int templetid = templet.getTempletid();
		List<Templetdtl> templetdtls = templet.getTempletdtls();
		List<Templetdtl> oldtempletdtls = templetdtlMapper.selectList("" + templetid);
		HashMap<Integer, Templetdtl> hash = new HashMap<Integer, Templetdtl>();
		for (Templetdtl templetdtl : templetdtls) {
			if (templetdtl.getTempletdtlid() <= 0) {
				templetdtl.setTempletid(templetid);
				templetdtlMapper.insertSelective(templetdtl);
			} else {
				hash.put(templetdtl.getTempletdtlid(), templetdtl);
			}
		}
		for (int i = 0; i < oldtempletdtls.size(); i++) {
			Templetdtl oldTempletdtl = oldtempletdtls.get(i);
			if (hash.get(oldTempletdtl.getTempletdtlid()) == null) {
				// Remove old private records
				if (oldTempletdtl.getObjtype().equals(Templetdtl.ObjType_Medialist)) {
					medialistService.deleteMedialist("" + oldTempletdtl.getObjid());
				} else if (oldTempletdtl.getObjtype().equals(Templetdtl.ObjType_Text)) {
					textService.deleteText("" + oldTempletdtl.getObjid());
				} else if (oldTempletdtl.getObjtype().equals(Templetdtl.ObjType_Stream)) {
					streamService.deleteStream("" + oldTempletdtl.getObjid());
				} else if (oldTempletdtl.getObjtype().equals(Templetdtl.ObjType_Widget)) {
					widgetService.deleteWidget("" + oldTempletdtl.getObjid());
				} else if (oldTempletdtl.getObjtype().equals(Templetdtl.ObjType_Rss)) {
					rssService.deleteRss("" + oldTempletdtl.getObjid());
				}
				templetdtlMapper.deleteByPrimaryKey("" + oldtempletdtls.get(i).getTempletdtlid());
			}
		}

		for (Templetdtl templetdtl : templetdtls) {
			if (templet.getHomeflag().equals("0")) {
				templetdtl.setHometempletid(templet.getHometempletid());
			} else {
				templetdtl.setHometempletid(templet.getTempletid());
			}
			Templetdtl oldTempletdtl = templetdtlMapper.selectByPrimaryKey("" + templetdtl.getTempletdtlid());
			if (!oldTempletdtl.getObjtype().equals(templetdtl.getObjtype())
					|| oldTempletdtl.getObjid().intValue() != templetdtl.getObjid().intValue()) {
				// Remove old private records
				if (oldTempletdtl.getObjtype().equals(Templetdtl.ObjType_Medialist)) {
					medialistService.deleteMedialist("" + oldTempletdtl.getObjid());
				} else if (oldTempletdtl.getObjtype().equals(Templetdtl.ObjType_Text)) {
					textService.deleteText("" + oldTempletdtl.getObjid());
				} else if (oldTempletdtl.getObjtype().equals(Templetdtl.ObjType_Stream)) {
					streamService.deleteStream("" + oldTempletdtl.getObjid());
				} else if (oldTempletdtl.getObjtype().equals(Templetdtl.ObjType_Widget)) {
					widgetService.deleteWidget("" + oldTempletdtl.getObjid());
				} else if (oldTempletdtl.getObjtype().equals(Templetdtl.ObjType_Rss)) {
					rssService.deleteRss("" + oldTempletdtl.getObjid());
				}
			}
			if (templetdtl.getObjtype().equals(Templetdtl.ObjType_Medialist)) {
				Medialist medialist = templetdtl.getMedialist();
				Medialist oldMedialist = medialistMapper.selectByPrimaryKey("" + templetdtl.getObjid());
				List<Medialistdtl> oldmedialistdtls;
				if (oldMedialist == null) {
					medialist.setOrgid(templet.getOrgid());
					medialist.setBranchid(0);
					medialist.setName(templet.getName() + "-" + templetdtl.getTempletdtlid());
					medialist.setType(Medialist.Type_Private);
					medialist.setCreatestaffid(templet.getCreatestaffid());
					medialistMapper.insertSelective(medialist);
					oldmedialistdtls = new ArrayList<Medialistdtl>();
				} else {
					oldmedialistdtls = oldMedialist.getMedialistdtls();
				}

				HashMap<Integer, Medialistdtl> medialistdtlhash = new HashMap<Integer, Medialistdtl>();
				for (Medialistdtl medialistdtl : medialist.getMedialistdtls()) {
					medialistdtl.setMedialistid(medialist.getMedialistid());
					if (medialistdtl.getMedialistdtlid() == 0) {
						medialistdtlMapper.insertSelective(medialistdtl);
					} else {
						medialistdtlMapper.updateByPrimaryKeySelective(medialistdtl);
						medialistdtlhash.put(medialistdtl.getMedialistdtlid(), medialistdtl);
					}
				}
				for (int i = 0; i < oldmedialistdtls.size(); i++) {
					if (medialistdtlhash.get(oldmedialistdtls.get(i).getMedialistdtlid()) == null) {
						medialistdtlMapper.deleteByPrimaryKey("" + oldmedialistdtls.get(i).getMedialistdtlid());
					}
				}

				templetdtl.setObjid(medialist.getMedialistid());
			} else if (templetdtl.getObjtype().equals(Templetdtl.ObjType_Text)) {
				Text text = templetdtl.getText();
				Text oldText = textMapper.selectByPrimaryKey("" + templetdtl.getObjid());
				if (oldText == null) {
					text.setOrgid(templet.getOrgid());
					text.setBranchid(0);
					text.setName(templet.getName() + "-" + templetdtl.getTempletdtlid());
					text.setType(Medialist.Type_Private);
					text.setCreatestaffid(templet.getCreatestaffid());
					textMapper.insertSelective(text);
				} else {
					text.setTextid(templetdtl.getObjid());
					textMapper.updateByPrimaryKeySelective(text);
				}
				templetdtl.setObjid(text.getTextid());
			} else if (templetdtl.getObjtype().equals(Templetdtl.ObjType_Stream)) {
				Stream stream = templetdtl.getStream();
				Stream oldStream = streamMapper.selectByPrimaryKey("" + templetdtl.getObjid());
				if (oldStream == null) {
					stream.setOrgid(templet.getOrgid());
					stream.setBranchid(0);
					stream.setName(templet.getName() + "-" + templetdtl.getTempletdtlid());
					stream.setType(Medialist.Type_Private);
					stream.setCreatestaffid(templet.getCreatestaffid());
					streamMapper.insertSelective(stream);
				} else {
					stream.setStreamid(templetdtl.getObjid());
					streamMapper.updateByPrimaryKeySelective(stream);
				}
				templetdtl.setObjid(stream.getStreamid());
			} else if (templetdtl.getObjtype().equals(Templetdtl.ObjType_Widget)) {
				Widget widget = templetdtl.getWidget();
				Widget oldWidget = widgetMapper.selectByPrimaryKey("" + templetdtl.getObjid());
				if (oldWidget == null) {
					widget.setOrgid(templet.getOrgid());
					widget.setBranchid(0);
					widget.setName(templet.getName() + "-" + templetdtl.getTempletdtlid());
					widget.setType(Medialist.Type_Private);
					widget.setCreatestaffid(templet.getCreatestaffid());
					widgetMapper.insertSelective(widget);
				} else {
					widget.setWidgetid(templetdtl.getObjid());
					widgetMapper.updateByPrimaryKeySelective(widget);
				}
				templetdtl.setObjid(widget.getWidgetid());
			} else if (templetdtl.getObjtype().equals(Templetdtl.ObjType_Rss)) {
				Rss rss = templetdtl.getRss();
				Rss oldRss = rssMapper.selectByPrimaryKey("" + templetdtl.getObjid());
				if (oldRss == null) {
					rss.setOrgid(templet.getOrgid());
					rss.setBranchid(0);
					rss.setName(templet.getName() + "-" + templetdtl.getTempletdtlid());
					rss.setType(Medialist.Type_Private);
					rss.setCreatestaffid(templet.getCreatestaffid());
					rssMapper.insertSelective(rss);
				} else {
					rss.setRssid(templetdtl.getObjid());
					rssMapper.updateByPrimaryKeySelective(rss);
				}
				templetdtl.setObjid(rss.getRssid());
			}

			templetdtlMapper.updateByPrimaryKeySelective(templetdtl);
		}

		String snapshotdtl = templet.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
		}
		String snapshotFilePath = "/templet/" + templet.getTempletid() + "/snapshot/" + templet.getTempletid() + ".png";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		templet.setSnapshot(snapshotFilePath);
		templetMapper.updateByPrimaryKeySelective(templet);
	}

}
