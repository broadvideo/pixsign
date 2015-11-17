package com.broadvideo.pixsignage.interceptor;

import java.util.Locale;

import org.springframework.context.i18n.LocaleContextHolder;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.opensymphony.xwork2.util.logging.Logger;
import com.opensymphony.xwork2.util.logging.LoggerFactory;

/**
 * 
 * 自定义的struts2国际化处理方法，改为cookie操作.
 * 
 * 
 */
public class PixI18nInterceptor extends AbstractInterceptor {

	public static final String DEFAULT_PARAMETER = "locale";

	protected static final Logger LOG = LoggerFactory.getLogger(PixI18nInterceptor.class);

	private static final long serialVersionUID = -2508727215373833285L;

	protected String parameterName = DEFAULT_PARAMETER;

	public PixI18nInterceptor() {
		if (LOG.isDebugEnabled()) {
			LOG.debug("new I18nInterceptor()");
		}
	}

	public void setParameterName(String parameterName) {
		this.parameterName = parameterName;
	}

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		/**
		 * 由LocalResolverFilter写入的locale在这里读取出来交给struts2使用.
		 */
		Locale locale = LocaleContextHolder.getLocale();
		saveLocale(invocation, locale);
		final String result = invocation.invoke();
		return result;
	}

	/**
	 * Save the given locale to the ActionInvocation.
	 * 
	 * @param invocation
	 *            The ActionInvocation.
	 * @param locale
	 *            The locale to save.
	 */
	protected void saveLocale(ActionInvocation invocation, Locale locale) {
		invocation.getInvocationContext().setLocale(locale);
	}

}
