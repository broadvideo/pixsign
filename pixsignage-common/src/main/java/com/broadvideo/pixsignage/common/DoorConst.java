package com.broadvideo.pixsignage.common;

import com.fasterxml.jackson.annotation.JsonValue;

public class DoorConst {
	// 柜门类型
	public static enum DoorType {

		UP("0"), DOWN("1");
		private String val;

		DoorType(String value) {
			this.val = value;
		}

		@JsonValue
		public String getVal() {
			return val;
		}

		public void setVal(String val) {
			this.val = val;
		}

	}

	// 柜门授权类型
	public static enum DoorAuthorizeState {

		INIT("0"), SUBSCRIBE("1"), OPEN("3");
		private String val;

		DoorAuthorizeState(String value) {
			this.val = value;
		}

		@JsonValue
		public String getVal() {
			return val;
		}

		public void setVal(String val) {
			this.val = val;
		}

	}
	
	// DOOR STATE
	public static enum DoorState {

		FAIL("0"), SUCCESS("1");
		private String val;

		DoorState(String value) {
			this.val = value;
		}

		@JsonValue
		public String getVal() {
			return val;
		}

		public void setVal(String val) {
			this.val = val;
		}

	}

	// DOOR STATE
	public static enum ActionType {

		ACTION_OPEN("0"), ACTION_CLOSE("1");
		private String val;

		ActionType(String value) {
			this.val = value;
		}

		@JsonValue
		public String getVal() {
			return val;
		}

		public void setVal(String val) {
			this.val = val;
		}

	}

}
