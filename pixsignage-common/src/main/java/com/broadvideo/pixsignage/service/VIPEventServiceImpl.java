package com.broadvideo.pixsignage.service;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.session.RowBounds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.domain.Event;
import com.broadvideo.pixsignage.persistence.EventMapper;
import com.broadvideo.pixsignage.persistence.EventpersonMapper;
import com.broadvideo.pixsignage.persistence.PersonMapper;
import com.broadvideo.pixsignage.util.UUIDUtils;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service("vipeventService")
@Transactional(rollbackFor = Exception.class)
public class VIPEventServiceImpl implements EventService {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private EventMapper eventMapper;
	@Autowired
	private EventpersonMapper eventpersonMapper;
	@Autowired
	private PersonMapper personMapper;
	@Override
	public PageResult getEventList(Event event, PageInfo page) {
		RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
		List<Event> dataList = eventMapper.selectList(event, rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount = pageList.getPaginator().getTotalCount();
		return new PageResult(totalCount, dataList, page);
	}

	@Override
	public Integer addEvent(Event event) {
		event.setUuid(UUIDUtils.generateUUID());
		event.setStatus(GlobalFlag.VALID);
		event.setSourcetype("0");
		event.setAmount(-1);
		event.setCreatetime(new Date());
		this.eventMapper.insertSelective(event);
		return event.getEventid();
	}

	@Override
	public void updateEvent(Event event) {
		this.eventMapper.updateByPrimaryKeySelective(event);

	}

	@Override
	public void deleteEvent(Event event) {

		event.setStatus(GlobalFlag.DELETE);
		this.eventMapper.updateByPrimaryKeySelective(event);

	}

}
