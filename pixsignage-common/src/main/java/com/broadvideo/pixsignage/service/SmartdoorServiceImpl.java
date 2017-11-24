package com.broadvideo.pixsignage.service;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Doorlog;
import com.broadvideo.pixsignage.persistence.DoorlogMapper;
import com.broadvideo.pixsignage.vo.TerminalBinding;

@Service
@Transactional(rollbackFor = Exception.class)
public class SmartdoorServiceImpl implements SmartdoorService {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private DoorlogMapper doorlogMapper;

	@Override
	public void saveDoorlog(TerminalBinding binding) {
		try {
		Doorlog doorlog = (Doorlog) binding;
		doorlog.setCreatetime(new Date());
		doorlogMapper.insertSelective(doorlog);
		} catch (Exception ex) {

			logger.error("Save doorlog exception.", ex);
		}

	}



}
