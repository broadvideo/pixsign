package biz.videoexpress.pixedx.lmsapi.common;

import com.broadvideo.pixsignage.common.ServiceException;


public class AppException extends ServiceException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 2159395027286673362L;
	private Integer retcode;

	public AppException(String message) {
		super(message);
	}

	public AppException(Integer retcode, String message) {
		super(message);
		this.retcode = retcode;
	}

	public AppException(Throwable e) {
		super(e);
	}

	public AppException(Integer retcode, Throwable e) {
		super(e);
		this.retcode = retcode;
	}
	public Integer getRetcode() {
		return retcode;
	}

	public void setRetcode(Integer retcode) {
		this.retcode = retcode;
	}

}