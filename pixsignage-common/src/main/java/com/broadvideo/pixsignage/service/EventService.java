package com.broadvideo.pixsignage.service;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.domain.Event;

public interface EventService {

	PageResult getEventList(Event event, PageInfo pageinfo);
	Integer addEvent(Event event);
	void updateEvent(Event event);

	void deleteEvent(Event event);

}
