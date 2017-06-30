package com.broadvideo.pixsignage.common;

/**
 * 返回值枚举
 * 
 * @author charles
 *
 */
public interface RetCodeEnum {

	/**
	 * 处理中
	 */
	public final static int PROCESSING = 0;

	/**
	 * 操作成功
	 */
	public final static int SUCCESS = 1;

	/**
	 * 操作失败：和已经存在的记录冲突
	 */
	public final static int EXIST = -2;

	/**
	 * 操作失败：操作异常
	 */
	public final static int EXCEPTION = -3;
	/**
	 * 操作失败：获取vod时长异常
	 */
	public final static int GET_VOD_DURATION_EXCEPTION = -31;

	/**
	 * 需要等待转码处理
	 */
	public final static int WAITING_FOR_TRANSCODING = -32;

	/**
	 * 操作失败：无效的参数请求
	 */
	public final static int INVALID_ARGS = -4;
	/**
	 * 邮件格式不正确
	 */

	public final static int INVALID_EMAIL_FORMAT = -41;


	/**
	 * 操作失败：无效的类型
	 */

	public final static int INVLIAD_TYPE = -5;
	/**
	 * 无效的图片width：heigth比例
	 */
	public final static int INVALID_IMAGE_RATIO = -51;
	/**
	 * 操作失败：数据超出了阀值
	 */
	public final static int OVERFLOW = -6;
	/**
	 * 不可以修改
	 */
	public final static int UNMODIFY = -7;

	public final static int NOT_ALLOWED_DELETE = -8;
	/**
	 * 操作失败
	 */
	public final static int FAILURE = -10;

	/**
	 * 存在子节点
	 */
	public final static int EXIST_CHILD = -21;
	/**
	 * 存在关联的数据
	 */
	public final static int EXIST_ATTACH_OBJECT = -22;
	/**
	 * 登陆账号已经存在
	 */
	public final static int EXIST_LOGIN_NAME = -23;

	/**
	 * 人员姓名存在
	 */
	public final static int EXIST_PERSON_NAME = -24;

	/**
	 * 人员邮件存在
	 */
	public final static int EXIST_PERSON_EMAIL = -25;
	/**
	 * 已经存在父节点
	 */
	public final static int EXIST_PARENT_NODE = -26;
	/**
	 * 设置公开课失败：不存在父节点
	 */
	public final static int NOT_EXIST_PARENT_NODE = -30;
	/**
	 * 密码不一致
	 */
	public final static int PASSWORD_NOT_EQUAL = -42;

	/**
	 * 未登录
	 */
	public static int RELOGIN = -90;
	/**
	 * 没有排课信息
	 */
	public static int NOT_FOUND_CLASSTIME = -100;
	// 未绑定教室
	public static int NOT_BIND_CODER_GROUP = -101;
	// 未绑定编码器
	public static int NOT_BIND_CODER = -102;
	// 未找到记录
	public static int NOT_FOUND_OBJECT = -103;
	/**
	 * 课表方案缺少时间配置
	 */
	public final static int NONE_PERIOD_TIME_DTL = -104;
}
