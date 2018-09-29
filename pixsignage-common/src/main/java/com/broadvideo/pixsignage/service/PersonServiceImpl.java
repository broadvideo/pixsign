package com.broadvideo.pixsignage.service;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.NPOIFSFileSystem;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.xerces.impl.dv.util.Base64;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.POIUtil;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.domain.Person;
import com.broadvideo.pixsignage.persistence.BranchMapper;
import com.broadvideo.pixsignage.persistence.PersonMapper;
import com.broadvideo.pixsignage.util.DateUtil;
import com.broadvideo.pixsignage.util.UUIDUtils;
import com.broadvideo.pixsignage.util.ZipUtil;
import com.ibm.icu.util.Calendar;

@Transactional(rollbackFor = Exception.class)
@Service
public class PersonServiceImpl implements PersonService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private PersonMapper personMapper;
	@Autowired
	private BranchMapper branchMapper;

	@Override
	public Integer addPerson(Person person) {
		if (StringUtils.isNotBlank(person.getPersonno())) {
			if (checkExists(null, person.getPersonno(), person.getRfid(), person.getOrgid())) {
				logger.error("Person(personno={},rfid={}) has exits.", person.getPersonno(), person.getRfid());
				throw new ServiceException("员工工号已经存在!");
			}
		}
		person.setUuid(UUIDUtils.generateUUID());
		person.setStatus(GlobalFlag.VALID);
		person.setCreatetime(new Date());
		this.personMapper.insertSelective(person);
		return person.getPersonid();
	}

	@Override
	public Integer addPerson(Person person, File avatarfile, File imageFile) {
		Integer personid = this.addPerson(person);
		if (avatarfile != null) {
			String avatarpath = this.saveAvatar(personid, avatarfile, person.getOrgid());
			Person newPerson = new Person();
			newPerson.setPersonid(personid);
			newPerson.setAvatar(avatarpath);
			this.personMapper.updateByPrimaryKeySelective(newPerson);
		}
		if (imageFile != null) {

			String imagepath = this.saveFaceImage(personid, imageFile, person.getOrgid());
			Person newPerson = new Person();
			newPerson.setPersonid(personid);
			newPerson.setImageurl(imagepath);
			this.personMapper.updateByPrimaryKeySelective(newPerson);

		}
		return personid;
	}

	private boolean checkExists(Integer excludeId, String personno, String rfid, Integer orgId) {

		return this.personMapper.countBy(excludeId, personno, rfid, orgId) > 0;
	}

	@Override
	public void updatePerson(Person person) {
		personMapper.updateByPrimaryKeySelective(person);
	}

	@Override
	public void deletePerson(Integer personid, Integer orgid) {

		Person person = this.personMapper.selectByPrimaryKey(personid);
		if (person.getOrgid().equals(orgid)) {
			if (StringUtils.isNotBlank(person.getAvatar())) {
				String avatarpath = this.getAvatarAbsolutePath(person);
				File deleteFile = new File(avatarpath);
				if (!deleteFile.isDirectory()) {
					deleteFile.delete();
				}

			}
			if (StringUtils.isNotBlank(person.getImageurl())) {
				String faceimagepath = this.getFaceImageAbsolutePath(person);
				File deleteFile = new File(faceimagepath);
				if (!deleteFile.isDirectory()) {
					deleteFile.delete();
				}

			}
			person.setStatus(GlobalFlag.DELETE);
			person.setUpdatetime(new Date());
			this.personMapper.updateByPrimaryKeySelective(person);

		}

	}

	@Override
	public String saveAvatar(Integer personid, final InputStream is, Integer orgid) {
		if (is == null) {
			logger.error("avatarfile is not exists.");
			return null;
		}

		Person person = this.personMapper.selectByPrimaryKey(personid);
		String avatarpath = this.getAvatarBaseDir(orgid) + "/" + person.getPersonid() + ".jpg";
		String targetAvatarpath = CommonConfig.CONFIG_PIXDATA_HOME + avatarpath;
		FileUtils.deleteQuietly(new File(targetAvatarpath));
		OutputStream os = null;
		try {

			File targetFile = new File(targetAvatarpath);
			if (!targetFile.getParentFile().exists()) {
				boolean flag = targetFile.getParentFile().mkdirs();
				logger.info("mkdir parent dir:{} ret val:{}", targetFile.getParent(), flag);
			}
			os = new FileOutputStream(targetFile);
			IOUtils.copy(is, os);

		} catch (FileNotFoundException e) {
			logger.error("File not found", e);

		} catch (IOException e) {

			logger.error("saveAvatar io exception.", e);
		} finally {
			IOUtils.closeQuietly(os);
			IOUtils.closeQuietly(is);
		}

		return avatarpath;
	}

	@Override
	public String saveAvatar(Integer personid, File avatarfile, Integer orgid) {

		try {
			return this.saveAvatar(personid, new FileInputStream(avatarfile), orgid);
		} catch (FileNotFoundException e) {

			throw new ServiceException("File:" + avatarfile.getName() + " not found.");

		}
	}

	@Override
	public String saveFaceImage(Integer personid, final InputStream is, Integer orgid) {
		if (is == null) {
			logger.error("face  is not exists.");
			return null;
		}
		Person person = this.personMapper.selectByPrimaryKey(personid);
		String faceimagepath = this.getFaceImageBaseDir(orgid) + "/" + person.getPersonid() + ".jpg";
		String targetAvatarpath = CommonConfig.CONFIG_PIXDATA_HOME + faceimagepath;
		FileUtils.deleteQuietly(new File(targetAvatarpath));
		OutputStream os = null;
		try {

			File targetFile = new File(targetAvatarpath);
			if (!targetFile.getParentFile().exists()) {
				boolean flag = targetFile.getParentFile().mkdirs();
				logger.info("mkdir parent dir:{} ret val:{}", targetFile.getParent(), flag);
			}
			os = new FileOutputStream(targetFile);
			IOUtils.copy(is, os);
		} catch (FileNotFoundException e) {
			logger.error("File not found", e);

		} catch (IOException e) {

			logger.error("saveFaceImage io exception.", e);
		} finally {
			IOUtils.closeQuietly(os);
			IOUtils.closeQuietly(is);

		}

		return faceimagepath;
	}

	public String saveFaceImage(Integer personid, File imageFile, Integer orgid) {

		try {
			return this.saveFaceImage(personid, new FileInputStream(imageFile), orgid);
		} catch (FileNotFoundException e) {

			throw new ServiceException("imageFile:" + imageFile.getName() + " not found.");
		}
	}

	@Override
	public String getAvatarBaseDir(Integer orgid) {
		StringBuilder sb = new StringBuilder();
		sb.append("/image").append("/avatar");
		String paddingOrgid = StringUtils.leftPad(orgid.toString(), 5, "0");
		sb.append("/").append(paddingOrgid);

		return sb.toString();
	}

	@Override
	public String getFaceImageBaseDir(Integer orgid) {
		StringBuilder sb = new StringBuilder();
		sb.append("/image").append("/face");
		String paddingOrgid = StringUtils.leftPad(orgid.toString(), 5, "0");
		sb.append("/").append(paddingOrgid);

		return sb.toString();
	}

	@Override
	public String getAvatarAbsolutePath(Person person) {
		if (person.getAvatar() != null) {
			String avatar = CommonConfig.CONFIG_PIXDATA_HOME + person.getAvatar();
			logger.info("personid={} avatar:{}", person.getPersonid(), avatar);
			return avatar;
		} else {
			logger.error("personid={} avatar is null", person.getPersonid());
			return null;
		}
	}

	public String getFaceImageAbsolutePath(Person person) {
		if (person.getAvatar() != null) {
			String imageurl = CommonConfig.CONFIG_PIXDATA_HOME + person.getImageurl();
			logger.info("personid={} imageurl:{}", person.getPersonid(), imageurl);
			return imageurl;
		} else {
			logger.error("personid={} imageurl is null", person.getPersonid());
			return null;
		}
	}

	@Override
	public synchronized JSONObject importPersons(File zipFile, Integer branchid, Integer orgid) {
		final String tmpOutputDest = CommonConfig.CONFIG_TEMP_HOME + "/" + UUIDUtils.generateUUID();

		final String excelFilename = "data.xls";
		try {
			ZipUtil.unzip(zipFile.getAbsolutePath(), tmpOutputDest);
		} catch (Exception ex) {
			logger.error("unzip failed: file({})", zipFile.getAbsolutePath(), ex);
			throw new ServiceException(RetCodeEnum.EXCEPTION, "压缩包解压异常！");
		}
		String excelFilePath = tmpOutputDest + "/" + excelFilename;
		File excelFile = new File(excelFilePath);
		if (!excelFile.exists()) {
			logger.error("import failed:excel file({}) not found.", excelFilePath);
			throw new ServiceException("导入失败：模板中不存在excel文件名：" + excelFilename + "!");
		}
		// HSSFWorkbook, File
		NPOIFSFileSystem fs = null;
		try {
			fs = new NPOIFSFileSystem(excelFile);
			HSSFWorkbook wb = new HSSFWorkbook(fs.getRoot(), true);
			Integer invalidCount = 0;
			List<Person> persons = this.extractPersons(wb, invalidCount);
			String baseAvatar = this.getAvatarBaseDir(orgid);
			String baseFace = this.getFaceImageBaseDir(orgid);
			String attachementDir = tmpOutputDest + "/attachment";
			int total = persons.size() + invalidCount;
			int success = 0;
			for (Person person : persons) {
				String personno = null;
				String avatarFilePath = null;
				String faceFilePath = null;
				try {
					person.setOrgid(orgid);
					person.setCreatestaffid(-1);
					personno = person.getPersonno();
					person.setType(2);
					person.setBranchid(branchid);
					avatarFilePath = attachementDir + "/" + personno + "/avatar/avatar.jpg";
					faceFilePath = attachementDir + "/" + personno + "/face/face.jpg";
					Integer personid = this.addPerson(person, new File(avatarFilePath), new File(faceFilePath));
					logger.info("addPerson:personno:{},avatar:{},face:{} ret peronid:{}", personno, avatarFilePath,
							faceFilePath, personid);
					success++;
				} catch (Exception ex) {
					logger.error("addPerson fail:personno:{},avatar:{},face:{}", personno, avatarFilePath,
							faceFilePath, ex);
					continue;
				}
			}

			JSONObject resultJson = new JSONObject();
			resultJson.put("total", total);
			resultJson.put("success", success);
			resultJson.put("fail", total - success);
			resultJson.put("invalid", invalidCount);

			return resultJson;
		} catch (Exception ex) {

			logger.error("importPersons fail:", ex);
			throw new ServiceException(RetCodeEnum.EXCEPTION, "导入人员数据异常:" + ex.getMessage());
		} finally {
			if (fs != null) {
				try {
					fs.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

			logger.error("Delete tmp unzip dir:{}", tmpOutputDest);
			try {
				FileUtils.deleteDirectory(new File(tmpOutputDest));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

	}

	private List<Person> extractPersons(HSSFWorkbook wb, Integer invalidCount) {
		Sheet sheet = wb.getSheetAt(0);
		int rowStart = 1;
		int rowEnd = sheet.getLastRowNum();
		logger.info("Collect Perons from  sheet name:{} ", sheet.getSheetName());
		List<Person> persons = new ArrayList<Person>();
		for (int rowNum = rowStart; rowNum <= rowEnd; rowNum++) {
			Row r = sheet.getRow(rowNum);
			if (r == null) {
				continue;
			}

			String personno = POIUtil.formatCellValue(r.getCell(0));
			if (StringUtils.isBlank(personno)) {
				logger.error("Invalid rows for personno is null.");
				invalidCount++;
				continue;
			}
			String name = POIUtil.formatCellValue(r.getCell(1));
			if (StringUtils.isBlank(name)) {
				logger.error("Invalid rows for name is null.");
				invalidCount++;
				continue;

			}
			String genderName = POIUtil.formatCellValue(r.getCell(2));
			String gender = "2";
			if ("男".equals(genderName)) {
				gender = "0";
			} else if ("女".equals(genderName)) {
				gender = "1";
			}
			String mobile = POIUtil.formatCellValue(r.getCell(3));
			String email = POIUtil.formatCellValue(r.getCell(4));
			Person person = new Person();
			person.setPersonno(personno);
			person.setName(name);
			person.setSex(gender);
			person.setEmail(email);
			person.setMobile(mobile);
			persons.add(person);

		}
		logger.info("extractClassrooms total:{}", persons.size());
		return persons;

	}

	@Override
	public void syncPersons(List<Person> newPersons, Integer orgid) {

		List<Branch> branchList = branchMapper.selectRoot(orgid + "");
		for (Person newPerson : newPersons) {
			try {
				byte[] avatarBytes = Base64.decode(newPerson.getAvatar());
				byte[] faceBytes = Base64.decode(newPerson.getImageurl());
				InputStream avatarInputStream = new ByteArrayInputStream(avatarBytes);
				InputStream faceInputStream = new ByteArrayInputStream(faceBytes);
				Person qPerson = this.personMapper.selectByUuid(newPerson.getUuid(), orgid);
				if (qPerson != null) {
					newPerson.setPersonid(qPerson.getPersonid());
					newPerson.setAvatar(null);
					newPerson.setImageurl(null);
					this.personMapper.updateByPrimaryKeySelective(newPerson);
				} else {

					newPerson.setBranchid(branchList.get(0).getBranchid());
					newPerson.setCreatetime(new Date());
					newPerson.setOrgid(orgid);
					newPerson.setCreatestaffid(-1);
					newPerson.setStatus(GlobalFlag.VALID);
					newPerson.setType(2);
					newPerson.setAvatar(null);
					newPerson.setImageurl(null);
					this.personMapper.insertSelective(newPerson);
				}
				String avatarpath = this.saveAvatar(newPerson.getPersonid(), avatarInputStream, orgid);
				String facepath = this.saveFaceImage(newPerson.getPersonid(), faceInputStream, orgid);
				Person updateRecord = new Person();
				updateRecord.setPersonid(newPerson.getPersonid());
				updateRecord.setAvatar(avatarpath);
				updateRecord.setImageurl(facepath);
				this.personMapper.updateByPrimaryKeySelective(updateRecord);

			} catch (Exception ex) {

				logger.error("Sync person:{} exception.", newPerson, ex);
				continue;
			}
		}

	}

	public static void main(String[] args) {

		Date newDate = new Date(1535791822307L);
		System.out.println("newDate:" + DateUtil.getDateStr(newDate, "yyyy-MM-dd HH:mm:ss SSS"));
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(newDate);
		calendar.set(Calendar.MILLISECOND, 0);
		System.out.println("newDate:" + DateUtil.getDateStr(calendar.getTime(), "yyyy-MM-dd HH:mm:ss SSS"));
		System.out.println("newDate:" + calendar.getTimeInMillis());

	}
}
