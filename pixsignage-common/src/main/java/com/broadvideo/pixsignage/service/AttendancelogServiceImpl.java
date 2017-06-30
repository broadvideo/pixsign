package com.broadvideo.pixsignage.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.persistence.AttendancelogMapper;

/**
 * 考勤记录服务类
 * 
 * @author charles
 *
 */
@Transactional(rollbackFor = Exception.class)
@Service
public class AttendancelogServiceImpl implements AttendancelogService {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private AttendancelogMapper attendancelogMapper;

}
