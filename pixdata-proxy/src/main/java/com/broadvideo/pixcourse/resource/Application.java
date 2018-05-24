package com.broadvideo.pixcourse.resource;

import org.glassfish.jersey.server.ResourceConfig;

public class Application extends ResourceConfig {

	public Application() {

		register(AppExceptionMapper.class);
		register(AppReqRespFilter.class);
		register(ResCourseProxy.class);
		register(ResAttendanceProxy.class);

	}
}
