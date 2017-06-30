package com.broadvideo.pixsignage.common;




public class ResponseUtil {

	private static JsonMapper jsonMapper = new JsonMapper();

	/**
	 * 返回错误响应
	 * 
	 * @param code
	 * @param message
	 */
	public static void codeResponse(Integer code, String message) {
		BasicRetRespEntity respEntity = new BasicRetRespEntity(code, message);
		responseJson(respEntity);

	}

	/**
	 * 返回id值响应
	 * 
	 * @param id
	 * @param message
	 */
	public static void idRetResonse(Integer id, String message) {

		IdRetRespEntity repEntity = new IdRetRespEntity(RetCodeEnum.SUCCESS, message, id);
		responseJson(repEntity);

	}

	public static void objectRetResponse(Object data, String aliasName, String message) {
		ObjectRetRespEntity repEntity = new ObjectRetRespEntity(RetCodeEnum.SUCCESS, message, data);
		responseJson(repEntity);
	}
	public static void objectRetResponse(Object data, String message) {
		ObjectRetRespEntity repEntity = new ObjectRetRespEntity(RetCodeEnum.SUCCESS, message, data);
		responseJson(repEntity);
	}

	public static void valRetResponse(int retval, String message) {
		ValRetRespEntity repEntity = new ValRetRespEntity(RetCodeEnum.SUCCESS, message, retval);
		responseJson(repEntity);
	}

	public static void responseJson(BasicRetRespEntity respEntity) {

		Struts2Utils.renderJson(jsonMapper.toJson(respEntity), "encoding:UTF-8");

	}







}
