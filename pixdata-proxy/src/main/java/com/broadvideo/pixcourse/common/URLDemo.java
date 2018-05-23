package com.broadvideo.pixcourse.common;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;

public class URLDemo {

	public static void main(String[] args) {

		try {
			URL url = new URL("http://192.168.0.212:81/big-data/viewQueryDetailWS?wsdl");
			InputStream is = url.openConnection().getInputStream();

			int dataInt = -1;
			StringWriter writer = new StringWriter();
			while ((dataInt = is.read()) != -1) {
				writer.write(dataInt);

			}

			System.out.println("dataStr:" + writer.getBuffer().toString());
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}
