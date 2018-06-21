package com.broadvideo.pixsignage.service;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.domain.Smartbox;
import com.broadvideo.pixsignage.vo.TerminalBinding;

public interface SmartboxService {

	PageResult getSmartboxList(String search, Integer orgid, PageInfo page);

	Integer addSmartbox(Smartbox smartbox);

	void updateSmartbox(Smartbox smartbox);

	void deleteSmartbox(Integer smartboxid, Integer orgid);

	void savelog(TerminalBinding binding);

}
