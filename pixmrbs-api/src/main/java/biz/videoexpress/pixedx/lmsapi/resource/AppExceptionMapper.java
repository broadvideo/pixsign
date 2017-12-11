package biz.videoexpress.pixedx.lmsapi.resource;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.Provider;

import org.glassfish.jersey.spi.ExtendedExceptionMapper;

import biz.videoexpress.pixedx.lmsapi.common.ApiRetCodeEnum;
import biz.videoexpress.pixedx.lmsapi.common.AppException;
import biz.videoexpress.pixedx.lmsapi.common.BasicResp;

/**
 * Translate all exceptions to ErrorResponse to client
 * 
 * @author foxty
 *
 */
@Provider
public class AppExceptionMapper implements ExtendedExceptionMapper<Exception> {

	@Override
	public Response toResponse(Exception exception) {

		BasicResp basicResp = new BasicResp();
		basicResp.setRetcode(ApiRetCodeEnum.EXCEPTION);
		basicResp.setMessage(exception.getMessage());
		if (exception instanceof AppException) {
			AppException be = (AppException) exception;
			if (be.getRetcode() != null) {
				basicResp.setRetcode(be.getRetcode());
			}
		}

		return Response.status(Status.EXPECTATION_FAILED).entity(basicResp).build();
	}

	@Override
	public boolean isMappable(Exception arg0) {
		return true;
	}

}
