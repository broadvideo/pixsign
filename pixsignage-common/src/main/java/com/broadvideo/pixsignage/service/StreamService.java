package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Stream;

public interface StreamService {
	public Stream selectByPrimaryKey(String streamid);

	public int selectCount(String orgid);

	public List<Stream> selectList(String orgid, String start, String length);

	public void addStream(Stream stream);

	public void updateStream(Stream stream);

	public void deleteStream(String streamid);

}
