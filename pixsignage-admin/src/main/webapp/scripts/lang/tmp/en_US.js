var common={
view:{
v00:'Current Category:',
v01:'Yes',
v02:'No',
v03:" _MENU_ Record/Page",
v04:"No data detected",
v05:"From _START_ To _END_ / Total _TOTAL_ records",
v06:"No data",
v07:"Search",
v08:"(Search from _MAX_ records)",
v09:"Prev",
v10:"Next",
v11:"Server Time: "
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
t10:'The name is occupied, please rename.',
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
t05:"Failed to add a super live event, error message: ",
t06:"Please add a new event before submiting.",
t07:"Are you sure to delete the event?",
t08:"Only one event can be added at a time.",
}
};

var addNvrLive={
view:{
v00:"Delay Live",
v01:"Untitled Live Event",
v02:'NVR: ',
v03:"Destination: ",
},
tips:{
t00:"Please select a NVR before continuing.",
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
t06:'Failed to get the video duration. Please check the video.',
t07:"Failed to submit the VOD meta information.",
}
};
var branch={
view:{
v01:'A system preserved node is unchangeable.',
},
tips:{
t00:'The department is added successfully.',
t02:'The department is updated successfully.',
t03:'Are you sure to delete:',
t04:'The department is deleted successfully.',
t05:'Failed to delete. One or more subsidary nodes exist.',
}
};
var campusList={
tips:{
t00:'The campus is added successfully.',
t02:'Failed to add the campus: ',
t03:'The campus is updated successfully.',
t04:'Failed to update the campus: ',
t05:'Failed to get the campus information: ',
t06:'Are you sure to delete: ',
t07:'The campus is deleted successfully.',
t08:'Failed to delete. Some subsidary data exists.',
t09:'Failed to delete: ',
}
};

var category={
tips:{
t02:'The category is added successfully.',
t04:'Failed to add a category. One or more VODs exist in the father category.',
t05:'The category is updated successfully.',
t06:'Failed to add the category: ',
t08:'Failed to update the category information: ',
t09:'Are you sure to delete:',
t10:'The category is deleted successfully.',
t11:'A system preserved category can not be deleted.',
t12:'Failed to delete. One or more sub-nodes exist.',
t13:'Failed to delete. One or more VODs exist in the category.',
t14:'Failed to delete: ',
t15:'Just can move in the same parent category.',
t16:"Most two levels can be added.",
}
};

var coderGroupList={
view:{
v00:"Source",
v01:"Receiver",
v02:"Source+Receiver",
},
menu:{
m00:'Encoders',
},
tips:{
t00:'The device is added successfully.',
t02:'Failed to add a new device: ',
t03:'The device is updated successfully.',
t04:'Failed to update the device.',
t05:'Failed to get the device information: ',
t06:"Some slots are unconfigured. Please continue.",
t07:"An encoder can not be selected repeatedly. Please select again.",
t08:'The encoder list is updated successfully.',
t09:'Failed to update the encoder list:',
t10:'Failed to get the encoder list: ',
t11:'Are you sure to delete:',
t12:'The device is deleted successfully.',
t13:'Failed to delete the device: ',
}
};
var coderList={
view:{
v00:'Fetching',
v01:'Offline',
v02:'Online',
},
menu:{
m00:'Settings',
m01:'Real-time Status',
},
tips:{
t00:'The encoder is added successfully.',
t02:'Failed to add a new encoder: ',
t03:'The encoder settings are updated successfully.',
t04:'Failed to modify the encoder RTSP settings.',
t05:'Failed to modify the encoder channel settings.',
t06:'Failed to modify the encoder media settings.',
t07:'Failed to update the encoder settings: ',
t08:'Failed to fetch the encoder settings: ',
t09:'The encoder is updated successfully.',
t11:'Failed to update the encoder:',
t12:'Failed to fetch the encoder information: ',
t13:"The encoder online status: Online",
t14:"The encoder online status: Offline",
t15:'Failed to fetch the encoder status: ',
t16:'Are you sure to delete: ',
t17:'The encoder is deleted successfully.',
t18:'Failed to delete the encoder: ',
t19:'Failed to fetch the encoder list.',
t20:'Failed to fetch the encoder list: ',
t21:'Failed to fetch the encoder status: '
}
};

var deviceCoderList={
view:{
v00:'Fetching',
v01:'Offline',
v02:'Online',
v03:'Uninitialized',
},
menu:{
m00:'Settings',
m01:'Real-time Status',
m02:'Initialize',
m03:'Clear Slot'
},
tips:{
t00:'The encoder is updated successfully.',
t02:'Failed to update the encoder.',
t03:'The encoder settings are updated successfully.',
t04:'Failed to modify the encoder RTSP settings.',
t05:'Failed to modify the encoder channel settings.',
t06:'Failed to modify the encoder media settings.',
t07:'Failed to update the encoder settings: ',
t08:'Failed to fetch the encoder settings: ',
t09:'The encoder is updated successfully.',
t11:'Failed to update the encoder:',
t12:'Failed to fetch the encoder information: ',
t13:"The encoder online status: Online",
t14:"The encoder online status: Offline",
t15:'Failed to fetch the encoder status: ',
t16:'Are you sure to delete: ',
t17:'the slot setting is cleared successfully.',
t18:'Failed to clear the slot: ',
t19:'Failed to fetch the encoder list.',
t20:'Failed to fetch the encoder list: ',
t21:'Failed to fetch the encoder status: '
}
};

var sysConfig={
tips:{
t00:'Failed to get the system configuration: ',
t01:'Logo_18 is a png format needed, and 18 px in height. Please select again.',
t02:'Logo_18 is uploaded successfully.',
t04:'Logo_120 is a png format needed, and 120 px in height. Please select again.',
t05:'Logo_120 is uploaded successfully.',
t06:'The system configuration is updated successfully.',
t07:'Conflits with other records.',
t08:'Failed to update the system configuration: ',
t09:'Failed to get the system configuration: ',
t10:'The reboot command is sent to the server successfully.',
t11:'The reboot command is failed to execute.',
t12:'Failed to reboot the server: ',
t13:'Are you sure to reboot the server?'
}
};

var courseList={
view:{
v00:"External",
v01:'Local',
v02:'Public',
v03:'Unpublic',
v04:'Course Category',
v05:' Current Category: ',
v06:' All',
},
menu:{
m00:'Outline',
m01:'Public',
m02:'Unpublic',
},
tips:{
t01:'Please fill in the course name.',
t02:'Please pick up a category for the course.',
t03:'The course is added successfully.',
t04:'Invalid operation. A category is needed.',
t05:'Course duration is needed.',
t06:'Are you sure to make the course unpulic:',
t07:'The course is made unpublic successfully.',
t08:'Failed to make the course unpublic: ',
t09:'Are you sure to make the course public: ',
t10:'The course is made public successfully.',
t11:'The higher level node does not exist, the course can not be made public.',
t12:'Failed to make the coure public: ',
t13:'The course is updated successfully.',
t14:'Failed to update the course.',
t15:'Are you sure to delete the course: ',
t16:'The course is deleted successfully.',
t17:'Failed to delete the course: ',
t18:'Please select a leaft node or the root node.'
}
};

var courseOutline={
view:{
v00:'Chapter',
v01:'Section',
v02:'Unit',
v03:['Trancode/slice the VOD to HLS','Trancode and record the live stream to HLS','Record the RTSP stream directly','Output RTSP','Remote SYNC','Meta Remote SYNC','Dispatch Cable TV', 'Create RTSP for Delay Live', 'Live Source Check'],
v04:['Wait to handle','Failed to distribute','Handling','Finished','Failed'],
v05:'Wait to handle',
v06:'Failed to distribute',
v07:'Handling',
v08:'Finished',
v09:'Failed',
},
menu:{
m00:'Add',
m01:'Select form List',
m02:'Unit details',
m03:'Hide details',
},
tips:{
t00:'Failed to fetch the outline: ',
t01:'Failed to rename: ',
t02:'Failed to add a chapter: ',
t03:'Failed to add a section: ',
t04:'Failed to add a unit: ',
t05:'Add a live courseware',
t06:'Add a VOD courseware',
t07:'Failed to add a section: ',
t08:'No courseware is included in this unit.',
t09:'Failed to fetch the unit details.',
t10:'The live event does not start.',
t11:'The live event is already deleted.',
t12:'Failed to fetch the live event detailed status: ',
t13:'Resend the instructions successsfully.',
t14:'Abnormal',
t15:'Retry operation cannot be performed in this status.',
t16:'Failed to resend the instructions.',
t17:'Server error: ',
t18:'No receivers.',
t19:'Failed to get receivers.',
t20:'Are you sure to stop the live event: ',
t21:'The live event is stoped successfully.',
t22:'The live event cannot be stoped in this status.',
t23:'Failed to stop the live event: ',
t24:'Are you sure to delete the courseware: ',
t25:'The courseware is deleted successfully.',
t26:'Failed to delete the courseware: ',
}
};
var deviceList={
menu:{
m00:'Encoders',
},
tips:{
t00:'The device is added successfully.',
t02:'Failed to add a new device: ',
t03:'The device is updated successfully.',
t04:'Failed to update the device: ',
t05:'Failed to fetch the device inforation: ',
t06:'Are you sure to delete the device:',
t07:'The device is deleted successfully.',
t08:'Failed to delete the device: ',
}
};
var liveList={
view:{
v00:['Trancode/slice the VOD to HLS','Trancode and record the live stream to HLS','Record the RTSP stream directly','Output RTSP','Remote SYNC','Meta Remote SYNC','Dispatch Cable TV', 'Create RTSP for Delay Live', 'Live Source Check'],
v01:['Wait to handle','Failed to distribute','Handling','Finished','Failed'],
v02:'Wait to handle',
v03:'Failed to distribute',
v04:'Handling',
v05:'Finished',
v06:'Failed',
v07:'Super Live Event',
v08:'Carousel Channel',
v09:'Live Event',
v10:'Delay Live Event',
v11:'Local',
v12:'External',
v13:'Ongoing',
v14:'Finish',
v15:'Normal',
v16:'Abnormal',
v17:'Live Courseware',
v18:'Live Room',
v19:'Live not Supported',
},
menu:{
m00:'Source Status',
m01:'Receivers Status',
m02:'Live Status',
m03:'Preview',
m04:'Stop',
m05:'Edit Receivers',
},
tips:{
t00:'The live event does not start.',
t01:'The live event is already deleted.',
t02:'Failed to fetch detailed status of the live event: ',
t03:'Live source status: Normal',
t04:'Live source status: Interrupted',
t05:'Live source status: Failed to connect',
t06:'Live source status: Task ID not exist',
t07:'Live source status: Unknown',
t08:'Failed to fetch the live source status: ',
t09:'Resend the instructions successfully.',
t10:'Retry operation cannot be performed in this status.',
t11:'Failed to resend the instructions.',
t12:'Server error: ',
t13:'No receivers.',
t14:'Failed to get receivers.',
t15:'The live event is updated successfully.',
t17:'The receivers are updated successfully.',
t18:'Are you sure to stop the live event: ',
t19:'The live event is stoped successfully.',
t20:'The live event cannot be stoped in this status.',
t21:'Failed to stop the live event: ',
t22:'Are you sure to delete the live event: ',
t23:'The live event is deleted successfully.',
t24:'Failed to delete the live event: ',
t25:'The live event already exists in the unit. Please pick up another one.',
t26:'Failed to pick up a live event: ',
}
};

var liveRoom={
menu:{
m00:'Add',
m01:'Select from List',
m02:'Live Datails',
m03:'Live Event',
},
tips:{
t00:'Please fill in the live room name.',
t01:'The live room is added successfully.',
t04:'Add a live courseware',
t05:'Add a VOD courseware',
t06:'The live room is updated successfully.',
t07:'Failed to update the live room.',
t08:'Are you sure to delete the live room: ',
t09:'The live is deleted successfully.',
t10:'Failed to delete the live room: ',
}
};

var liveSource={
view:{
v00:'External 102',
v01:'Internal RTSP',
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
v00:'Higher Level Node',
v01:'Lower Level Node',
},
tips:{
t00:'The node is added successfully.',
t01:'Only one higher level node can be added.',
t02:'The node is updated successfully.',
t03:'Are you sure to delete: ',
t04:'The node is deleted successfully.',
t05:'Failed to delete the node: ',
}
};

var person={
menu:{
m00:'Change Password',
},
tips:{
t00:"The passwords are not the same. Please re-enter.",
t01:"The name can only be a combination of letters and numbers. Please re-enter.",
t02:"The email address is incorrect. Please re-enter.",
t03:'Please pick a department for the user.',
t04:'The account is added successfully.',
t05:'The account already exists.',
t06:'The name is occupied.',
t07:'The email address is occupied.',
t08:'The account is updated successfully.',
t09:'The password is updated successfully.',
t10:'Are you sure to delete: ',
t11:'The account is deleted successfully.',
t12:'Failed to delete the acount: ',
}
};

var publicCourse={
view:{
v00:'Booked',
v01:'Unbooked',
},
menu:{
m00:'Book',
m01:'Unbook',
},
tips:{
t00:'Are you sure to book: ',
t01:'The course is booked successfully.',
t02:'Failed to book the course: ',
t03:'Are you sure to unbook: ',
t04:'The course is unbooked successfully.',
t05:'Failed to unbook the course: ',
}
};

var sysRole={
tips:{
t00:'The role is added successfully.',
t01:'The role is updated successfully.',
t02:'Are you sure to delete: ',
t03:'The role is deleted successfully.',
t04:'Failed to delete the role: ',
}
};

var vchannelList={
view:{
v00:'Wait to handle',
v01:'Successful',
v02:'Failed'
},
menu:{
m00:'Link Encoder',
m01:'Resend Configuration'
},
tips:{
t00:'The receiver encoder is linked successfully.',
t01:'The configuration is sent to the receiver successfully.',
t02:'Resending configuration is not suitable for this record.',
t03:'The server is abnormal.'
}
};

var vodList={
view:{
v00:'Add',
v01:'NVR List',
v02:' Current Category: ',
v03:' All',
v04:'Upload/Wait',
v05:'Upload/Transcoding',
v06:'Upload/Failed',
v07:'Upload/Finished',
v08:'Trans-Record/Abnormal',
v09:'Trans-Record/Finished',
v10:'Source-Record/Abnormal',
v11:'Source-Record/Finished',
v12:"External/Wait",
v13:"External/Fetching",
v14:"External/Finished",
v15:"External/Failed",
v16:"Show in Category"
},
tips:{
t00:'The VOD meta is updated successfully.',
t01:'Failed to update the VOD meta.',
t02:'Are you sure to delete: ',
t03:'The VOD is deleted successfully.',
t04:'Failed to delete the VOD.',
t05:'Please select a leaf node or the root node.',
t06:'The VOD already exists in the unit. Please select another one.',
t07:'Failed to select a VOD: ',
t08:'The VOD already exists in the live room. Please select another one.',
t09:'The task is already existed.',
t10:'The download task sum exceeds the threshold.',
t11:'The VOD Does not meet the download conditions.',
t12:'Failed to get the download link.'
}
};

var singleChoiceList={
view:{
v00:'Choice',
v01:'Are you share to delete: '
},
menu:{
m00:'Hide Solution',
m01:'Show Solution'
},
tips:{
t00:'Invalid operation. A categroy is needed.',
t01:'Please select a category.',
t02:'Please select the correct choice.',
t03:'The question description can not be null.',
t04:"The choice can not be null.",
t05:"Delete the question successfully.",
t06:"Failed to delete question: ",
t07:"Invalid operation. At least one correct choice is needed."
}
};

var defaultCategory={
a01:'All',
a02:'LiveRoom',
a03:'Course',
a04:'VOD',
a05:'Test',
};

var paramConfig={
tips: {
				t00 : "编辑参数成功.",
				t01 : "参数值不允许为空。"
							
				}
		};	