package com.broadvideo.pixsignage.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.service.ImageService;

@Scope("request")
@Controller("imageAction")
public class ImageAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6916555378882105703L;

	private static final Logger log = Logger.getLogger(ImageAction.class);

	private Image image;

	private File[] mymedia;
	private String[] mymediaContentType;
	private String[] mymediaFileName;
	private String[] name;

	@Autowired
	private ImageService imageService;

	public void doUpload() throws Exception {
		log.info("Begin image upload action process.");
		HttpServletResponse response = getHttpServletResponse();
		response.setContentType("text/html;charset=utf-8");
		PrintWriter writer = response.getWriter();
		JSONObject result = new JSONObject();
		JSONArray jsonArray = new JSONArray();

		result.put("files", jsonArray);

		if (mymedia != null) {
			for (int i = 0; i < mymedia.length; i++) {
				JSONObject jsonItem = new JSONObject();
				try {
					if (name[i] == null || name[i].equals("")) {
						name[i] = mymediaFileName[i];
					}
					jsonItem.put("name", name[i]);
					jsonItem.put("filename", mymediaFileName[i]);
					jsonItem.put("size", FileUtils.sizeOf(mymedia[i]));

					Image image = new Image();
					image.setOrgid(getLoginStaff().getOrgid());
					image.setBranchid(getLoginStaff().getBranchid());
					image.setName(name[i]);
					image.setFilename(mymediaFileName[i]);
					image.setStatus("9");
					image.setDescription(mymediaFileName[i]);
					image.setCreatestaffid(getLoginStaff().getStaffid());
					imageService.addImage(image);

					String newFileName = "" + image.getImageid() + "." + FilenameUtils.getExtension(mymediaFileName[i]);
					File fileToCreate = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/upload", newFileName);
					if (fileToCreate.exists()) {
						fileToCreate.delete();
					}
					FileUtils.moveFile(mymedia[i], fileToCreate);
					image.setFilepath("/image/upload/" + newFileName);
					image.setFilename(newFileName);
					image.setSize(FileUtils.sizeOf(fileToCreate));
					FileInputStream fis = new FileInputStream(fileToCreate);
					image.setMd5(DigestUtils.md5Hex(fis));
					fis.close();
					image.setStatus("1");
					imageService.updateImage(image);

					jsonItem.put("name", name[i]);
					jsonItem.put("filename", newFileName);
				} catch (Exception e) {
					e.printStackTrace();
					addActionError(e.getMessage());
					jsonItem.put("error", e.getMessage());
				}
				jsonArray.put(jsonItem);
			}
		}

		writer.write(result.toString());
		writer.close();

		log.info("Finish image upload action process.");
	}

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String branchid = getParameter("branchid");
			String search = getParameter("sSearch");

			if (branchid == null) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			int count = imageService.selectCount("" + getLoginStaff().getOrgid(), branchid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Image> imageList = imageService.selectList("" + getLoginStaff().getOrgid(), branchid, search, start,
					length);
			for (int i = 0; i < imageList.size(); i++) {
				aaData.add(imageList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			image.setCreatestaffid(getLoginStaff().getStaffid());
			image.setOrgid(getLoginStaff().getOrgid());
			image.setBranchid(getLoginStaff().getBranchid());
			imageService.addImage(image);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			imageService.updateImage(image);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			imageService.deleteImage("" + image.getImageid());
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Image getImage() {
		return image;
	}

	public void setImage(Image image) {
		this.image = image;
	}

	public File[] getMymedia() {
		return mymedia;
	}

	public void setMymedia(File[] mymedia) {
		this.mymedia = mymedia;
	}

	public String[] getMymediaContentType() {
		return mymediaContentType;
	}

	public void setMymediaContentType(String[] mymediaContentType) {
		this.mymediaContentType = mymediaContentType;
	}

	public String[] getMymediaFileName() {
		return mymediaFileName;
	}

	public void setMymediaFileName(String[] mymediaFileName) {
		this.mymediaFileName = mymediaFileName;
	}

	public String[] getName() {
		return name;
	}

	public void setName(String[] name) {
		this.name = name;
	}

}
