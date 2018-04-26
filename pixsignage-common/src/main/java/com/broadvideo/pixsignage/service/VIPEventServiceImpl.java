package com.broadvideo.pixsignage.service;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.session.RowBounds;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.EventType;
import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Event;
import com.broadvideo.pixsignage.domain.Eventdtl;
import com.broadvideo.pixsignage.persistence.EventMapper;
import com.broadvideo.pixsignage.persistence.EventdtlMapper;
import com.broadvideo.pixsignage.persistence.EventpersonMapper;
import com.broadvideo.pixsignage.persistence.PersonMapper;
import com.broadvideo.pixsignage.util.DateUtil;
import com.broadvideo.pixsignage.util.UUIDUtils;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service("vipeventService")
@Transactional(rollbackFor = Exception.class)
public class VIPEventServiceImpl implements EventService {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private EventMapper eventMapper;
	@Autowired
	private EventdtlMapper eventdtlMapper;
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
		if (EventType.EVERY_DAY.equals(event.getType())) {
			event.setEventdaysflag("1111111");
		} else if (EventType.WORKDAY.equals(event.getType())) {
			event.setEventdaysflag("1111100");
		} else if (EventType.CUSTOM.equals(event.getType())) {
			logger.info("event({}) timedtls:{}", event.getName(), event.getTimedtls());
			JSONArray timedtlArr = buildTimedtls(event.getTimedtls());
			char[] eventdaysflag = new char[] { '0', '0', '0', '0', '0', '0', '0' };
			for (int i = 0; i < timedtlArr.length(); i++) {
				JSONObject timedtl = timedtlArr.getJSONObject(i);
				int dayofweek = timedtl.getInt("dayofweek");
				eventdaysflag[dayofweek - 1] = '1';
			}
			event.setEventdaysflag(new String(eventdaysflag));
		}
		event.setCreatetime(new Date());
		this.eventMapper.insertSelective(event);
		if (EventType.CUSTOM.equals(event.getType())) {
			this.syncEventdtls(event.getEventid(), buildTimedtls(event.getTimedtls()));
		}
		return event.getEventid();
	}

	private void syncEventdtls(Integer eventid, JSONArray timedtlArr) {
		this.eventdtlMapper.deleteByEventid(eventid);
		for (int i = 0; i < timedtlArr.length(); i++) {
			JSONObject timedtl = timedtlArr.getJSONObject(i);
			int dayofweek = timedtl.getInt("dayofweek");
			String shortstarttime = timedtl.getString("shortstarttime");
			String shortendtime = timedtl.getString("shortendtime");
			Eventdtl eventdtl = new Eventdtl();
			eventdtl.setDayofweek(dayofweek);
			eventdtl.setShortstarttime(DateUtil.getDate(shortstarttime, "HH:mm"));
			eventdtl.setShortendtime(DateUtil.getDate(shortendtime, "HH:mm"));
			eventdtl.setEventid(eventid);
			this.eventdtlMapper.insertSelective(eventdtl);

		}
	}
	private JSONArray buildTimedtls(String timedtls) {
		JSONArray timedtlArr = new JSONArray(timedtls);
		for (int i = 0; i < timedtlArr.length(); i++) {
			JSONObject timedtl = timedtlArr.getJSONObject(i);
			String shortstarttime = timedtl.getString("shortstarttime");
			String shortendtime = timedtl.getString("shortendtime");
			Date d1 = DateUtil.getDate(shortstarttime, "HH:mm");
			Date d2 = DateUtil.getDate(shortendtime, "HH:mm");
			if (d1.getTime() >= d2.getTime()) {
				throw new ServiceException(RetCodeEnum.EXCEPTION, "自定义时间段：开始时间必须小于结束时间!");
			}
		}

		return timedtlArr;
	}

	@Override
	public void updateEvent(Event event) {

		Event queryEvent = this.eventMapper.selectByPrimaryKey(event.getEventid());
		if (queryEvent.getStartdate().getTime() < System.currentTimeMillis()) {// 事件已经开始，不允许修改
			logger.info("Event({}) had started. ", queryEvent.getName());
			Event updateEvent = new Event();
			updateEvent.setName(event.getName());
			updateEvent.setEventid(event.getEventid());
			updateEvent.setRoomid(event.getRoomid());
			updateEvent.setUpdatestaffid(event.getUpdatestaffid());
			updateEvent.setUpdatetime(new Date());
			updateEvent.setOrgid(event.getOrgid());
			if (queryEvent.getEnddate().getTime() < event.getEnddate().getTime()) {
				updateEvent.setEnddate(event.getEnddate());
			}
			this.eventMapper.updateEvent(updateEvent);

		} else {// 事件未开始
			if (EventType.CUSTOM.equals(event.getType())) {// 自定义事件类型
				logger.info("event({}) timedtls:{}", event.getName(), event.getTimedtls());
				JSONArray timedtlArr = buildTimedtls(event.getTimedtls());
				char[] eventdaysflag = new char[] { '0', '0', '0', '0', '0', '0', '0' };
				for (int i = 0; i < timedtlArr.length(); i++) {
					JSONObject timedtl = timedtlArr.getJSONObject(i);
					int dayofweek = timedtl.getInt("dayofweek");
					eventdaysflag[dayofweek - 1] = '1';
				}
				event.setEventdaysflag(new String(eventdaysflag));
				logger.info("Sync event(id:{}) dtls({})...", event.getEventid(), event.getTimedtls());
				this.syncEventdtls(event.getEventid(), buildTimedtls(event.getTimedtls()));
			} else {// 非自定义类型，清除自定义记录
				this.eventdtlMapper.deleteByEventid(event.getEventid());
			}
			event.setUpdatetime(new Date());
			this.eventMapper.updateEvent(event);

		}
	}

	@Override
	public void deleteEvent(Event event) {
		this.eventdtlMapper.deleteByEventid(event.getEventid());
		event.setStatus(GlobalFlag.DELETE);
		this.eventMapper.updateByPrimaryKeySelective(event);

	}



}
