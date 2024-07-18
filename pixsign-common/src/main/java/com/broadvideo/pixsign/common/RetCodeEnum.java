package com.broadvideo.pixsign.common;

/**
 * 返回值枚举
 * 
 * @author charles
 *
 */
public interface RetCodeEnum {


	/**
	 * 操作成功
	 */
	public final static int SUCCESS = 0;
	/**
	 * 操作失败：操作异常
	 */
	public final static int EXCEPTION = -1;
	/**
	 * 操作失败：和已经存在的记录冲突
	 */
	public final static int EXIST = -2;

	/**
	 * 操作失败：无效的参数请求
	 */
	public final static int INVALID_ARGS = -3;


}
