package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Wxappinfo {
	// 微信公众号类型
	public static String WX_MP_TYPE = "0";
    private Integer wxappinfoid;

    private String type;

    private String appid;

    private String appsecret;

    private String accesstoken;

    private String callbackurl;
    private String token;
    private String encodingaeskey;
    private String encodingtype;

    private String description;

    private Date createtime;

    private Integer orgid;

    private String status;

    public Integer getWxappinfoid() {
        return wxappinfoid;
    }

    public void setWxappinfoid(Integer wxappinfoid) {
        this.wxappinfoid = wxappinfoid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type == null ? null : type.trim();
    }

    public String getAppid() {
        return appid;
    }

    public void setAppid(String appid) {
        this.appid = appid == null ? null : appid.trim();
    }

    public String getAppsecret() {
        return appsecret;
    }

    public void setAppsecret(String appsecret) {
        this.appsecret = appsecret == null ? null : appsecret.trim();
    }

    public String getAccesstoken() {
        return accesstoken;
    }

    public void setAccesstoken(String accesstoken) {
        this.accesstoken = accesstoken == null ? null : accesstoken.trim();
    }

    public String getCallbackurl() {
        return callbackurl;
    }

    public void setCallbackurl(String callbackurl) {
        this.callbackurl = callbackurl == null ? null : callbackurl.trim();
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token == null ? null : token.trim();
    }
    public String getEncodingaeskey() {
        return encodingaeskey;
    }
    public void setEncodingaeskey(String encodingaeskey) {
        this.encodingaeskey = encodingaeskey == null ? null : encodingaeskey.trim();
    }
    public String getEncodingtype() {
        return encodingtype;
    }
    public void setEncodingtype(String encodingtype) {
        this.encodingtype = encodingtype == null ? null : encodingtype.trim();
    }
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public Integer getOrgid() {
        return orgid;
    }

    public void setOrgid(Integer orgid) {
        this.orgid = orgid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status == null ? null : status.trim();
    }
}