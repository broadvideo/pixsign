package com.broadvideo.pixsignage.vo;

import java.util.Date;

/**
 * 员工打卡记录
 * 
 * @author charles
 *
 */
public class StaffSwipe {

	private Long id;
	private Date swipetime;
	private Long cardnumber;
	private int apid;
	private String apname;
	private String account;
	private String ntag;

	public StaffSwipe() {

	}

	public StaffSwipe(Long id, Date swipetime, int apid, String account) {
		this.id = id;
		this.swipetime = swipetime;
		this.apid = apid;
		this.account = account;
	}
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getSwipetime() {
		return swipetime;
	}

	public void setSwipetime(Date swipetime) {
		this.swipetime = swipetime;
	}

	public Long getCardnumber() {
		return cardnumber;
	}

	public void setCardnumber(Long cardnumber) {
		this.cardnumber = cardnumber;
	}

	public int getApid() {
		return apid;
	}

	public void setApid(int apid) {
		this.apid = apid;
	}

	public String getApname() {
		return apname;
	}

	public void setApname(String apname) {
		this.apname = apname;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getNtag() {
		return ntag;
	}

	public void setNtag(String ntag) {
		this.ntag = ntag;
	}

}
