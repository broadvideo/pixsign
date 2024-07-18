package com.broadvideo.pixsign.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsign.domain.Debugreport;
import com.broadvideo.pixsign.persistence.DebugreportMapper;
import com.broadvideo.pixsign.service.DeviceService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("debugreportAction")
public class DebugreportAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Debugreport debugreport;

	@Autowired
	private DebugreportMapper debugreportMapper;
	@Autowired
	private DeviceService deviceService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");

			int count = debugreportMapper.selectCount();
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Debugreport> debugreportList = debugreportMapper.selectList(start, length);
			for (int i = 0; i < debugreportList.size(); i++) {
				aaData.add(debugreportList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("DebugreportAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doCollect() {
		try {
			String deviceid = getParameter("deviceid");
			deviceService.debug(deviceid);
			logger.info("Device collect debug success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("Device collect debug error", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Debugreport getDebugreport() {
		return debugreport;
	}

	public void setDebugreport(Debugreport debugreport) {
		this.debugreport = debugreport;
	}

}
