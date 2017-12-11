package biz.videoexpress.pixedx.lmsapi.bean;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserProfileInfo {

	private Integer userId;
	private String username;
	private String name;
	private String email;
	private Long lastLogin;

	@JsonProperty("user_id")
	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	@JsonProperty("username")
	public String getUsername() {
		return username;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@JsonProperty("email")
	public String getEmail() {
		return email;
	}

	@JsonProperty("last_login")
	public Long getLastLogin() {
		return lastLogin;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setLastLogin(Long lastLogin) {
		this.lastLogin = lastLogin;
	}

}
