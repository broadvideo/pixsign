var common = {
	view: {
		id: 'ID',
		name: 'Name',
		type: 'Type',
		code: 'Code',
		value: 'Value',
		status: 'Status',
		
		device: 'Device',
		devicegroup: 'Device Group',
		medialist: 'Media List',
		video: 'Video',
		intvideo: 'Video',
		extvideo: 'External Video',
		image: 'Image',
		text: 'Text',
		stream: 'Stream',
		dvb: 'DVB',
		layout: 'Layout',
		solovideo: 'Video',
		soloimage: 'Image',
		solopage: 'Page',
		mediagrid: 'Media Grid',

		bundle: 'Program',
		touchbundle: 'Interactive Program',
		subbundle: 'Sub-Program',
		subtemplet: 'Sub-Template',
		schedule: 'Schedule',
		layoutschedule: 'Layout Schedule',
		regionschedule: 'Region Schedule',
		bundleschedule: 'Schedule',
		sequence: 'Sequence',
		terminalid: 'ID',
		hardkey: 'Hardkey',
		position: 'Location',
		map: 'Map',
		city: 'City',
		addr: 'Address',
		onlineflag: 'Online',
		config: 'Configuration',
		control: 'Remote Control',
		screen: 'Screenshot',
		progress: 'Progress',
		file: 'File',
		filename: 'File Name',
		size: 'Size',
		url: 'URL',
		frequence: 'Frequency',
		channelnumber: 'Channel Number',
		ratio: 'Ratio',
		loginname: 'Login Name',
		branch: 'Branch',
		versionname: 'Version Name',
		versioncode: 'Version Code',
		mtype: 'Type',
		appname: 'App Name',
		latest: 'Latest',
		expiretime: 'Expiration Date',
		maxdevices: 'Max Device Amount',
		currentdevices: 'Current Device Amount',
		storage: 'Storage',
		maxstorage: 'Max Storage',
		currentstorage: 'Storage Used',
		boardinfo: 'Board Info',
		createtime: 'Create Time',
		updatetime: 'Update Time',
		uploadtime: 'Upload Time',
		refreshtime: 'Online Time',
		activetime: 'Active Time',
		playtime: 'Play TIme',
		screentime: 'Screen Shot Time',
		starttime: 'Start Time',
		endtime: 'End Time',
		onlinetime: 'Online Time',
		offlinetime: 'Offline Time',
		onlineduration: 'Online Duration',
		duration: 'Duration',

		unregister: 'Unregister',
		online: 'Online',
		offline: 'Offline',
		active: 'Active',
		inactive: 'Inactive',
		idle: 'Idle',
		once: 'Once',
		daily: 'Daily',
		status_0: 'Waiting',
		status_1: 'Active',

		review_wait: 'Wait for Review',
		review_passed: 'Review Passed',
		review_rejected: 'Review Rejected',

		region_mainflag_0: '',
		region_mainflag_1: 'Main ',
		region_type_0: 'Play Zone',
		region_type_1: 'Text Zone',
		region_type_2: 'Date Zone',
		region_type_3: 'Weather Zone',
		region_type_4: 'VideoIn Zone',
		region_type_5: 'DVB Zone',
		region_type_6: 'Stream Zone',
		region_type_7: 'Interactive Button',
		region_type_8: 'Navigate Bar',
		region_type_9: 'QR Code',
		region_type_10: 'Calendar List',
		region_type_11: 'Calendar Table',
		region_type_12: 'RSS',
		region_type_13: 'Audio',
		region_type_A1: 'Lift Maintain',
		region_type_A2: 'Lift Notice',

		play_period: 'Play Period',
		valid_period: 'Effective Period',

		operation: 'Operation',
		add: 'Add',
		edit: 'Edit',
		remove: 'Remove',
		view: 'View',
		detail: 'Detail',
		refresh: 'Refresh',
		sync: 'Sync',
		push: 'Push',
		reboot: 'Reboot',
		shutdown: 'Power-off',
		bind: 'Bind',
		unbind: 'Unbind',
		design: 'Design',
		option: 'Option',
		export: 'Export',
		review: 'Review',
		addregion: 'Add Region',
		password_reset: 'Reset Password',
		unknown: 'Unknown',
		more: 'More',
		empty: 'No data available in table',
		blank: 'Blank',

		page_add: 'Add Page',
		pagepkg_edit: 'Edit Package',
		pagepkg_remove: 'Remove Package',

		unlimited: 'Unlimited',
		downloaddata: 'Data Flow',

		ratio_1: '16:9',
		ratio_2: '9:16',
		ratio_3: '4:3',
		ratio_4: '3:4',
		ratio_5: '32:9',
		type_0: 'Private',
		type_1: 'Public',

		template_ratio_1: '1920x1080',
		template_ratio_2: '1080x1920',
		template_type_0: 'Private',
		template_type_1: 'Public',

		upgradeflag: 'Auto Upgrade Flag',
		volumeflag: 'System Volume Flag',
		volumeflag_off: 'Default',
		volumeflag_on: 'Setting',
		volume: 'System Volume',
		devicepassflag: 'Maintain Password Flag',
		devicepass: 'Maintain Password',
		backupvideo: 'Backup Video',
		powerflag: 'Power Control Flag',
		poweron: 'Power on',
		poweroff: 'Power off',
		qrcodeflag: 'QR Code Display',
		on: 'ON',
		off: 'OFF',
		
		mainboard: 'Product',
		description: 'Description',
		download: 'Download',
		
		upgradeflag: 'Upgrade Policy',
		upgradeflag_0: 'Upgrade Disabled',
		upgradeflag_1: 'Upgrade Auto',
		upgradeflag_2: 'Upgrade To',

		current_hour: 'Current Hour',
		previous_hour: 'Previous Hour',
		today: 'Today',
		yesterday: 'Yesterday',

		stat_period: 'Period',
		amount: 'Amount',

		config_serverip: 'Server IP',
		config_serverport: 'Server Port',
		config_pixedxip: 'PixedX IP',
		config_pixedxport: 'PixedX Port',
		
		hourstat: 'Hourly',
		daystat: 'Daily',
		monthstat: 'Monthly',
		periodstat: 'Period',

		male: 'Male',
		female: 'Female',
		age1: '0-6',
		age2: '7-17',
		age3: '18-40',
		age4: '41-65',
		age5: '66+',
		
		wxappid: 'Weixin AppID',
		wxsecret: 'Weixin AppSecret',
		wxvalidflag: 'Weixin Verify',
		valid: 'Valid',
		invalid: 'Invalid',
		count: 'Quantity',
		applytime: 'Apply Time',
		comment: 'Comment',
		audittime: 'Audit Time',
		
		table_ZeroRecords : 'No data available in table',
		table_Processing : '<i class="fa fa-coffee"></i>　Processing...',
		table_EmptyTable : 'No data available in table',
		table_LengthMenu : ' _MENU_ records',
		table_Info : 'Showing _START_ to _END_ of _TOTAL_ records',
		table_InfoEmpty : 'Showing 0 to 0 of 0 records',
		table_Search : 'Search:',
		table_Previous : 'Previous',
		table_Next : 'Next'
	},
	tips: {
		remove: 'Please confirm whether to delete ',
		unbind: 'Please confirm whether to unbind ',
		sync: 'Please confirm whether to sync schedules to ',
		synclayout: 'Please confirm whether to sync the layout',
		syncmediagrid: 'Please confirm whether to sync the media grid',
		config: 'Please confirm whether to push configuration to ',
		pushall: 'Please confirm whether to push configuration to all devices',
		reboot: 'Please confirm whether to reboot ',
		poweroff: 'Please confirm whether to power-off ',
		screen: 'Please confirm whether to screen shot ',
		ucancel: 'Please confirm whether to cancel emergency message',
		error: 'Operation failed! ',
		success: 'Operation successfully!',
			
		device_select: 'Please select device',
		devicegroup_select: 'Please select device group',
		detail_select: 'Please select',
		device_missed: 'Device or device group should be selected',
			
		device_schedule_zero: 'Current device has no schedules',
		devicegp_schedule_zero: 'Current device group has no schedules',
		schedule_zero: 'Blank Schedules',

		username_required: 'Username required',
		password_required: 'Password required',
		code_required: 'ORG code required',
		input_check: 'Please check the input items',
		login_failed: 'Input error, login failed',

		region_remove_failed: 'Cannot remove this region',

		folder_remove_failed: 'Cannot remove this folder',

		loginname_repeat: 'Login name conflicted',
		name_repeat: 'Name conflicted',
		code_repeat: 'Code conflicted',

		storage_full: 'Storage reaches the limit',
		org_full: 'Org devices or storage reaches the limit',

		maxorgs: 'Org count reaches the limit',

		session_timeout: 'Session timeout, please login again',
	},
};