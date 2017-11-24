package com.broadvideo.pixsignage.util;

public class CommonUtils {
	
	
	public static void sleep(long milliseconds){
		
		try {
			Thread.currentThread().sleep(milliseconds);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
