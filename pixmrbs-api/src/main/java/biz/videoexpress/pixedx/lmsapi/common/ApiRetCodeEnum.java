package biz.videoexpress.pixedx.lmsapi.common;

public interface ApiRetCodeEnum {
	
	//成功
	public final static Integer  SUCCESS=0;
	//请求参数错误
	public final static Integer  INVALID_ARGS=-1;
	//未登录
	public final static Integer NOT_LOGIN=-2;
	//系统异常
	public final static Integer EXCEPTION=-3;
	//认证失败
	public final static Integer  AUTH_FAIL=-20;
	
	
	//client_id、client_secret无效
	public final static Integer  INVALID_CLIENT=-21;
	//无效的token
	public final static Integer  INVALID_TOKEN=-22;
	

}
