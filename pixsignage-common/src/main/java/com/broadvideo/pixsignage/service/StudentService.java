package com.broadvideo.pixsignage.service;

import java.io.File;

import com.broadvideo.pixsignage.domain.Student;

public interface StudentService {

	Integer addStudent(Student student);

	Integer addStudent(Student student, File avatarfile);

	void deleteStudent(Integer studentid, Integer orgid);

	void updateStudent(Student student);

	String saveAvatar(Integer studentid, File avatarfile, Integer orgid);
	
	String getAvatarBaseDir(Integer orgid);

	String getAvatarAbsolutePath(Student student);


}
