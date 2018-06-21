package com.broadvideo.pixsignage.service;

import java.io.File;
import java.io.InputStream;
import java.util.List;

import org.json.JSONObject;

import com.broadvideo.pixsignage.domain.Person;

public interface PersonService {

	Integer addPerson(Person person);

	Integer addPerson(Person person, File avatarfile, File imageFile);

	void deletePerson(Integer personid, Integer orgid);

	void updatePerson(Person person);

	JSONObject importPersons(File zipFile, Integer branchid, Integer orgid);

	String saveAvatar(Integer personid, File avatarfile, Integer orgid);

	String saveAvatar(Integer personid, InputStream is, Integer orgid);

	String saveFaceImage(Integer personid, File imagefile, Integer orgid);

	String saveFaceImage(Integer personid, InputStream is, Integer orgid);

	String getAvatarBaseDir(Integer orgid);

	String getFaceImageBaseDir(Integer orgid);

	String getAvatarAbsolutePath(Person person);

	void syncPersons(List<Person> newPersons, Integer orgid);

}
