package com.broadvideo.pixsignage.action.signage;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Diy;
import com.broadvideo.pixsignage.domain.Diyaction;
import com.broadvideo.pixsignage.service.DiyService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.SqlUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@SuppressWarnings("serial")
@Scope("request")
@Controller("diyAction")
public class DiyAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Diy diy;

	private File[] myfile;
	private String[] myfileContentType;
	private String[] myfileFileName;
	private String[] branchids;

	@Autowired
	private DiyService diyService;

	public void doUpload() throws Exception {
		HttpServletResponse response = getHttpServletResponse();
		response.setContentType("text/html;charset=utf-8");
		PrintWriter writer = response.getWriter();
		JSONObject result = new JSONObject();
		JSONArray jsonArray = new JSONArray();

		if (myfile != null) {
			for (int i = 0; i < myfile.length; i++) {
				JSONObject jsonItem = new JSONObject();
				try {
					logger.info("Upload one diy, file={}", myfileFileName[i]);
					String filename = myfileFileName[i];
					String dir = filename.substring(0, filename.lastIndexOf("."));
					FileUtils.deleteQuietly(new File("/tmp", dir));
					CommonUtil.unzip(myfile[i], "/tmp", false);
					String s = FileUtils.readFileToString(new File("/tmp/" + dir + "/diy.json"), "UTF-8");
					JSONObject diyJson = JSONObject.fromObject(s);
					JSONArray diyactionJsonArray = diyJson.getJSONArray("actions");
					String code = diyJson.getString("code");
					String snapshot = diyJson.getString("snapshot");
					File snapshotFile = new File("/tmp/" + dir + "/" + snapshot);
					BufferedImage img = ImageIO.read(snapshotFile);

					Diy diy = new Diy();
					diy.setOrgid(getLoginStaff().getOrgid());
					diy.setBranchid(Integer.parseInt(branchids[i]));
					diy.setName(diyJson.getString("name"));
					diy.setCode(diyJson.getString("code"));
					diy.setType(diyJson.getString("type"));
					diy.setWidth(img.getWidth());
					diy.setHeight(img.getHeight());
					diy.setFilepath("/diy/" + dir);
					diy.setFilename(myfileFileName[i]);
					diy.setSnapshot("/diy/" + dir + "/" + diyJson.getString("snapshot"));
					diy.setVersion(diyJson.getString("version"));
					diy.setStatus("1");
					diy.setDescription(diyJson.getString("desc"));
					diy.setCreatestaffid(getLoginStaff().getStaffid());

					List<Diyaction> diyactions = new ArrayList<Diyaction>();
					for (int j = 0; j < diyactionJsonArray.size(); j++) {
						Diyaction diyaction = new Diyaction();
						diyaction.setCode(diyactionJsonArray.getJSONObject(j).getString("id"));
						diyaction.setName(diyactionJsonArray.getJSONObject(j).getString("name"));
						diyactions.add(diyaction);
					}
					diy.setDiyactions(diyactions);
					diyService.uploadDiy(diy);

					String thumbnailPath = "/diy/snapshot/" + diy.getDiyid() + "."
							+ FilenameUtils.getExtension(snapshot);
					File thumbFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbnailPath);
					CommonUtil.resizeImage(snapshotFile, thumbFile, 640);
					diy.setThumbnail(thumbnailPath);
					diyService.updateDiy(diy);

					String diyFilePath = "/diy/" + code;
					File diyFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + diyFilePath);
					FileUtils.deleteQuietly(diyFile);
					FileUtils.moveDirectory(new File("/tmp/" + code), diyFile);

					jsonItem.put("errorcode", 0);
					jsonItem.put("name", diy.getName());
					jsonItem.put("version", diy.getVersion());
					jsonArray.add(jsonItem);
				} catch (Exception e) {
					logger.info("Diy parse error, file={}", myfileFileName[i], e);
					addActionError(e.getMessage());
					jsonItem.put("filename", myfileFileName[i]);
					jsonItem.put("errorcode", 3000);
					jsonItem.put("error", e.getMessage());
					jsonArray.add(jsonItem);
				}
			}
		}
		result.put("files", jsonArray);

		writer.write(result.toString());
		writer.close();
	}

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

			List<Object> aaData = new ArrayList<Object>();
			int count = diyService.selectCount("" + getLoginStaff().getOrgid(), branchid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Diy> diyList = diyService.selectList("" + getLoginStaff().getOrgid(), branchid, search, start, length);
			for (int i = 0; i < diyList.size(); i++) {
				aaData.add(diyList.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DiyAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			diyService.deleteDiy("" + diy.getDiyid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DiyAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Diy getDiy() {
		return diy;
	}

	public void setDiy(Diy diy) {
		this.diy = diy;
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

	public String[] getBranchids() {
		return branchids;
	}

	public void setBranchids(String[] branchids) {
		this.branchids = branchids;
	}

}
