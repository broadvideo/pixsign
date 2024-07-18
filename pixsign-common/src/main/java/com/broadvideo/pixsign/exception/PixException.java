package com.broadvideo.pixsign.exception;

import java.util.Locale;

import org.springframework.context.support.ResourceBundleMessageSource;

public class PixException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	/**
	 * 错误编码
	 */
	private int errorCode;

	/**
	 * 构造一个基本异常.
	 *
	 * @param message
	 *            信息描述
	 */
	public PixException(String message) {
		super(message);
	}

	/**
	 * 构造一个基本异常.
	 *
	 * @param errorCode
	 *            错误编码
	 * @param message
	 *            信息描述
	 * @param propertiesKey
	 *            消息是否为属性文件中的Key
	 */
	public PixException(int errorCode, String message) {
		super(message);
		this.setErrorCode(errorCode);
	}

	/**
	 * 构造一个基本异常.
	 *
	 * @param errorCode
	 *            错误编码
	 * @param message
	 *            信息描述
	 */
	public PixException(int errorCode, String message, Throwable cause) {
		super(message, cause);
		this.setErrorCode(errorCode);
	}

	/**
	 * 构造一个基本异常.
	 *
	 * @param message
	 *            信息描述
	 * @param cause
	 *            根异常类（可以存入任何异常）
	 */
	public PixException(String message, Throwable cause) {
		super(message, cause);
	}

	public int getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(int errorCode) {
		this.errorCode = errorCode;
	}

	public String getLocaleMessage(ResourceBundleMessageSource messageSource, Locale locale) {
		return messageSource.getMessage("error." + errorCode, null, getMessage(), locale);
	}

}
