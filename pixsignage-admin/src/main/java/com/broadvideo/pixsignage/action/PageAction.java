package com.broadvideo.pixsignage.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegroup;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Pagezone;
import com.broadvideo.pixsignage.service.ImageService;
import com.broadvideo.pixsignage.service.PageService;
import com.broadvideo.pixsignage.service.ScheduleService;
import com.broadvideo.pixsignage.util.SqlUtil;

import net.sf.json.JSONObject;

@SuppressWarnings("serial")
@Scope("request")
@Controller("pageAction")
public class PageAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static Hashtable<String, String> CONFIG_FONTS = new Hashtable<String, String>();

	private Page page;
	private Device[] devices;
	private Devicegroup[] devicegroups;

	@Autowired
	private PageService pageService;
	@Autowired
	private ImageService imageService;
	@Autowired
	private ScheduleService scheduleService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			int count = pageService.selectCount("" + getLoginStaff().getOrgid(), branchid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Page> pageList = pageService.selectList("" + getLoginStaff().getOrgid(), branchid, search, start,
					length);
			for (int i = 0; i < pageList.size(); i++) {
				aaData.add(pageList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doGet() {
		try {
			String pageid = getParameter("pageid");
			page = pageService.selectByPrimaryKey(pageid);
			if (page == null) {
				setErrorcode(-1);
				setErrormsg("Not found");
				return ERROR;
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doGet exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			page.setOrgid(getLoginStaff().getOrgid());
			page.setBranchid(getLoginStaff().getBranchid());
			page.setCreatestaffid(getLoginStaff().getStaffid());
			pageService.addPage(page);
			makePageZip("" + page.getPageid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			pageService.updatePage(page);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			pageService.deletePage("" + page.getPageid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String pageid = getParameter("pageid");
			scheduleService.syncScheduleByPage(pageid);
			logger.info("Page sync success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doSync exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDesign() {
		try {
			page.setOrgid(getLoginStaff().getOrgid());
			page.setCreatestaffid(getLoginStaff().getStaffid());
			pageService.design(page);
			makePageZip("" + page.getPageid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doDesign exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doPush() {
		try {
			pageService.push(page, devices, devicegroups);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doSchedule exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	private void makePageZip(String pageid) throws Exception {
		if (CONFIG_FONTS.size() == 0) {
			Properties properties = new Properties();
			InputStream is = this.getClass().getResourceAsStream("/fonts.properties");
			properties.load(is);
			CONFIG_FONTS = new Hashtable<String, String>();
			Iterator<Entry<Object, Object>> it = properties.entrySet().iterator();
			while (it.hasNext()) {
				Entry<Object, Object> entry = it.next();
				logger.info("Init font key={}, value={}", entry.getKey().toString(), entry.getValue().toString());
				CONFIG_FONTS.put(entry.getKey().toString(), entry.getValue().toString());
			}
			is.close();
		}

		Page page = pageService.selectByPrimaryKey(pageid);
		page.setSnapshotdtl(null);
		String saveDir = CommonConfig.CONFIG_PIXDATA_HOME + "/page/" + page.getPageid();
		String zipname = "page-" + page.getPageid() + ".zip";
		FileUtils.forceMkdir(new File(saveDir));

		File zipFile = new File(saveDir, zipname);
		if (zipFile.exists()) {
			zipFile.delete();
		}
		ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));
		out.putNextEntry(new ZipEntry("fonts/"));
		out.putNextEntry(new ZipEntry("image/"));
		ClassLoader classLoader = getClass().getClassLoader();
		ArrayList<String> fontList = new ArrayList<String>();
		for (Pagezone pagezone : page.getPagezones()) {
			if (pagezone.getType().equals(Pagezone.Type_Image)) {
				Image image = imageService.selectByPrimaryKey(pagezone.getObjid());
				if (image != null) {
					pagezone.setContent("./image/" + image.getFilename());
					File imageFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + image.getFilepath());
					zip(out, imageFile, "image/" + image.getFilename());
				}
			}
			if (pagezone.getType().equals(Pagezone.Type_Text) && pagezone.getFontfamily().length() > 0) {
				String font = CONFIG_FONTS.get(pagezone.getFontfamily());
				logger.info("Copy one font, family={}, file={}", pagezone.getFontfamily(), font);
				if (font != null && fontList.indexOf(font) < 0) {
					fontList.add(font);
				}
			}
		}
		for (String font : fontList) {
			if (classLoader.getResource("/pagezip/fonts/" + font) != null) {
				File fontFile = new File(classLoader.getResource("/pagezip/fonts/" + font).getFile());
				zip(out, fontFile, "fonts/" + font);
			} else {
				logger.error("font file {} not exists", font);
			}
		}

		File dataFile = new File(saveDir, "data.js");
		FileUtils.writeStringToFile(dataFile, "var Page=" + JSONObject.fromObject(page).toString(2), "UTF-8", false);
		zip(out, dataFile, "data.js");

		zip(out, new File(classLoader.getResource("/pagezip/pixpage").getFile()), "pixpage");
		zip(out, new File(classLoader.getResource("/pagezip/module").getFile()), "module");
		zip(out, new File(classLoader.getResource("/pagezip/plugin").getFile()), "plugin");
		zip(out, new File(classLoader.getResource("/pagezip/index.html").getFile()), "index.html");
		out.close();
	}

	private void zip(ZipOutputStream out, File f, String base) throws Exception {
		if (f.isDirectory()) {
			File[] fl = f.listFiles();
			if (fl.length == 0) {
				out.putNextEntry(new ZipEntry(base + "/")); // 创建zip压缩进入点base
			}
			for (int i = 0; i < fl.length; i++) {
				if (base.equals("")) {
					zip(out, fl[i], fl[i].getName()); // 递归遍历子文件夹
				} else {
					zip(out, fl[i], base + "/" + fl[i].getName()); // 递归遍历子文件夹
				}
			}
		} else {
			out.putNextEntry(new ZipEntry(base)); // 创建zip压缩进入点base
			FileInputStream in = new FileInputStream(f);
			byte[] b = new byte[1000];
			int len = -1;
			while ((len = in.read(b)) != -1) {
				out.write(b, 0, len);
			}
			in.close();
		}
	}

	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
	}

	public Device[] getDevices() {
		return devices;
	}

	public void setDevices(Device[] devices) {
		this.devices = devices;
	}

	public Devicegroup[] getDevicegroups() {
		return devicegroups;
	}

	public void setDevicegroups(Devicegroup[] devicegroups) {
		this.devicegroups = devicegroups;
	}

}
