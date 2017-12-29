package com.broadvideo.pixsignage.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.service.OrgService;
import com.broadvideo.pixsignage.service.PageService;
import com.broadvideo.pixsignage.service.PlanService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("pageAction")
public class PageAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Page page;
	private String[] staffids;

	private File[] mypage;
	private String[] mypageContentType;
	private String[] mypageFileName;
	private String[] orgids;

	private String exportname;
	private InputStream inputStream;

	@Autowired
	private PageService pageService;
	@Autowired
	private PlanService planService;
	@Autowired
	private OrgService orgService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String orgid = getParameter("orgid");
			if (orgid == null || orgid.equals("")) {
				orgid = "" + getLoginStaff().getOrgid();
			}
			String branchid = getParameter("branchid");
			if (branchid != null && branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}
			String touchflag = getParameter("touchflag");
			String homeflag = getParameter("homeflag");

			int count = pageService.selectCount(orgid, branchid, touchflag, homeflag, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Page> pageList = pageService.selectList(orgid, branchid, touchflag, homeflag, search, start, length,
					getLoginStaff());
			for (int i = 0; i < pageList.size(); i++) {
				aaData.add(pageList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doGet() {
		try {
			String pageid = getParameter("pageid");
			page = pageService.selectByPrimaryKey(pageid);
			if (page == null) {
				setErrorcode(-1);
				setErrormsg("Not found");
				return ERROR;
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doGet exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doListStaff() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String pageid = getParameter("pageid");

			int count = pageService.selectStaffCount(pageid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Staff> staffList = pageService.selectStaff(pageid, search, start, length);
			for (int i = 0; i < staffList.size(); i++) {
				aaData.add(staffList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doListStaff exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doListStaff2Select() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String pageid = getParameter("pageid");

			int count = pageService.selectStaff2SelectCount(pageid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Staff> staffList = pageService.selectStaff2Select(pageid, search, start, length);
			for (int i = 0; i < staffList.size(); i++) {
				aaData.add(staffList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doListStaff2Select exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			page.setOrgid(getLoginStaff().getOrgid());
			page.setCreatestaffid(getLoginStaff().getStaffid());
			String frompageid = getParameter("frompageid");
			if (frompageid != null) {
				pageService.copyPage(frompageid, page);
			} else {
				pageService.addPage(page);
			}
			if (page.getHomeflag().equals("1")) {
				pageService.makeHtmlZip("" + page.getPageid());
			} else {
				pageService.makeHtmlZip("" + page.getHomepageid());
			}

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			pageService.updatePage(page);
			if (page.getHomeflag().equals("1")) {
				pageService.makeHtmlZip("" + page.getPageid());
			} else {
				pageService.makeHtmlZip("" + page.getHomepageid());
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			pageService.deletePage("" + page.getPageid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String pageid = getParameter("pageid");
			planService.syncPlanByPage(pageid);
			logger.info("Page sync success");
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doSync exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDesign() {
		try {
			page.setOrgid(getLoginStaff().getOrgid());
			page.setCreatestaffid(getLoginStaff().getStaffid());
			pageService.design(page);
			if (page.getHomeflag().equals("1")) {
				pageService.makeHtmlZip("" + page.getPageid());
			} else {
				pageService.makeHtmlZip("" + page.getHomepageid());
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doDesign exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doExport() {
		try {
			String pageid = getParameter("pageid");
			exportname = "page-export-" + pageid + ".zip";
			String saveDir = CommonConfig.CONFIG_PIXDATA_HOME + "/page/" + pageid;
			FileUtils.forceMkdir(new File(saveDir));
			File zipFile = new File(saveDir, exportname);
			if (zipFile.exists()) {
				zipFile.delete();
			}
			pageService.exportZip(pageid, zipFile);
			inputStream = new FileInputStream(zipFile);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doExport exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public void doUpload() throws Exception {
		HttpServletResponse response = getHttpServletResponse();
		response.setContentType("text/html;charset=utf-8");
		PrintWriter writer = response.getWriter();
		JSONObject result = new JSONObject();
		JSONArray jsonArray = new JSONArray();

		result.put("files", jsonArray);

		if (mypage != null) {
			for (int i = 0; i < mypage.length; i++) {
				JSONObject jsonItem = new JSONObject();
				try {
					logger.info("Upload one page, orgid={},file={}", orgids[i], mypageFileName[i]);
					jsonItem.put("filename", mypageFileName[i]);
					jsonItem.put("size", FileUtils.sizeOf(mypage[i]));
					Org org = orgService.selectByPrimaryKey(orgids[i]);
					Page page = pageService.importZip(org.getOrgid(), org.getTopbranchid(), mypage[i]);
					jsonItem.put("name", page.getName());
				} catch (Exception e) {
					logger.info("Page parse error, file={}", mypageFileName[i], e);
					addActionError(e.getMessage());
					jsonItem.put("error", e.getMessage());
				}
				jsonArray.put(jsonItem);
			}
		}

		writer.write(result.toString());
		writer.close();
	}

	public String doAddStaffs() {
		try {
			pageService.addStaffs(page, staffids);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doAddStaffs exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDeleteStaffs() {
		try {
			pageService.deleteStaffs(page, staffids);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PageAction doDeleteStaffs exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
	}

	public String[] getStaffids() {
		return staffids;
	}

	public void setStaffids(String[] staffids) {
		this.staffids = staffids;
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

	public File[] getMypage() {
		return mypage;
	}

	public void setMypage(File[] mypage) {
		this.mypage = mypage;
	}

	public String[] getMypageFileName() {
		return mypageFileName;
	}

	public void setMypageFileName(String[] mypageFileName) {
		this.mypageFileName = mypageFileName;
	}

	public String[] getOrgids() {
		return orgids;
	}

	public void setOrgids(String[] orgids) {
		this.orgids = orgids;
	}

}
