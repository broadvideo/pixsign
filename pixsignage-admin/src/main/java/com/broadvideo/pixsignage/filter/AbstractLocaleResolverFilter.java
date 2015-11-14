package com.broadvideo.pixsignage.filter;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.Filter;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.jsp.jstl.core.Config;

import org.apache.commons.lang.LocaleUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.servlet.LocaleResolver;

/**
 * 本地化拦截器.
 * 
 * 
 * 
 */
public abstract class AbstractLocaleResolverFilter implements Filter {
	// 默认Local请求参数名
	private static final String DEFUALT_LOCALE_PARAMETER = "locale";
	protected final Logger LOGGER = LoggerFactory.getLogger(getClass());
	private static boolean localeOpenFlag = false;;

	public void handerFilter(ServletRequest request, ServletResponse response) throws IOException, ServletException {
		HttpServletRequest httpServletRequest = (HttpServletRequest) request;
		HttpSession session = httpServletRequest.getSession();

		WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(session.getServletContext());

		Locale changeLocale = null;
		try {
			changeLocale = LocaleUtils.toLocale(request.getParameter(DEFUALT_LOCALE_PARAMETER));
			if (localeOpenFlag) {
				changeLocale = Locale.CHINA;
			}
		} catch (IllegalArgumentException e) {
			LOGGER.warn("request 参数locale格式异常 {}", request.getParameter(DEFUALT_LOCALE_PARAMETER));
		}

		// 操作国际化的cookies的信息
		LocaleResolver localeResolver = (LocaleResolver) ctx.getBean(LocaleResolver.class);
		Locale cookieLocale = localeResolver.resolveLocale(httpServletRequest);

		if (changeLocale != null) {
			// 需要改变语言
			if (Locale.CHINA.equals(changeLocale)) {
				cookieLocale = Locale.CHINA;
			} else if (!Locale.CHINA.equals(cookieLocale) && Locale.CHINESE.equals(cookieLocale.getLanguage())) {
				cookieLocale = Locale.CHINA;
				// cookieLocale = Locale.TAIWAN; //未来支持台湾繁体语言时，开启本句
			} else {
				changeLocale = Locale.US;
			}

			if (cookieLocale != null && changeLocale != null) {
				localeResolver.setLocale((HttpServletRequest) request, (HttpServletResponse) response, changeLocale);
				cookieLocale = changeLocale;
			}
		}

		if (Locale.CHINA.equals(cookieLocale)) {
			cookieLocale = Locale.CHINA;
		} else if (!Locale.CHINA.equals(cookieLocale) && Locale.CHINESE.equals(cookieLocale.getLanguage())) {
			cookieLocale = Locale.CHINA;
			// cookieLocale = Locale.TAIWAN; //未来支持台湾繁体语言时，开启本句
		} else {
			cookieLocale = Locale.US;
		}

		LocaleContextHolder.setLocale(cookieLocale, true);
		// session.setAttribute("WW_TRANS_I18N_LOCALE", cookieLocale);
		Config.set(request, Config.FMT_LOCALE, cookieLocale);

	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		localeOpenFlag = org.apache.commons.lang.BooleanUtils
				.toBoolean(filterConfig.getInitParameter("localeOpenFlag"));
	}

	@Override
	public void destroy() {

	}

}
