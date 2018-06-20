package com.broadvideo.pixsignage.action;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Smartbox;
import com.broadvideo.pixsignage.service.SmartboxService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("smartboxAction")
public class SmartboxAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());
	private Smartbox smartbox;
	@Autowired
	private SmartboxService smartboxService;

	public String doList() {
		try {
			PageInfo pageInfo = super.initPageInfo();
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			PageResult pageResult = this.smartboxService.getSmartboxList(search, getStaffOrgid(), pageInfo);
			this.setiTotalRecords(pageResult.getTotalCount());
			this.setiTotalDisplayRecords(pageResult.getTotalCount());
			this.setAaData(pageResult.getResult());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("smartboxAction doList exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			if (StringUtils.isBlank(smartbox.getName()) || smartbox.getStocknum() == null) {
				logger.error("smartboxAction.doAdd: params(name:{},stocknum:{}) error.", smartbox.getName(),
						smartbox.getStocknum());
				renderError(RetCodeEnum.INVALID_ARGS, "请求缺少参数");
				return ERROR;
			}
			smartbox.setDoorversion("2");
			smartbox.setCreatetime(new Date());
			smartbox.setOrgid(getStaffOrgid());
			smartboxService.addSmartbox(smartbox);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("smartboxAction doAdd exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			if (smartbox.getSmartboxid() == null) {
				logger.error("smartboxAction.doUpdate: params(smartboxid:{}) error.", smartbox.getSmartboxid());
				renderError(RetCodeEnum.INVALID_ARGS, "请求缺少参数");
				return ERROR;
			}
			smartbox.setOrgid(getStaffOrgid());
			smartboxService.updateSmartbox(smartbox);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doUpdate exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			if (smartbox.getSmartboxid() == null) {
				logger.error("smartboxAction.doDelete: params(smartboxid:{}) error.", smartbox.getSmartboxid());
				renderError(RetCodeEnum.INVALID_ARGS, "请求缺少参数");
				return ERROR;
			}
			smartboxService.deleteSmartbox(smartbox.getSmartboxid(), getStaffOrgid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("smartboxAction doDelete exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}

	public Smartbox getSmartbox() {
		return smartbox;
	}

	public void setSmartbox(Smartbox smartbox) {
		this.smartbox = smartbox;
	}

}
