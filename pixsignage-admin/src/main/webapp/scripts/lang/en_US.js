var common={
view:{
v00:'Current Category:',
v01:'Yes',
v02:'No',
v03:" _MENU_ Record/Page",
v04:"No data detected",
v05:"From _START_ To _END_ /Total _TOTAL_ records",
v06:"No data",
v07:"Search",
v08:"(Search from _MAX_ records)",
v09:"Prev",
v10:"Next",
},
menu:{
m00:'Action',
m01:'Edit',
m02:'Delete',
m03:'Add',
},
tips:{
t00:'Session is timeout, please login again.',
t01:'Server error',
t02:'submited data error',
t03:'Confirm',
t04:'Cancel',
t05:"Course resource is removed, please add a new one.",
t06:"Please select a leaf node.",
t07:'The size is beyond the threshold.',
t08:'Related data is detected.',
t09:'Supported type: jpg、jpeg、gif、png、bmp. Please try again.',
t10:'The name conflits with others. Please modify.',
}

};

var info={
view:{
v00:'Ongoing Live',
v01:'records',
v02:'Live',
v03:'VOD',
v04:'User',
v05:'persons',
v06:'Disk name:',
v07:'Disk size:',
v08:'used:',
v09:'available:',
v10:'A disk is failed to mount.',
},
tips:{
t00:'Warning: failed to mount disk, please check the server.',
t01:'Failed to get the disk usage',
}
};

var addInstant={
view:{
v00:'Untitled live event',
v01:'Source: ',
v02:"Destination: ",
},
tips:{
t00:'The live resource is removed, please add another one.',
t04:'The name is occupied, please rename.',
t05:"Failed to add a super live event, error message: ",
t06:"Please add a new event before submiting.",
t07:"Are you sure to delete the event?",
t08:"Only one event can be added at a time.",
}
};

var addNvrLive={
view:{
v00:"Delay Live",
v01:"Untitled Live event",
v02:'NVR: ',
v03:"Destination: ",
},
tips:{
t00:"Please select a NVR before continuing.",
t01:'The name is occupied, please rename.',
t02:"Failed to add a delay live event, error message: ",
t03:"Please add a new event before submiting.",
t04:"Only one event can be added at a time.",
t05:"Are you sure to delete the event?",
}
};

var addVod={
view:{
v00:'Add',
},
tips:{
t00:'Supported format: mp4, mpg, avi, ts. Please select again.',
t01:'The video file is uploaded successfully.',
t03:'Delete the video file successfully.',
t04:'Failed to delete the video file.',
t05:'The name is occupied, please rename.',
t06:'Failed to get the video duration. Please check the video.',
t07:"Failed to submit the VOD meta information.",
}
};
var branch={
view:{
v00:'Headquarters',
v01:'A system preserved node is unchangeable.',
},
tips:{
t00:'The department is added successfully.',
t01:'The name is occupied, please rename.',
t02:'The department is updated successfully.',
t03:'Are you sure to delete:',
t04:'The department is deleted successfully.',
t05:'Failed to delete. One or more subsidary nodes exist.',
}
};
var campusList={
tips:{
t00:'新增学校成功。',
t01:'学校名称重复，请修改名称。',
t02:'新增学校失败：',
t03:'更新学校成功。',
t04:'更新学校失败：',
t05:'获取学校信息失败：',
t06:'确认删除学校：',
t07:'删除学校成功。',
t08:'存在关联数据，删除失败。',
t09:'删除学校失败：',
}
};

var category={
tips:{
t02:'新增分类成功。',
t03:'和已经已经存在的记录冲突。',
t04:'新增失败，分类中存在视频。',
t05:'编辑分类成功。',
t06:'新增分类失败：',
t07:'分类名称重复，请修改名称。',
t08:'修改分类信息失败：',
t09:'确认删除分类：',
t10:'删除分类成功。',
t11:'不能删除系统内置分类。',
t12:'删除失败，分类存在子节点。',
t13:'删除失败，分类中存在视频。',
t14:'删除分类失败：',
}
};

var coderGroupList={
view:{
v00:"源",
v01:"接收",
v02:"源+接收",
},
menu:{
m00:'编码卡',
},
tips:{
t00:'新增设备成功。',
t01:'设备名称重复，请修改名称。',
t02:'新增设备失败：',
t03:'更新分组成功。',
t04:'更新分组失败：',
t05:'获取设备信息失败：',
t06:"存在未配置通道，请继续配置。",
t07:"编码卡重复，请重新选择。",
t08:'编辑编码卡列表成功。',
t09:'编辑编码卡列表失败：',
t10:'获取编码卡列表失败：',
t11:'确认删除分组：',
t12:'删除分组成功。',
t13:'删除分组失败：',
}
};
var coderList={
view:{
v00:'获取中',
v01:'离线',
v02:'在线',
},
menu:{
m00:'配置参数',
m01:'实时状态',
},
tips:{
t00:'新增编码单元成功。',
t01:'编码单元名称重复，请修改名称。',
t02:'新增编码单元失败：',
t03:'编码单元配置更新成功。',
t04:'编码单元RTSP配置更新，服务器出错。',
t05:'编码单元频道配置更新，服务器出错。',
t06:'编码单元媒体配置更新，服务器出错。',
t07:'更新编码单元配置失败：',
t08:'获取编码单元配置信息失败：',
t09:'编码单元更新成功。',
t10:'编码单元名称重复，请修改名称。',
t11:'编码单元更新失败：',
t12:'编码单元信息获取失败：',
t13:"编码单元在线状态：在线",
t14:"编码单元在线状态：离线",
t15:'编码单元状态查询失败：',
t16:'确认删除编码单元：',
t17:'编码单元删除成功。',
t18:'编码单元删除失败：',
t19:'获取编码单元列表时，服务器出错。',
t20:'编码单元列表获取失败：',
t21:'编码单元状态查询失败：'
}

};

var deviceCoderList={
view:{
v00:'获取中',
v01:'离线',
v02:'在线',
v03:'未初始化',
},
menu:{
m00:'配置参数',
m01:'实时状态',
m02:'初始化',
m03:'清除配置'
},
tips:{
t00:'编辑编码单元成功。',
t01:'编码单元名称重复，请修改名称。',
t02:'编辑编码单元失败：',
t03:'编码单元配置更新成功。',
t04:'编码单元RTSP配置更新，服务器出错。',
t05:'编码单元频道配置更新，服务器出错。',
t06:'编码单元媒体配置更新，服务器出错。',
t07:'更新编码单元配置失败：',
t08:'获取编码单元配置信息失败：',
t09:'编码单元更新成功。',
t10:'编码单元名称重复，请修改名称。',
t11:'编码单元更新失败：',
t12:'编码单元信息获取失败：',
t13:"编码单元在线状态：在线",
t14:"编码单元在线状态：离线",
t15:'编码单元状态查询失败：',
t16:'确认清除此槽位配置：',
t17:'清除配置成功。',
t18:'清除配置失败：',
t19:'获取编码单元列表时，服务器出错。',
t20:'编码单元列表获取失败：',
t21:'编码单元状态查询失败：'
}

};

var sysConfig={
tips:{
t00:'获取系统配置失败：',
t01:'Logo18需为png格式，高度为18px，请您重新选择。',
t02:'Logo_18上传成功。',
t04:'Logo120需为png格式，高度为120px，请您重新选择。',
t05:'Logo_120上传成功。',
t06:'编辑系统配置成功。',
t07:'和已经存在的记录冲突。',
t08:'修改系统配置失败：',
t09:'获取系统配置失败：',
}
};

var courseList={
view:{
v00:"外部",
v01:'本地',
v02:'已公开',
v03:'不公开',
v04:'分类查找',
v05:'当前分类：',
v06:'所有',
},
menu:{
m00:'大纲',
m01:'公开',
m02:'取消公开',
},
tips:{
t01:'请填写课程名称。',
t02:'请选课程所属分类。',
t03:'新增课程成功。',
t04:'名称重复，请修改。',
t05:'账户名称已存在。',
t06:'确认取消公开课程：',
t07:'取消公开课程成功。',
t08:'取消公开课程失败：',
t09:'确认公开课程：',
t10:'公开课程成功。',
t11:'不存在上级节点，无法公开。',
t12:'公开课程失败：',
t13:'编辑课程成功。',
t14:'编辑课程失败。',
t15:'确认删除课程：',
t16:'删除课程成功。',
t17:'删除课程失败：',
t18:'请叶子节点或者根节点。'
}
};

var courseOutline={
view:{
v00:'章',
v01:'节',
v02:'单元',
v03:['将VOD转码/切片为系统支持的格式','对视频信号进行转码录制','对RTSP视频信号进行直接录制','输出RTSP','远程同步','Meta信息远程同步','有线电视直播调度'],
v04:['等待处理','分发失败','处理中','处理成功','处理失败'],
v05:'等待处理',
v06:'分发失败',
v07:'处理中',
v08:'处理成功',
v09:'处理失败',
},
menu:{
m00:'新增',
m01:'从列表选择',
m02:'单元详情',
m03:'隐藏详情',

},
tips:{
t00:'加载大纲失败：',
t01:'修改名称失败：',
t02:'添加章失败：',
t03:'添加节失败：',
t04:'添加单元失败：',
t05:'新增直播课件',
t06:'新增视频课件',
t07:'添加节失败：',
t08:'本单元没有包含课件。',
t09:'获取单元详情失败：',
t10:'直播事件未开始。',
t11:'此直播事件已经被删除。',
t12:'查询直播事件详细状态失败：',
t13:'重发指令成功。',
t14:'异常。',
t15:'此状态无法执行重试操作。',
t16:'重发指令失败。',
t17:'服务器错误：',
t18:'没有接收设备。',
t19:'获取接收设备列表失败。',
t20:'确认停止直播事件：',
t21:'停止直播事件成功。',
t22:'此直播事件不满足停止条件。',
t23:'停止直播事件失败：',
t24:'确认删除课件：',
t25:'删除课件成功。',
t26:'删除课件失败：'
}

};
var deviceList={
menu:{
m00:'编码卡',
},
tips:{
t00:'新增设备成功。',
t01:'设备名称重复，请修改名称。',
t02:'新增设备失败：',
t03:'更新设备成功。',
t04:'更新设备失败：',
t05:'获取设备信息失败：',
t06:'确认删除设备：',
t07:'删除设备成功。',
t08:'删除设备失败：',
}
};
var liveList={
view:{
v00:['对VOD进行转码/切片，生成HLS','对Cloud域进行直播或录制，生成HLS','对Instant域进行录制，生成HLS','输出RTSP','远程同步','Meta信息远程同步','配置直播','延播生成RTSP','直播源检测'],
v01:['等待处理','分发失败','处理中','处理成功','处理失败'],
v02:'等待处理',
v03:'分发失败',
v04:'处理中',
v05:'处理成功',
v06:'处理失败',
v07:'超级直播',
v08:'轮播频道',
v09:'直播事件',
v10:'延播事件',
v11:'本地',
v12:'外部',
v13:'直播中',
v14:'结束',
v15:'正常',
v16:'异常',
v17:'直播课件',
v18:'直播间',
v19:'不支持直播',
},
menu:{
m00:'直播源状态',
m01:'接收设备状态',
m02:'直播任务状态',
m03:'预览',
m04:'停止',
m05:'编辑接收解码器',
},
tips:{
t00:'直播事件未开始。',
t01:'此直播事件已经被删除。',
t02:'查询直播事件详细状态失败：',
t03:'直播源状态：流服务正常。',
t04:'直播源状态：流服务中断。',
t05:'直播源状态：连接失败。',
t06:'直播源状态：stream id任务不存在。',
t07:'直播源状态：未知。',
t08:'查询直播源状态失败：',
t09:'重发指令成功。',
t10:'此状态无法执行重试操作。',
t11:'重发指令失败。',
t12:'服务器错误：',
t13:'没有接收设备。',
t14:'获取接收设备列表失败。',
t15:'编辑直播事件成功。',
t16:'直播名称重复，请修改名称。',
t17:'编辑接收解码器成功。',
t18:'确认停止直播事件：',
t19:'停止直播事件成功。',
t20:'此直播事件不满足停止条件。',
t21:'停止直播事件失败：',
t22:'确认删除直播事件：',
t23:'删除直播事件成功。',
t24:'删除直播事件失败：',
t25:'课程单元中已经存在此直播，请重新选择。',
t26:'选择直播事件失败：',
t27:'课程单元中已经存在此直播，请重新选择。',
t28:'选择直播事件失败：',
}

};

var liveRoom={
menu:{
m00:'新增',
m01:'从列表选择',
m02:'直播明细',
m03:'直播事件',
},
tips:{
t00:'请填写直播间名称。',
t01:'新增直播间成功。',
t02:'名称重复，请修改。',
t03:'账户名称已存在。',
t04:'新增直播课件',
t05:'新增视频课件',
t06:'编辑直播间成功。',
t07:'编辑直播间失败。',
t08:'确认删除直播间：',
t09:'删除直播间成功。',
t10:'删除直播间失败：',
}
};

var liveSource={
view:{
v00:'Outer 102',
v01:'Inner RTSP',
},
tips:{
t00:'Add the live source successfully.',
t01:'The name is occupied, please rename.',
t02:'Failed to add the live source.',
t03:'Update the live source successfully.',
t04:'Failed to update live source.',
t05:'Failed to get the live source: ',
t06:'Are you sure to delete: ',
t07:'Delete the live source successfully.',
t08:'Failed to delete the live source: ',
}
};

var nodeList={
view:{
v00:'上级节点',
v01:'下级节点',
},
tips:{
t00:'新增角色成功。',
t01:'上级节点已经存在。只能配置一个上级节点。',
t02:'编辑节点成功。',
t03:'确认删除节点：',
t04:'删除节点成功。',
t05:'删除节点失败：',
}

};

var person={
menu:{
m00:'修改密码',
},
tips:{
t00:"两次密码输入不一致，请重新输入",
t01:"名称只能为字母和数字的组合，且不能为空，请重新输入。",
t02:"email地址非法，请重新输入。",
t03:'请选择员工所属部门。',
t04:'新增员工成功。',
t05:'账户名称已存在。',
t06:'人员姓名已存在。',
t07:'邮箱地址已存在。',
t08:'编辑员工成功。',
t09:'修改密码成功。',
t10:'确认删除账号：',
t11:'删除账号成功。',
t12:'删除账号失败：',
}
};

var publicCourse={
view:{
v00:'已订',
v01:'未订',
},
menu:{
m00:'订阅',
m01:'取消订阅',
},
tips:{
t00:'确认订阅课程：',
t01:'订阅课程成功。',
t02:'订阅课程失败：',
t03:'确认取消订阅课程：',
t04:'取消订阅课程成功。',
t05:'取消订阅课程失败：',
}
};

var sysRole={
tips:{
t00:'新增角色成功。',
t01:'编辑角色成功。',
t02:'确认删除角色：',
t03:'删除角色成功。',
t04:'删除角色失败：',
}
};

var vchannelList={
view:{
v00:'等待调度',
v01:'调度成功',
v02:'调度失败'
},
menu:{
m00:'关联编码器',
m01:'重发配置'
},
tips:{
t00:'关联接收解码器成功。',
t01:'向解码器重发配置成功。',
t02:'此记录不符合重发配置条件。',
t03:'服务器异常。'
}
};

var vodList={
view:{
v00:'添加',
v01:'录制列表',
v02:'当前分类：',
v03:'所有',
v04:'上传视频/等待处理',
v05:'上传视频/转码中',
v06:'上传视频/转码失败',
v07:'上传视频/转码完成',
v08:'转码录制/录制异常',
v09:'转码录制/录制成功',
v10:'原码录制/录制异常',
v11:'原码录制/录制成功',
v12:"外部资源/未获取",
v13:"外部资源/获取中",
v14:"外部资源/已获取",
v15:"外部资源/获取失败",
v16:"分类查找"
},
tips:{
t00:'更新视频信息成功',
t01:'修改视频信息失败',
t02:'确认删除视频：',
t03:'删除视频成功。',
t04:'删除视频失败：',
t05:'请选择叶子节点或者根节点。',
t06:'课程单元中已经存在此视频，请重新选择。',
t07:'选择视频失败：',
t08:'直播间中已经存在此视频，请重新选择。',
}
};