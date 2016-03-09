package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Bundledtl;
import com.broadvideo.pixsignage.domain.Regionschedule;
import com.broadvideo.pixsignage.domain.Stream;
import com.broadvideo.pixsignage.persistence.BundledtlMapper;
import com.broadvideo.pixsignage.persistence.RegionscheduleMapper;
import com.broadvideo.pixsignage.persistence.StreamMapper;

@Service("streamService")
public class StreamServiceImpl implements StreamService {

	@Autowired
	private StreamMapper streamMapper;
	@Autowired
	private BundledtlMapper bundledtlMapper;
	@Autowired
	private RegionscheduleMapper regionscheduleMapper;

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
		bundledtlMapper.clearByObj(Bundledtl.ObjType_Stream, streamid);
		regionscheduleMapper.deleteByObj(Regionschedule.ObjType_Stream, streamid);
		streamMapper.deleteByPrimaryKey(streamid);
	}

}
