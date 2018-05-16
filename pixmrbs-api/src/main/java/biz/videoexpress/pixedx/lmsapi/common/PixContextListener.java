package biz.videoexpress.pixedx.lmsapi.common;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.service.OrgService;

public class PixContextListener implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub

	}

	@Override
	public void contextInitialized(ServletContextEvent sce) {

		ApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(sce.getServletContext());
		OrgService orgService = (OrgService) ctx.getBean("orgService");
		Org org = orgService.selectByCode("default");
		System.out.println("######PixContextListener.contextInitialized orgid:" + org.getOrgid());
		sce.getServletContext().setAttribute("orgid", org.getOrgid());

	}
}
