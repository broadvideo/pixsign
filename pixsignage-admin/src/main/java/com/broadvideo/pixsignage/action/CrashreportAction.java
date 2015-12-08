package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Crashreport;
import com.broadvideo.pixsignage.service.CrashreportService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("crashreportAction")
public class CrashreportAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Crashreport crashreport;

	@Autowired
	private CrashreportService crashreportService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");

			int count = crashreportService.selectCount();
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Crashreport> crashreportList = crashreportService.selectList(start, length);
			for (int i = 0; i < crashreportList.size(); i++) {
				aaData.add(crashreportList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doGet() {
		try {
			int crashreportid = crashreport.getCrashreportid();
			crashreport = crashreportService.selectAllByPrimaryKey("" + crashreportid);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Crashreport getCrashreport() {
		return crashreport;
	}

	public void setCrashreport(Crashreport crashreport) {
		this.crashreport = crashreport;
	}

}
