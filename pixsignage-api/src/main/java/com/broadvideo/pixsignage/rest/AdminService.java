package com.broadvideo.pixsignage.rest;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;

import javax.imageio.ImageIO;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.comparator.LastModifiedFileComparator;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegrid;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Folder;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.domain.Templet;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.BundleMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicegridMapper;
import com.broadvideo.pixsignage.persistence.DevicegroupMapper;
import com.broadvideo.pixsignage.persistence.FolderMapper;
import com.broadvideo.pixsignage.persistence.ImageMapper;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.persistence.TempletMapper;
import com.broadvideo.pixsignage.persistence.VideoMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Component
@Produces("application/json;charset=UTF-8")
@Path("/admin")
public class AdminService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private DevicegroupMapper devicegroupMapper;
	@Autowired
	private DevicegridMapper devicegridMapper;
	@Autowired
	private FolderMapper folderMapper;
	@Autowired
	private VideoMapper videoMapper;
	@Autowired
	private ImageMapper imageMapper;
	@Autowired
	private TempletMapper templetMapper;
	@Autowired
	private BundleMapper bundleMapper;

	// ==============================================================================
	// System Interface
	// ==============================================================================
	@GET
	@Path("login")
	@Produces("application/json;charset=UTF-8")
	public String login(@QueryParam("username") String username, @QueryParam("password") String password) {
		try {
			logger.info("Admin login: username={},password={}", username, password);
			Staff staff = staffMapper.login(username, password);

			if (username.equals("admin") && staff != null) {
				List<Staff> staffs = staffMapper.selectByLoginname("admin@default");
				staff = staffs.get(0);
				String token = CommonUtil.getMd5(username, "" + Math.random());
				staff.setToken(token);
				staffMapper.updateByPrimaryKeySelective(staff);
				JSONObject responseJson = new JSONObject();
				responseJson.put("code", 0);
				responseJson.put("message", "成功");
				JSONObject dataJson = new JSONObject();
				dataJson.put("token", token);
				responseJson.put("data", dataJson);
				logger.info("Admin login response: {}", responseJson.toString());
				return responseJson.toString();
			} else if (staff != null && staff.getOrg() != null) {
				String token = CommonUtil.getMd5(username, "" + Math.random());
				staff.setToken(token);
				staffMapper.updateByPrimaryKeySelective(staff);
				JSONObject responseJson = new JSONObject();
				responseJson.put("code", 0);
				responseJson.put("message", "成功");
				JSONObject dataJson = new JSONObject();
				dataJson.put("token", token);
				responseJson.put("data", dataJson);
				logger.info("Admin login response: {}", responseJson.toString());
				return responseJson.toString();
			} else {
				return handleResult(1003, "登录失败");
			}
		} catch (Exception e) {
			logger.error("Admin login exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("getversion")
	@Produces("application/json;charset=UTF-8")
	public String getversion(@QueryParam("appname") String appname) {
		try {
			logger.info("Admin getversion: appname={}", appname);

			File dir = new File("/pixdata/pixsignage/app");
			File[] files = dir.listFiles(new FilenameFilter() {
				@Override
				public boolean accept(File dir, String name) {
					return name.startsWith(appname + "-") && name.endsWith((".apk"));
				}
			});
			Arrays.sort(files, LastModifiedFileComparator.LASTMODIFIED_REVERSE);

			String vname = "";
			String vcode = "0";
			String url = "";
			if (files.length > 0) {
				String filename = files[0].getName();
				url = "/pixsigdata/app/" + filename;
				String[] apks = filename.split("-");
				if (apks.length >= 3) {
					vname = apks[1];
					vcode = apks[2];
					if (vcode.indexOf(".") > 0) {
						vcode = vcode.substring(0, vcode.indexOf("."));
					}
				}
			}

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONObject dataJson = new JSONObject();
			dataJson.put("name", vname);
			dataJson.put("code", vcode);
			dataJson.put("url", url);
			dataJson.put("mincode", vcode);
			responseJson.put("data", dataJson);
			logger.info("Admin getversion response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin getversion exception, ", e);
			return handleResult(2001, "系统异常");
		}
	}

	@GET
	@Path("devices")
	@Produces("application/json;charset=UTF-8")
	public String devices(@QueryParam("start") String start, @QueryParam("length") String length,
			@QueryParam("token") String token) {
		try {
			logger.info("Admin devices: start={},length={},token={}", start, length, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			List<Device> devices = deviceMapper.selectList("" + staff.getOrgid(), "" + staff.getBranchid(), "1", null,
					null, null, null, null, null, null, start, length, "deviceid");
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONObject dataJson = new JSONObject();
			JSONArray devicesJson = new JSONArray();
			for (Device device : devices) {
				JSONObject deviceJson = new JSONObject();
				deviceJson.put("device_id", "" + device.getDeviceid());
				deviceJson.put("terminal_id", device.getTerminalid());
				deviceJson.put("name", device.getName());
				deviceJson.put("status", device.getStatus());
				deviceJson.put("online", device.getOnlineflag());
				deviceJson.put("devicegroup_id", device.getDevicegroupid());
				deviceJson.put("city", device.getCity());
				deviceJson.put("addr", device.getAddr1() + " " + device.getAddr2());
				deviceJson.put("version", device.getMtype() + " " + device.getAppname() + " " + device.getVname() + "("
						+ device.getVcode() + ")");
				if (device.getRefreshtime() != null) {
					deviceJson.put("refreshtime",
							new SimpleDateFormat(CommonConstants.DateFormat_Full).format(device.getRefreshtime()));
				} else {
					deviceJson.put("refreshtime", "");
				}
				if (device.getActivetime() != null) {
					deviceJson.put("activetime",
							new SimpleDateFormat(CommonConstants.DateFormat_Full).format(device.getActivetime()));
				} else {
					deviceJson.put("activetime", "");
				}
				devicesJson.add(deviceJson);
			}
			dataJson.put("devices", devicesJson);
			responseJson.put("data", dataJson);
			logger.info("Admin devices response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin devices exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("devicegroups")
	@Produces("application/json;charset=UTF-8")
	public String devicegroups(@QueryParam("start") String start, @QueryParam("length") String length,
			@QueryParam("token") String token) {
		try {
			logger.info("Admin devicegroups: start={},length={},token={}", start, length, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			List<Devicegroup> devicegroups = devicegroupMapper.selectList("" + staff.getOrgid(),
					"" + staff.getBranchid(), Devicegroup.Type_Device, null, null, start, length);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONObject dataJson = new JSONObject();
			JSONArray devicegroupsJson = new JSONArray();
			for (Devicegroup devicegroup : devicegroups) {
				JSONObject devicegroupJson = new JSONObject();
				devicegroupJson.put("devicegroup_id", "" + devicegroup.getDevicegroupid());
				devicegroupJson.put("name", devicegroup.getName());
				devicegroupsJson.add(devicegroupJson);
			}
			dataJson.put("devicegroups", devicegroupsJson);
			responseJson.put("data", dataJson);
			logger.info("Admin devicegroups response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin devicegroups exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("devicegrids")
	@Produces("application/json;charset=UTF-8")
	public String devicegrids(@QueryParam("start") String start, @QueryParam("length") String length,
			@QueryParam("token") String token) {
		try {
			logger.info("Admin devicegrids: start={},length={},token={}", start, length, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			List<Devicegrid> devicegrids = devicegridMapper.selectList("" + staff.getOrgid(), "" + staff.getBranchid(),
					null, null, null, start, length);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONObject dataJson = new JSONObject();
			JSONArray devicegridsJson = new JSONArray();
			for (Devicegrid devicegrid : devicegrids) {
				JSONObject devicegridJson = new JSONObject();
				devicegridJson.put("device_grid_id", "" + devicegrid.getDevicegridid());
				devicegridJson.put("xcount", devicegrid.getXcount());
				devicegridJson.put("ycount", devicegrid.getYcount());
				devicegridJson.put("ratio", devicegrid.getRatio());
				JSONArray devicesJson = new JSONArray();
				for (Device device : devicegrid.getDevices()) {
					JSONObject deviceJson = new JSONObject();
					deviceJson.put("terminal_id", device.getTerminalid());
					deviceJson.put("name", device.getName());
					deviceJson.put("xpos", device.getXpos());
					deviceJson.put("ypos", device.getYpos());
					deviceJson.put("status", device.getStatus());
					devicesJson.add(deviceJson);
				}
				devicegridJson.put("devices", devicesJson);
				devicegridsJson.add(devicegridJson);
			}
			dataJson.put("devicegrids", devicegridsJson);
			responseJson.put("data", dataJson);
			logger.info("Admin devicegrids response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin devicegrids exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("bind")
	@Produces("application/json;charset=UTF-8")
	public String bind(@QueryParam("device_id") String deviceid, @QueryParam("terminal_id") String terminalid,
			@QueryParam("hardkey") String hardkey, @QueryParam("token") String token) {
		try {
			logger.info("Admin bind: device_id={},terminal_id={},hardkey={},token={}", deviceid, terminalid, hardkey,
					token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			Device device = deviceMapper.selectByHardkey(hardkey);
			if (device != null && !device.getTerminalid().equals(terminalid)) {
				device.setHardkey(null);
				device.setStatus("0");
				deviceMapper.updateByPrimaryKey(device);
			}

			device = deviceMapper.selectByTerminalid(terminalid);
			if (device == null) {
				return handleResult(1004, "无效终端号" + terminalid);
			} else if (device.getStatus().equals("1") && device.getHardkey() != null
					&& !device.getHardkey().equals(hardkey)) {
				return handleResult(1005, terminalid + "已经被别的终端注册.");
			}
			device.setHardkey(hardkey);
			device.setStatus("1");
			deviceMapper.updateByPrimaryKey(device);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Admin bind response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin bind exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("unbind")
	@Produces("application/json;charset=UTF-8")
	public String unbind(@QueryParam("device_id") String deviceid, @QueryParam("token") String token) {
		try {
			logger.info("Admin unbind: deviceid={},token={}", deviceid, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			Device device = deviceMapper.selectByPrimaryKey(deviceid);
			if (device == null) {
				return handleResult(1004, "无效终端" + deviceid);
			}
			device.setHardkey(null);
			device.setStatus("0");
			deviceMapper.updateByPrimaryKey(device);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Admin unbind response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin unbind exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("videos")
	@Produces("application/json;charset=UTF-8")
	public String videos(@QueryParam("start") String start, @QueryParam("length") String length,
			@QueryParam("token") String token) {
		try {
			logger.info("Admin videos: start={},length={},token={}", start, length, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			String serverurl = "http://" + configMapper.selectValueByCode("ServerIP") + ":"
					+ configMapper.selectValueByCode("ServerPort") + "/pixsigdata";
			Folder folder = folderMapper.selectRoot("" + staff.getOrgid(), "" + staff.getBranchid());
			List<Video> videos = videoMapper.selectList("" + staff.getOrgid(), "" + staff.getBranchid(),
					"" + folder.getFolderid(), Video.TYPE_INTERNAL, null, null, null, null, start, length);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONObject dataJson = new JSONObject();
			JSONArray videosJson = new JSONArray();
			for (Video video : videos) {
				JSONObject videoJson = new JSONObject();
				videoJson.put("video_id", "" + video.getVideoid());
				videoJson.put("name", video.getName());
				videoJson.put("width", video.getWidth());
				videoJson.put("height", video.getHeight());
				videoJson.put("thumbnail", serverurl + video.getThumbnail());
				videosJson.add(videoJson);
			}
			dataJson.put("videos", videosJson);
			responseJson.put("data", dataJson);
			logger.info("Admin videos response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin videos exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("images")
	@Produces("application/json;charset=UTF-8")
	public String images(@QueryParam("start") String start, @QueryParam("length") String length,
			@QueryParam("token") String token) {
		try {
			logger.info("Admin images: start={},length={},token={}", start, length, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			String serverurl = "http://" + configMapper.selectValueByCode("ServerIP") + ":"
					+ configMapper.selectValueByCode("ServerPort") + "/pixsigdata";
			Folder folder = folderMapper.selectRoot("" + staff.getOrgid(), "" + staff.getBranchid());
			List<Image> images = imageMapper.selectList("" + staff.getOrgid(), "" + staff.getBranchid(),
					"" + folder.getFolderid(), "0", null, start, length);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONObject dataJson = new JSONObject();
			JSONArray imagesJson = new JSONArray();
			for (Image image : images) {
				JSONObject imageJson = new JSONObject();
				imageJson.put("image_id", "" + image.getImageid());
				imageJson.put("name", image.getName());
				imageJson.put("width", image.getWidth());
				imageJson.put("height", image.getHeight());
				imageJson.put("thumbnail", serverurl + image.getThumbnail());
				imagesJson.add(imageJson);
			}
			dataJson.put("images", imagesJson);
			responseJson.put("data", dataJson);
			logger.info("Admin images response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin images exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("upload_image")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String reportpflow(@FormDataParam("name") String name, @FormDataParam("filename") String filename,
			@FormDataParam("token") String token, @FormDataParam("file") FormDataContentDisposition fileHeader,
			@FormDataParam("file") InputStream file) {
		try {
			logger.info("Admin upload_image: name={},filename={},token={},fileHeader={}", name, filename, token,
					fileHeader);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			Folder folder = folderMapper.selectRoot("" + staff.getOrgid(), "" + staff.getBranchid());
			Image image = new Image();
			image.setOrgid(staff.getOrgid());
			image.setBranchid(staff.getBranchid());
			image.setFolderid(folder.getFolderid());
			image.setName(name);
			image.setFilename(name);
			image.setStatus("9");
			image.setObjtype("0");
			image.setObjid(0);
			image.setDescription(name);
			image.setCreatestaffid(staff.getStaffid());
			imageMapper.insertSelective(image);

			String newFileName = "" + image.getImageid() + "." + FilenameUtils.getExtension(filename);
			String imageFilePath, thumbFilePath;
			imageFilePath = "/image/upload/" + newFileName;
			thumbFilePath = "/image/thumb/" + newFileName;
			File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + imageFilePath);
			File thumbFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbFilePath);
			if (imageFile.exists()) {
				imageFile.delete();
			}
			if (thumbFile.exists()) {
				thumbFile.delete();
			}
			FileUtils.copyInputStreamToFile(file, imageFile);
			CommonUtil.resizeImage(imageFile, thumbFile, 640);

			BufferedImage img = ImageIO.read(imageFile);
			image.setWidth(img.getWidth());
			image.setHeight(img.getHeight());
			image.setFilepath(imageFilePath);
			image.setThumbnail(thumbFilePath);
			image.setFilename(newFileName);
			image.setSize(FileUtils.sizeOf(imageFile));
			FileInputStream fis = new FileInputStream(imageFile);
			image.setMd5(DigestUtils.md5Hex(fis));
			fis.close();
			image.setStatus("1");
			imageMapper.updateByPrimaryKeySelective(image);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Admin upload_image response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin upload_image exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("templets")
	@Produces("application/json;charset=UTF-8")
	public String templets(@QueryParam("ratio") String ratio, @QueryParam("touchflag") String touchflag,
			@QueryParam("start") String start, @QueryParam("length") String length, @QueryParam("token") String token) {
		try {
			logger.info("Admin templets: start={},length={},token={}", start, length, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			String serverurl = "http://" + configMapper.selectValueByCode("ServerIP") + ":"
					+ configMapper.selectValueByCode("ServerPort") + "/pixsigdata";
			List<Templet> templets = templetMapper.selectList("" + staff.getOrgid(), ratio, touchflag, "1", null, null,
					start, length);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONObject dataJson = new JSONObject();
			JSONArray templetsJson = new JSONArray();
			for (Templet templet : templets) {
				JSONObject templetJson = new JSONObject();
				templetJson.put("templet_id", "" + templet.getTempletid());
				templetJson.put("name", templet.getName());
				templetJson.put("width", templet.getWidth());
				templetJson.put("height", templet.getHeight());
				templetJson.put("thumbnail", serverurl + templet.getSnapshot());
				templetsJson.add(templetJson);
			}
			dataJson.put("templets", templetsJson);
			responseJson.put("data", dataJson);
			logger.info("Admin templets response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin templets exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	// ==============================================================================
	// Other
	// ==============================================================================
	private String handleResult(int code, String message) {
		JSONObject responseJson = new JSONObject();
		responseJson.put("code", code);
		responseJson.put("message", message);
		logger.info("Admin response: {}", responseJson.toString());
		return responseJson.toString();
	}
}
