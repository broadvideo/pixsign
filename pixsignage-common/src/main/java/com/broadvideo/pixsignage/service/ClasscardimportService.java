package com.broadvideo.pixsignage.service;

import java.io.File;

import org.json.JSONObject;

public interface ClasscardimportService {

	JSONObject batchImportData(File file, Integer staffid, Integer orgid);

}