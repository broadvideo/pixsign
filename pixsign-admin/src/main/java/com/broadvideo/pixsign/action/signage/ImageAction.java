package com.broadvideo.pixsign.action.signage;

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
import org.apache.commons.io.FilenameUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsign.action.BaseDatatableAction;
import com.broadvideo.pixsign.common.CommonConfig;
import com.broadvideo.pixsign.domain.Image;
import com.broadvideo.pixsign.persistence.FolderMapper;
import com.broadvideo.pixsign.service.ImageService;
import com.broadvideo.pixsign.util.CommonUtil;
import com.broadvideo.pixsign.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("imageAction")
public class ImageAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Image image;

	private File[] mymedia;
	private String[] mymediaContentType;
	private String[] mymediaFileName;
	private String[] names;
	private String[] branchids;
	private String[] folderids;
	private String[] adflags;

	@Autowired
	private FolderMapper folderMapper;
	@Autowired
	private ImageService imageService;

	public void doUpload() throws Exception {
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
					logger.info("Upload one image, file={}", mymediaFileName[i]);
					if (names[i] == null || names[i].equals("")) {
						names[i] = mymediaFileName[i];
					}
					jsonItem.put("name", names[i]);
					jsonItem.put("filename", mymediaFileName[i]);
					jsonItem.put("size", FileUtils.sizeOf(mymedia[i]));

					Image image = new Image();
					image.setOrgid(getLoginStaff().getOrgid());
					if (branchids == null) {
						int branchid = getLoginStaff().getOrg().getTopbranchid();
						int folderid = folderMapper.selectRoot("" + getLoginStaff().getOrgid(), "" + branchid)
								.getFolderid();
						image.setBranchid(branchid);
						image.setFolderid(folderid);
					} else {
						image.setBranchid(Integer.parseInt(branchids[i]));
						image.setFolderid(Integer.parseInt(folderids[i]));
					}
					image.setAdflag(adflags[i]);
					image.setName(names[i]);
					image.setOname(mymediaFileName[i]);
					image.setFilename(mymediaFileName[i]);
					image.setStatus("9");
					image.setObjtype("0");
					image.setObjid(0);
					image.setDescription(mymediaFileName[i]);
					image.setCreatestaffid(getLoginStaff().getStaffid());
					imageService.addImage(image);

					String newFileName = "" + image.getImageid() + "." + FilenameUtils.getExtension(mymediaFileName[i]);
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
					boolean resize = CommonUtil.resizeImage(mymedia[i], imageFile, 38400);
					CommonUtil.resizeImage(imageFile, thumbFile, 640);
					if (resize) {
						FileUtils.moveFile(mymedia[i], new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/upload/"
								+ image.getImageid() + "_original." + FilenameUtils.getExtension(mymediaFileName[i])));
					} else {
						FileUtils.deleteQuietly(mymedia[i]);
					}

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
					imageService.updateImage(image);

					jsonItem.put("name", names[i]);
					jsonItem.put("filename", newFileName);
				} catch (Exception e) {
					logger.info("Image parse error, file={}", mymediaFileName[i], e);
					addActionError(e.getMessage());
					jsonItem.put("error", e.getMessage());
				}
				jsonArray.put(jsonItem);
			}
		}

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
			String folderid = getParameter("folderid");
			if (folderid == null || folderid.equals("")) {
				folderid = "" + getLoginStaff().getBranch().getTopfolderid();
			}
			String adflag = getParameter("adflag");
			if (adflag == null || adflag.equals("")) {
				adflag = "0";
			}

			int count = imageService.selectCount("" + getLoginStaff().getOrgid(), branchid, folderid, adflag, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Image> imageList = imageService.selectList("" + getLoginStaff().getOrgid(), branchid, folderid, adflag,
					search, start, length);
			for (Image image : imageList) {
				if (image.getWidth().intValue() == 0 || image.getHeight().intValue() == 0) {
					BufferedImage img = ImageIO.read(new File(CommonConfig.CONFIG_PIXDATA_HOME + image.getFilepath()));
					image.setWidth(img.getWidth());
					image.setHeight(img.getHeight());
					imageService.updateImage(image);
				}
				aaData.add(image);
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("ImageAction doList exception, ", ex);
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
			logger.error("ImageAction doAdd exception, ", ex);
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
			logger.error("ImageAction doUpdate exception, ", ex);
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
			logger.error("ImageAction doDelete exception, ", ex);
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

	public String[] getNames() {
		return names;
	}

	public void setNames(String[] names) {
		this.names = names;
	}

	public String[] getBranchids() {
		return branchids;
	}

	public void setBranchids(String[] branchids) {
		this.branchids = branchids;
	}

	public String[] getFolderids() {
		return folderids;
	}

	public void setFolderids(String[] folderids) {
		this.folderids = folderids;
	}

	public String[] getAdflags() {
		return adflags;
	}

	public void setAdflags(String[] adflags) {
		this.adflags = adflags;
	}

}
