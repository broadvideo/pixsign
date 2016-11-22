var common = {
	view: {
		id: '编号',
		name: '名称',
		type: '类型',
		code: '编码',
		value: '值',
		status: '状态',
		
		device: '终端',
		devicegroup: '终端组',
		medialist: '媒体列表',
		video: '视频',
		intvideo: '视频',
		extvideo: '引入视频',
		image: '图片',
		text: '文本',
		stream: '视频流',
		dvb: '数字频道',
		layout: '布局',

		subbundle: '子节目',
		schedule: '计划',
		layoutschedule: '布局计划',
		regionschedule: '播出计划',
		bundleschedule: '节目计划',
		sequence: '序号',
		terminalid: '终端ID',
		hardkey: '硬件码',
		position: '位置',
		map: '地图',
		city: '城市',
		addr: '地址',
		onlineflag: '在线',
		config: '配置',
		control: '控制',
		screen: '截屏',
		progress: '进度',
		file: '文件',
		filename: '文件名',
		size: '大小',
		url: '链接',
		frequence: '频点',
		channelnumber: '频道号',
		ratio: '宽高比',
		loginname: '登录名',
		branch: '分支机构',
		versionname: '版本名称',
		versioncode: '版本号',
		expiretime: '过期时间',
		maxdevices: '终端上限',
		currentdevices: '注册终端',
		maxstorage: '存储上限',
		currentstorage: '已用存储',
		createtime: '创建时间',
		updatetime: '更新时间',
		uploadtime: '上载时间',
		refreshtime: '最新访问',
		activetime: '激活时间',
		playtime: '播放时间',
		screentime: '截屏时间',
		starttime: '开始时间',
		endtime: '结束时间',
		onlinetime: '上线时间',
		offlinetime: '离线时间',
		onlineduration: '在线时长',
		duration: '时长',

		unregister: '未注册',
		online: '在线',
		offline: '离线',
		active: '激活',
		inactive: '未激活',
		idle: '空闲',
		once: '单次',
		daily: '每日',
		
		review_wait: '等待审核',
		review_passed: '审核通过',
		review_rejected: '审核未过',
		
		region_mainflag_0: '',
		region_mainflag_1: '主',
		region_type_0: '播放区',
		region_type_1: '文本区',
		region_type_2: '时间区',
		region_type_3: '天气区',
		region_type_4: 'VideoIn',
		region_type_5: 'DVB',
		region_type_6: '视频流',
		region_type_7: '互动键',
		region_type_8: '导航条',
		region_type_9: '二维码',
		region_type_A1: '电梯维保',
		region_type_A2: '电梯须知',

		operation: '操作',
		add: '新增',
		edit: '编辑',
		remove: '删除',
		view: '查看',
		detail: '明细',
		refresh: '刷新',
		sync: '同步',
		push: '推送',
		reboot: '重启',
		bind: '绑定',
		unbind: '解绑',
		design: '设计',
		option: '选项',
		export: '导出',
		review: '审核',
		addregion: '新增区域',
		password_reset: '重置密码',
		unknown: '未知',
		more: '更多',
		empty: '列表为空',
		
		page_add: '新增页面',
		pagepkg_edit: '编辑包',
		pagepkg_remove: '删除包',

		unlimited: '无限制',
		downloaddata: '流量',

		ratio_1: '横屏16:9',
		ratio_2: '竖屏9:16',
		ratio_3: '横屏4:3',
		ratio_4: '竖屏3:4',
		ratio_5: '条形屏32:9',
		type_0: '内部布局',
		type_1: '公共布局',

		template_ratio_1: '1920x1080',
		template_ratio_2: '1080x1920',
		template_type_0: '内部模板',
		template_type_1: '公共模板',

		devicepassflag: '终端密码开关',
		devicepass: '终端密码',
		backupvideo: '默认垫片',
		powerflag: '自动开关机',
		poweron: '开机时间',
		poweroff: '关机时间',
		qrcodeflag: '二维码显示',
		on: '打开',
		off: '关闭',
		
		mainboard: '主板型号',
		description: '描述',
		download: '下载地址',
		
		current_hour: '当前小时',
		previous_hour: '上一小时',
		today: '今日',
		yesterday: '昨日',
		
		wxappid: '微信AppID',
		wxsecret: '微信AppSecret',
		wxvalidflag: '微信校验',
		valid: '有效',
		invalid: '无效',
		count: '数量',
		applytime: '申请时间',
		comment: '备注',
		audittime: '审核时间',
		
		table_ZeroRecords : '没有匹配的数据',
		table_Processing : '<i class="fa fa-coffee"></i>　获取数据中...',
		table_EmptyTable : '没有匹配的数据',
		table_LengthMenu : '每页 _MENU_ 记录',
		table_Info : '从 _START_ 到 _END_ (共 _TOTAL_ 条数据)',
		table_InfoEmpty : '从 0 到 0 (共 0 条数据)',
		table_Search : '搜索:',
		table_Previous : '前一页',
		table_Next : '后一页'
	},
	tips: {
		remove: '请确认是否删除 ',
		unbind: '请确认是否解绑 ',
		sync: '是否同步播放计划至 ',
		synclayout: '是否同步此布局至相关联的终端和终端组',
		config: '是否重新推送配置至 ',
		pushall: '是否推送配置至所有终端 ',
		reboot: '是否重启 ',
		screen: '是否截屏 ',
		ucancel: '是否取消紧急消息',
		error: '操作失败  ',
		success: '操作成功',
		
		device_select: '请选择终端',
		devicegroup_select: '请选择终端组',
		detail_select: '请选择对应内容',
		device_missed: '需要选择终端或者终端组',
		
		device_layoutschedule_zero: '当前终端没有布局计划，请新增计划',
		device_bundleschedule_zero: '当前终端没有节目包计划，请新增计划',
		devicegp_layoutschedule_zero: '当前终端组没有布局计划，请新增计划',
		devicegp_bundleschedule_zero: '当前终端组没有节目包计划，请新增计划',
		regionschedule_zero: '当前区域没有播放计划，请新增计划',
		
		username_required: '必须输入用户名',
		password_required: '必须输入密码',
		code_required: '必须输入企业编码',
		input_check: '请检查输入项',
		login_failed: '信息输入有误，登陆失败',

		region_remove_failed: '无法删除这个区域',

		folder_remove_failed: '无法删除这个文件夹',

		loginname_repeat: '登录名已存在',
		name_repeat: '名称已存在',
		code_repeat: '编码已存在',

		storage_full: '存储已达上限，无法上传文件',
		org_full: '企业终端或存储已达上限，无法创建',

		maxorgs: '企业数量已达上限',
	},
};
