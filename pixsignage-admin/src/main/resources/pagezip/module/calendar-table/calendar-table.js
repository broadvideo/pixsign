//日历初始化
var CalendarTable = function () {
    var baseUrl = 'http://192.168.2.102/pixsignage-api/service'
    var terminalId = window.android && window.android.getTerminalId() || '00002'
    var classRoom = {}
    var timer, current = moment()

    //初始化Calendar
    var initCalendar = function () {
        if (!jQuery().fullCalendar) {
            return;
        }

        $(".calendar-table").fullCalendar({
            header: {left: '', center: 'title', right: '', /*right: 'prev, month, agendaWeek, agendaDay, next'*/},
            lang: 'zh-cn',
            timezone: "local",
            aspectRatio: 1,
            firstDay: 1,
            allDaySlot: false,
            slotDuration: '00:30:00',
            //snapDuration: '00:05:00',
            //slotEventOverlap: false,
            selectOverlap: false,
            eventOverlap: false,
            defaultTimedEventDuration: '01:00:00',
            forceEventDuration: true,
            displayEventTime: true,
            //scrollTime: '09:00:00',
            minTime: '08:00:00',
            maxTime: '20:00:00',
            allDayDefault: false,
            defaultView: 'agendaWeek',
            weekends: true,
            slotLabelFormat: 'HH:mm',
            droppable: true,
            buttonText: {today: '今天', month: '月', week: '星期', day: '天'},
            views: {
                month: {
                    displayEventEnd: true,
                    timeFormat: 'HH:mm'
                },
                week: {
                    displayEventEnd: true,
                    timeFormat: 'HH:mm'
                },
                day: {
                    displayEventEnd: true,
                    timeFormat: 'HH:mm'
                }
            },
            eventRender: function (event, element, view) {
                switch (event.status) {
                    case 'after':
                        $(element).addClass('after');
                        $(element).removeClass('before');
                        $(element).removeClass('current');
                        break
                    case 'before':
                        $(element).removeClass('after');
                        $(element).addClass('before');
                        $(element).removeClass('current');
                        break
                    case 'current':
                        $(element).removeClass('after');
                        $(element).removeClass('before');
                        $(element).addClass('current');
                        break
                }
            },
            eventAfterAllRender: function (view) {
                $('.fc-event-dot').css('margin-top', '8px');
                if (!timer) {
                    timer = setInterval(function () {
                        if (moment().isSame(current, 'day')) {
                            $(".calendar-list").fullCalendar('refetchEvents');
                        } else {
                            $('.calendar-list').fullCalendar('destroy');
                            Calendar.init();
                        }
                    }, 10000);
                    current = moment();
                }
            },
            events: function (start, end, timezone, callback) {
                $.ajax({
                    url: baseUrl + '/classrooms/' + classRoom.id + '/schedules',
                    contentType: 'application/json; charset=UTF-8',
                    dataType: 'json',
                }).then(function (res) {
                    if (res.retcode != 0) return callback([]);
                    var events = [];
                    res.data.forEach(function (item) {
                        var event = {
                            start: item['start_time'],
                            end: item['end_time'],
                            title: item['course_name'],
                            host: item.instructor,
                            current: false
                        };
                        if (moment(event.start, 'HH:mm').isAfter(moment())) {
                            event.status = 'after'
                        }
                        else if (moment(event.end, 'HH:mm').isBefore(moment())) {
                            event.status = 'before'
                        }
                        else {
                            event.status = 'current'
                        }
                        events.push(event);
                    });
                    callback(events);
                }).catch(function (err) {
                    callback([]);
                });
            },
        });
    }

    // 数据初始化
    var init = function () {
        $.ajax({
            url: baseUrl + '/terminals/' + terminalId + '/classroom',
            dataType: 'json'
        }).then(function (res) {
            classRoom = res.classroom
            initCalendar()
        }).catch(function (err) {
            console.log(err.message)
        })
    }

    return {
        init: init
    };
}();
window.onload = function () {
    CalendarTable.init();
}