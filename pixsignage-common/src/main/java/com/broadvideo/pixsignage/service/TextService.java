package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Text;

public interface TextService {
	public Text selectByPrimaryKey(String textid);

	public int selectCount(String orgid);

	public List<Text> selectList(String orgid, String start, String length);

	public void addText(Text text);

	public void updateText(Text text);

	public void deleteText(String textid);

}
