package com.broadvideo.pixsignage.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.NPOIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.POIUtil;
import com.broadvideo.pixsignage.common.PeriodType;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Classroom;
import com.broadvideo.pixsignage.domain.Courseschedule;
import com.broadvideo.pixsignage.domain.Courseschedulescheme;
import com.broadvideo.pixsignage.domain.Periodtimedtl;
import com.broadvideo.pixsignage.domain.Schoolclass;
import com.broadvideo.pixsignage.domain.Student;
import com.broadvideo.pixsignage.util.DateUtil;

@Service
public class ClasscardimportServiceImpl implements ClasscardimportService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ClassroomService classroomService;
	@Autowired
	private SchoolclassService schoolclassService;
	@Autowired
	private StudentService studentService;
	@Autowired
	private CourseScheduleSchemeService coursescheduleschemeService;
	@Autowired
	private CourseScheduleService coursescheduleService;

	@Override
	public JSONObject batchImportData(File file, Integer staffid, Integer orgId) {
		// HSSFWorkbook, File
		NPOIFSFileSystem fs = null;
		try {
			fs = new NPOIFSFileSystem(file);
			HSSFWorkbook wb = new HSSFWorkbook(fs.getRoot(), true);
			JSONObject resultJson = new JSONObject();
			logger.info("extract classrooms:");
			List<Classroom> classrooms = this.extractClassrooms(wb);
			int classroomImportTotal = classrooms.size();
			int classroomImportFail = 0;
			for (Classroom classroom : classrooms) {
				try {
					classroom.setOrgid(orgId);
					classroom.setCreatepsnid(staffid);
					classroom.setCreatetime(new Date());
					Integer classroomid = this.classroomService.addClassroom(classroom);
				} catch (ServiceException ex) {
					logger.error("addClassroom({}) ocurred exception.", classroom.getName(), ex.getMessage());
					classroomImportFail++;
				}

			}
			resultJson.put("classroom", buildImportResult(classroomImportTotal, classroomImportFail));
			logger.info("extract schoolclass:");
			List<Schoolclass> schoolclassList = this.extractSchoolclassList(wb);
			int schoolclassImportTotal = schoolclassList.size();
			int schoolclassImportFail = 0;
			for (Schoolclass schoolclass : schoolclassList) {
				try {
					schoolclass.setOrgid(orgId);
					schoolclass.setCreatestaffid(staffid);
					schoolclass.setCreatetime(new Date());
					String classroomname = schoolclass.getClassroomname();
					Classroom qClassroom = this.classroomService.loadClassroomByName(classroomname, orgId);
					if (qClassroom != null) {
						schoolclass.setClassroomid(qClassroom.getClassroomid());
					} else {

						logger.error("Not found classroom:classroomname:{},orgid:{}", classroomname, orgId);
					}
					Integer schoolclassid = schoolclassService.addSchoolclass(schoolclass);
				} catch (ServiceException ex) {
					logger.error("addSchoolclass({}) ocurred exception.", schoolclass.getName(), ex);
					schoolclassImportFail++;
				}
			}
			resultJson.put("schoolclass", buildImportResult(schoolclassImportTotal, schoolclassImportFail));
			logger.info("extract students:");
			List<Student> students = this.extractStudents(wb);
			int studentImportTotal = students.size();
			int studentImportFail = 0;
			for (Student student : students) {
				try {
					student.setOrgid(orgId);
					student.setCreatestaffid(staffid);
					final String schoolclassname = student.getSchoolclassname();
					if (StringUtils.isNotBlank(schoolclassname)) {
						Schoolclass qSchoolclass = this.schoolclassService
								.loadSchoolclassByName(schoolclassname, orgId);
						if (qSchoolclass != null) {
							student.setSchoolclassid(qSchoolclass.getSchoolclassid());
						} else {
							logger.error("Not found schoolclass:name={},orgid={}", schoolclassname, orgId);
						}
					}
					student.setCreatetime(new Date());
					Integer studentid = studentService.addStudent(student);
				} catch (ServiceException ex) {
					logger.error("addStudent({}) ocurred exception.", student.getName(), ex);
					studentImportFail++;
				}

			}
			resultJson.put("student", buildImportResult(studentImportTotal, studentImportFail));
			logger.info("extract coursescheduleschemes:");
			List<Courseschedulescheme> schemes = this.extractCourseschedulescheme(wb);
			int schemeImportTotal = schemes.size();
			int schemeImportFail = 0;
			for (Courseschedulescheme scheme : schemes) {
				if (StringUtils.isBlank(scheme.getName()) || StringUtils.isBlank(scheme.getWorkdays())) {
					schemeImportFail++;
					continue;
				}
				scheme.setOrgid(orgId);
				scheme.setCreatepsnid(staffid);
				scheme.setCreatetime(new Date());
				try {
					Integer schemeid = this.coursescheduleschemeService.addScheme(scheme);
				} catch (ServiceException ex) {
					logger.error("addScheme({}) ocurred exception.", scheme.getName(), ex);
					schemeImportFail++;
				}

			}
			resultJson.put("scheme", buildImportResult(schemeImportTotal, schemeImportFail));
			logger.info("extract courseschedule:");
			List<Courseschedule> courseschedules = this.extractCourseschedules(wb);
			int coursescheduleImportTotal = courseschedules.size();
			int coursescheduleImportFail = 0;
			if (courseschedules != null && courseschedules.size() > 0) {
				Courseschedule courseschedule = courseschedules.get(0);
				String classroomname = courseschedule.getClassroomname();
				String schemename = courseschedule.getCoursescheduleschemename();
				Courseschedulescheme scheme = this.coursescheduleschemeService.loadSchemeByName(schemename, orgId);
				Classroom classroom = classroomService.loadClassroomByName(classroomname, orgId);

				if (scheme == null || classroom == null) {
					logger.error("courseschedule import fail,reason:scheme({}) or classroom({}) is null.", schemename,
							classroomname);
					coursescheduleImportFail = coursescheduleImportTotal;
				} else {
					Integer coursescheduleschemeid = scheme.getCoursescheduleschemeid();
					final Integer classroomid = classroom.getClassroomid();
					// List<Courseschedule> existCourseschedules =
					// this.coursescheduleService.getClassroomCourseSchedules(
					// classroomid, coursescheduleschemeid, orgId);
					// if (existCourseschedules != null &&
					// existCourseschedules.size() > 0) {
					// logger.error("classroomid={},coursescheduleschemeid:{} has exists.import courseschedule fail!",
					// classroomid, coursescheduleschemeid);
					// coursescheduleImportFail++;
					// } else {

					Courseschedulescheme schemedtl = this.coursescheduleschemeService.getSchemeDtl(
							coursescheduleschemeid, orgId);
					String scheduleWorkDays = "," + scheme.getWorkdays() + ",";
					for (Courseschedule tCourseschedule : courseschedules) {
						String curWorkday = "," + tCourseschedule.getWorkday() + ",";
						if (scheduleWorkDays.indexOf(curWorkday) == -1) {
							logger.error("Improt courseschedule.workday:{} not in schedule.workdays.",
									tCourseschedule.getWorkday(), scheme.getWorkdays());
							coursescheduleImportFail++;
							continue;
						}

						tCourseschedule.setOrgid(orgId);
						tCourseschedule.setCoursescheduleschemeid(coursescheduleschemeid);
						tCourseschedule.setCreatepsnid(staffid);
						tCourseschedule.setClassroomid(classroomid);
						tCourseschedule.setCreatetime(new Date());
						Integer periodtimedtlId = getPeriodtimedtlId(schemedtl, tCourseschedule.getPeriodtimedtl());
						if (periodtimedtlId == null) {
							logger.error("Import courseschedule not in periodtimedtl.");
							coursescheduleImportFail++;
							continue;
						}
						tCourseschedule.setPeriodtimedtlid(periodtimedtlId);
						try {
							this.coursescheduleService.addCourseSchedule(tCourseschedule);
						} catch (Exception ex) {
							logger.error("addCourseSchedule fail.", ex);
							coursescheduleImportFail++;
						}

					}
					// }

				}

			}

			resultJson.put("courseschedule", buildImportResult(coursescheduleImportTotal, coursescheduleImportFail));

			return resultJson;

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("batchImportData ocurred exception.", e);
			throw new ServiceException("batchImportData ocurred exception.", e);

		} finally {
			if (fs != null) {
				try {
					fs.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

		}

	}

	private JSONObject buildImportResult(int total, int fail) {

		JSONObject resultJson = new JSONObject();
		resultJson.put("total", total);
		resultJson.put("success", total - fail);
		resultJson.put("fail", fail);
		return resultJson;

	}

	private static Integer getPeriodtimedtlId(Courseschedulescheme schemedtl, Periodtimedtl periodtimedtl) {
		List<Periodtimedtl> periodtimedtls = new ArrayList<Periodtimedtl>();
		if (PeriodType.MORNING.equals(periodtimedtl.getType())) {
			periodtimedtls = schemedtl.getMorningperiodtimedtls();

		} else if (PeriodType.AFTERNOON.equals(periodtimedtl.getType())) {
			periodtimedtls = schemedtl.getAfternoonperiodtimedtls();

		} else if (PeriodType.NIGHT.equals(periodtimedtl.getType())) {
			periodtimedtls = schemedtl.getNightperiodtimedtls();

		}
		for (Periodtimedtl dtl : periodtimedtls) {
			if (dtl.getPeriodnum().equals(periodtimedtl.getPeriodnum())) {

				return dtl.getPeriodtimedtlid();
			}

		}

		return null;
	}

	/**
	 * extract classrooms from sheet[0]
	 * 
	 * @param wb
	 * @return
	 */
	private List<Classroom> extractClassrooms(HSSFWorkbook wb) {
		Sheet sheet = wb.getSheetAt(0);
		int rowStart = 1;
		int rowEnd = sheet.getLastRowNum();
		logger.info("Init classrooms from  sheet name:{} ", sheet.getSheetName());
		List<Classroom> classrooms = new ArrayList<Classroom>();
		for (int rowNum = rowStart; rowNum <= rowEnd; rowNum++) {
			Row r = sheet.getRow(rowNum);
			if (r == null) {
				continue;
			}

			String classroomname = r.getCell(0) != null ? r.getCell(0).getStringCellValue() : null;
			if (StringUtils.isBlank(classroomname)) {
				logger.error("Invalid rows for classroom.name is null.");
				continue;
			}
			String description = r.getCell(1) != null ? r.getCell(1).getStringCellValue() : null;

			Classroom classroom = new Classroom();
			classroom.setName(classroomname);
			classroom.setDescription(description);
			classrooms.add(classroom);
		}
		logger.info("extractClassrooms total:{}", classrooms.size());
		return classrooms;
	}

	/**
	 * extract班级信息from sheet[1]
	 * 
	 * @param wb
	 * @return
	 */
	public List<Schoolclass> extractSchoolclassList(HSSFWorkbook wb) {
		Sheet sheet = wb.getSheetAt(1);
		int rowStart = 1;
		int rowEnd = sheet.getLastRowNum();
		logger.info("Init schooclass list from  sheet name:{} ", sheet.getSheetName());
		List<Schoolclass> schoolclassList = new ArrayList<Schoolclass>();
		for (int rowNum = rowStart; rowNum <= rowEnd; rowNum++) {
			Row r = sheet.getRow(rowNum);
			if (r == null) {
				continue;
			}

			String schoolclassname = r.getCell(0) != null ? r.getCell(0).getStringCellValue() : null;
			if (StringUtils.isBlank(schoolclassname)) {
				logger.error("Invalid rows for schoolclass.name is null.");
				continue;
			}
			String classroomname = r.getCell(1) != null ? r.getCell(1).getStringCellValue() : null;
			String description = r.getCell(2) != null ? r.getCell(2).getStringCellValue() : null;

			Schoolclass schoolclass = new Schoolclass();
			schoolclass.setName(schoolclassname);
			schoolclass.setClassroomname(classroomname);
			schoolclass.setDescription(description);
			schoolclassList.add(schoolclass);
		}
		logger.info("extractSchoolclassList total:{}", schoolclassList.size());
		return schoolclassList;
	}

	/**
	 * extract student from sheet[2]
	 * 
	 * @param wb
	 * @return
	 */
	public List<Student> extractStudents(HSSFWorkbook wb) {
		Sheet sheet = wb.getSheetAt(2);
		int rowStart = 1;
		int rowEnd = sheet.getLastRowNum();
		logger.info("Init students  from  sheet name:{} ", sheet.getSheetName());
		List<Student> studentList = new ArrayList<Student>();
		for (int rowNum = rowStart; rowNum <= rowEnd; rowNum++) {
			Row r = sheet.getRow(rowNum);
			if (r == null) {
				continue;
			}

			String schoolclassname = r.getCell(0) != null ? r.getCell(0).getStringCellValue() : null;
			String studentno = POIUtil.formatCellValue(r.getCell(1));
			// Cell studentnoCell = r.getCell(1);
			// if (studentnoCell != null) {
			// studentnoCell.setCellType(Cell.CELL_TYPE_STRING);
			// studentno = r.getCell(1).getStringCellValue();
			// }
			String studentname = POIUtil.formatCellValue(r.getCell(2));
			// r.getCell(2) != null ? r.getCell(2).getStringCellValue() : null;
			if (StringUtils.isBlank(studentno) || StringUtils.isBlank(studentname)) {
				logger.error("Invalid rows for studentno or studentname is null.");
				continue;
			}
			String sex = r.getCell(3) != null ? r.getCell(3).getStringCellValue() : null;
			String hardid = POIUtil.formatCellValue(r.getCell(4));
			// r.getCell(4) != null ? r.getCell(4).getStringCellValue() : null;
			Student student = new Student();
			student.setSchoolclassname(schoolclassname);
			student.setStudentno(studentno);
			student.setName(studentname);
			student.setHardid(hardid);
			studentList.add(student);
		}
		logger.info("extractStudents total:{}", studentList.size());
		return studentList;
	}

	/**
	 * extract scheme from sheet[3]
	 * 
	 * @param wb
	 * @return
	 */
	public List<Courseschedulescheme> extractCourseschedulescheme(HSSFWorkbook wb) {
		Sheet sheet = wb.getSheetAt(3);
		int rowStart = 2;
		int rowEnd = sheet.getLastRowNum();
		logger.info("Init scheme  from  sheet name:{} ", sheet.getSheetName());
		List<Courseschedulescheme> coursescheduleschemeList = new ArrayList<Courseschedulescheme>();
		for (int rowNum = rowStart; rowNum <= rowEnd; rowNum++) {
			Row r = sheet.getRow(rowNum);
			if (r == null) {
				continue;
			}
			String schemename = getCellValue(r.getCell(0));
			List<String> workdayList = new ArrayList<String>();
			String monFlag = GlobalFlag.YES.equals(getCellValue(r.getCell(1))) ? "1" : "";
			if (StringUtils.isNotBlank(monFlag)) {
				workdayList.add(monFlag);
			}
			String tuesFlag = GlobalFlag.YES.equals(getCellValue(r.getCell(2))) ? "2" : "";
			if (StringUtils.isNotBlank(tuesFlag)) {
				workdayList.add(tuesFlag);
			}
			String wedFlag = GlobalFlag.YES.equals(getCellValue(r.getCell(3))) ? "3" : "";
			if (StringUtils.isNotBlank(wedFlag)) {
				workdayList.add(wedFlag);
			}
			String thurFlag = GlobalFlag.YES.equals(getCellValue(r.getCell(4))) ? "4" : "";
			if (StringUtils.isNotBlank(thurFlag)) {
				workdayList.add(thurFlag);
			}
			String friFlag = GlobalFlag.YES.equals(getCellValue(r.getCell(5))) ? "5" : "";
			if (StringUtils.isNotBlank(friFlag)) {
				workdayList.add(friFlag);
			}
			String satFlag = GlobalFlag.YES.equals(getCellValue(r.getCell(6))) ? "6" : "";
			if (StringUtils.isNotBlank(satFlag)) {
				workdayList.add(satFlag);
			}
			String sunFlag = GlobalFlag.YES.equals(getCellValue(r.getCell(7))) ? "7" : "";
			if (StringUtils.isNotBlank(sunFlag)) {
				workdayList.add(sunFlag);
			}
			String morningperiods = getCellValue(r.getCell(8));
			String afternoonperiods = getCellValue(r.getCell(9));
			String nightperiods = getCellValue(r.getCell(10));
			Courseschedulescheme scheme = new Courseschedulescheme();
			scheme.setName(schemename);
			scheme.setMorningperiods(NumberUtils.toInt(morningperiods));
			scheme.setAfternoonperiods(NumberUtils.toInt(afternoonperiods));
			scheme.setNightperiods(NumberUtils.toInt(nightperiods));
			scheme.setWorkdays(StringUtils.join(workdayList, ","));
			logger.info("Init morning period dtls....");
			// morning period dtls
			for (int morningPeriods = 1; morningPeriods <= scheme.getMorningperiods(); morningPeriods++) {
				int startCellIndex = 11 + (2 * morningPeriods - 2);
				int endCellIndex = startCellIndex + 1;
				String morningPeriodStart = getCellValue(r.getCell(startCellIndex));
				String morningPeriodEnd = getCellValue(r.getCell(endCellIndex));
				if (StringUtils.isBlank(morningPeriodStart) || StringUtils.isBlank(morningPeriodEnd)) {
					logger.error("Morning periodStart({}) or periodEnd({}) is null.", morningPeriodStart,
							morningPeriodEnd);
					continue;
				}
				scheme.getMorningperiodtimedtls().add(
						this.buildPeriodtimedtl(morningPeriodStart, morningPeriodEnd, PeriodType.MORNING,
								morningPeriods));
			}
			logger.info("Init afternoon period dtls....");
			for (int afternoonPeriods = 1; afternoonPeriods <= scheme.getAfternoonperiods(); afternoonPeriods++) {
				int startCellIndex = 25 + (2 * afternoonPeriods - 2);
				int endCellIndex = startCellIndex + 1;
				String afternoonPeriodStart = getCellValue(r.getCell(startCellIndex));
				String afternoonPeriodEnd = getCellValue(r.getCell(endCellIndex));
				if (StringUtils.isBlank(afternoonPeriodStart) || StringUtils.isBlank(afternoonPeriodEnd)) {
					logger.error("Aternoon periodStart({}) or periodEnd({}) is null.", afternoonPeriodStart,
							afternoonPeriodEnd);
					continue;
				}
				scheme.getAfternoonperiodtimedtls().add(
						this.buildPeriodtimedtl(afternoonPeriodStart, afternoonPeriodEnd, PeriodType.AFTERNOON,
								afternoonPeriods));
			}
			logger.info("Init night period dtls....");
			for (int nightPeriods = 1; nightPeriods <= scheme.getNightperiods(); nightPeriods++) {
				int startCellIndex = 37 + (2 * nightPeriods - 2);
				int endCellIndex = startCellIndex + 1;
				String nightPeriodStart = getCellValue(r.getCell(startCellIndex));
				String nightPeriodEnd = getCellValue(r.getCell(endCellIndex));
				if (StringUtils.isBlank(nightPeriodStart) || StringUtils.isBlank(nightPeriodEnd)) {
					logger.error("Night periodStart({}) or periodEnd({}) is null.", nightPeriodStart, nightPeriodEnd);
					continue;
				}
				scheme.getNightperiodtimedtls().add(
						this.buildPeriodtimedtl(nightPeriodStart, nightPeriodEnd, PeriodType.NIGHT, nightPeriods));
			}
			coursescheduleschemeList.add(scheme);
		}
		logger.info("extractCourseschedulescheme total:{}", coursescheduleschemeList.size());
		return coursescheduleschemeList;
	}

	/**
	 * extract courseschedule from sheet[4]
	 * 
	 * @param wb
	 * @return
	 */
	public List<Courseschedule> extractCourseschedules(HSSFWorkbook wb) {
		Sheet sheet = wb.getSheetAt(4);
		logger.info("Init courseschedules  from  sheet name:{} ", sheet.getSheetName());
		Row selSchemeRow = sheet.getRow(1);
		if (selSchemeRow == null || StringUtils.isBlank(getCellValue(selSchemeRow.getCell(1)))) {
			logger.error("Courseschedule is not select scheme,could not import.");
			return null;
		}
		Row selRoomRow = sheet.getRow(2);
		if (selRoomRow == null || StringUtils.isBlank(getCellValue(selRoomRow.getCell(1)))) {
			logger.error("Courseschedule is not select classroom,could not import.");
			return null;
		}
		String selSchemename = getCellValue(selSchemeRow.getCell(1));
		String classroomname = getCellValue(selRoomRow.getCell(1));
		List<Courseschedule> courseschedules = new ArrayList<Courseschedule>();
		// 读取上午的排课信息
		int periodNum = 1;
		for (int rowNum = 5; rowNum <= 18; rowNum = rowNum + 2) {

			for (int colNum = 1; colNum <= 7; colNum++) {
				Cell courseCell = sheet.getRow(rowNum).getCell(colNum);
				Cell teacherCell = sheet.getRow(rowNum + 1).getCell(colNum);
				if (courseCell == null) {// || teacherCell == null
					continue;
				}
				Courseschedule courseschedule = buildCourseschedule(courseCell, teacherCell, PeriodType.MORNING,
						periodNum, selSchemename, classroomname);
				courseschedules.add(courseschedule);
			}

			periodNum++;
		}
		// 读取下午的排课信息
		periodNum = 1;
		for (int rowNum = 20; rowNum <= 31; rowNum = rowNum + 2) {

			for (int colNum = 1; colNum <= 7; colNum++) {
				Cell courseCell = sheet.getRow(rowNum).getCell(colNum);
				Cell teacherCell = sheet.getRow(rowNum + 1).getCell(colNum);
				if (courseCell == null) {// || teacherCell == null
					continue;
				}
				Courseschedule courseschedule = buildCourseschedule(courseCell, teacherCell, PeriodType.AFTERNOON,
						periodNum, selSchemename, classroomname);
				courseschedules.add(courseschedule);
			}
			periodNum++;

		}
		// 读取晚上排课信息
		periodNum = 1;
		for (int rowNum = 33; rowNum <= 40; rowNum = rowNum + 2) {
			for (int colNum = 1; colNum <= 7; colNum++) {
				Cell courseCell = sheet.getRow(rowNum).getCell(colNum);
				Cell teacherCell = sheet.getRow(rowNum + 1).getCell(colNum);
				if (courseCell == null) {// || teacherCell == null
					continue;
				}
				Courseschedule courseschedule = buildCourseschedule(courseCell, teacherCell, PeriodType.NIGHT,
						periodNum, selSchemename, classroomname);
				courseschedules.add(courseschedule);
			}

			periodNum++;
		}
		logger.info("extractCourseschedules total:{}", courseschedules.size());
		return courseschedules;
	}

	private Courseschedule buildCourseschedule(Cell courseCell, Cell teacherCell, String periodType, int periodNum,
			String selSchemename, String classroomname) {
		Courseschedule courseschedule = new Courseschedule();
		courseschedule.setClassroomname(classroomname);
		courseschedule.setCoursescheduleschemename(selSchemename);
		courseschedule.setCoursename(getCellValue(courseCell));
		courseschedule.setTeachername(getCellValue(teacherCell));
		int colIndex = courseCell.getColumnIndex();
		courseschedule.setWorkday(colIndex);
		Periodtimedtl periodtimedtl = new Periodtimedtl();
		periodtimedtl.setType(periodType);
		periodtimedtl.setPeriodnum(periodNum);
		courseschedule.setPeriodtimedtl(periodtimedtl);
		return courseschedule;
	}

	private Periodtimedtl buildPeriodtimedtl(String start, String end, String type, int periodnum) {
		Periodtimedtl dtl = new Periodtimedtl();
		dtl.setShortstarttime(start);
		dtl.setShortendtime(end);
		dtl.setType(type);
		dtl.setPeriodnum(periodnum);
		return dtl;
	}

	private static String getCellValue(Cell cell) {

		String value = "";
		if (cell == null) {

			return value;
		}
		switch (cell.getCellType()) {
		case Cell.CELL_TYPE_STRING:
			value = cell.getRichStringCellValue().getString();

			break;
		case Cell.CELL_TYPE_NUMERIC:
			if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
				value = DateUtil.getDateStr(cell.getDateCellValue(), "HH:mm");
			} else {
				cell.setCellType(Cell.CELL_TYPE_STRING);
				value = cell.getStringCellValue();
			}
			break;
		case Cell.CELL_TYPE_BOOLEAN:
			value = cell.getBooleanCellValue() ? "1" : "0";
			break;
		case Cell.CELL_TYPE_FORMULA:
			value = cell.getCellFormula();
			break;
		case Cell.CELL_TYPE_BLANK:
			value = "";
			break;
		default:
			value = "";
		}

		return value;
	}

	public static void main(String[] args) throws Exception {

		Date curDate = new Date(1526985015472L);
		System.out.print(curDate + "");
		// HSSFWorkbook, File
		NPOIFSFileSystem fs = new NPOIFSFileSystem(new File("C:\\Users\\charles\\Desktop\\template.xls"));
		HSSFWorkbook wb = new HSSFWorkbook(fs.getRoot(), true);
		Sheet sheet = wb.getSheetAt(4);

		ClasscardimportServiceImpl classcardimportService = new ClasscardimportServiceImpl();
		List<Courseschedule> courseschedules = classcardimportService.extractCourseschedules(wb);
		System.out.println("sheet name:" + sheet.getSheetName());
		int rowStart = 2;
		int rowEnd = sheet.getLastRowNum();
		System.out.println("读取" + sheet.getSheetName() + "的行列数据:");
		for (int rowNum = rowStart; rowNum <= rowEnd; rowNum++) {
			System.out.println("################Rownum:" + rowNum);
			Row r = sheet.getRow(rowNum);
			if (r == null) {
				continue;
			}

			for (Cell cell : r) {
				if (cell == null) {
					continue;
				}
				System.out.println(">>>>>>>>>>>cell index:" + cell.getColumnIndex());

				System.out.println(">>>>>>>>>>>cell:" + getCellValue(cell));

			}

		}

	}

}
