package com.broadvideo.pixsignage.action;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;
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
import com.broadvideo.pixsignage.domain.House;
import com.broadvideo.pixsignage.domain.House;
import com.broadvideo.pixsignage.persistence.HouseMapper;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("houseAction")
public class HouseAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private House house;

	private File[] myfile;
	private String[] myfileFileName;

	@Autowired
	private HouseMapper houseMapper;

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
					logger.info("Upload one house, file={}", myfileFileName[i]);
					String filename = myfileFileName[i];
					String name = filename.substring(0, filename.lastIndexOf("."));
					FileUtils.deleteQuietly(new File("/tmp", name));
					CommonUtil.unzip(myfile[i], "/tmp", false);

					BufferedImage img = null;
					int width = 0;
					int height = 0;
					File thumbnailFile = new File("/tmp/" + name + "/cover.jpg");
					if (thumbnailFile.exists()) {
						img = ImageIO.read(thumbnailFile);
						width = img.getWidth();
						height = img.getHeight();
					}

					House house = houseMapper.selectByName(name);
					if (house == null) {
						house = new House();
						house.setOrgid(getLoginStaff().getOrgid());
						house.setName(name);
						houseMapper.insertSelective(house);
					}
					if (img != null) {
						String thumbnail = "/house/thumbnail/" + house.getHouseid() + ".jpg";
						FileUtils.copyFile(thumbnailFile, new File(CommonConfig.CONFIG_PIXDATA_HOME + thumbnail));
						house.setThumbnail(thumbnail);
						house.setHeight(height);
						house.setWidth(width);
					}
					String houseFilePath = "/house/" + house.getHouseid() + ".zip";
					File houseFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + houseFilePath);
					FileUtils.deleteQuietly(houseFile);
					FileUtils.moveFile(myfile[i], houseFile);
					FileInputStream fis = new FileInputStream(houseFile);
					house.setZip(houseFilePath);
					house.setChecksum(DigestUtils.md5Hex(fis));
					fis.close();
					houseMapper.updateByPrimaryKeySelective(house);

					jsonItem.put("errorcode", 0);
					jsonItem.put("name", house.getName());
					jsonArray.put(jsonItem);
				} catch (Exception e) {
					logger.info("House parse error, file={}", myfileFileName[i], e);
					addActionError(e.getMessage());
					jsonItem.put("filename", myfileFileName[i]);
					jsonItem.put("errorcode", -1);
					jsonItem.put("error", e.getMessage());
					jsonArray.put(jsonItem);
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

			int count = houseMapper.selectCount(search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<House> houseList = houseMapper.selectList(search, start, length);
			for (House house : houseList) {
				aaData.add(house);
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("HouseAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			houseMapper.deleteByPrimaryKey("" + house.getHouseid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("HouseAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public House getHouse() {
		return house;
	}

	public void setHouse(House house) {
		this.house = house;
	}

	public File[] getMyfile() {
		return myfile;
	}

	public void setMyfile(File[] myfile) {
		this.myfile = myfile;
	}

	public String[] getMyfileFileName() {
		return myfileFileName;
	}

	public void setMyfileFileName(String[] myfileFileName) {
		this.myfileFileName = myfileFileName;
	}

}
