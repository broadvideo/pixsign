package com.broadvideo.pixsignage.common;

public interface ApiRetCodeEnum {
	
	//成功
	public final static Integer  SUCCESS=0;
	//请求参数错误
	public final static Integer  INVALID_ARGS=-1;
	//未登录
	public final static Integer NOT_LOGIN=-2;
	//系统异常
	public final static Integer EXCEPTION=-3;
	// 终端不存在
	public final static Integer TERMINAL_NOT_FOUND = -10000;
	// 终端未授权操作柜门
	public final static Integer TERMINAL_NOAUTH_OPT_DOOR = -10001;
	// 终端未绑定用户
	public final static Integer TERMINAL_NOBINDING_USER = -10002;

	// 微信公众号缺少配置
	public final static Integer WXMP_NO_CONFIG = -20000;
	//认证失败
	public final static Integer  AUTH_FAIL=-20;
	
	
	//client_id、client_secret无效
	public final static Integer  INVALID_CLIENT=-21;
	//无效的token
	public final static Integer  INVALID_TOKEN=-22;
	

}
