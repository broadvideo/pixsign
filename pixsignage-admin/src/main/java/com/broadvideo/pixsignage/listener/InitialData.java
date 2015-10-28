package com.broadvideo.pixsignage.listener;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class InitialData implements ServletContextListener {
	
    @Override
	public void contextDestroyed(ServletContextEvent event) {
	}

	@Override
	public void contextInitialized(ServletContextEvent event) {
		ServletContext context = event.getServletContext().getContext("/pixlicense");
		System.out.println("pixorg context: " + context);
		if (context != null) {
			System.out.println(context.getAttribute("test"));
		}
	}

}
