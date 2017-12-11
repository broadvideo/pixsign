package biz.videoexpress.pixedx.lmsapi.resource;

import org.glassfish.jersey.server.ResourceConfig;

public class Application extends ResourceConfig {

	public Application() {

		register(AppExceptionMapper.class);
		register(AppReqRespFilter.class);
		register(ResUsers.class);
		register(ResMeetings.class);
		register(ResMeetings.class);
		register(ResBranches.class);

	}
}
