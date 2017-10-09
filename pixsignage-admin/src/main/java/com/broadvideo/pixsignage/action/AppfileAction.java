package com.broadvideo.pixsignage.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.App;
import com.broadvideo.pixsignage.domain.Appfile;
import com.broadvideo.pixsignage.persistence.AppMapper;
import com.broadvideo.pixsignage.service.AppfileService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("appfileAction")
public class AppfileAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Appfile appfile;

	private File[] myfile;
	private String[] myfileContentType;
	private String[] myfileFileName;

	@Autowired
	private AppfileService appfileService;
	@Autowired
	private AppMapper appMapper;

	public void doUpload() throws Exception {
		HttpServletResponse response = getHttpServletResponse();
		response.setContentType("text/html;charset=utf-8");
		PrintWriter writer = response.getWriter();
		JSONObject result = new JSONObject();
		JSONArray jsonArray = new JSONArray();

		result.put("files", jsonArray);

		if (myfile != null) {
			for (int i = 0; i < myfile.length; i++) {
				JSONObject jsonItem = new JSONObject();
				try {
					logger.info("Upload one appfile, file={}", myfileFileName[i]);
					String filename = myfileFileName[i];
					String name = "";
					String vname = "";
					int vcode = 0;
					String mtype = "";
					String[] ss = filename.split("-");
					if (ss.length >= 4) {
						name = ss[0];
						vname = ss[1];
						vcode = Integer.parseInt(ss[2]);
						mtype = ss[3];
						if (mtype.indexOf(".") > 0) {
							mtype = mtype.substring(0, mtype.indexOf("."));
						}
					} else {
						logger.info("Appfile parsed error, file={}", filename);
						jsonItem.put("filename", filename);
						jsonItem.put("errorcode", 3001);
						jsonItem.put("error", "filename parsed error");
						jsonArray.put(jsonItem);
						continue;
					}
					if (!new File(CommonConfig.CONFIG_PIXDATA_HOME + "/app/" + mtype).exists()) {
						logger.info("Appfile parse error, file={}", filename);
						jsonItem.put("filename", filename);
						jsonItem.put("errorcode", 3001);
						jsonItem.put("error", "mtype not acceptable");
						jsonArray.put(jsonItem);
						continue;
					}

					String filepath = "/app/" + mtype + "/" + filename;

					File appfileFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + filepath);
					if (appfileFile.exists()) {
						appfileFile.delete();
					}
					FileUtils.moveFile(myfile[i], appfileFile);

					App app = appMapper.select(name, mtype);
					if (app == null) {
						app = new App();
						app.setName(name);
						app.setMtype(mtype);
						app.setSname(name);
						appMapper.insertSelective(app);
					}

					Appfile appfile = new Appfile();
					appfile.setName(name);
					appfile.setVname(vname);
					appfile.setVcode(vcode);
					appfile.setMtype(mtype);
					appfile.setFilename(filename);
					appfile.setFilepath(filepath);
					appfile.setDescription("");
					long filesize = FileUtils.sizeOf(appfileFile);
					appfile.setSize(filesize);
					FileInputStream fis = new FileInputStream(appfileFile);
					appfile.setMd5(DigestUtils.md5Hex(fis));
					appfile.setLatestflag("1");
					fis.close();
					appfileService.addAppfile(appfile);

					jsonItem.put("errorcode", 0);
					jsonItem.put("name", name);
					jsonItem.put("vname", vname);
					jsonItem.put("vcode", vcode);
					jsonItem.put("mtype", mtype);
					jsonItem.put("filename", filename);
					jsonItem.put("size", filesize);
					jsonArray.put(jsonItem);
				} catch (Exception e) {
					logger.info("Appfile parse error, file={}", myfileFileName[i], e);
					addActionError(e.getMessage());
					jsonItem.put("filename", myfileFileName[i]);
					jsonItem.put("errorcode", 3000);
					jsonItem.put("error", e.getMessage());
					jsonArray.put(jsonItem);
				}
			}
		}

		writer.write(result.toString());
		writer.close();
	}

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String name = getParameter("name");
			String mtype = getParameter("mtype");

			List<Object> aaData = new ArrayList<Object>();
			List<Appfile> appfileList = appfileService.selectList(name, mtype);
			for (Appfile appfile : appfileList) {
				App app = appMapper.select(appfile.getName(), appfile.getMtype());
				if (app != null) {
					appfile.setSname(app.getSname());
					appfile.setSdescription(app.getDescription());
				}
				aaData.add(appfile);
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AppfileAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			appfileService.updateAppfile(appfile);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AppfileAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			appfileService.deleteAppfile("" + appfile.getAppfileid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AppfileAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Appfile getAppfile() {
		return appfile;
	}

	public void setAppfile(Appfile appfile) {
		this.appfile = appfile;
	}

	public File[] getMyfile() {
		return myfile;
	}

	public void setMyfile(File[] myfile) {
		this.myfile = myfile;
	}

	public String[] getMyfileContentType() {
		return myfileContentType;
	}

	public void setMyfileContentType(String[] myfileContentType) {
		this.myfileContentType = myfileContentType;
	}

	public String[] getMyfileFileName() {
		return myfileFileName;
	}

	public void setMyfileFileName(String[] myfileFileName) {
		this.myfileFileName = myfileFileName;
	}

}
