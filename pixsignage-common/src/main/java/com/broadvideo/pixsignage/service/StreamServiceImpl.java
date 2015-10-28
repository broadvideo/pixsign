package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Stream;
import com.broadvideo.pixsignage.persistence.StreamMapper;

@Service("streamService")
public class StreamServiceImpl implements StreamService {

	@Autowired
	private StreamMapper streamMapper;

	public Stream selectByPrimaryKey(String streamid) {
		return streamMapper.selectByPrimaryKey(streamid);
	}

	public int selectCount(String orgid) {
		return streamMapper.selectCount(orgid);
	}

	public List<Stream> selectList(String orgid, String start, String length) {
		return streamMapper.selectList(orgid, start, length);
	}

	@Transactional
	public void addStream(Stream stream) {
		streamMapper.insertSelective(stream);
	}

	@Transactional
	public void updateStream(Stream stream) {
		streamMapper.updateByPrimaryKeySelective(stream);
	}

	@Transactional
	public void deleteStream(String streamid) {
		streamMapper.deleteByPrimaryKey(streamid);
	}

}
