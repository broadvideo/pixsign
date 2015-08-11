package com.broadvideo.signage.pixcast;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.log4j.Logger;
import org.jdom2.CDATA;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.signage.common.CommonConfig;
import com.broadvideo.signage.domain.Device;
import com.broadvideo.signage.domain.Layout;
import com.broadvideo.signage.domain.Media;
import com.broadvideo.signage.domain.Org;
import com.broadvideo.signage.domain.Region;
import com.broadvideo.signage.domain.Regiondtl;
import com.broadvideo.signage.domain.Staff;
import com.broadvideo.signage.domain.Tpllayout;
import com.broadvideo.signage.domain.Tplregion;
import com.broadvideo.signage.persistence.ConfigMapper;
import com.broadvideo.signage.persistence.DeviceMapper;
import com.broadvideo.signage.persistence.LayoutMapper;
import com.broadvideo.signage.persistence.MediaMapper;
import com.broadvideo.signage.persistence.OrgMapper;
import com.broadvideo.signage.persistence.RegionMapper;
import com.broadvideo.signage.persistence.RegiondtlMapper;
import com.broadvideo.signage.persistence.StaffMapper;
import com.broadvideo.signage.persistence.TpllayoutMapper;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;

@Component
@Consumes("application/json;charset=UTF-8")
@Produces("application/json;charset=UTF-8")
@Path("/pixcast")
public class PixcastService {

	private static final Logger log = Logger.getLogger(PixcastService.class);

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private MediaMapper mediaMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private LayoutMapper layoutMapper;
	@Autowired
	private RegionMapper regionMapper;
	@Autowired
	private RegiondtlMapper regiondtlMapper;
	@Autowired
	private TpllayoutMapper tpllayoutMapper;

	@POST
	@Path("login")
	public String login(String request) {
		try {
			log.info("pixcast login: " + request);
			JSONObject requestJson = new JSONObject(request);
			String username = requestJson.getString("username");
			String password = requestJson.getString("password");
			String org = "pixcast";
			List<Staff> staffs = staffMapper.selectByOrgLogin(username, password, org);
			if (staffs.size() > 0) {
				JSONObject responseJson = new JSONObject().put("code", 0).put("message", "success");
				JSONObject dataJson = new JSONObject();
				responseJson.put("data", dataJson);
				dataJson.put("token", staffs.get(0).getToken());
				log.info("TMS response: " + responseJson.toString());
				return responseJson.toString();
			} else {
				return handleResult("1001", "fail to login");
			}
		} catch (Exception e) {
			return handleResult("1003", e.getMessage());
		}

	}

	@POST
	@Path("logout")
	public String logout(String request) {
		try {
			log.info("pixcast logout: " + request);
			JSONObject requestJson = new JSONObject(request);
			String token = requestJson.getString("token");
			List<Staff> staffs = staffMapper.selectByUploadkey(token);
			if (staffs.size() == 0) {
				return handleResult("1002", "token error");
			}
			return handleResult("0", "success");
		} catch (Exception e) {
			return handleResult("1003", e.getMessage());
		}
	}

	@POST
	@Path("getvideos")
	public String getvideos(String request) {
		try {
			log.info("pixcast getvideos: " + request);
			JSONObject requestJson = new JSONObject(request);
			String start = requestJson.getString("start");
			String length = requestJson.getString("length");
			String search = requestJson.getString("search");
			String token = requestJson.getString("token");
			List<Staff> staffs = staffMapper.selectByUploadkey(token);
			if (staffs.size() == 0) {
				return handleResult("1002", "token error");
			}

			if (start != null) {
				try {
					Integer.parseInt(start);
				} catch (Exception e) {
					start = null;
				}
			}
			if (length != null) {
				try {
					Integer.parseInt(length);
				} catch (Exception e) {
					length = null;
				}
			}

			String serverip = configMapper.selectValueByCode("ServerIP");
			String serverport = configMapper.selectValueByCode("ServerPort");

			List<Media> medias = mediaMapper.selectList("" + staffs.get(0).getOrgid(), null, "2", null, search, start,
					length);

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "success");
			JSONObject dataJson = new JSONObject();
			responseJson.put("data", dataJson);
			JSONArray videosJson = new JSONArray();
			dataJson.put("videos", videosJson);
			for (int i = 0; i < medias.size(); i++) {
				Media media = medias.get(i);
				JSONObject videoJson = new JSONObject();
				videoJson.put("videoid", "" + media.getMediaid());
				videoJson.put("name", media.getName());
				videoJson.put("poster", "http://" + serverip + ":" + serverport
						+ "/pixorg/web/org/media!getthumb.action?mediaid=" + media.getMediaid());
				videosJson.put(videoJson);
			}
			log.info("pixcast response: " + responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			return handleResult("1003", e.getMessage());
		}
	}

	@POST
	@Path("getchannels")
	public String getchannels(String request) {
		try {
			log.info("pixcast getchannels: " + request);
			JSONObject requestJson = new JSONObject(request);
			String token = requestJson.getString("token");
			List<Staff> staffs = staffMapper.selectByUploadkey(token);
			if (staffs.size() == 0) {
				return handleResult("1002", "token error");
			}

			List<Device> devices = deviceMapper.selectList("" + staffs.get(0).getOrgid(), ""
					+ staffs.get(0).getBranchid(), null, null, null, null, null, null, null);

			JSONObject responseJson = new JSONObject().put("code", 0).put("message", "success");
			JSONObject dataJson = new JSONObject();
			responseJson.put("data", dataJson);
			JSONArray devicesJson = new JSONArray();
			dataJson.put("channels", devicesJson);
			for (int i = 0; i < devices.size(); i++) {
				Device device = devices.get(i);
				JSONObject deviceJson = new JSONObject();
				deviceJson.put("channelid", "" + device.getDeviceid());
				deviceJson.put("name", device.getName());
				int port = device.getDeviceid() + 5453;
				deviceJson.put("url", "rtsp://" + CommonConfig.CONFIG_SERVER_IP + ":" + port + "/stream0");
				devicesJson.put(deviceJson);
			}
			log.info("pixcast response: " + responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			return handleResult("1003", e.getMessage());
		}
	}

	@POST
	@Path("addchannel")
	public String addchannel(String request) {
		try {
			log.info("pixcast addchannel: " + request);
			JSONObject requestJson = new JSONObject(request);
			String name = requestJson.getString("name");
			String desc = requestJson.getString("desc");
			String token = requestJson.getString("token");
			List<Staff> staffs = staffMapper.selectByUploadkey(token);
			if (staffs.size() == 0) {
				return handleResult("1002", "token error");
			}

			List<Device> devices = deviceMapper.selectUnregisterList("" + staffs.get(0).getOrgid(), null, null, null);
			if (devices.size() > 0) {
				Device device = devices.get(0);
				device.setStatus("1");
				device.setName(name);
				device.setDescription(desc);
				deviceMapper.updateByPrimaryKey(device);

				if (syncChannel(device)) {
					return handleResult("0", "success");
				} else {
					return handleResult("1004", "sync error");
				}
			} else {
				return handleResult("2002", "channel exceeds the limit");
			}
		} catch (Exception e) {
			return handleResult("1003", e.getMessage());
		}
	}

	@POST
	@Path("updatechannel")
	public String updatechannel(String request) {
		try {
			log.info("pixcast updatechannel: " + request);
			JSONObject requestJson = new JSONObject(request);
			String channelid = requestJson.getString("channelid");
			String name = requestJson.getString("name");
			String desc = requestJson.getString("desc");
			String token = requestJson.getString("token");
			List<Staff> staffs = staffMapper.selectByUploadkey(token);
			if (staffs.size() == 0) {
				return handleResult("1002", "token error");
			}

			Device device = deviceMapper.selectByPrimaryKey(channelid);
			if (device != null) {
				device.setName(name);
				device.setDescription(desc);
				deviceMapper.updateByPrimaryKey(device);

				if (syncChannel(device)) {
					return handleResult("0", "success");
				} else {
					return handleResult("1004", "sync error");
				}
			} else {
				return handleResult("2001", "channel not found");
			}
		} catch (Exception e) {
			return handleResult("1003", e.getMessage());
		}
	}

	@POST
	@Path("delchannel")
	public String delchannel(String request) {
		try {
			log.info("pixcast delchannel: " + request);
			JSONObject requestJson = new JSONObject(request);
			String channelid = requestJson.getString("channelid");
			String token = requestJson.getString("token");
			List<Staff> staffs = staffMapper.selectByUploadkey(token);
			if (staffs.size() == 0) {
				return handleResult("1002", "token error");
			}

			Device device = deviceMapper.selectByPrimaryKey(channelid);
			if (device != null) {
				device.setStatus("9");
				deviceMapper.deleteByKeys(channelid);

				if (syncChannel(device)) {
					return handleResult("0", "success");
				} else {
					return handleResult("1004", "sync error");
				}
			} else {
				return handleResult("2001", "channel not found");
			}
		} catch (Exception e) {
			return handleResult("1003", e.getMessage());
		}
	}

	@POST
	@Path("getplaylist")
	public String getplaylist(String request) {
		try {
			log.info("pixcast getplaylist: " + request);
			JSONObject requestJson = new JSONObject(request);
			String channelid = requestJson.getString("channelid");
			String token = requestJson.getString("token");
			List<Staff> staffs = staffMapper.selectByUploadkey(token);
			if (staffs.size() == 0) {
				return handleResult("1002", "token error");
			}

			String serverip = configMapper.selectValueByCode("ServerIP");
			String serverport = configMapper.selectValueByCode("ServerPort");

			Device device = deviceMapper.selectByPrimaryKey(channelid);
			if (device != null) {
				ArrayList<Media> playlist = new ArrayList<Media>();
				if (device.getOnlinelayoutid() != null) {
					Layout layout = layoutMapper.selectByPrimaryKey("" + device.getOnlinelayoutid());
					if (layout != null) {
						for (Region region : layout.getRegions()) {
							if (region.getCode().equals("Main")) {
								for (Regiondtl regiondtl : region.getRegiondtls()) {
									playlist.add(regiondtl.getMedia());
								}
								break;
							}
						}
					}
				}

				JSONObject responseJson = new JSONObject().put("code", 0).put("message", "success");
				JSONObject dataJson = new JSONObject();
				responseJson.put("data", dataJson);
				JSONArray playdtlsJson = new JSONArray();
				dataJson.put("playdtls", playdtlsJson);
				for (Media media : playlist) {
					JSONObject mediaJson = new JSONObject();
					mediaJson.put("videoid", "" + media.getMediaid());
					mediaJson.put("name", media.getName());
					mediaJson.put("poster", "http://" + serverip + ":" + serverport
							+ "/pixorg/web/org/media!getthumb.action?mediaid=" + media.getMediaid());
					playdtlsJson.put(mediaJson);
				}
				log.info("pixcast response: " + responseJson.toString());
				return responseJson.toString();
			} else {
				return handleResult("2001", "channel not found");
			}
		} catch (Exception e) {
			return handleResult("1003", e.getMessage());
		}
	}

	@POST
	@Path("updateplaylist")
	public String updateplaylist(String request) {
		try {
			log.info("pixcast updateplaylist: " + request);
			JSONObject requestJson = new JSONObject(request);
			String channelid = requestJson.getString("channelid");
			JSONArray playdtls = requestJson.getJSONArray("playdtls");
			String token = requestJson.getString("token");
			List<Staff> staffs = staffMapper.selectByUploadkey(token);
			if (staffs.size() == 0) {
				return handleResult("1002", "token error");
			}
			Staff staff = staffs.get(0);

			Device device = deviceMapper.selectByPrimaryKey(channelid);
			if (device != null) {
				Layout layout;
				if (device.getOnlinelayoutid() != null) {
					layout = layoutMapper.selectByPrimaryKey("" + device.getOnlinelayoutid());
					if (layout == null) {
						layout = newLayout(staff);
					}
				} else {
					layout = newLayout(staff);
				}
				for (Region region : layout.getRegions()) {
					if (region.getCode().equals("Main")) {
						regiondtlMapper.deleteByRegion(region.getRegionid());
						for (int i = 0; i < playdtls.length(); i++) {
							JSONObject playdtl = playdtls.getJSONObject(i);
							Media video = mediaMapper.selectByPrimaryKey(playdtl.getString("videoid"));
							if (video != null) {
								Regiondtl regiondtl = new Regiondtl();
								regiondtl.setRegionid(region.getRegionid());
								regiondtl.setMediaid(playdtl.getInt("videoid"));
								regiondtl.setMediatype("2");
								regiondtl.setSequence(i + 1);
								regiondtl.setRaw(video.getName());
								regiondtl.setDuration(0);
								regiondtlMapper.insert(regiondtl);
							}
						}
					}
				}
				Layout newLayout = layoutMapper.selectByPrimaryKey("" + layout.getLayoutid());
				newLayout.setXml(generateXML(newLayout));
				try {
					byte[] bs = newLayout.getXml().getBytes("UTF-8");
					newLayout.setXmlsize(bs.length);
					newLayout.setXmlmd5(DigestUtils.md5Hex(bs));
				} catch (Exception e) {
				}
				layoutMapper.updateByPrimaryKeySelective(newLayout);

				device.setOnlinelayoutid(layout.getLayoutid());
				deviceMapper.updateByPrimaryKey(device);

				// Sync
				JSONObject syncJson = new JSONObject();
				syncJson.put("channelid", channelid);
				JSONArray playdtlsJson = new JSONArray();
				syncJson.put("playdtls", playdtlsJson);
				for (int i = 0; i < playdtls.length(); i++) {
					JSONObject playdtl = playdtls.getJSONObject(i);
					Media video = mediaMapper.selectByPrimaryKey(playdtl.getString("videoid"));
					if (video != null) {
						JSONObject playdtlJson = new JSONObject();
						playdtlJson.put("videoid", "" + video.getMediaid());
						playdtlJson.put("videofile", "/opt/pix/storage/video/" + video.getFilename());
						playdtlsJson.put(playdtlJson);
					}
				}
				if (syncPlaylist(syncJson.toString())) {
					return handleResult("0", "success");
				} else {
					return handleResult("1004", "sync error");
				}
			} else {
				return handleResult("2001", "channel not found");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return handleResult("1003", e.getMessage());
		}
	}

	private Layout newLayout(Staff staff) {
		List<Tpllayout> tpllayouts = tpllayoutMapper.selectByCode("Global");
		Tpllayout tpllayout = tpllayouts.get(0);
		List<Tplregion> tplregions = tpllayout.getTplregions();

		Layout layout = new Layout();
		layout.setName("Default");
		layout.setOrgid(staff.getOrgid());
		layout.setBranchid(staff.getBranchid());
		layout.setCreatestaffid(staff.getStaffid());
		layout.setStatus("1");
		layout.setType("0");
		layout.setHeight(tpllayout.getHeight());
		layout.setWidth(tpllayout.getWidth());
		layoutMapper.insert(layout);
		for (int i = 0; i < tplregions.size(); i++) {
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
		return layoutMapper.selectByPrimaryKey("" + layout.getLayoutid());
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

		for (int i = 0; i < layout.getRegions().size(); i++) {
			Region region = layout.getRegions().get(i);
			Element regionElement = new Element("region");
			layoutElement.addContent(regionElement);
			regionElement.setAttribute("id", "" + region.getRegionid());
			regionElement.setAttribute("width", "" + region.getWidth());
			regionElement.setAttribute("height", "" + region.getHeight());
			regionElement.setAttribute("top", "" + region.getTopoffset());
			regionElement.setAttribute("left", "" + region.getLeftoffset());
			regionElement.setAttribute("zindex", "" + region.getZindex());

			for (int j = 0; j < region.getRegiondtls().size(); j++) {
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
				} else if (regiondtl.getMediatype().equals("2") || regiondtl.getMediatype().equals("5")
						|| regiondtl.getMediatype().equals("6")) {
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

	private boolean syncChannel(Device device) {
		try {
			Org org = orgMapper.selectByCode("pixcast");
			Media backupmedia = org.getBackupmedia();

			JSONObject requestJson = new JSONObject();
			requestJson.put("channelid", "" + device.getDeviceid());
			requestJson.put("name", device.getName());
			requestJson.put("uri", "" + device.getDeviceid());
			int port = device.getDeviceid() + 5453;
			requestJson.put("port", "" + port);
			if (backupmedia != null) {
				requestJson.put("backupvideo", "/opt/pix/storage/video/" + backupmedia.getFilename());
			} else {
				requestJson.put("backupvideo", "");
			}
			if (device.getStatus().equals("1")) {
				requestJson.put("status", "1");
			} else {
				requestJson.put("status", "0");
			}
			String request = requestJson.toString();
			log.info("syncChannel request: " + request);

			Client c = Client.create();
			WebResource r = c.resource("http://" + CommonConfig.CONFIG_SERVER_IP + ":8099/channelinfo");
			String response = r.accept(MediaType.APPLICATION_JSON_TYPE).type(MediaType.APPLICATION_JSON_TYPE)
					.post(String.class, request);
			log.info("syncChannel response: " + response);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			log.error("syncChannel error: " + e.getMessage());
			return false;
		}
	}

	private boolean syncPlaylist(String request) {
		try {
			log.info("syncPlaylist request: " + request);

			Client c = Client.create();
			WebResource r = c.resource("http://" + CommonConfig.CONFIG_SERVER_IP + ":8099/playlist");
			String response = r.accept(MediaType.APPLICATION_JSON_TYPE).type(MediaType.APPLICATION_JSON_TYPE)
					.post(String.class, request);
			log.info("syncPlaylist response: " + response);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			log.error("syncPlaylist error: " + e.getMessage());
			return false;
		}
	}

	private String handleResult(String code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("code", code);
		responseJson.put("message", message);
		log.info("pixcast response: " + responseJson.toString());
		return responseJson.toString();
	}

}
