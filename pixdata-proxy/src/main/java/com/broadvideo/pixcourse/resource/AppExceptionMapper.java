package com.broadvideo.pixcourse.resource;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.Provider;

import org.glassfish.jersey.spi.ExtendedExceptionMapper;

import com.broadvideo.pixcourse.common.ApiRetCodeEnum;
import com.broadvideo.pixcourse.common.AppException;
import com.broadvideo.pixcourse.common.BasicResp;

/**
 * Translate all exceptions to ErrorResponse to client
 * 
 * @author foxty
 *
 */
@Provider
public class AppExceptionMapper implements ExtendedExceptionMapper<Exception> {

	public Response toResponse(Exception exception) {
		BasicResp basicResp = new BasicResp();
		basicResp.setCode(ApiRetCodeEnum.EXCEPTION);
		basicResp.setMessage(exception.getMessage());
		if (exception instanceof AppException) {
			AppException be = (AppException) exception;
			if (be.getCode() != null) {
				basicResp.setCode(be.getCode());
			}
		}

		return Response.status(Status.EXPECTATION_FAILED).entity(basicResp).build();
	}

	public boolean isMappable(Exception exception) {
		return true;
	}

}
