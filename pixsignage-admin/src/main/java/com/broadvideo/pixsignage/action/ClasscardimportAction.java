
package com.broadvideo.pixsignage.action;

import java.io.File;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.service.ClasscardimportService;
import com.broadvideo.pixsignage.util.Struts2Utils;

@Scope("request")
@Controller("classcardimportAction")
public class ClasscardimportAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -441477583675560857L;
	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ClasscardimportService classcardimportService;
	private File excelFile;



	public String doImport() throws Exception {

		if (this.excelFile == null) {
			logger.error("uploadFile is empty.");
			renderError(RetCodeEnum.INVALID_ARGS, "Invalid args");
			return ERROR;
		}
		try {
		JSONObject importResult = this.classcardimportService.batchImportData(this.excelFile,
				getLoginStaff().getStaffid(), getLoginStaff()
				.getOrgid());
		JSONObject resultJson = new JSONObject();
		resultJson.put("errorcode", 0);
		resultJson.put("errormsg", "");
		resultJson.put("importResult", importResult);
			Struts2Utils.renderJson(resultJson.toString(), "encoding:UTF-8");
		} catch (Exception ex) {

			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}


		return NONE;
	}



	public File getExcelFile() {
		return excelFile;
	}

	public void setExcelFile(File excelFile) {
		this.excelFile = excelFile;
	}


}
