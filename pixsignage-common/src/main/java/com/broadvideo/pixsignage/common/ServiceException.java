package com.broadvideo.pixsignage.common;

/**
 * Service层公用的Exception.
 * 
 * @author charles
 *
 */
public class ServiceException extends RuntimeException {

	private Integer code;

	/**
	 * 
	 */
	private static final long serialVersionUID = 5433463691403184541L;

	public ServiceException() {
		super();
	}

	public ServiceException(Integer code, String message) {
		super(message);
		this.code = code;
	}
	public ServiceException(String message) {
		super(message);
	}

	public ServiceException(Throwable cause) {
		super(cause);
	}

	public ServiceException(Integer code, Throwable e) {
		super(e);
		this.code = code;
	}

	public ServiceException(String message, Throwable cause) {
		super(message, cause);
	}

	public Integer getCode() {
		return code;
	}



}
