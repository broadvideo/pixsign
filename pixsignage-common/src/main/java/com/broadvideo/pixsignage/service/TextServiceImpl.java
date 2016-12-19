package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Bundledtl;
import com.broadvideo.pixsignage.domain.Text;
import com.broadvideo.pixsignage.persistence.BundledtlMapper;
import com.broadvideo.pixsignage.persistence.TextMapper;

@Service("textService")
public class TextServiceImpl implements TextService {

	@Autowired
	private TextMapper textMapper;
	@Autowired
	private BundledtlMapper bundledtlMapper;

	public Text selectByPrimaryKey(String textid) {
		return textMapper.selectByPrimaryKey(textid);
	}

	public int selectCount(String orgid, String branchid) {
		return textMapper.selectCount(orgid, branchid);
	}

	public List<Text> selectList(String orgid, String branchid, String start, String length) {
		return textMapper.selectList(orgid, branchid, start, length);
	}

	@Transactional
	public void addText(Text text) {
		textMapper.insertSelective(text);
	}

	@Transactional
	public void updateText(Text text) {
		textMapper.updateByPrimaryKeySelective(text);
	}

	@Transactional
	public void deleteText(String textid) {
		bundledtlMapper.clearByObj(Bundledtl.ObjType_Text, textid);
		textMapper.deleteByPrimaryKey(textid);
	}

}
