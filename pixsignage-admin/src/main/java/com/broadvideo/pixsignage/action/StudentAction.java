package com.broadvideo.pixsignage.action;

import java.io.File;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Student;
import com.broadvideo.pixsignage.persistence.StudentMapper;
import com.broadvideo.pixsignage.service.StudentService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("studentAction")
public class StudentAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Student student;
	private File avatarfile;
	private String avatarfileContentType;
	@Autowired
	private StudentService studentService;
	@Autowired
	private StudentMapper studentMapper;

	public String doUpload() {

		return SUCCESS;
	}

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String classid = getParameter("classid");

			List<Object> aaData = new ArrayList<Object>();
			int count = studentMapper.selectCount("" + getLoginStaff().getOrgid(), classid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Student> studentList = studentMapper.selectList("" + getLoginStaff().getOrgid(), classid, search,
					start, length);
			for (int i = 0; i < studentList.size(); i++) {
				aaData.add(studentList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("StudentAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			student.setOrgid(getLoginStaff().getOrgid());
			student.setCreatestaffid(getLoginStaff().getStaffid());
			student.setCreatetime(Calendar.getInstance().getTime());
			Integer studentid = this.studentService.addStudent(student, avatarfile);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("StudentAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			student.setOrgid(getLoginStaff().getOrgid());
			if (avatarfile != null) {
				String avatar = studentService.saveAvatar(student.getStudentid(), avatarfile, getLoginStaff()
						.getOrgid());
				logger.info("saveAvatar return path:{}", avatar);
				student.setAvatar(avatar);
			}
			this.studentService.updateStudent(student);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("StudentAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			studentService.deleteStudent(student.getStudentid(), getLoginStaff().getOrgid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("StudentAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
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

}
