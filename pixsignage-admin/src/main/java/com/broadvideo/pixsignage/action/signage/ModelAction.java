package com.broadvideo.pixsignage.action.signage;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.domain.Model;
import com.broadvideo.pixsignage.persistence.ModelMapper;

@SuppressWarnings("serial")
@Scope("request")
@Controller("modelAction")
public class ModelAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Model model;

	@Autowired
	private ModelMapper modelMapper;

	public String doList() {
		try {
			List<Object> aaData = new ArrayList<Object>();
			List<Model> modelList = modelMapper.selectList();
			for (int i = 0; i < modelList.size(); i++) {
				aaData.add(modelList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("ModelAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			modelMapper.insertSelective(model);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("ModelAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			modelMapper.updateByPrimaryKeySelective(model);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("ModelAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Model getModel() {
		return model;
	}

	public void setModel(Model model) {
		this.model = model;
	}

}
