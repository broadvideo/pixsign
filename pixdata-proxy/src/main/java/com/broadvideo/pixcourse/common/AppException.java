package com.broadvideo.pixcourse.common;

public class AppException extends RuntimeException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 7321765697336104808L;
	private Integer code;

	public AppException() {
		super();
	}

	public AppException(Integer code, String message) {
		super(message);
		this.code = code;
	}

	public AppException(String message) {
		super(message);
	}

	public AppException(Throwable cause) {
		super(cause);
	}

	public AppException(Integer code, Throwable e) {
		super(e);
		this.code = code;
	}

	public AppException(String message, Throwable cause) {
		super(message, cause);
	}

	public Integer getCode() {
		return code;
	}

}