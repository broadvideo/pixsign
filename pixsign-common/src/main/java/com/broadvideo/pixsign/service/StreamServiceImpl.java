package com.broadvideo.pixsign.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsign.domain.Bundlezonedtl;
import com.broadvideo.pixsign.domain.Stream;
import com.broadvideo.pixsign.persistence.BundlezonedtlMapper;
import com.broadvideo.pixsign.persistence.StreamMapper;

@Service("streamService")
public class StreamServiceImpl implements StreamService {

	@Autowired
	private StreamMapper streamMapper;
	@Autowired
	private BundlezonedtlMapper bundlezonedtlMapper;

	public Stream selectByPrimaryKey(String streamid) {
		return streamMapper.selectByPrimaryKey(streamid);
	}

	public int selectCount(String orgid, String branchid, String search) {
		return streamMapper.selectCount(orgid, branchid, search);
	}

	public List<Stream> selectList(String orgid, String branchid, String search, String start, String length) {
		return streamMapper.selectList(orgid, branchid, search, start, length);
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
		bundlezonedtlMapper.deleteByObj(Bundlezonedtl.ObjType_Stream, streamid);
		streamMapper.deleteByPrimaryKey(streamid);
	}

}
