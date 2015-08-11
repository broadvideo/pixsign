package com.broadvideo.signage.interceptor;

import com.broadvideo.signage.exception.BusinessException;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

public class BusinessInterceptor extends AbstractInterceptor {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7006311229733697504L;

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		System.out.println("BusinessInterceptor intercept() invoked! ");
		before(invocation);
		String result = "";
		try {
			result = invocation.invoke();
		} catch (Exception ex) {
			ex.printStackTrace();
			throw new BusinessException(ex.getMessage());
		}

		after(invocation, result);
		return result;
	}

	/**
	 * 
	 * @param invocation
	 * @return
	 * @throws Exception
	 */
	public void before(ActionInvocation invocation) throws Exception {
		// ...
	}

	/**
	 * 
	 * @param invocation
	 * @return
	 * @throws Exception
	 */
	public void after(ActionInvocation invocation, String result)
			throws Exception {
		// ...
	}

}