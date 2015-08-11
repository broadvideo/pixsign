package com.broadvideo.signage.service;

import java.io.StringReader;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.log4j.Logger;
import org.jdom2.CDATA;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.filter.Filter;
import org.jdom2.filter.Filters;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.jdom2.xpath.XPathBuilder;
import org.jdom2.xpath.XPathExpression;
import org.jdom2.xpath.XPathFactory;
import org.jdom2.xpath.jaxen.JaxenXPathFactory;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xml.sax.InputSource;

import com.broadvideo.signage.domain.Device;
import com.broadvideo.signage.domain.Layout;
import com.broadvideo.signage.domain.Media;
import com.broadvideo.signage.domain.Region;
import com.broadvideo.signage.domain.Regiondtl;
import com.broadvideo.signage.domain.Schedule;
import com.broadvideo.signage.domain.Task;
import com.broadvideo.signage.domain.Tpllayout;
import com.broadvideo.signage.domain.Tplregion;
import com.broadvideo.signage.persistence.DeviceMapper;
import com.broadvideo.signage.persistence.LayoutMapper;
import com.broadvideo.signage.persistence.MediaMapper;
import com.broadvideo.signage.persistence.RegionMapper;
import com.broadvideo.signage.persistence.RegiondtlMapper;
import com.broadvideo.signage.persistence.ScheduleMapper;
import com.broadvideo.signage.persistence.TaskMapper;
import com.broadvideo.signage.persistence.TpllayoutMapper;
import com.broadvideo.signage.util.KafkaUtil;

@Service("layoutService")
public class LayoutServiceImpl implements LayoutService {

	private static Logger logger = Logger.getLogger(LayoutServiceImpl.class);
	
	@Autowired
	private LayoutMapper layoutMapper ;
	@Autowired
	private RegionMapper regionMapper ;
	@Autowired
	private RegiondtlMapper regiondtlMapper;
	@Autowired
	private TpllayoutMapper tpllayoutMapper ;
	@Autowired
	private DeviceMapper deviceMapper ;	
	@Autowired
	private MediaMapper mediaMapper ;	
	@Autowired
	private TaskMapper taskMapper ;
	@Autowired
	private ScheduleMapper scheduleMapper ;
	
	@Autowired
	private SchedulefileService schedulefileService;
	@Autowired
	private DevicefileService devicefileService;

	public int selectCount(int orgid, int branchid, String search) {
		return layoutMapper.selectCount(orgid, branchid, search);
	}
	
	public List<Layout> selectList(int orgid, int branchid, String search, String start, String length) {
		return layoutMapper.selectList(orgid, branchid, search, start, length);
	}
	
	public Layout selectByPrimaryKey(String layoutid) {
		return layoutMapper.selectByPrimaryKey(layoutid);
	}
	
	public Layout selectWithXmlByPrimaryKey(String layoutid) {
		return layoutMapper.selectWithXmlByPrimaryKey(layoutid);
	}
	
	public String selectPreviewXlf(String layoutid) {
		Layout layout = layoutMapper.selectWithXmlByPrimaryKey(layoutid);
		String xml = layout.getXml();
		
		try {
			Document doc = new SAXBuilder().build(new InputSource(new StringReader(xml)));
			Element root = doc.getRootElement();
			Filter<Element> filter = Filters.element();
			XPathBuilder<Element> builder = new XPathBuilder<Element>("//media[@type='video']", filter);
			XPathFactory factory = JaxenXPathFactory.instance();
			XPathExpression<Element> objs = builder.compileWith(factory);
			List<Element> objList = objs.diagnose(root, false).getResult();
			for (int i=0; i<objList.size(); i++) {
				Element e = objList.get(i);
				String mediaid = e.getAttributeValue("id");
				Media media = mediaMapper.selectByPrimaryKey(mediaid);
				if (media.getPreviewduration() == null || media.getPreviewduration() == 0) {
					e.setAttribute("duration", "10");
				} else {
					e.setAttribute("duration", "" + media.getPreviewduration());
				}
			}
			XMLOutputter xmlOutput = new XMLOutputter();
			xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
			xml = xmlOutput.outputString(doc);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		
		return xml;
	}
	
	@Transactional
	public void addLayout(Layout layout, int tpllayoutid) {
		Tpllayout tpllayout = tpllayoutMapper.selectByPrimaryKey("" + tpllayoutid);
		List<Tplregion> tplregions = tpllayout.getTplregions();
		layout.setHeight(tpllayout.getHeight());
		layout.setWidth(tpllayout.getWidth());
		layoutMapper.insert(layout);
		for (int i=0; i<tplregions.size(); i++) {
			Tplregion tplregion = tplregions.get(i);
			Region region = new Region();
			region.setLayoutid(layout.getLayoutid());
			region.setCode(tplregion.getCode());
			region.setHeight(tplregion.getHeight());
			region.setWidth(tplregion.getWidth());
			region.setTopoffset(tplregion.getTopoffset());
			region.setLeftoffset(tplregion.getLeftoffset());
			region.setZindex(tplregion.getZindex());
			regionMapper.insert(region);
		}
		
		Layout newLayout = layoutMapper.selectByPrimaryKey("" + layout.getLayoutid());
		newLayout.setXml(generateXML(newLayout));
		try {
			byte[] bs = newLayout.getXml().getBytes("UTF-8");
			newLayout.setXmlsize(bs.length);
			newLayout.setXmlmd5(DigestUtils.md5Hex(bs));
		} catch (Exception e) {}
		layoutMapper.updateByPrimaryKeySelective(newLayout);
	}
	
	public void updateLayout(Layout layout) {
		layoutMapper.updateByPrimaryKeySelective(layout);
	}

	@Transactional
	public void updateLayoutWithRegion(Layout layout) {
		String oldMd5 = layout.getXmlmd5();
		if (oldMd5 == null) {
			oldMd5 = "";
		}
		layoutMapper.updateByPrimaryKeySelective(layout);
		List<Regiondtl> oldregiondtls = regiondtlMapper.selectByLayout(layout.getLayoutid());
		HashMap<Integer, Regiondtl> hash = new HashMap<Integer, Regiondtl>();
		for (int i=0; i<layout.getRegions().size(); i++) {
			Region region = layout.getRegions().get(i);
			for (int j=0; j<region.getRegiondtls().size(); j++) {
				Regiondtl regiondtl = region.getRegiondtls().get(j);
				if (regiondtl.getRegiondtlid() == 0) {
					regiondtlMapper.insert(regiondtl);
				} else {
					regiondtlMapper.updateByPrimaryKey(regiondtl);
					hash.put(regiondtl.getRegiondtlid(), regiondtl);
				}
			}
		}
		for (int i=0; i<oldregiondtls.size(); i++) {
			if (hash.get(oldregiondtls.get(i).getRegiondtlid()) == null) {
				regiondtlMapper.deleteByPrimaryKey(oldregiondtls.get(i).getRegiondtlid());
			}
		}

		Layout newLayout = layoutMapper.selectByPrimaryKey("" + layout.getLayoutid());
		newLayout.setXml(generateXML(newLayout));
		try {
			byte[] bs = newLayout.getXml().getBytes("UTF-8");
			newLayout.setXmlsize(bs.length);
			newLayout.setXmlmd5(DigestUtils.md5Hex(bs));
		} catch (Exception e) {}
		
		if (!newLayout.getXmlmd5().equals(oldMd5)) {
			layoutMapper.updateByPrimaryKeySelective(newLayout);
			
			//update device.schedulestatus and devicefile
			/*
			List<Device> devices = deviceMapper.selectByLayout(layout.getLayoutid());
			for (int i=0; i<devices.size(); i++) {
				Device device = devices.get(i);
				device.setSchedulestatus("1");
				deviceMapper.updateByPrimaryKey(device);
				devicefileService.updateDevicefileByDevice(""+device.getDeviceid());
			}*/
		}
	}
	
	@Transactional
	public void handleWizard(Layout layout, Task task) {
		String oldMd5 = layout.getXmlmd5();
		if (oldMd5 == null) {
			oldMd5 = "";
		}
		if (layout.getLayoutid() == 0) {
			layoutMapper.insert(layout);
			for (int i=0; i<layout.getRegions().size(); i++) {
				Region region = layout.getRegions().get(i);
				region.setLayoutid(layout.getLayoutid());
				regionMapper.insert(region);
			}
		} else {			
			layoutMapper.updateByPrimaryKeySelective(layout);
		}
		
		List<Regiondtl> oldregiondtls = regiondtlMapper.selectByLayout(layout.getLayoutid());
		HashMap<Integer, Regiondtl> hash = new HashMap<Integer, Regiondtl>();
		for (int i=0; i<layout.getRegions().size(); i++) {
			Region region = layout.getRegions().get(i);
			for (int j=0; j<region.getRegiondtls().size(); j++) {
				Regiondtl regiondtl = region.getRegiondtls().get(j);
				if (regiondtl.getRegiondtlid() == 0) {
					regiondtl.setRegionid(region.getRegionid());
					regiondtlMapper.insert(regiondtl);
				} else {
					regiondtlMapper.updateByPrimaryKey(regiondtl);
					hash.put(regiondtl.getRegiondtlid(), regiondtl);
				}
			}
		}
		for (int i=0; i<oldregiondtls.size(); i++) {
			if (hash.get(oldregiondtls.get(i).getRegiondtlid()) == null) {
				regiondtlMapper.deleteByPrimaryKey(oldregiondtls.get(i).getRegiondtlid());
			}
		}

		//Update XML
		Layout newLayout = layoutMapper.selectByPrimaryKey("" + layout.getLayoutid());
		newLayout.setXml(generateXML(newLayout));
		try {
			byte[] bs = newLayout.getXml().getBytes("UTF-8");
			newLayout.setXmlsize(bs.length);
			newLayout.setXmlmd5(DigestUtils.md5Hex(bs));
		} catch (Exception e) {}
		
		if (!newLayout.getXmlmd5().equals(oldMd5)) {
			layoutMapper.updateByPrimaryKeySelective(newLayout);
		}

		//Add Task
		SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		if (task.getType().equals("2")) {
			task.setFromdate(Calendar.getInstance().getTime());
			if (task.getTodate() == null) {
				try {
					task.setTodate(dateformat.parse("2037-01-01 00:00:00"));
				} catch (Exception ex) { }
			}
		}
		long filesize = 0;
		filesize = layoutMapper.sumMediaSize(""+layout.getLayoutid());
		task.setFilesize(filesize);
		taskMapper.insert(task);
		
		//Add Schedule
		List<Schedule> schedules = task.getSchedules();
		HashMap<String, Schedule> scheduleHash = new HashMap<String, Schedule>();
		for (int i=0; i<schedules.size(); i++) {
			Schedule schedule = schedules.get(i);
			schedule.setTaskid(task.getTaskid());
			schedule.setLayoutid(layout.getLayoutid());
			schedule.setSyncstatus("0");
			schedule.setStatus("1");
			schedule.setComplete(0);
			schedule.setFilesize(filesize);
			schedule.setFilesizecomplete((long)0);
			schedule.setCreatestaffid(task.getCreatestaffid());
			if (schedule.getType().equals("2")) {
				schedule.setFromdate(task.getFromdate());
				schedule.setTodate(task.getTodate());
			}

			int deviceid = schedule.getDeviceid();
			int devicegroupid = schedule.getDevicegroupid();
			if (deviceid > 0) {
				if (scheduleHash.get("" + deviceid) == null) {
					scheduleHash.put("" + deviceid, schedule);
				}
			} else if (devicegroupid > 0) {
				List<Device> devices = deviceMapper.selectByDeviceGroup(""+devicegroupid);
				for (int j=0; j<devices.size(); j++) {
					if (scheduleHash.get("" + devices.get(j).getDeviceid()) == null) {
						Schedule newSchedule = new Schedule();
						newSchedule.setTaskid(task.getTaskid());
						newSchedule.setDeviceid(devices.get(j).getDeviceid());
						newSchedule.setLayoutid(schedule.getLayoutid());
						newSchedule.setType(schedule.getType());
						newSchedule.setFromdate(schedule.getFromdate());
						newSchedule.setTodate(schedule.getTodate());
						newSchedule.setPriority(schedule.getPriority());
						newSchedule.setSyncstatus("0");
						newSchedule.setStatus("1");
						newSchedule.setComplete(0);
						newSchedule.setCreatestaffid(task.getCreatestaffid());
						scheduleHash.put("" + deviceid, newSchedule);
					}
				}
			}
		}
		
		for (Map.Entry<String, Schedule> entry : scheduleHash.entrySet()) {  
			Schedule schedule = entry.getValue();
			if (schedule.getDeviceid() > 0) {
				if (schedule.getType().equals("2")) {
					scheduleMapper.updateStatusByDevice(""+schedule.getDeviceid(), "0");
				}
				scheduleMapper.insert(schedule);
				schedulefileService.insertSchedulefileBySchedule(schedule);
				
				Device device = deviceMapper.selectByPrimaryKey(""+schedule.getDeviceid());
				device.setDeviceid(schedule.getDeviceid());
				device.setSchedulestatus("1");
				deviceMapper.updateByPrimaryKeySelective(device);
				devicefileService.updateDevicefileByDevice(""+schedule.getDeviceid());
				
				//For PIDS urgent schedule
				if (schedule.getUtype().equals("1")) {
					try {
					//Call Kafka Message System
						Date now = Calendar.getInstance().getTime();
						JSONObject msgJson = new JSONObject();
						msgJson.put("MsgSeq", "" + now.getTime());
						msgJson.put("MsgType", "ulayout");
						msgJson.put("PublishTime", dateformat.format(now));
						JSONObject bodyJson = new JSONObject();
						msgJson.put("MsgBody", bodyJson);
						bodyJson.put("LayoutFile", "" + layout.getLayoutid() + ".xlf");
						bodyJson.put("LayoutContent", Base64.encodeBase64String(newLayout.getXml().getBytes("UTF-8")));
						bodyJson.put("EndTime", "" + dateformat.format(schedule.getTodate()));
						bodyJson.put("LayoutFlag", "2");
						String msg = msgJson.toString();
						logger.info("Begin to publish message to Kafka with topic(" + device.getTerminalid() + "): " + msg);
						KafkaUtil.publish(device.getTerminalid(), msg);
					} catch (Exception e) {
						e.printStackTrace();
						logger.error("Error to publish message to Kafka: " + e.getMessage());
					}
				}
			}
		}

		//update device.schedulestatus and devicefile
		/*
		if (!newLayout.getXmlmd5().equals(oldMd5)) {
			List<Device> devices = deviceMapper.selectByLayout(layout.getLayoutid());
			for (int i=0; i<devices.size(); i++) {
				Device device = devices.get(i);
				device.setSchedulestatus("1");
				deviceMapper.updateByPrimaryKey(device);
				devicefileService.updateDevicefileByDevice(""+device.getDeviceid());
			}
		}*/
		
	}
	
	public void deleteLayout(String[] ids) {
		String s = "";
		if (ids.length > 0) s = ids[0];
		for (int i=1; i<ids.length; i++) {
			s += "," + ids[i];
		}
		layoutMapper.deleteByKeys(s);
	}
	
	public Regiondtl selectRegiondtl(String regiondtlid) {
		return regiondtlMapper.selectByPrimaryKey(regiondtlid);
	}
	
	private String generateXML(Layout layout) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		Element layoutElement = new Element("layout");
		Document doc = new Document(layoutElement);
		layoutElement.setAttribute("version", "1");
		layoutElement.setAttribute("width", "" + layout.getWidth());
		layoutElement.setAttribute("height", "" + layout.getHeight());
		if (layout.getBgmedia() != null) {
			layoutElement.setAttribute("background", layout.getBgmedia().getFilename());
		}
		if (layout.getBgcolor() != null) {
			layoutElement.setAttribute("bgcolor", layout.getBgcolor());
		}
		
		for (int i=0; i<layout.getRegions().size(); i++) {
			Region region = layout.getRegions().get(i);
			Element regionElement = new Element("region");
			layoutElement.addContent(regionElement);
			regionElement.setAttribute("id", "" + region.getRegionid());
			regionElement.setAttribute("width", "" + region.getWidth());
			regionElement.setAttribute("height", "" + region.getHeight());
			regionElement.setAttribute("top", "" + region.getTopoffset());
			regionElement.setAttribute("left", "" + region.getLeftoffset());
			regionElement.setAttribute("zindex", "" + region.getZindex());
			
			for (int j=0; j<region.getRegiondtls().size(); j++) {
				Regiondtl regiondtl = region.getRegiondtls().get(j);
				Element mediaElement = new Element("media");
				regionElement.addContent(mediaElement);
				if (regiondtl.getMediatype().equals("1")) {
					mediaElement.setAttribute("id", "" + regiondtl.getMediaid());
					mediaElement.setAttribute("duration", "" + regiondtl.getDuration());
					mediaElement.setAttribute("type", "image");
					Element optionsElement = new Element("options");
					mediaElement.addContent(optionsElement);
					optionsElement.addContent(new Element("uri").setText(regiondtl.getMedia().getFilename())); 
					mediaElement.addContent(new Element("raw"));
				} else if (regiondtl.getMediatype().equals("2") || regiondtl.getMediatype().equals("5") || regiondtl.getMediatype().equals("6")) {
					mediaElement.setAttribute("id", "" + regiondtl.getMediaid());
					mediaElement.setAttribute("duration", "" + regiondtl.getDuration());
					mediaElement.setAttribute("type", "video");
					Element optionsElement = new Element("options");
					mediaElement.addContent(optionsElement);
					optionsElement.addContent(new Element("uri").setText(regiondtl.getMedia().getFilename())); 
					mediaElement.addContent(new Element("raw"));
				} else if (regiondtl.getMediatype().equals("3")) {
					mediaElement.setAttribute("id", "text" + regiondtl.getRegiondtlid());
					mediaElement.setAttribute("duration", "" + regiondtl.getDuration());
					mediaElement.setAttribute("type", "text");
					Element optionsElement = new Element("options");
					mediaElement.addContent(optionsElement);
					String direction = "left";
					if (regiondtl.getDirection().equals("1")) {
						direction = "none";
					} else if (regiondtl.getDirection().equals("2")) {
						direction = "up";
					} else if (regiondtl.getDirection().equals("3")) {
						direction = "down";
					} else if (regiondtl.getDirection().equals("4")) {
						direction = "left";
					} else if (regiondtl.getDirection().equals("5")) {
						direction = "right";
					}
					optionsElement.addContent(new Element("direction").setText(direction));
					optionsElement.addContent(new Element("speed").setText("" + regiondtl.getSpeed())); 
					optionsElement.addContent(new Element("color").setText(regiondtl.getColor())); 
					optionsElement.addContent(new Element("size").setText("" + regiondtl.getSize())); 
					optionsElement.addContent(new Element("opacity").setText("" + regiondtl.getOpacity()));
					Element rawElement = new Element("raw");
					mediaElement.addContent(rawElement);
					rawElement.addContent(new Element("text").addContent(new CDATA(regiondtl.getRaw())));
				} else if (regiondtl.getMediatype().equals("4")) {
					mediaElement.setAttribute("id", "live" + regiondtl.getRegiondtlid());
					mediaElement.setAttribute("duration", "0");
					mediaElement.setAttribute("type", "live");
					Element optionsElement = new Element("options");
					mediaElement.addContent(optionsElement);
					optionsElement.addContent(new Element("uri").setText("" + regiondtl.getUri())); 
					optionsElement.addContent(new Element("from").setText(dateFormat.format(regiondtl.getFromdate()))); 
					optionsElement.addContent(new Element("to").setText(dateFormat.format(regiondtl.getTodate())));
					mediaElement.addContent(new Element("raw"));
				} else if (regiondtl.getMediatype().equals("7")) {
					mediaElement.setAttribute("id", "widget" + regiondtl.getRegiondtlid());
					mediaElement.setAttribute("duration", "" + regiondtl.getDuration());
					mediaElement.setAttribute("type", "widget");
					Element optionsElement = new Element("options");
					mediaElement.addContent(optionsElement);
					optionsElement.addContent(new Element("uri").setText("" + regiondtl.getUri())); 
					mediaElement.addContent(new Element("raw"));
				} else if (regiondtl.getMediatype().equals("8")) {
					mediaElement.setAttribute("id", "pixcast" + regiondtl.getRegiondtlid());
					mediaElement.setAttribute("duration", "0");
					mediaElement.setAttribute("type", "pixcast");
					mediaElement.addContent(new Element("options"));
					mediaElement.addContent(new Element("raw"));
				}
			}
		}
		XMLOutputter xmlOutput = new XMLOutputter();
		xmlOutput.setFormat(Format.getPrettyFormat().setEncoding("UTF-8"));
		return xmlOutput.outputString(doc);
	}

}
