package com.broadvideo.pixsign.rest;

import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;

public class PixResourceConfig extends ResourceConfig {

	public PixResourceConfig() {
		register(MultiPartFeature.class);
		register(PixsignService.class);
	}
}
