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
		devicegrid: '终端格',
		devicegridgroup: '终端格组',
		medialist: '媒体列表',
		video: '视频',
		intvideo: '视频',
		extvideo: '引入视频',
		image: '图片',
		audio: '音频',
		text: '文本',
		stream: '视频流',
		dvb: '数字频道',
		layout: '布局',
		solovideo: '单屏视频',
		soloimage: '单屏图片',
		solopage: '单屏页面',
		touchpage: '互动页面',
		mediagrid: '联屏媒体',
		playlist: '播放列表',

		bundle: '单屏节目',
		touchbundle: '互动节目',
		subbundle: '子节目',
		subtemplet: '子模板',
		subpage: '子页面',
		subtemplate: '子模板',
		schedule: '计划',
		layoutschedule: '布局计划',
		regionschedule: '播出计划',
		bundleschedule: '节目计划',
		multiplan: '联屏计划',
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
		screen: '终端截屏',
		screenview: '查看截屏',
		fileview: '查看文件',
		syncplan: '同步计划',
		syncconfig: '推送配置',
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
		mtype: '型号',
		appname: '软件名',
		latest: '最新',
		expiretime: '过期时间',
		maxdevices: '终端上限',
		currentdevices: '注册终端',
		storage: '存储',
		storageused: '已用存储',
		storageavail: '剩余存储',
		maxstorage: '存储上限',
		currentstorage: '已用存储',
		temperature: '温度',
		downloadspeed: '下载速率',
		downloadbytes: '下载大小',
		networkmode: '网络模式',
		networkmode_0: '未知',
		networkmode_1: 'WIFI',
		networkmode_2: '有线网',
		networkmode_3: '移动网络',
		networksignal: '网络信号',
		brightness: '亮度',
		boardinfo: '硬件信息',
		createtime: '创建时间',
		updatetime: '更新时间',
		uploadtime: '上载时间',
		refreshtime: '最新在线',
		activetime: '激活时间',
		playtime: '播放时间',
		screentime: '截屏时间',
		starttime: '开始时间',
		endtime: '结束时间',
		onlinetime: '上线时间',
		offlinetime: '离线时间',
		onlineduration: '在线时长',
		duration: '时长',
		maxtimes: '次数',

		unregister: '未注册',
		online: '在线',
		offline: '离线',
		active: '激活',
		inactive: '未激活',
		idle: '空闲',
		once: '单次',
		daily: '每日',
		status_0: '待处理',
		status_1: '有效',
		
		review_wait: '等待审核',
		review_passed: '审核通过',
		review_rejected: '审核未过',
		
		region_mainflag_0: '',
		region_mainflag_1: '主',
		region_type_0: '广告位',
		region_type_1: '播放',
		region_type_2: 'Widget',
		region_type_3: '文本',
		region_type_4: '滚动',
		region_type_5: '时间',
		region_type_6: '天气',
		region_type_7: '按键',
		region_type_8: '导航条',
		region_type_9: '控制',
		region_type_10: '菜单条',
		region_type_12: 'RSS',
		region_type_13: '音频',
		region_type_14: '视频流',
		region_type_15: 'VideoIn',
		region_type_16: 'DVB',
		region_type_17: 'Page',
		region_type_101: '按摩椅二维码',
		region_type_102: '按摩椅控制',
		region_type_103: 'Cloudia',

		pagezone_type_1: '视频',
		pagezone_type_2: '图片',
		pagezone_type_3: '文本',
		pagezone_type_4: '滚动',
		pagezone_type_5: '时间',
		pagezone_type_6: '网页',
		pagezone_type_7: '按键',
		pagezone_type_11: '今日课表',
		pagezone_type_12: '本周课表',
		pagezone_type_13: '考勤签到',
		pagezone_type_14: '家校互动',
		pagezone_type_15: '考试通告',
		pagezone_type_16: '个人信息',
		pagezone_type_21: '互动',
		pagezone_type_31: '会议',
		pagezone_type_41: '地产',
		
		bundle_touchtype_0: '返回',
		bundle_touchtype_1: '跳转首页',
		bundle_touchtype_2: '跳转子页',
		bundle_touchtype_3: '播放视频',
		bundle_touchtype_4: '播放图片',
		bundle_touchtype_5: '播放网页',
		bundle_touchtype_6: '跳转APK',
		bundle_touchtype_9: '屏蔽',

		touchtype_0: '返回',
		touchtype_1: '首页',
		touchtype_2: '子页跳转',
		touchtype_3: '本页切换',
		touchtype_9: '屏蔽',

		play_period: '播放时间段',
		valid_period: '生效期',

		privilege: '权限',
		operation: '操作',
		add: '新增',
		edit: '编辑',
		remove: '删除',
		view: '查看',
		detail: '明细',
		copy: '复制',
		refresh: '刷新',
		sync: '同步',
		push: '推送',
		reboot: '重启',
		shutdown: '关机',
		bind: '绑定',
		unbind: '解绑',
		design: '设计',
		option: '选项',
		export: '导出',
		review: '审核',
		send: '发送',
		save_template: '存为模板',
		addregion: '新增区域',
		password_reset: '重置密码',
		unknown: '未知',
		more: '更多',
		empty: '列表为空',
		blank: '空白',
		
		page_add: '新增页面',
		pagepkg_edit: '编辑包',
		pagepkg_remove: '删除包',

		unlimited: '无限制',
		downloaddata: '流量',

		ratio_1: '横屏16:9',
		ratio_2: '竖屏9:16',
		ratio_3: '横屏4:3',
		ratio_4: '竖屏3:4',
		ratio_5: '条形屏16:3',
		ratio_5: '条形屏3:16',
		type_0: '内部布局',
		type_1: '公共布局',

		template_type_0: '内部模板',
		template_type_1: '公共模板',

		plan_priority_0: '普通',
		plan_priority_1: '插播',

		upgradeflag: '自动升级开关',
		volumeflag: '系统音量开关',
		volumeflag_off: '默认音量',
		volumeflag_on: '设置音量',
		volume: '音量',
		devicepassflag: '终端密码开关',
		devicepass: '终端密码',
		backupvideo: '默认垫片',
		defaultpage: '默认页面',
		powerflag: '自动开关机',
		poweron: '开机时间',
		poweroff: '关机时间',
		qrcodeflag: '二维码显示',
		on: '打开',
		off: '关闭',
		
		mainboard: '主板型号',
		description: '描述',
		download: '下载',
		
		upgradeflag: '升级策略',
		upgradeflag_0: '不升级',
		upgradeflag_1: '自动升级',
		upgradeflag_2: '指定版本',

		current_hour: '当前小时',
		previous_hour: '上一小时',
		today: '今日',
		yesterday: '昨日',
		
		stat_period: '统计周期',
		amount: '总次数',
		dcount: '终端数',

		config_serverip: '本服务器地址',
		config_serverport: '本服务器端口',
		config_cdnserver: 'CDN服务器',
		config_pixedxip: 'PixedX服务器地址',
		config_pixedxport: 'PixedX服务器端口',
		
		hourstat: '每小时',
		daystat: '每日',
		monthstat: '每月',
		periodstat: '时间段',
		fulltime: '全天',

		persons: '总人数',
		male: '男性',
		female: '女性',
		age1: '0-6岁',
		age2: '7-17岁',
		age3: '18-40岁',
		age4: '41-65岁',
		age5: '66岁以上',
		look1: '正常',
		look2: '微笑',
		
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
		resetpassword: '密码将被重置成与登陆名一致，请确认 ',
		unbind: '请确认是否解绑 ',
		sync: '是否同步播放计划至 ',
		synclayout: '是否同步至相关联的终端和终端组',
		syncmediagrid: '是否同步此联屏媒体至相关联的终端',
		syncmedialist: '是否同步此媒体列表至相关联的终端',
		savetemplate: '是否把此页面存为模板',
		config: '是否重新推送配置至 ',
		pushall: '是否推送配置至所有终端 ',
		reboot: '是否重启 ',
		poweroff: '是否关机',
		screen: '是否截屏 ',
		ucancel: '是否取消紧急消息',
		error: '操作失败  ',
		success: '操作成功',
		
		device_select: '请选择终端',
		devicegroup_select: '请选择终端组',
		detail_select: '请选择对应内容',
		device_missed: '需要选择终端或者终端组',
		
		device_schedule_zero: '当前终端没有播出计划，请新增',
		devicegp_schedule_zero: '当前终端组没有播出计划，请新增',
		schedule_zero: '播出计划空白',
		date_error: '非法的开始日期与结束日期',
		plandtl_zero: '请选择节目',
		planbind_zero: '请选择终端',
		bundle_zero: '请选择节目',
		page_zero: '请选择节目',
		bind_zero: '请选择终端',
		
		loginname_repeat: '用户名重复',
		username_required: '必须输入用户名',
		password_required: '必须输入密码',
		code_required: '必须输入企业编码',
		browser_check: '请使用Chrome/Firefox/Safari浏览器',
		input_check: '请检查输入项',
		login_failed: '信息输入有误，登陆失败',
		register_failed: '信息输入有误，注册失败',
		getvcode_failed: '短信发送失败',

		mainzone_missed: '请把一个区域设置为主区域',
		region_remove_failed: '无法删除这个区域',

		folder_remove_failed: '无法删除这个文件夹',

		name_repeat: '名称已存在',
		code_repeat: '编码已存在',
		username_repeat: '登录名已存在',
		phone_repeat: '手机号已存在',

		storage_full: '存储已达上限，无法上传文件',
		org_full: '企业终端或存储已达上限，无法创建',

		maxorgs: '企业数量已达上限',
		
		session_timeout: '登录已失效，请重新登录',
	},
	bundleanimation: {
		none: '无',
		random: '随机',
		fadeIn: '淡入',
		slideInLeft: '向左平移',
		slideInRight: '向右平移',
		slideInUp: '向上平移',
		slideInDown: '向下平移',
		zoomIn: '放大进入',
		rotateIn: '顺时针旋入',
		rotateInUpLeft: '从左向上旋入',
		flipInX: '水平翻转进入',
		rollIn: '翻滚',
	},
	animation: {
		none: '无',
		pulse: '脉冲',
		flash: '闪烁',
		shake: '震动',
		jackInTheBox: '弹出',
		rubberBand: '变形',
		bounce: '反弹',
		swing: '摆动',
		wobble: '晃动 ',
		jello: '扭动',
		bounceIn: '弹跳进入',
		bounceInDown: '顶部弹入',
		bounceInLeft: '左侧弹入',
		bounceInRight: '右侧弹入 ',
		bounceInUp: '底部弹入',
		bounceOut: '弹跳退出',
		bounceOutDown: '底部弹出',
		bounceOutLeft: '左侧弹出',
		bounceOutRight: '右侧弹出',
		bounceOutUp: '顶部弹出',
		fadeIn: '渐入式显示',
		fadeInDown: '顶部渐进滑入',
		fadeInUp: '底部渐进滑入',
		fadeInLeft: '左侧渐进滑入',
		fadeInRight: '右侧渐进滑入',
		fadeOut: '渐进淡出',
		fadeOutDown: '底部渐进淡出',
		fadeOutLeft: '左侧渐进淡出',
		fadeOutRight: '右侧渐进淡出',
		fadeOutUp: '顶部渐进淡出',
		flip: '翻转',
		flipOutY: '翻转消失',
		rollIn: '旋转滑入',
		rotateIn: '旋转',
		zoomInDown: '放大',
		slideInLeft: '左侧平移',
		slideInRight: '右侧平移',
		slideInDown: '向下平移',
	},
	effect: {
		slide: '平移',
		fade: '淡出',
		cube: '立体',
		flip: '翻转',
	},
};