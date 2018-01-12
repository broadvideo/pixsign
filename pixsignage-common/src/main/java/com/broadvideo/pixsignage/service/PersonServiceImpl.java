package com.broadvideo.pixsignage.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Person;
import com.broadvideo.pixsignage.persistence.PersonMapper;
import com.broadvideo.pixsignage.util.UUIDUtils;

@Transactional(rollbackFor = Exception.class)
@Service
public class PersonServiceImpl implements PersonService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private PersonMapper personMapper;

	@Override
	public Integer addPerson(Person person) {
		if (StringUtils.isNotBlank(person.getPersonno()) || StringUtils.isNotBlank(person.getRfid())) {
		if (checkExists(null, person.getPersonno(), person.getRfid(), person.getOrgid())) {
			logger.error("Person(personno={},rfid={}) has exits.", person.getPersonno(), person.getRfid());
				throw new ServiceException("员工工号已经存在!");
		}
		}
		person.setUuid(UUIDUtils.generateUUID());
		person.setStatus(GlobalFlag.VALID);
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
	public String saveAvatar(Integer personid, File avatarfile, Integer orgid) {

		if (avatarfile == null) {
			logger.error("avatarfile is not exists.");
			return null;
		}
		Person person = this.personMapper.selectByPrimaryKey(personid);
		String avatarpath = this.getAvatarBaseDir(orgid) + "/" + person.getPersonid() + ".jpg";
		String targetAvatarpath = CommonConfig.CONFIG_PIXDATA_HOME + avatarpath;
		FileUtils.deleteQuietly(new File(targetAvatarpath));
		try {
			
             File targetFile=new File(targetAvatarpath);
             if(!targetFile.getParentFile().exists()){
            	boolean flag= targetFile.getParentFile().mkdirs();
            	logger.info("mkdir parent dir:{} ret val:{}",targetFile.getParent(),flag);
             }
			IOUtils.copy(new FileInputStream(avatarfile), new FileOutputStream(targetFile));
		} catch (FileNotFoundException e) {
			logger.error("File not found", e);

		} catch (IOException e) {

			logger.error("saveAvatar io exception.", e);
		}

		return avatarpath;
	}

	public String saveFaceImage(Integer personid, File imageFile, Integer orgid) {

		if (imageFile == null) {
			logger.error("avatarfile is not exists.");
			return null;
		}
		Person person = this.personMapper.selectByPrimaryKey(personid);
		String faceimagepath = this.getFaceImageBaseDir(orgid) + "/" + person.getPersonid() + ".jpg";
		String targetAvatarpath = CommonConfig.CONFIG_PIXDATA_HOME + faceimagepath;
		FileUtils.deleteQuietly(new File(targetAvatarpath));
		try {

			File targetFile = new File(targetAvatarpath);
			if (!targetFile.getParentFile().exists()) {
				boolean flag = targetFile.getParentFile().mkdirs();
				logger.info("mkdir parent dir:{} ret val:{}", targetFile.getParent(), flag);
			}
			IOUtils.copy(new FileInputStream(imageFile), new FileOutputStream(targetFile));
		} catch (FileNotFoundException e) {
			logger.error("File not found", e);

		} catch (IOException e) {

			logger.error("saveFaceImage io exception.", e);
		}

		return faceimagepath;
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



}
