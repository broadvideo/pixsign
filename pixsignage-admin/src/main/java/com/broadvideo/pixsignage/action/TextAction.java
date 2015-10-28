package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Text;
import com.broadvideo.pixsignage.service.TextService;

@Scope("request")
@Controller("textAction")
public class TextAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7128312546971676985L;

	private static final Logger log = Logger.getLogger(TextAction.class);

	private Text text;

	@Autowired
	private TextService textService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			List<Object> aaData = new ArrayList<Object>();
			int count = textService.selectCount("" + getLoginStaff().getOrgid());
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Text> textList = textService.selectList("" + getLoginStaff().getOrgid(), start, length);
			for (int i = 0; i < textList.size(); i++) {
				aaData.add(textList.get(i));
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

	public String doAdd() {
		try {
			text.setOrgid(getLoginStaff().getOrgid());
			text.setCreatestaffid(getLoginStaff().getStaffid());
			textService.addText(text);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
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
			ex.printStackTrace();
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
			ex.printStackTrace();
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
