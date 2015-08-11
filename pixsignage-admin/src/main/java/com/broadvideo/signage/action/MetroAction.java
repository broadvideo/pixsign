package com.broadvideo.signage.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Metroline;
import com.broadvideo.signage.service.MetroService;

@Scope("request")
@Controller("metroAction")
public class MetroAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8144326256812580850L;

	private static final Logger log = Logger.getLogger(MetroAction.class);

	@Autowired
	private MetroService metroService;

	public String doList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			List<Metroline> metrolineList = metroService.selectMetrolineList();
			for (Metroline metroline : metrolineList) {
				aaData.add(metroline);
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

}
