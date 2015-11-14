var myurls = {
	'device.list' : 'device!list.action',
	'layout.list' : 'layout!list.action',
	'schedule.list' : 'schedule!listbydevice.action',
	'schedule.add' : 'schedule!add.action',
	'schedule.update' : 'schedule!update.action',
	'schedule.delete' : 'schedule!delete.action'
};

var currentevent = {};
var currentdeviceid = 0;

function addSchedule(date) {
	currentevent = {
		id: 0,
		title: '',
	};
	var formdata = new Object();
	formdata['schedule.deviceid'] = currentdeviceid;
	formdata['schedule.fromdate'] = $.fullCalendar.formatDate(date, 'yyyy-MM-dd') + ' 00:00:00';
	var todate = new Date();
	todate.setDate(date.getDate()+1);
	formdata['schedule.todate'] = $.fullCalendar.formatDate(todate, 'yyyy-MM-dd') + ' 00:00:00';
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$("#LayoutSelect").select2('val', 0);
	$('#MyEditForm').attr('action', myurls['schedule.add']);
	$('#MyEditModal').modal();
}

function updateSchedule() {
	var formdata = new Object();
	formdata['schedule.scheduleid'] = currentevent.id;
	formdata['schedule.deviceid'] = currentevent.deviceid;
	formdata['schedule.layoutid'] = currentevent.layoutid;
	formdata['schedule.fromdate'] = $.fullCalendar.formatDate(currentevent.start, 'yyyy-MM-dd HH:mm:ss');
	formdata['schedule.todate'] = $.fullCalendar.formatDate(currentevent.end, 'yyyy-MM-dd HH:mm:ss');
	refreshForm('MyEditForm');
	$('#MyEditForm').loadJSON(formdata);
	$("#LayoutSelect").select2('val', currentevent.layoutid);
	$('#MyEditForm').attr('action', myurls['schedule.update']);
	$('#MyEditModal').modal();
}

function moveSchedule(event, revertFunc) {
	var message = '请确认是否把播放计划"' + event.title + '"的时间段修改为：' 
	+ $.fullCalendar.formatDate(event.start, 'yyyy-MM-dd HH:mm:ss') + ' 至 ' 
	+ $.fullCalendar.formatDate(event.end, 'yyyy-MM-dd HH:mm:ss');
	bootbox.confirm(message, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : myurls['schedule.update'],
				cache: false,
				data : {
					'schedule.scheduleid': event.id, 
					'schedule.fromdate': $.fullCalendar.formatDate(event.start, 'yyyy-MM-dd HH:mm:ss'),
					'schedule.todate': $.fullCalendar.formatDate(event.end, 'yyyy-MM-dd HH:mm:ss')
				},
				success : function(data, status) {
					if (data.errorcode == 0) {
						
					} else {
						bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
						revertFunc();
					}
				},
				error : function() {
					bootbox.alert('出错了！');
					revertFunc();
				}
			});				
		} else {
			revertFunc();
		}
	 });
	
}

function refreshCalendar() {
	$('#calendar').fullCalendar('refetchEvents');	
}

function initSchedules() {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var h = {
            left: 'title',
            center: '',
            right: 'prev,next,today,month,agendaWeek,agendaDay'
        };

    $("#DeviceSelect").select2({
        placeholder: "请选择终端",
        minimumInputLength: 0,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: myurls['device.list'],
            type: 'GET',
            dataType: 'json',
            data: function (term, page) {
                return {
                	sSearch: term, // search term
                    iDisplayStart: (page-1)*10,
                    iDisplayLength: 10,
                };
            },
            results: function (data, page) {
            	var more = (page * 10) < data.iTotalRecords; 
            	return {
            		results : $.map(data.aaData, function (item) { 
            			return { 
            				text:item.name, 
            				id:item.deviceid 
            			};
            		}),
            		more: more
            	};
            }
        },
        formatResult: function (device) {
        	return device.text;
        },
        formatSelection: function (device) {
        	return device.text;
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
    });

    $("#DeviceSelect").on("change", function(e) {
    	currentdeviceid = $(this).val();
    	refreshCalendar();
    });    
    
    var localOptions = {
    		buttonText: {
    			today: '今天',
    			month: '月',
    			day: '天',
    			week: '周'
    		},
    		monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    		monthNamesShort: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    		dayNames: ['周日','周一','周二','周三','周四','周五','周六'],
    		dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六']
    	};
	$('#calendar').fullCalendar('destroy'); // destroy the calendar
    $('#calendar').fullCalendar($.extend({ //re-initialize the calendar
        header: {
            left: 'title',
            center: '',
            right: 'prev,next,today,month,agendaWeek,agendaDay'
        },
        timeFormat: 'H:mm',
        slotMinutes: 15,
        //editable: true,
        events: function(start, end, callback) {
            $.ajax({
                url: myurls['schedule.list'],
                type : 'GET',
                dataType: 'json',
                data: {
                	deviceid: currentdeviceid
                },
                success: function(data) {
        			if (data.errorcode == 0) {
        				var events = [];
        				for (var i=0; i<data.aaData.length; i++) {
                            events.push({
                            	id: data.aaData[i].scheduleid,
                                title: data.aaData[i].layout.name,
                                start: data.aaData[i].fromdate,
                                end: data.aaData[i].todate,
                                allDay: false,
                                backgroundColor: App.getLayoutColorCode('yellow'),
                                deviceid: data.aaData[i].deviceid,
                                layoutid: data.aaData[i].layoutid
                            });
        				}
                        callback(events);
        			} else {
        				bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
        			}
                },
        		error : function() {
        			bootbox.alert('出错了!');
        		}
            });
        },
        /*
        eventRender: function(event,element,calEvent) {
			var html = '<a href="javascript:;" data-id="' + event.id + '" class="btn-xs pix-update"><i class="fa fa-pencil"></i></a>';
			html += '<a href="javascript:;" data-id="' + event.id + '" class="pix-delete"><i class="fa fa-times"></i></a>';
            element.find('.fc-event-title').after($('<span class="fc-event-icons"></span>').html(html));
        },
        dayClick: function(date, allDay, jsEvent, view) {
        	if (currentdeviceid > 0) {
                addSchedule(date);
        	}
        },*/
        /*
        eventClick: function(calEvent, jsEvent, view) {
        	updateSchedule(calEvent);
        },*/
        eventDrop: function( event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view ) {
        	moveSchedule(event, revertFunc);
        },
        eventResize: function( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) {
        	moveSchedule(event, revertFunc);
        }
    }, localOptions));

	$('body').on('click', '.pix-delete', function(event) {
		currentevent = $('#calendar').fullCalendar( 'clientEvents', $(event.target).parent().attr('data-id'))[0];
		var message = '请确认是否删除播放计划"' + currentevent.title + '"(' 
		+ $.fullCalendar.formatDate(currentevent.start, 'yyyy-MM-dd HH:mm:ss') + ' 至 ' 
		+ $.fullCalendar.formatDate(currentevent.end, 'yyyy-MM-dd HH:mm:ss') + ')';
		bootbox.confirm(message, function(result) {
			if (result == true) {
				$.ajax({
					type : 'POST',
					url : myurls['schedule.delete'],
					cache: false,
					data : {
						'ids': currentevent.id
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							refreshCalendar();
						} else {
							bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
						}
					},
					error : function() {
						bootbox.alert('出错了！');
					}
				});				
			}
         });
		
	});

	$('body').on('click', '.pix-update', function(event) {
		currentevent = $('#calendar').fullCalendar( 'clientEvents', $(event.target).parent().attr('data-id'))[0];
		updateSchedule();
	});

}

function initMyEditModal() {
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	FormValidateOption.rules['schedule.layoutid'] = {};
	FormValidateOption.rules['schedule.layoutid']['required'] = true;
	FormValidateOption.rules['schedule.fromdate'] = {};
	FormValidateOption.rules['schedule.fromdate']['required'] = true;
	FormValidateOption.rules['schedule.todate'] = {};
	FormValidateOption.rules['schedule.todate']['required'] = true;
	FormValidateOption.ignore = null;
	FormValidateOption.submitHandler = function(form) {
		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : $('#MyEditForm').serialize(),
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#MyEditModal').modal('hide');
					bootbox.alert('操作成功');
					refreshCalendar();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了！');
			}
		});
	};
	$('#MyEditForm').validate(FormValidateOption);
	
	$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
		if ($('#MyEditForm').valid()) {
			$('#MyEditForm').submit();
		}
	});
	
    $("#LayoutSelect").select2({
        placeholder: "请选择布局",
        minimumResultsForSearch: -1,
        minimumInputLength: 0,
        ajax: { 
            url: myurls['layout.list'],
            type: 'GET',
            dataType: 'json',
            data: function (term, page) {
                return {
                    q: term, // search term
                    iDisplayStart: (page-1)*10,
                    iDisplayLength: 10,
                };
            },
            results: function (data, page) {
            	var more = (page * 10) < data.iTotalRecords; 
            	return {
            		results : $.map(data.aaData, function (item) { 
            			return { 
            				text:item.name, 
            				id:item.layoutid 
            			};
            		}),
            		more: more
            	};
            }
        },
        formatResult: function (layout) {
        	return layout.text;
        },
        formatSelection: function (layout) {
        	return layout.text;
        },
        initSelection: function(element, callback) {
        	callback({id: currentevent.layoutid, text: currentevent.title });
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
    });

    $(".form_datetime").datetimepicker({
        autoclose: true,
        isRTL: App.isRTL(),
        format: "yyyy-mm-dd hh:ii",
        pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
        language: "zh-CN",
        minuteStep: 5
    });

}
