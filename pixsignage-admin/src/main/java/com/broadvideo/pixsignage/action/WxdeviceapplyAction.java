package com.broadvideo.pixsignage.action;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Wxdevice;
import com.broadvideo.pixsignage.domain.Wxdeviceapply;
import com.broadvideo.pixsignage.domain.Wxinfo;
import com.broadvideo.pixsignage.service.WxdeviceService;
import com.broadvideo.pixsignage.service.WxdeviceapplyService;
import com.broadvideo.pixsignage.service.WxinfoService;
import com.broadvideo.pixsignage.util.WeixinUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("wxdeviceapplyAction")
public class WxdeviceapplyAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Wxdeviceapply wxdeviceapply;

	private String exportname;
	private InputStream inputStream;

	@Autowired
	private WxdeviceapplyService wxdeviceapplyService;
	@Autowired
	private WxinfoService wxinfoService;
	@Autowired
	private WxdeviceService wxdeviceService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");

			List<Object> aaData = new ArrayList<Object>();
			int count = wxdeviceapplyService.selectCount("" + getLoginStaff().getOrgid());
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Wxdeviceapply> wxdeviceapplyList = wxdeviceapplyService.selectList("" + getLoginStaff().getOrgid(),
					start, length);
			for (int i = 0; i < wxdeviceapplyList.size(); i++) {
				aaData.add(wxdeviceapplyList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("WxdeviceapplyAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			Wxinfo wxinfo = wxinfoService.getToken("" + getLoginStaff().getOrgid());
			if (wxinfo.getValidflag().equals("0")) {
				setErrorcode(-1);
				setErrormsg("Weixin AppID invalid");
				return ERROR;
			}
			WeixinUtil wxutil = new WeixinUtil();
			wxutil.applyDevice(wxinfo.getAccesstocken(), wxdeviceapply.getCount(), wxdeviceapply.getReason());
			if (wxutil.getResponseCode() == WeixinUtil.SUCCESS) {
				int applyid = wxutil.getResponseJson().getJSONObject("data").getInt("apply_id");
				wxdeviceapply.setOrgid(getLoginStaff().getOrgid());
				wxdeviceapply.setName("Apply-" + applyid);
				wxdeviceapply.setStatus("" + wxutil.getResponseJson().getJSONObject("data").getInt("audit_status"));
				wxdeviceapply.setApplytime(Calendar.getInstance().getTime());
				wxdeviceapply.setApplyid(applyid);
				wxdeviceapply.setComment(wxutil.getResponseJson().getJSONObject("data").getString("audit_comment"));
				wxdeviceapplyService.addWxdeviceapply(wxdeviceapply);
				return SUCCESS;
			} else {
				setErrorcode(-1);
				setErrormsg(wxutil.getResponseError());
				return ERROR;
			}
		} catch (Exception ex) {
			logger.error("WxdeviceapplyAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doRefresh() {
		try {
			wxdeviceapply = wxdeviceapplyService.selectByPrimaryKey("" + wxdeviceapply.getWxdeviceapplyid());
			Wxinfo wxinfo = wxinfoService.getToken("" + getLoginStaff().getOrgid());
			if (wxinfo.getValidflag().equals("0")) {
				setErrorcode(-1);
				setErrormsg("Weixin AppID invalid");
				return ERROR;
			}
			WeixinUtil wxutil = new WeixinUtil();
			wxutil.applyStatus(wxinfo.getAccesstocken(), wxdeviceapply.getApplyid());
			if (wxutil.getResponseCode() == WeixinUtil.SUCCESS) {
				wxdeviceapply.setStatus("" + wxutil.getResponseJson().getJSONObject("data").getInt("audit_status"));
				wxdeviceapply.setComment(wxutil.getResponseJson().getJSONObject("data").getString("audit_comment"));
				if (wxutil.getResponseJson().getJSONObject("data").getLong("audit_time") > 0) {
					Calendar c = Calendar.getInstance();
					c.setTimeInMillis(wxutil.getResponseJson().getJSONObject("data").getLong("audit_time") * 1000);
					wxdeviceapply.setAudittime(c.getTime());
				}
				wxdeviceapplyService.updateWxdeviceapply(wxdeviceapply);

				if (wxdeviceapply.getStatus().equals("2")) {
					wxutil.queryApplyDevices(wxinfo.getAccesstocken(), wxdeviceapply.getApplyid());
					JSONObject rspJson = wxutil.getResponseJson();
					JSONArray deviceJsonArray = rspJson.getJSONObject("data").getJSONArray("devices");
					for (int i = 0; i < deviceJsonArray.length(); i++) {
						JSONObject deviceJson = deviceJsonArray.getJSONObject(i);
						Wxdevice wxdevice = new Wxdevice();
						wxdevice.setOrgid(getLoginStaff().getOrgid());
						wxdevice.setWxdeviceapplyid(wxdeviceapply.getWxdeviceapplyid());
						wxdevice.setWxdeviceid(deviceJson.getInt("device_id"));
						wxdevice.setUuid(deviceJson.getString("uuid"));
						wxdevice.setMajor(deviceJson.getInt("major"));
						wxdevice.setMinor(deviceJson.getInt("minor"));
						wxdevice.setWxstatus("" + deviceJson.getInt("status"));
						if (deviceJson.getLong("last_active_time") > 0) {
							Calendar c = Calendar.getInstance();
							c.setTimeInMillis(deviceJson.getLong("last_active_time") * 1000);
							wxdevice.setActivetime(c.getTime());
						}
						wxdevice.setPoiid(deviceJson.getInt("poi_id"));
						wxdeviceService.syncWxdevice(wxdevice);
					}
				}

				return SUCCESS;
			} else {
				setErrorcode(-1);
				setErrormsg(wxutil.getResponseError());
				return ERROR;
			}
		} catch (Exception ex) {
			logger.error("WxdeviceapplyAction doRefresh exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doExport() {
		try {
			SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String wxdeviceapplyid = getParameter("wxdeviceapplyid");
			List<Wxdevice> wxdeviceList = wxdeviceService.selectList("" + getLoginStaff().getOrgid(), wxdeviceapplyid,
					null, null);
			StringBuffer sb = new StringBuffer();
			for (Wxdevice wxdevice : wxdeviceList) {
				sb.append(wxdevice.getWxdeviceid() + ",");
				sb.append(wxdevice.getUuid() + ",");
				sb.append(wxdevice.getMajor() + ",");
				sb.append(wxdevice.getMinor() + ",");
				sb.append(dateformat.format(wxdevice.getCreatetime()) + ",");
				sb.append("\r\n");
			}
			inputStream = new ByteArrayInputStream(sb.toString().getBytes("UTF-8"));
			dateformat = new SimpleDateFormat("yyyyMMddHHmmss");
			exportname = "wxdevice-" + wxdeviceapplyid + "-" + dateformat.format(Calendar.getInstance().getTime())
					+ ".csv";

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("WxdeviceapplyAction doExport exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Wxdeviceapply getWxdeviceapply() {
		return wxdeviceapply;
	}

	public void setWxdeviceapply(Wxdeviceapply wxdeviceapply) {
		this.wxdeviceapply = wxdeviceapply;
	}

	public String getExportname() {
		return exportname;
	}

	public void setExportname(String exportname) {
		this.exportname = exportname;
	}

	public InputStream getInputStream() {
		return inputStream;
	}

	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}

}
