package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Crashreport;
import com.broadvideo.pixsignage.service.CrashreportService;

@Scope("request")
@Controller("crashreportAction")
public class CrashreportAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7389847538320519717L;

	private static final Logger log = Logger.getLogger(CrashreportAction.class);

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
