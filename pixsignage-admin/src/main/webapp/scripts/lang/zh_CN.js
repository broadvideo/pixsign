var common = {
	view: {
		id: '编号',
		name: '名称',
		type: '类型',
		code: '编码',
		value: '值',
		
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

		schedule: '计划',
		layoutschedule: '布局计划',
		regionschedule: '播出计划',
		bundleschedule: '节目包计划',
		sequence: '序号',
		terminalid: '终端ID',
		hardkey: '硬件码',
		position: '位置',
		city: '城市',
		addr: '地址',
		onlineflag: '在线',
		config: '配置',
		control: '控制',
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

		unregister: '未注册',
		online: '在线',
		offline: '离线',
		idle: '空闲',
		once: '单次',
		daily: '每日',

		operation: '操作',
		add: '新增',
		edit: '编辑',
		remove: '删除',
		detail: '明细',
		sync: '同步',
		push: '推送',
		reboot: '重启',
		unbind: '解绑',
		design: '设计',
		option: '选项',
		addregion: '新增区域',
		password_reset: '重置密码',
		unknown: '未知',
		more: '更多',
		empty: '列表为空',

		unlimited: '无限制',
		downloaddata: '流量',

		ratio_1: '横屏16:9',
		ratio_2: '竖屏9:16',
		ratio_3: '横屏4:3',
		ratio_4: '竖屏3:4',
		type_0: '内部布局',
		type_1: '公共布局',

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
		reboot: '是否重启',
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

		loginname_repeat: '登录名已存在',
		name_repeat: '名称已存在',
		code_repeat: '编码已存在',

		storage_full: '存储已达上限，无法上传文件',

		maxorgs: '企业数量已达上限',
	},
};
