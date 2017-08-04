package com.broadvideo.pixsignage.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Student;
import com.broadvideo.pixsignage.persistence.StudentMapper;

@Transactional(rollbackFor = Exception.class)
@Service
public class StudentServiceImpl implements StudentService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private StudentMapper studentMapper;

	@Override
	public Integer addStudent(Student student) {
		if (checkExists(null, student.getStudentno(), student.getHardid(), student.getOrgid())) {
			logger.error("Student(studentno={},hardid={}) has exits.", student.getStudentno(), student.getHardid());
			throw new ServiceException("Student exists.");
		}
		this.studentMapper.insertSelective(student);
		return student.getStudentid();
	}

	@Override
	public Integer addStudent(Student student, File avatarfile) {
		Integer studentid = this.addStudent(student);
		if (avatarfile != null) {
		String avatarpath = this.saveAvatar(student.getStudentid(), avatarfile, student.getOrgid());
		Student newStudent = new Student();
		newStudent.setStudentid(studentid);
		newStudent.setAvatar(avatarpath);
		this.studentMapper.updateByPrimaryKeySelective(newStudent);
		}
		return studentid;
	}

	private boolean checkExists(Integer excludeId, String studentno, String hardid, Integer orgId) {

		return this.studentMapper.countBy(excludeId, studentno, hardid, orgId) > 0;
	}

	@Override
	public void updateStudent(Student student) {
		studentMapper.updateByPrimaryKeySelective(student);
	}

	@Override
	public void deleteStudent(Integer studentid, Integer orgid) {

		Student student = this.studentMapper.selectByPrimaryKey(studentid + "");
		if (student.getOrgid().equals(orgid)) {

			this.studentMapper.deleteByPrimaryKey(studentid, orgid);
			if (StringUtils.isNotBlank(student.getAvatar())) {
				String avatarpath = this.getAvatarAbsolutePath(student);
				File deleteFile = new File(avatarpath);
				if (!deleteFile.isDirectory()) {
					deleteFile.delete();
				}

			}

		}

	}

	@Override
	public String saveAvatar(Integer studentid, File avatarfile, Integer orgid) {

		if (avatarfile == null) {
			logger.error("avatarfile is not exists.");
			return null;
		}
		Student student = this.studentMapper.selectByPrimaryKey(studentid.toString());
		String avatarpath = this.getAvatarBaseDir(orgid) + "/" + student.getStudentno() + ".jpg";
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

	@Override
	public String getAvatarBaseDir(Integer orgid) {
		StringBuilder sb = new StringBuilder();
		sb.append("/image").append("/avatar");
		String paddingOrgid = StringUtils.leftPad(orgid.toString(), 5, "0");
		sb.append("/").append(paddingOrgid);

		return sb.toString();
	}

	@Override
	public String getAvatarAbsolutePath(Student student) {
		if (student.getAvatar() != null) {
			String avatar = CommonConfig.CONFIG_PIXDATA_HOME + student.getAvatar();
			logger.info("student.id={} avatar:{}", student.getStudentid(), avatar);
			return avatar;
		} else {
			logger.error("student.id={} avatar is null", student.getStudentid());
			return null;
		}
	}

	public static void main(String[] args) {

		File file = new File("d://txt/test");
		System.out.println("exists:" + file.delete());

	}



}
