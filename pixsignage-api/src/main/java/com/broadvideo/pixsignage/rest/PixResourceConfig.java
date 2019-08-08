package com.broadvideo.pixsignage.rest;

import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;

public class PixResourceConfig extends ResourceConfig {

	public PixResourceConfig() {
		register(MultiPartFeature.class);
		register(Admin2cService.class);
		register(AdminService.class);
		register(AdminService3.class);
		register(EstateService.class);
		register(Pixsign2cService.class);
		register(PixsignageService.class);
		register(PixsignageService2.class);
		register(PixsignageService21.class);
		register(PixsignageService3.class);
		register(StatisticService.class);
		register(ResClassrooms.class);
		register(ResStudents.class);
		register(ResTerminals.class);
		register(ResSmartDoors.class);
		register(ResWxmp.class);
		register(ResQRCodes.class);
		register(ResUsers.class);
		register(ResRooms.class);
		register(ResPersons.class);
		register(ResEvents.class);
		register(ResAttendances.class);
		register(ResConfigs.class);
		register(AttendanceService.class);
	}
}
