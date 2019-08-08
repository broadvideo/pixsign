package com.broadvideo.pixsignage.action.signage;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.domain.Intent;
import com.broadvideo.pixsignage.service.IntentService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("intentAction")
public class IntentAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Intent intent;

	@Autowired
	private IntentService intentService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);

			int count = intentService.selectCount("" + getLoginStaff().getOrgid(), search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Intent> intentList = intentService.selectList("" + getLoginStaff().getOrgid(), search, start, length);
			for (Intent intent : intentList) {
				aaData.add(intent);
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("IntentAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			intent.setOrgid(getLoginStaff().getOrgid());
			intentService.addIntent(intent);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("IntentAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			intentService.updateIntent(intent);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("IntentAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			intentService.deleteIntent("" + intent.getIntentid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("IntentAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Intent getIntent() {
		return intent;
	}

	public void setIntent(Intent intent) {
		this.intent = intent;
	}

}
