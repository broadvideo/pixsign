package biz.videoexpress.pixedx.lmsapi.bean;

import javax.ws.rs.QueryParam;

public class MeetingRoomReq extends PageInfo {
	@QueryParam("category_id")
	private Integer categoryId;
	@QueryParam("peoples")
	private Integer peoples;
	@QueryParam("terminal_id")
	private String terminalid;


	public Integer getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Integer categoryId) {
		this.categoryId = categoryId;
	}

	public Integer getPeoples() {
		return peoples;
	}

	public void setPeoples(Integer peoples) {
		this.peoples = peoples;
	}

	public String getTerminalid() {
		return terminalid;
	}

	public void setTerminalid(String terminalid) {
		this.terminalid = terminalid;
	}

}
