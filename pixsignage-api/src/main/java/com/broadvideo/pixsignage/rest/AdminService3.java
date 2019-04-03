package com.broadvideo.pixsignage.rest;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import javax.imageio.ImageIO;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;

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
import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.domain.Bundle;
import com.broadvideo.pixsignage.domain.Bundlezone;
import com.broadvideo.pixsignage.domain.Bundlezonedtl;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Folder;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Schedule;
import com.broadvideo.pixsignage.domain.Scheduledtl;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.domain.Templet;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.BranchMapper;
import com.broadvideo.pixsignage.persistence.BundleMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicegroupMapper;
import com.broadvideo.pixsignage.persistence.FolderMapper;
import com.broadvideo.pixsignage.persistence.ImageMapper;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.persistence.TempletMapper;
import com.broadvideo.pixsignage.persistence.VideoMapper;
import com.broadvideo.pixsignage.service.BundleService;
import com.broadvideo.pixsignage.service.ScheduleService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.DateUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Component
@Produces("application/json;charset=UTF-8")
@Path("/admin3")
public class AdminService3 {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private BranchMapper branchMapper;
	@Autowired
	private FolderMapper folderMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private DevicegroupMapper devicegroupMapper;
	@Autowired
	private VideoMapper videoMapper;
	@Autowired
	private ImageMapper imageMapper;
	@Autowired
	private TempletMapper templetMapper;
	@Autowired
	private BundleMapper bundleMapper;
	@Autowired
	private BundleService bundleService;

	@Autowired
	private ScheduleService scheduleService;

	// ==============================================================================
	// System Interface
	// ==============================================================================
	@GET
	@Path("get_version")
	@Produces("application/json;charset=UTF-8")
	public String getversion(@QueryParam("app_name") String appname) {
		try {
			logger.info("Admin3 getversion: app_name={}", appname);

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
			responseJson.put("version_name", vname);
			responseJson.put("version_code", vcode);
			responseJson.put("url", url);
			logger.info("Admin3 getversion response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 getversion exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("login")
	@Produces("application/json;charset=UTF-8")
	public String login(@QueryParam("username") String username, @QueryParam("password") String password) {
		try {
			logger.info("Admin3 login: username={},password={}", username, password);
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
				responseJson.put("token", token);
				logger.info("Admin3 login response: {}", responseJson.toString());
				return responseJson.toString();
			} else if (staff != null && staff.getOrg() != null) {
				String token = CommonUtil.getMd5(username, "" + Math.random());
				staff.setToken(token);
				staffMapper.updateByPrimaryKeySelective(staff);
				JSONObject responseJson = new JSONObject();
				responseJson.put("code", 0);
				responseJson.put("message", "成功");
				responseJson.put("token", token);
				logger.info("Admin3 login response: {}", responseJson.toString());
				return responseJson.toString();
			} else {
				return handleResult(1003, "登录失败");
			}
		} catch (Exception e) {
			logger.error("Admin3 login exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("branches")
	@Produces("application/json;charset=UTF-8")
	public String branches(@Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 branches: token={}", token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			List<Branch> branches = branchMapper.selectList("" + staff.getBranchid());
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONArray branchesJson = new JSONArray();
			for (Branch branch : branches) {
				JSONObject branchJson = new JSONObject();
				branchJson.put("branch_id", branch.getBranchid());
				branchJson.put("parent_id", branch.getParentid());
				branchJson.put("name", branch.getName());
				branchesJson.add(branchJson);
			}
			responseJson.put("branches", branchesJson);
			logger.info("Admin3 branches response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 branches exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("folders")
	@Produces("application/json;charset=UTF-8")
	public String folders(@QueryParam("branch_id") String branchid, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 folders: branch_id={},token={}", branchid, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			List<Folder> folders = folderMapper.selectList("" + staff.getOrg().getOrgid(), branchid);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONArray foldersJson = new JSONArray();
			for (Folder folder : folders) {
				JSONObject folderJson = new JSONObject();
				folderJson.put("folder_id", folder.getFolderid());
				folderJson.put("parent_id", folder.getParentid());
				folderJson.put("name", folder.getName());
				foldersJson.add(folderJson);
			}
			responseJson.put("folders", foldersJson);
			logger.info("Admin3 folders response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 folders exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("devices")
	@Produces("application/json;charset=UTF-8")
	public String devices(@QueryParam("branch_id") String branchid, @QueryParam("type") String type,
			@QueryParam("devicegroup_id") String devicegroupid, @QueryParam("start") String start,
			@QueryParam("length") String length, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 devices: branch_id={},type={},devicegroup_id={},start={},length={},token={}", branchid,
					devicegroupid, start, length, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			List<Device> devices = deviceMapper.selectList("" + staff.getOrgid(), branchid, "1", type, null, null,
					devicegroupid, null, null, null, null, start, length, "deviceid");
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
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
			responseJson.put("devices", devicesJson);
			logger.info("Admin3 devices response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 devices exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("devicegroups")
	@Produces("application/json;charset=UTF-8")
	public String devicegroups(@QueryParam("branch_id") String branchid, @QueryParam("start") String start,
			@QueryParam("length") String length, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 devicegroups: branch_id={},start={},length={},token={}", branchid, start, length,
					token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			List<Devicegroup> devicegroups = devicegroupMapper.selectList("" + staff.getOrgid(), branchid,
					Devicegroup.Type_Device, null, null, start, length);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONArray devicegroupsJson = new JSONArray();
			for (Devicegroup devicegroup : devicegroups) {
				JSONObject devicegroupJson = new JSONObject();
				devicegroupJson.put("devicegroup_id", "" + devicegroup.getDevicegroupid());
				devicegroupJson.put("name", devicegroup.getName());
				devicegroupsJson.add(devicegroupJson);
			}
			responseJson.put("devicegroups", devicegroupsJson);
			logger.info("Admin3 devicegroups response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 devicegroups exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("bind")
	@Produces("application/json;charset=UTF-8")
	public String bind(String request, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 bind: request={},token={}", request, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}
			JSONObject requestJson = JSONObject.fromObject(request);
			String terminalid = requestJson.optString("terminal_id");
			String hardkey = requestJson.optString("hardkey");
			String type = requestJson.optString("type");
			String checkcode = requestJson.optString("checkcode");
			String name = requestJson.optString("name");

			if (!checkcode.equals(CommonUtil.getMd5(hardkey, CommonConfig.SYSTEM_ID))) {
				return handleResult(1004, "非法请求");
			}

			Device device1 = deviceMapper.selectByTerminalid(terminalid);
			if (device1 == null) {
				return handleResult(1007, "无效终端号" + terminalid);
			} else if (device1.getStatus().equals("1") && device1.getHardkey() != null
					&& !device1.getHardkey().equals(hardkey)) {
				return handleResult(1005, terminalid + "已经被别的终端注册.");
			} else if (type != null && !type.equals("") && !device1.getType().equals(type)) {
				return handleResult(1011, terminalid + "终端类型不匹配.");
			}

			Device device2 = deviceMapper.selectByHardkey(hardkey);
			if (device2 != null && !device2.getTerminalid().equals(terminalid)) {
				logger.info("unbind old device {} for the same hardkey {}", device2.getTerminalid(), hardkey);
				deviceMapper.unbind("" + device2.getDeviceid());
			}

			device1.setActivetime(Calendar.getInstance().getTime());
			device1.setHardkey(hardkey);
			device1.setStatus("1");
			deviceMapper.updateByPrimaryKey(device1);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Admin3 bind response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 bind exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("unbind")
	@Produces("application/json;charset=UTF-8")
	public String unbind(String request, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 unbind: request={},token={}", request, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}
			JSONObject requestJson = JSONObject.fromObject(request);
			String deviceid = requestJson.optString("device_id");

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
			logger.info("Admin3 unbind response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 unbind exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("videos")
	@Produces("application/json;charset=UTF-8")
	public String videos(@QueryParam("folder_id") String folderid, @QueryParam("start") String start,
			@QueryParam("length") String length, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 videos: start={},length={},token={}", start, length, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			String branchid = "";
			if (folderid == null) {
				Folder folder = folderMapper.selectRoot("" + staff.getOrgid(), "" + staff.getBranchid());
				folderid = "" + folder.getFolderid();
				branchid = "" + folder.getBranchid();
			} else {
				Folder folder = folderMapper.selectByPrimaryKey(folderid);
				folderid = "" + folder.getFolderid();
				branchid = "" + folder.getBranchid();
			}
			List<Video> videos = videoMapper.selectList("" + staff.getOrgid(), branchid, folderid, Video.TYPE_INTERNAL,
					null, null, null, null, start, length);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONArray videosJson = new JSONArray();
			for (Video video : videos) {
				JSONObject videoJson = new JSONObject();
				videoJson.put("video_id", "" + video.getVideoid());
				videoJson.put("name", video.getName());
				videoJson.put("width", video.getWidth());
				videoJson.put("height", video.getHeight());
				videoJson.put("thumbnail", "/pixsigdata" + video.getThumbnail());
				videosJson.add(videoJson);
			}
			responseJson.put("videos", videosJson);
			logger.info("Admin3 videos response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 videos exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("images")
	@Produces("application/json;charset=UTF-8")
	public String images(@QueryParam("folder_id") String folderid, @QueryParam("start") String start,
			@QueryParam("length") String length, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 images: start={},length={},token={}", start, length, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			String branchid = "";
			if (folderid == null) {
				Folder folder = folderMapper.selectRoot("" + staff.getOrgid(), "" + staff.getBranchid());
				folderid = "" + folder.getFolderid();
				branchid = "" + folder.getBranchid();
			} else {
				Folder folder = folderMapper.selectByPrimaryKey(folderid);
				folderid = "" + folder.getFolderid();
				branchid = "" + folder.getBranchid();
			}
			List<Image> images = imageMapper.selectList("" + staff.getOrgid(), branchid, folderid, null, null, start,
					length);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONArray imagesJson = new JSONArray();
			for (Image image : images) {
				JSONObject imageJson = new JSONObject();
				imageJson.put("image_id", "" + image.getImageid());
				imageJson.put("name", image.getName());
				imageJson.put("width", image.getWidth());
				imageJson.put("height", image.getHeight());
				imageJson.put("thumbnail", "/pixsigdata" + image.getThumbnail());
				imagesJson.add(imageJson);
			}
			responseJson.put("images", imagesJson);
			logger.info("Admin3 images response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 images exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("upload_video")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String uploadvideo(@FormDataParam("folder_id") String folderid, @FormDataParam("name") String name,
			@FormDataParam("filename") String filename, @FormDataParam("file") FormDataContentDisposition fileHeader,
			@FormDataParam("file") InputStream file, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 upload_video: folder_id={},name={},filename={},token={},fileHeader={}", folderid, name,
					filename, token, fileHeader);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			int branchid = staff.getBranchid();
			if (folderid == null) {
				Folder folder = folderMapper.selectRoot("" + staff.getOrgid(), "" + staff.getBranchid());
				folderid = "" + folder.getFolderid();
				branchid = folder.getBranchid();
			}
			Video video = new Video();
			video.setOrgid(staff.getOrgid());
			video.setBranchid(branchid);
			video.setFolderid(Integer.parseInt(folderid));
			video.setName(name);
			video.setFilename(name);
			video.setStatus("9");
			video.setDescription(name);
			video.setCreatestaffid(staff.getStaffid());
			videoMapper.insertSelective(video);

			String format = FilenameUtils.getExtension(filename).toLowerCase();
			String newFileName = "" + video.getVideoid() + "." + format;

			String videoFilePath = "/video/upload/" + newFileName;
			File videoFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + videoFilePath);
			if (videoFile.exists()) {
				videoFile.delete();
			}
			FileUtils.copyInputStreamToFile(file, videoFile);
			logger.info("Finish content upload: " + newFileName);

			video.setFilepath("/video/upload/" + newFileName);
			video.setFilename(newFileName);
			video.setFormat(format);
			try {
				// Generate thumbnail
				FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/snapshot"));
				String command = CommonConfig.CONFIG_FFMPEG_CMD + " -i " + videoFile + " -y -f image2 -ss 5 -vframes 1 "
						+ CommonConfig.CONFIG_PIXDATA_HOME + "/video/snapshot/" + video.getVideoid() + ".jpg";
				logger.info("Begin to generate preview and thumbnail: " + command);
				CommonUtil.execCommand(command);
				File destFile = new File(
						CommonConfig.CONFIG_PIXDATA_HOME + "/video/snapshot/" + video.getVideoid() + ".jpg");
				if (!destFile.exists()) {
					command = CommonConfig.CONFIG_FFMPEG_CMD + " -i " + videoFile + " -y -f image2 -ss 1 -vframes 1 "
							+ CommonConfig.CONFIG_PIXDATA_HOME + "/video/snapshot/" + video.getVideoid() + ".jpg";
					CommonUtil.execCommand(command);
				}
				if (destFile.exists()) {
					BufferedImage img = ImageIO.read(destFile);
					video.setWidth(img.getWidth());
					video.setHeight(img.getHeight());
					video.setThumbnail("/video/snapshot/" + video.getVideoid() + ".jpg");
					logger.info("Finish thumbnail generating.");
				} else {
					logger.info("Failed to generate thumbnail.");
				}

			} catch (IOException ex) {
				logger.info("Video parse error, file={}", filename, ex);
			}

			video.setStatus("1");
			video.setProgress(100);
			videoMapper.updateByPrimaryKeySelective(video);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Admin3 upload_video response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 upload_video exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("upload_image")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String uploadimage(@FormDataParam("folder_id") String folderid, @FormDataParam("name") String name,
			@FormDataParam("filename") String filename, @FormDataParam("file") FormDataContentDisposition fileHeader,
			@FormDataParam("file") InputStream file, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 upload_image: folder_id={},name={},filename={},token={},fileHeader={}", folderid, name,
					filename, token, fileHeader);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			int branchid = staff.getBranchid();
			if (folderid == null) {
				Folder folder = folderMapper.selectRoot("" + staff.getOrgid(), "" + staff.getBranchid());
				folderid = "" + folder.getFolderid();
				branchid = folder.getBranchid();
			}
			Image image = new Image();
			image.setOrgid(staff.getOrgid());
			image.setBranchid(branchid);
			image.setFolderid(Integer.parseInt(folderid));
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
			logger.info("Admin3 upload_image response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 upload_image exception", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("templets")
	@Produces("application/json;charset=UTF-8")
	public String templets(@QueryParam("ratio") String ratio, @QueryParam("touch_flag") String touchflag,
			@QueryParam("start") String start, @QueryParam("length") String length, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 templets: ratio={},touch_flag={},start={},length={},token={}", ratio, touchflag, start,
					length, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			List<Templet> templets = templetMapper.selectList("" + staff.getOrgid(), ratio, touchflag, "1", null, null,
					start, length);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONArray templetsJson = new JSONArray();
			for (Templet templet : templets) {
				JSONObject templetJson = new JSONObject();
				templetJson.put("templet_id", "" + templet.getTempletid());
				templetJson.put("name", templet.getName());
				templetJson.put("width", templet.getWidth());
				templetJson.put("height", templet.getHeight());
				templetJson.put("thumbnail", "/pixsigdata" + templet.getSnapshot());
				templetsJson.add(templetJson);
			}
			responseJson.put("templets", templetsJson);
			logger.info("Admin3 templets response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 templets exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("bundles")
	@Produces("application/json;charset=UTF-8")
	public String bundles(@QueryParam("branch_id") String branchid, @QueryParam("touch_flag") String touchflag,
			@QueryParam("start") String start, @QueryParam("length") String length, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 bundles: branch_id={},touch_flag={},start={},length={},token={}", branchid, touchflag,
					start, length, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			List<Bundle> bundles = bundleMapper.selectList("" + staff.getOrgid(), branchid, null, touchflag, "1", null,
					start, length);
			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONArray bundlesJson = new JSONArray();
			for (Bundle bundle : bundles) {
				JSONObject bundleJson = new JSONObject();
				bundleJson.put("bundle_id", "" + bundle.getBundleid());
				bundleJson.put("name", bundle.getName());
				bundleJson.put("width", bundle.getWidth());
				bundleJson.put("height", bundle.getHeight());
				bundleJson.put("thumbnail", "/pixsigdata" + bundle.getSnapshot());
				bundlesJson.add(bundleJson);
			}
			responseJson.put("bundles", bundlesJson);
			logger.info("Admin3 bundles response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 bundles exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("bundle_detail")
	@Produces("application/json;charset=UTF-8")
	public String bundledetail(@QueryParam("bundle_id") String bundleid, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 bundle_detail: bundle_id={},token={}", bundleid, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			Bundle bundle = bundleMapper.selectByPrimaryKey(bundleid);
			JSONObject bundleJson = new JSONObject();
			bundleJson.put("bundle_id", bundle.getBundleid());
			bundleJson.put("name", bundle.getName());
			bundleJson.put("width", bundle.getWidth());
			bundleJson.put("height", bundle.getHeight());
			bundleJson.put("thumbnail", "/pixsigdata" + bundle.getSnapshot());
			JSONArray zonesJson = new JSONArray();
			for (Bundlezone bundlezone : bundle.getBundlezones()) {
				JSONObject zoneJson = new JSONObject();
				zoneJson.put("zone_id", bundlezone.getBundlezoneid());
				zoneJson.put("main_flag", bundlezone.getMainflag());
				zoneJson.put("width", bundlezone.getWidth());
				zoneJson.put("height", bundlezone.getHeight());
				zoneJson.put("top", bundlezone.getTopoffset());
				zoneJson.put("left", bundlezone.getLeftoffset());
				zoneJson.put("zindex", bundlezone.getZindex());
				zoneJson.put("type", bundlezone.getType());
				zoneJson.put("sleep", bundlezone.getSleeptime());
				zoneJson.put("interval", bundlezone.getIntervaltime());
				zoneJson.put("bgcolor", bundlezone.getBgcolor());
				zoneJson.put("opacity", bundlezone.getBgopacity());
				zoneJson.put("speed", bundlezone.getSpeed());
				zoneJson.put("color", bundlezone.getColor());
				zoneJson.put("size", bundlezone.getSize());
				zoneJson.put("date_format", bundlezone.getDateformat());
				zoneJson.put("fit_flag", bundlezone.getFitflag());
				zoneJson.put("volume", bundlezone.getVolume());
				zoneJson.put("content", bundlezone.getContent());
				JSONArray zonedtlsJson = new JSONArray();
				for (Bundlezonedtl bundlezonedtl : bundlezone.getBundlezonedtls()) {
					if (bundlezonedtl.getObjtype().equals(Bundlezonedtl.ObjType_Video)) {
						JSONObject zonedtlJson = new JSONObject();
						zonedtlJson.put("type", "video");
						zonedtlJson.put("id", bundlezonedtl.getObjid());
						zonedtlJson.put("sequence", bundlezonedtl.getSequence());
						zonedtlJson.put("name", bundlezonedtl.getVideo().getName());
						zonedtlJson.put("thumbnail", "/pixsigdata" + bundlezonedtl.getVideo().getThumbnail());
						zonedtlsJson.add(zonedtlJson);
					} else if (bundlezonedtl.getObjtype().equals(Bundlezonedtl.ObjType_Image)) {
						JSONObject zonedtlJson = new JSONObject();
						zonedtlJson.put("type", "image");
						zonedtlJson.put("id", bundlezonedtl.getObjid());
						zonedtlJson.put("sequence", bundlezonedtl.getSequence());
						zonedtlJson.put("name", bundlezonedtl.getImage().getName());
						zonedtlJson.put("thumbnail", "/pixsigdata" + bundlezonedtl.getImage().getThumbnail());
						zonedtlsJson.add(zonedtlJson);
					}
				}
				zoneJson.put("zonedtls", zonedtlsJson);
				zonesJson.add(zoneJson);
			}
			bundleJson.put("zones", zonesJson);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			responseJson.put("bundle", bundleJson);
			logger.info("Admin3 bundle_detail response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 bundle_detail exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("bundle_add")
	@Produces("application/json;charset=UTF-8")
	public String bundleadd(String request, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 bundle_add: request={},token={}", request, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}
			JSONObject requestJson = JSONObject.fromObject(request);
			String name = requestJson.optString("name");
			String ratio = requestJson.optString("ratio");
			int templetid = requestJson.optInt("templet_id");

			Bundle bundle = new Bundle();
			bundle.setName(name);
			bundle.setRatio(ratio);
			bundle.setTempletid(templetid);
			bundleService.addBundle(bundle);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Admin3 bundle_add response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 bundle_add exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("bundle_design")
	@Produces("application/json;charset=UTF-8")
	public String bundledesign(String request, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 bundle_design: request={},token={}", request, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}
			JSONObject requestJson = JSONObject.fromObject(request);
			String bundleid = requestJson.optString("bundle_id");
			String snapshotdtl = requestJson.optString("snapshotdtl");

			Bundle bundle = bundleService.selectByPrimaryKey(bundleid);
			List<Bundlezone> bundlezones = bundle.getBundlezones();
			List<Bundlezone> newzones = new ArrayList<Bundlezone>();
			bundle.setSnapshotdtl(snapshotdtl);
			JSONArray zonesJson = requestJson.getJSONArray("zones");
			for (int i = 0; i < zonesJson.size(); i++) {
				JSONObject zoneJson = zonesJson.getJSONObject(i);
				JSONArray zonedtlsJson = zoneJson.getJSONArray("zonedtls");
				int zoneid = zoneJson.optInt("zone_id");
				if (zoneid == 0) {
					Bundlezone bundlezone = new Bundlezone();
					bundlezone.setBundlezoneid(0);
					bundlezone.setMainflag(zoneJson.optString("main_flag"));
					bundlezone.setWidth(zoneJson.optInt("width"));
					bundlezone.setHeight(zoneJson.optInt("height"));
					bundlezone.setTopoffset(zoneJson.optInt("top"));
					bundlezone.setLeftoffset(zoneJson.optInt("left"));
					bundlezone.setZindex(zoneJson.optInt("zindex"));
					bundlezone.setType(Byte.parseByte(zoneJson.optString("type")));
					bundlezone.setSleeptime(zoneJson.optInt("sleep"));
					bundlezone.setIntervaltime(zoneJson.optInt("interval"));
					bundlezone.setSpeed(zoneJson.optString("speed"));
					bundlezone.setColor(zoneJson.optString("color"));
					bundlezone.setSize(zoneJson.optInt("size"));
					bundlezone.setDateformat(zoneJson.optString("date_format"));
					bundlezone.setFitflag(zoneJson.optString("fit_flag"));
					bundlezone.setBgcolor(zoneJson.optString("bgcolor"));
					bundlezone.setBgopacity(zoneJson.optInt("opacity"));
					bundlezone.setVolume(zoneJson.optInt("volume"));
					bundlezone.setContent(zoneJson.optString("content"));
					List<Bundlezonedtl> bundlezonedtls = new ArrayList<Bundlezonedtl>();
					for (int j = 0; j < zonedtlsJson.size(); j++) {
						JSONObject zonedtlJson = zonedtlsJson.getJSONObject(j);
						Bundlezonedtl bundlezonedtl = new Bundlezonedtl();
						if (zonedtlJson.optString("type").equals("video")) {
							bundlezonedtl.setObjtype(Bundlezonedtl.ObjType_Video);
							bundlezonedtl.setObjid(zonedtlJson.optInt("id"));
							bundlezonedtl.setSequence(zonedtlJson.optInt("sequence"));
							bundlezonedtls.add(bundlezonedtl);
						} else if (zonedtlJson.optString("type").equals("image")) {
							bundlezonedtl.setObjtype(Bundlezonedtl.ObjType_Image);
							bundlezonedtl.setObjid(zonedtlJson.optInt("id"));
							bundlezonedtl.setSequence(zonedtlJson.optInt("sequence"));
							bundlezonedtls.add(bundlezonedtl);
						}
					}
					bundlezone.setBundlezonedtls(bundlezonedtls);
					newzones.add(bundlezone);
				} else {
					for (Bundlezone bundlezone : bundlezones) {
						if (bundlezone.getBundlezoneid().intValue() == zoneid) {
							bundlezone.setMainflag(zoneJson.optString("main_flag"));
							bundlezone.setWidth(zoneJson.optInt("width"));
							bundlezone.setHeight(zoneJson.optInt("height"));
							bundlezone.setTopoffset(zoneJson.optInt("top"));
							bundlezone.setLeftoffset(zoneJson.optInt("left"));
							bundlezone.setZindex(zoneJson.optInt("zindex"));
							bundlezone.setType(Byte.parseByte(zoneJson.optString("type")));
							bundlezone.setSleeptime(zoneJson.optInt("sleep"));
							bundlezone.setIntervaltime(zoneJson.optInt("interval"));
							bundlezone.setSpeed(zoneJson.optString("speed"));
							bundlezone.setColor(zoneJson.optString("color"));
							bundlezone.setSize(zoneJson.optInt("size"));
							bundlezone.setDateformat(zoneJson.optString("date_format"));
							bundlezone.setFitflag(zoneJson.optString("fit_flag"));
							bundlezone.setBgcolor(zoneJson.optString("bgcolor"));
							bundlezone.setBgopacity(zoneJson.optInt("opacity"));
							bundlezone.setVolume(zoneJson.optInt("volume"));
							bundlezone.setContent(zoneJson.optString("content"));
							List<Bundlezonedtl> bundlezonedtls = new ArrayList<Bundlezonedtl>();
							for (int j = 0; j < zonedtlsJson.size(); j++) {
								JSONObject zonedtlJson = zonedtlsJson.getJSONObject(j);
								Bundlezonedtl bundlezonedtl = new Bundlezonedtl();
								bundlezonedtl.setBundlezoneid(bundlezone.getBundlezoneid());
								if (zonedtlJson.optString("type").equals("video")) {
									bundlezonedtl.setObjtype(Bundlezonedtl.ObjType_Video);
									bundlezonedtl.setObjid(zonedtlJson.optInt("id"));
									bundlezonedtl.setSequence(zonedtlJson.optInt("sequence"));
									bundlezonedtls.add(bundlezonedtl);
								} else if (zonedtlJson.optString("type").equals("image")) {
									bundlezonedtl.setObjtype(Bundlezonedtl.ObjType_Image);
									bundlezonedtl.setObjid(zonedtlJson.optInt("id"));
									bundlezonedtl.setSequence(zonedtlJson.optInt("sequence"));
									bundlezonedtls.add(bundlezonedtl);
								}
							}
							bundlezone.setBundlezonedtls(bundlezonedtls);
							newzones.add(bundlezone);
							break;
						}
					}
				}
			}
			bundle.setBundlezones(newzones);

			bundleService.design(bundle);
			if (bundle.getHomeflag().equals("1")) {
				bundleService.makeJsonFile("" + bundle.getBundleid());
			} else {
				bundleService.makeJsonFile("" + bundle.getHomebundleid());
			}

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Admin3 bundle_design response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 bundle_design exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("device_schedule")
	@Produces("application/json;charset=UTF-8")
	public String deviceschedule(@QueryParam("device_id") String deviceid, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 device_schedule: device_id={},token={}", deviceid, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			List<Schedule> schedules = scheduleService.selectList(Schedule.ScheduleType_Solo, "0",
					Schedule.BindType_Device, deviceid, Schedule.PlayMode_Daily);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONArray schedulesJson = new JSONArray();
			for (Schedule schedule : schedules) {
				JSONObject scheduleJson = new JSONObject();
				scheduleJson.put("schedule_id", "" + schedule.getScheduleid());
				scheduleJson.put("start_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getStarttime()));
				JSONArray scheduledtlsJson = new JSONArray();
				for (Scheduledtl scheduledtl : schedule.getScheduledtls()) {
					JSONObject scheduledtlJson = new JSONObject();
					scheduledtlJson.put("bundle_id", "" + scheduledtl.getObjid());
					scheduledtlJson.put("thumbnail", "/pixsigdata" + scheduledtl.getBundle().getSnapshot());
					scheduledtlsJson.add(scheduledtlJson);
				}
				scheduleJson.put("scheduledtls", scheduledtlsJson);
				schedulesJson.add(scheduleJson);
			}
			responseJson.put("schedules", schedulesJson);
			logger.info("Admin3 device_schedule response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 device_schedule exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@GET
	@Path("device_group_schedule")
	@Produces("application/json;charset=UTF-8")
	public String devicegroupschedule(@QueryParam("devicegroup_id") String devicegroupid,
			@Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 device_group_schedule: devicegroup_id={},token={}", devicegroupid, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}

			List<Schedule> schedules = scheduleService.selectList(Schedule.ScheduleType_Solo, "0",
					Schedule.BindType_Devicegroup, devicegroupid, Schedule.PlayMode_Daily);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			JSONArray schedulesJson = new JSONArray();
			for (Schedule schedule : schedules) {
				JSONObject scheduleJson = new JSONObject();
				scheduleJson.put("schedule_id", "" + schedule.getScheduleid());
				scheduleJson.put("start_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getStarttime()));
				JSONArray scheduledtlsJson = new JSONArray();
				for (Scheduledtl scheduledtl : schedule.getScheduledtls()) {
					JSONObject scheduledtlJson = new JSONObject();
					scheduledtlJson.put("bundle_id", "" + scheduledtl.getObjid());
					scheduledtlJson.put("thumbnail", "/pixsigdata" + scheduledtl.getBundle().getSnapshot());
					scheduledtlsJson.add(scheduledtlJson);
				}
				scheduleJson.put("scheduledtls", scheduledtlsJson);
				schedulesJson.add(scheduleJson);
			}
			responseJson.put("schedules", schedulesJson);
			logger.info("Admin3 device_group_schedule response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 device_group_schedule exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("update_device_schedule")
	@Produces("application/json;charset=UTF-8")
	public String updatedeviceschedule(String request, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 update_device_schedule: request={},token={}", request, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}
			JSONObject requestJson = JSONObject.fromObject(request);
			int deviceid = requestJson.optInt("device_id");

			JSONArray schedulesJson = requestJson.getJSONArray("schedules");
			Schedule[] schedules = new Schedule[schedulesJson.size()];
			for (int i = 0; i < schedulesJson.size(); i++) {
				JSONObject scheduleJson = schedulesJson.getJSONObject(i);
				schedules[i] = new Schedule();
				schedules[i].setScheduleid(scheduleJson.optInt("schedule_id"));
				schedules[i].setScheduletype(Schedule.ScheduleType_Solo);
				schedules[i].setAttachflag("0");
				schedules[i].setBindtype(Schedule.BindType_Device);
				schedules[i].setBindid(deviceid);
				schedules[i].setPlaymode(Schedule.PlayMode_Daily);
				schedules[i].setStarttime(DateUtil.getDate(scheduleJson.optString("start_time"), "HH:mm"));
				List<Scheduledtl> scheduledtls = new ArrayList<Scheduledtl>();
				JSONArray scheduledtlsJson = scheduleJson.getJSONArray("scheduledtls");
				for (int j = 0; j < scheduledtlsJson.size(); j++) {
					Scheduledtl scheduledtl = new Scheduledtl();
					scheduledtl.setScheduledtlid(0);
					scheduledtl.setObjid(scheduledtlsJson.optInt(j));
					scheduledtl.setObjtype(Scheduledtl.ObjType_Bundle);
					scheduledtl.setSequence(j + 1);
					scheduledtls.add(scheduledtl);
				}
				schedules[i].setScheduledtls(scheduledtls);
			}

			scheduleService.batch(Schedule.ScheduleType_Solo, "0", Schedule.BindType_Device, "" + deviceid, schedules);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Admin3 update_device_schedule response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 update_device_schedule exception, ", e);
			return handleResult(1001, "系统异常");
		}
	}

	@POST
	@Path("update_devicegroup_schedule")
	@Produces("application/json;charset=UTF-8")
	public String updatedevicegroupschedule(String request, @Context HttpHeaders headers) {
		try {
			MultivaluedMap<String, String> headerParams = headers.getRequestHeaders();
			String token = headerParams.getFirst("TOKEN");
			logger.info("Admin3 update_devicegroup_schedule: request={},token={}", request, token);
			Staff staff = staffMapper.selectByToken(token);
			if (staff == null) {
				return handleResult(1002, "Token失效");
			}
			JSONObject requestJson = JSONObject.fromObject(request);
			int devicegroupid = requestJson.optInt("devicegroup_id");

			JSONArray schedulesJson = requestJson.getJSONArray("schedules");
			Schedule[] schedules = new Schedule[schedulesJson.size()];
			for (int i = 0; i < schedulesJson.size(); i++) {
				JSONObject scheduleJson = schedulesJson.getJSONObject(i);
				schedules[i] = new Schedule();
				schedules[i].setScheduleid(scheduleJson.optInt("schedule_id"));
				schedules[i].setScheduletype(Schedule.ScheduleType_Solo);
				schedules[i].setAttachflag("0");
				schedules[i].setBindtype(Schedule.BindType_Devicegroup);
				schedules[i].setBindid(devicegroupid);
				schedules[i].setPlaymode(Schedule.PlayMode_Daily);
				schedules[i].setStarttime(DateUtil.getDate(scheduleJson.optString("start_time"), "HH:mm"));
				List<Scheduledtl> scheduledtls = new ArrayList<Scheduledtl>();
				JSONArray scheduledtlsJson = scheduleJson.getJSONArray("scheduledtls");
				for (int j = 0; j < scheduledtlsJson.size(); j++) {
					Scheduledtl scheduledtl = new Scheduledtl();
					scheduledtl.setScheduledtlid(0);
					scheduledtl.setObjid(scheduledtlsJson.optInt(j));
					scheduledtl.setObjtype(Scheduledtl.ObjType_Bundle);
					scheduledtl.setSequence(j + 1);
					scheduledtls.add(scheduledtl);
				}
				schedules[i].setScheduledtls(scheduledtls);
			}

			scheduleService.batch(Schedule.ScheduleType_Solo, "0", Schedule.BindType_Devicegroup, "" + devicegroupid,
					schedules);

			JSONObject responseJson = new JSONObject();
			responseJson.put("code", 0);
			responseJson.put("message", "成功");
			logger.info("Admin3 update_device_schedule response: {}", responseJson.toString());
			return responseJson.toString();
		} catch (Exception e) {
			logger.error("Admin3 update_device_schedule exception, ", e);
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
		logger.info("Admin3 response: {}", responseJson.toString());
		return responseJson.toString();
	}
}
