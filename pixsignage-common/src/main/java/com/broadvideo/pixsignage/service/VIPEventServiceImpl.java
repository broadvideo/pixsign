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
import com.broadvideo.pixsignage.domain.Eventperson;
import com.broadvideo.pixsignage.domain.Person;
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

	@Override
	public synchronized void syncEvents(List<Event> newEvents, Integer orgid) {

		logger.info("syncEvents: sync new events:{}", newEvents);
		for (Event newEvent : newEvents) {
			try {
				Event qEvent = this.eventMapper.selectByUuid(newEvent.getUuid(), orgid);
				if (qEvent != null) {
					logger.info("syncEvents update event:{}", qEvent.getName());
					newEvent.setEventid(qEvent.getEventid());
					this.eventMapper.updateByPrimaryKeySelective(newEvent);
				} else {
					logger.info("syncEvents add event:{}", newEvent.getName());
					newEvent.setOrgid(orgid);
					newEvent.setCreatestaffid(-1);
					newEvent.setCreatetime(new Date());
					newEvent.setStatus(GlobalFlag.VALID);
					newEvent.setSourcetype("1");
					this.eventMapper.insertSelective(newEvent);
				}
				this.eventpersonMapper.deleteByEventid(newEvent.getEventid());
				List<String> personUuids = newEvent.getPersonUuids();
				for (String personUuid : personUuids) {
					Eventperson eventPerson = new Eventperson();
					eventPerson.setEventid(newEvent.getEventid());
					Person qPerson = this.personMapper.selectByUuid(personUuid, orgid);
					eventPerson.setPersonid(qPerson.getPersonid());
					eventPerson.setCreatetime(new Date());
					this.eventpersonMapper.insertSelective(eventPerson);

				}
			} catch (Exception ex) {
				logger.error("Sync event:{} exception.", newEvent);
				continue;

			}

		}

	}

}
