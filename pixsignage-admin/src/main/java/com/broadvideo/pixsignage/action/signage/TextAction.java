package com.broadvideo.pixsignage.action.signage;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.domain.Text;
import com.broadvideo.pixsignage.service.TextService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("textAction")
public class TextAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Text text;

	@Autowired
	private TextService textService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			List<Object> aaData = new ArrayList<Object>();
			int count = textService.selectCount("" + getLoginStaff().getOrgid(), branchid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Text> textList = textService.selectList("" + getLoginStaff().getOrgid(), branchid, search, start,
					length);
			for (int i = 0; i < textList.size(); i++) {
				aaData.add(textList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TextAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			text.setOrgid(getLoginStaff().getOrgid());
			text.setCreatestaffid(getLoginStaff().getStaffid());
			textService.addText(text);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TextAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			textService.updateText(text);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TextAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			textService.deleteText("" + text.getTextid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("TextAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Text getText() {
		return text;
	}

	public void setText(Text text) {
		this.text = text;
	}

}
