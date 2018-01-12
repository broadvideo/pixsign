package com.broadvideo.pixsignage.action;

import java.io.File;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Person;
import com.broadvideo.pixsignage.persistence.PersonMapper;
import com.broadvideo.pixsignage.service.PersonService;
import com.broadvideo.pixsignage.util.SqlUtil;

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
			int count = personMapper.selectCount("" + getLoginStaff().getOrgid(), search, person.getType());
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Person> personList = personMapper.selectList("" + getLoginStaff().getOrgid(), search,
					person.getType(),
					start, length);
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
			if (avatarfile != null) {
				String avatar = personService.saveAvatar(person.getPersonid(), avatarfile, getLoginStaff()
						.getOrgid());
				logger.info("saveAvatar return path:{}", avatar);
				person.setAvatar(avatar);
			}
			if (imagefile != null) {

				String imagefile = personService.saveFaceImage(person.getPersonid(), avatarfile, getLoginStaff()
						.getOrgid());
				logger.info("saveFaceImage return path:{}", imagefile);
				person.setImageurl(imagefile);
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


}
