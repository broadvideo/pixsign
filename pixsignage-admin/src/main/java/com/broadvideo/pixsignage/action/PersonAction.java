package com.broadvideo.pixsignage.action;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Person;
import com.broadvideo.pixsignage.persistence.PersonMapper;
import com.broadvideo.pixsignage.service.PersonService;
import com.broadvideo.pixsignage.util.SqlUtil;
import com.broadvideo.pixsignage.util.Struts2Utils;

@SuppressWarnings("serial")
@Scope("request")
@Controller("personAction")
public class PersonAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Person person;
	private File avatarfile;
	private String avatarfileContentType;
	private File imagefile;
	private String imagefileContentType;
	private File personZipFile;
	private String personZipFileContentType;

	@Autowired
	private PersonService personService;
	@Autowired
	private PersonMapper personMapper;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);

			List<Object> aaData = new ArrayList<Object>();
			int count = personMapper.selectCount("" + getLoginStaff().getOrgid(), person.getBranchid(), search,
					person.getType());
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Person> personList = personMapper.selectList("" + getLoginStaff().getOrgid(), person.getBranchid(),
					search, person.getType(), start, length);
			for (int i = 0; i < personList.size(); i++) {
				aaData.add(personList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("personAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			person.setOrgid(getStaffOrgid());
			person.setCreatestaffid(getLoginStaff().getStaffid());
			person.setCreatetime(Calendar.getInstance().getTime());
			if (imagefile != null) {
				if (!checkImageFormat(imagefile)) {
					logger.error("{}:Not jpg format", imagefile.getName());
					setErrorcode(-1);
					setErrormsg("识别图片格式错误：上传jpg格式图片用于识别！");
					return ERROR;
				}
			}
			Integer personid = this.personService.addPerson(person, avatarfile, imagefile);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PersonAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			person.setOrgid(getLoginStaff().getOrgid());
			person.setUpdatetime(new Date());
			person.setUpdatestaffid(getStaffid());
			if (imagefile != null) {
				if (!checkImageFormat(imagefile)) {
					logger.error("{}:Not jpg format", imagefile.getName());
					setErrorcode(-1);
					setErrormsg("识别图片格式错误：上传jpg格式图片用于识别！");
					return ERROR;
				}
				String imagefile = personService.saveFaceImage(person.getPersonid(), avatarfile, getLoginStaff()
						.getOrgid());
				logger.info("saveFaceImage return path:{}", imagefile);
				person.setImageurl(imagefile);
			}
			if (avatarfile != null) {
				String avatar = personService.saveAvatar(person.getPersonid(), avatarfile, getLoginStaff().getOrgid());
				logger.info("saveAvatar return path:{}", avatar);
				person.setAvatar(avatar);
			}

			this.personService.updatePerson(person);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PersonAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			personService.deletePerson(person.getPersonid(), getLoginStaff().getOrgid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PersonAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doImport() {
		try {
			String branchid = super.getParameter("person.branchid");
			if (StringUtils.isBlank(branchid)) {
				logger.error("branchid:{} is empty.", branchid);
				renderError(RetCodeEnum.EXCEPTION, "请选择分支结构！");
				return ERROR;

			}
			if (personZipFile == null) {
				logger.error("personZipFile:{} is null.", personZipFile);
				renderError(RetCodeEnum.EXCEPTION, "请选择需要导入的Zip包！");
				return ERROR;
			}
			JSONObject dataJson = this.personService.importPersons(personZipFile, NumberUtils.toInt(branchid),
					getStaffOrgid());
			JSONObject resultJson = new JSONObject();
			resultJson.put("errorcode", 0);
			resultJson.put("errormsg", "");
			resultJson.put("importResult", dataJson);
			Struts2Utils.renderJson(resultJson.toString(), "encoding:UTF-8");
			return NONE;
		} catch (Exception ex) {
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}

	public Person getPerson() {
		return person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}

	public File getAvatarfile() {
		return avatarfile;
	}

	public void setAvatarfile(File avatarfile) {
		this.avatarfile = avatarfile;
	}

	public String getAvatarfileContentType() {
		return avatarfileContentType;
	}

	public void setAvatarfileContentType(String avatarfileContentType) {
		this.avatarfileContentType = avatarfileContentType;
	}

	public File getImagefile() {
		return imagefile;
	}

	public void setImagefile(File imagefile) {
		this.imagefile = imagefile;
	}

	public String getImagefileContentType() {
		return imagefileContentType;
	}

	public void setImagefileContentType(String imagefileContentType) {
		this.imagefileContentType = imagefileContentType;
	}

	public static boolean checkImageFormat(File file) {
		boolean f = false;
		ImageInputStream iis = null;
		try {

			// create an image input stream from the specified file
			iis = ImageIO.createImageInputStream(file);

			// get all currently registered readers that recognize the image
			// format
			Iterator<ImageReader> iter = ImageIO.getImageReaders(iis);

			if (!iter.hasNext()) {
				throw new RuntimeException("No readers found!");
			}

			// get the first reader
			ImageReader reader = iter.next();

			// System.out.println("Format: " + reader.getFormatName());
			// "JPEG"
			if (reader != null && "JPEG".equalsIgnoreCase(reader.getFormatName())) {
				f = true;
			}
			// close stream
		} catch (IOException e) {
			e.printStackTrace();
		} finally {

			try {
				if (iis != null) {
					iis.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		return f;
	}

	public File getPersonZipFile() {
		return personZipFile;
	}

	public void setPersonZipFile(File personZipFile) {
		this.personZipFile = personZipFile;
	}

	public String getPersonZipFileContentType() {
		return personZipFileContentType;
	}

	public void setPersonZipFileContentType(String personZipFileContentType) {
		this.personZipFileContentType = personZipFileContentType;
	}

}
