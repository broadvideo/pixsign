package com.broadvideo.pixsignage.service;

import com.broadvideo.pixsignage.vo.TerminalBinding;



public interface SmartdoorService {
	/**
	 * 保存开关门日志
	 * 
	 * @param doorlog
	 */
	void saveDoorlog(TerminalBinding binding);

}
