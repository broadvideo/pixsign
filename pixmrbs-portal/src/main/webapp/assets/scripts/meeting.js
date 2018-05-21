var origin = '/pixmrbs-api';
var categories = null
var myMeetings = []
var branches = []
var Meeting = function (user) {
    /*用户状态渲染*/
    var renderUserStatus = function () {
        if (typeof sessionStorage.username != 'undefined') {
            $("#userinfo").text(sessionStorage.username + ": 欢迎您！");
            $('#login').hide()
            $('#my-meeting').show()
            $('#logout').show()
        } else {
            $("#userinfo").text("未登录");
            $('#login').show()
            $('#my-meeting').hide()
            $('#logout').hide()
        }
    };

    /*导航栏行为定义*/
    var handleNavbar = function () {
        window.history.replaceState({location: 'dashboard'}, '', '#dashboard')
        sessionStorage.pageId = 'dashboard';
        /*导航栏点击事件*/
        $(".navbar-nav li").click(function (ev) {
            ev.preventDefault();
            $('ul.main-menu li').removeClass('active')
            $(this).addClass('active')
            var id = $(this).prop('id');
            if (sessionStorage.pageId == id) return;
            sessionStorage.pageId = id;
            switch (id) {
                case 'dashboard':
                    window.history.pushState({location: 'dashboard'}, '', '#dashboard')
                    $('body>.container').hide()
                    $('#dashboard2').show();
                    handleDashboard()
                    break;
                case 'meeting':
                    window.history.pushState({location: 'meeting'}, '', '#meeting')
                    $('body>.container').hide()
                    $('#meeting2').show();
                    handleBuilding()
                    initCalendar()
                    break;
                case 'my-meeting':
                    window.history.pushState({location: 'mymeeting'}, '', '#mymeeting')
                    $('body>.container').hide()
                    $('#my-meeting2').show();
                    handleMyMeeting()
                    break;
            }
            App.handleLayout();
        });

        /*回退popstate监听*/
        window.addEventListener('popstate', function (event) {
            if (!event.state) return
            var text = event.state.location;
            sessionStorage.pageId = text;
            switch (text) {
                case 'dashboard':
                    $('ul.main-menu li').removeClass('active')
                    $('body>.container').hide()
                    $('#dashboard').addClass('active')
                    $('#dashboard2').show();
                    handleDashboard()
                    break;
                case "meeting":
                    $('ul.main-menu li').removeClass('active')
                    $('body>.container').hide()
                    $('#meeting').addClass('active')
                    $('#meeting2').show();
                    handleBuilding()
                    initCalendar()
                    break;
                case "mymeeting":
                    $('ul.main-menu li').removeClass('active')
                    $('body>.container').hide()
                    $('#my-meeting').addClass('active')
                    $('#my-meeting2').show();
                    handleMyMeeting()
                    break;
            }
            App.handleLayout();
        });

        /*用户登入登出*/
        $('#login').click(function () {
            $("#modal_login").modal("toggle");
        })
        $('#logout').click(function () {
            user.logout(renderUserStatus);
        })

        /*登录界面提交点击事件*/
        $("body").on("click", "#modal_login #login_submit", function (event) {
            event.preventDefault();
            var data = {
                grant_type: "password",
                client_id: "pixmrbs-portal",
                client_secret: "pixmrbs-portal",
                username: $("#username").val(),
                password: $("#password").val()
            };
            user.login(data, function () {
                $("#modal_login").modal("hide");
                renderUserStatus();
            });
        });

        /*APP下载*/
        $('#downloadapp').click(function () {
            $("#contact_us").modal("toggle");
            var apkUrl = location.origin + '/pixdata/app/ktbox.apk';
            $('#qrcode').empty();
            $('#qrcode').qrcode({width: 270, height: 270, text: apkUrl});
            $('#qrcode').closest('a').attr('href', apkUrl);
        })

    };

    function handleDashboard () {
        /*基本统计信息*/
        $.ajax({
            url: origin + '/meetings/basic_summary',
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            dataType: "json"
        }).done(function (result) {
            var basicSummaryDot = doT.template($("#temp_basic_summary").text());
            $(".basic-summary").html(basicSummaryDot(result.data));
        }).fail(function (err) {
            let text = err.responseJSON.message || '不明错误'
            toastr.error(text)
        });

        //最近一周会议统计
        let start = moment().subtract(7, 'd').format('YYYYMMDD')
        let month_start = moment().subtract(30, 'd').format('YYYYMMDD')
        let end = moment().format('YYYYMMDD')
        $.ajax({
            url: origin + '/meetings/meetings_summary',
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            data: {start_date: start, end_date: end},
            dataType: "json"
        }).done(function (result) {
            let days = result.data.map(function (item) {
                return moment(item.date, 'YYYYMMDD').format('ddd')
            })
            let sums = result.data.map(function (item) {
                return item.meetings_total
            })

            let dom = document.querySelector('.meeting-sum')
            let width = dom.clientWidth
            let height = width * 0.6
            $(dom).css({width: width + 'px', height: height + 'px'})
            var myChart = echarts.init(dom);

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: '周会议统计'
                },
                tooltip: {},
                legend: {
                    data: ['会议']
                },
                xAxis: {
                    data: days
                },
                yAxis: {},
                grid: {show: true, borderWidth: 0.5},
                backgroundColor: 'rgba(178,34,34,0.04)',
                series: [{
                    name: '会议',
                    type: 'line',
                    symbol: 'emptyCircle',
                    symbolSize: 10,
                    lineStyle: {
                        normal: {
                            width: 1,
                            color: 'rgb(255,87,84)',
                            type: 'dotted'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: 'rgba(185,87,84,0.4)',
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    data: sums
                }]
            };
            myChart.setOption(option);
        }).fail(function (err) {
            let text = err.responseJSON.message || '不明错误'
            toastr.error(text)
        });

        //近一周会议室使用统计
        $.ajax({
            url: origin + '/meetings/meeting_rooms_summary',
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            data: {start_date: start, end_date: end},
            dataType: "json"
        }).done(function (result) {
            let days = result.data.map(function (item) {
                return moment(item.date, 'YYYYMMDD').format('ddd')
            })
            let sums = result.data.map(function (item) {
                return item.used_total
            })

            let dom = document.querySelector('.room-sum')
            let width = dom.clientWidth
            let height = width * 0.6
            $(dom).css({width: width + 'px', height: height + 'px'})
            var myChart = echarts.init(dom);

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: '周会议室统计'
                },
                tooltip: {},
                legend: {
                    data: ['会议室']
                },
                xAxis: {
                    data: days
                },
                yAxis: {},
                backgroundColor: 'rgba(210,105,30,0.04)',
                series: [{
                    name: '会议室',
                    type: 'line',
                    symbolSize: 10,
                    lineStyle: {
                        normal: {
                            width: 1,
                            color: 'rgb(255,87,84)',
                            type: 'dotted',
                            shadowColor: 'rgba(199,21,133,1)',
                            shadowBlur: 10
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: 'rgba(199,21,133,0.4)'

                        }
                    },
                    data: sums
                }]
            };
            myChart.setOption(option);
        }).fail(function (err) {
            let text = err.responseJSON.message || '不明错误'
            toastr.error(text)
        });

        //近一周热门会议室统计
        $.ajax({
            url: origin + '/meetings/hottest_meeting_rooms',
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            data: {start_date: start, end_date: end, length: 10},
            dataType: "json"
        }).done(function (result) {
            let rooms = result.data.map(function (item) {
                return item.name
            })
            let times = result.data.map(function (item) {
                return item.book_times
            })
            let dom = document.querySelector('.week-hot-rooms')
            let width = dom.clientWidth
            let height = width * 0.6
            $(dom).css({width: width + 'px', height: height + 'px'})
            var myChart = echarts.init(dom);

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: '周热门会议室统计'
                },
                tooltip: {},
                legend: {
                    data: ['会议']
                },
                xAxis: {
                },
                yAxis: {
                    data: rooms
                },
                backgroundColor: 'rgba(123,104,238,0.04)',
                series: [{
                    name: '会议',
                    type: 'bar',
                    barMaxWidth: 20,
                    itemStyle: {
                        normal: {
                            color: 'rgba(255,87,84,0.6)'
                        }
                    },
                    data: times
                }]
            };
            myChart.setOption(option);
        }).fail(function (err) {
            let text = err.responseJSON.message || '不明错误'
            toastr.error(text)
        });

        //近一月热门会议室统计
        $.ajax({
            url: origin + '/meetings/hottest_meeting_rooms',
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            data: {start_date: month_start, end_date: end, length: 10},
            dataType: "json"
        }).done(function (result) {
            let rooms = result.data.map(function (item) {
                return item.name
            })
            let times = result.data.map(function (item) {
                return item.book_times
            })
            let dom = document.querySelector('.month-hot-rooms')
            let width = dom.clientWidth
            let height = width * 0.6
            $(dom).css({width: width + 'px', height: height + 'px'})
            var myChart = echarts.init(dom);

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: '月热门会议室统计'
                },
                tooltip: {},
                legend: {
                    data: ['会议']
                },
                xAxis: {
                },
                yAxis: {
                    data: rooms
                },
                backgroundColor: 'rgba(34,139,34,0.04)',
                series: [{
                    name: '会议',
                    type: 'bar',
                    barMaxWidth: 20,
                    itemStyle: {
                        normal: {
                            color: 'rgba(255,87,84,0.6)'
                        }
                    },
                    data: times
                }]
            };
            myChart.setOption(option);
        }).fail(function (err) {
            let text = err.responseJSON.message || '不明错误'
            toastr.error(text)
        });
    }

    function handleBuilding () {
        $.ajax({
            url: origin + '/meetings/meeting_room_categories',
            type: "GET",
            headers: {Authorization: sessionStorage.authorization},
            contentType: 'application/json; charset=utf-8',
            dataType: "json"
        }).done(function (result) {
            categories = result.data
            var buildingDot = doT.template($("#temp_building").text());
            $("#select1").html(buildingDot(categories));
            $("#select1 dd:eq(0)").click();
        }).fail(function (err) {
            let text = err.responseJSON.message || '不明错误'
            toastr.error(text)
        });
    }

    function handleRoom (id) {
        var data = {
            length: 100,
            start: 0,
            category_id: id
        }
        $.ajax({
            url: origin + '/meetings/meeting_rooms',
            type: "GET",
            headers: {Authorization: sessionStorage.authorization},
            data: data,
            contentType: 'application/json; charset=utf-8',
            dataType: "json"
        }).done(function (result) {
            var roomDot = doT.template($("#temp_room").text());
            $("#select2").html(roomDot(result.data));
            $("#select2 dd:eq(0)").click();
        }).fail(function (err) {
            let text = err.responseJSON.message || '不明错误'
            toastr.error(text)
        });
    }

    /*分类点击事件处理*/
    var handleClickRoom = function () {
        /*点击写字楼*/
        $("#select1").on('click', 'dd', function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            $("#selectA").remove();
            $("#selectB").remove();
            $('#select2 dd:gt(0)').remove();
            if (!$(this).hasClass("select-none")) {
                var copyThisA = $(this).clone();
                $(".select-result dl").append(copyThisA.attr("id", "selectA"));
                /*渲染子分类*/
                var buildingId = $(this).data('building-id')
                handleRoom(buildingId)
            }
            queryMeetings()
        });

        $("#select2").on('click', 'dd', function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            $("#selectB").remove();
            if (!$(this).hasClass("select-none")) {
                var copyThisB = $(this).clone();
                $(".select-result dl").append(copyThisB.attr("id", "selectB"));
            }
            queryMeetings()
        });

        $("#meeting2").on("click", "#selectA", function () {
            $(this).remove();
            $("#selectB").remove();
            $("#select1 .select-none").addClass("selected").siblings().removeClass("selected");
            $('#select2 dd:gt(0)').remove();
            queryMeetings()
        });

        $("#meeting2").on("click", "#selectB", function () {
            $(this).remove();
            $("#select2 .select-none").addClass("selected").siblings().removeClass("selected");
            queryMeetings()
        });

        $("#meeting2").on("click", "dd", function () {
            if ($(".select-result dd").length > 1) {
                $(".select-no").hide();
            } else {
                $(".select-no").show();
            }
        });
    };

    /*根据分类查询课程列表*/
    function queryMeetings () {
        if ($('#selectB').length == 1) {
            let roomId = $('#selectB').data('room-id')
            let startTime = moment().subtract(1, 'M').format('YYYYMMDDHHmm')
            let endTime = moment().add(1, 'M').format('YYYYMMDDHHmm')
            let data = {
                start: 0,
                length: 1000,
                meeting_room_id: roomId,
                start_time: startTime,
                end_time: endTime
            }
            $.ajax({
                url: origin + '/meetings',
                type: "GET",
                headers: {Authorization: sessionStorage.authorization},
                contentType: 'application/json; charset=utf-8',
                data: data,
                dataType: "json"
            }).done(function (result) {
                let meetings = result.data.map(function (item) {
                    var meeting = Object.assign({}, item)
                    meeting.id = meeting.meeting_id
                    meeting.title = item.subject
                    meeting.start = item.start_time
                    meeting.end = item.end_time
                    return meeting
                })
                $("#calendar").fullCalendar('removeEvents');
                $("#calendar").fullCalendar('addEventSource', {
                    "events": meetings,
                    editable: false,
                    color: "#FF6600"
                });
            }).fail(function (err) {
                let text = err.responseJSON.message || '不明错误'
                toastr.error(text)
            });
        } else {
            $("#calendar").fullCalendar('removeEvents');
        }
    }

    //初始化Calendar
    function initCalendar () {
        var h = {
            left: 'title',
            center: '',
            right: 'prev,next,today,agendaWeek,month'
        };
        $("#calendar").fullCalendar('destroy');
        $("#calendar").fullCalendar({ //re-initialize the calendar
            header: h,
            lang: "zh-cn",
            timezone: "local",
            contentHeight: "auto",
            aspectRatio: 2,
            firstDay: 1,
            allDaySlot: false,
            slotDuration: '00:30:00',
            snapDuration: '00:10:00',
            //slotEventOverlap: false,
            selectOverlap: false,
            eventOverlap: false,
            defaultTimedEventDuration: '01:00:00',
            forceEventDuration: true,
            displayEventEnd: {month: true, 'default': true},
            scrollTime: '09:00:00',
            minTime: "08:00:00",
            maxTime: "22:00:00",
            allDayDefault: false,
            defaultView: "agendaWeek",
            weekends: true,
            axisFormat: 'HH:mm',
            timeFormat: {month: 'HH:mm', agenda: 'HH:mm'},
            droppable: false,
            eventClick: function (event, jsEvent, view) {
                if (event.start.isAfter(moment())) {
                    let roomName = $('#selectB').data('room-name')
                    let meeting = Object.assign({}, event)
                    meeting.roomName = roomName
                    var editMeetingDot = doT.template($("#temp_edit_meeting").text());
                    $("#nest_modal").html(editMeetingDot(meeting));
                    $("#modal_edit_meeting").modal('show')
                    editMeeting()
                } else {
                    toastr.warning('会议已过期，无法调整。')
                }
            },
            dayClick: function (date, jsEvent, view, resourceObj) {
                if ($('#selectB').length == 1 && date.isAfter(moment())) {
                    let roomId = $('#selectB').data('room-id')
                    let roomName = $('#selectB').data('room-name')
                    let data = {
                        roomId,
                        roomName: roomName,
                        start: date.format('YYYY-MM-DD HH:mm:ss'),
                        end: date.add(1, 'h').format('YYYY-MM-DD HH:mm:ss')
                    }
                    var addMeetingDot = doT.template($("#temp_add_meeting").text());
                    $("#nest_modal").html(addMeetingDot(data));
                    $("#modal_add_meeting").modal('show')
                    addMeeting()
                } else {
                    toastr.warning('无法预定会议。请确保已经选定会议室，且点击处时间在当前时间之后。')
                }
            }
        });
    }

    /*部门树*/
    function getBranches () {
        $.ajax({
            url: origin + '/branches',
            type: "GET",
            headers: {Authorization: sessionStorage.authorization},
            dataType: "json"
        }).done(function (result) {
            branches = result.data.map(function (item) {
                item.id = item.branch_id
                item.text = item.name
                item.icon = 'fa fa-flag-checkered'
                item.parent = item.parent_id
                if (item.parent_id === 0) {
                    item.icon = 'fa fa-flag'
                    item.parent = '#'
                }
                return item
            })
        }).fail(function (err) {
            let text = err.responseJSON.message || '不明错误'
            toastr.error(text)
        });
    }

    function initModal (dom) {
        var treeDom = dom.find('.branches')
        var selectDom = $(dom).find('.attendee-selector')
        var selectedDom = $(dom).find('.attendees')
        treeDom.jstree({
            core: {
                "themes": {"responsive": false},
                "data": branches,
                "check_callback": true,
            }
        }).bind("changed.jstree", function (event, data) {
            $.ajax({
                url: origin + `/branches/${data.node.id}/users`,
                headers: {Authorization: sessionStorage.authorization},
                dataType: 'json'
            }).then(function (res) {
                selectDom.find('option:gt(0)').remove()
                var attendeeDot = doT.template($("#temp_attendee").text());
                selectDom.append(attendeeDot(res.data));
            });
        });
        //选择员工，将其加入列表
        selectDom.on('change', function () {
            var option = this.selectedOptions[0]
            if (option.text == '未选') return
            var flag = false
            selectedDom.find('span').each(function (index, item) {
                if ($(item).data('id') == option.value) flag = true
            })
            if (flag) {
                toastr.warning('此人已经添加')
                return
            }
            var selected = `<span class="label label-success" data-id="${option.value}">
                        ${option.text} <i class="fa fa-times"></i>
                    </span>`
            selectedDom.append(selected)
            var height = $(dom).find('.modal-body').prop('scrollHeight')
            $(dom).find('.modal-body').css({height: `${height}px`})
        })
        //删除员工，将其从列表删除
        selectedDom.on('click', 'i', function () {
            $(this).closest('span').remove()
        })
    }

    function addMeeting () {
        var dom = $('#modal_add_meeting')
        initModal(dom)
        $('#add_meeting_submit').click(function (ev) {
            ev.preventDefault()
            var data = $('#form_add_meeting').serializeJSON()
            var ids = []
            $('#form_add_meeting .attendees span').each(function (index, item) {
                ids.push($(item).data('id'))
            })
            data.attendee_user_ids = ids
            let userId = sessionStorage.userid
            $.ajax({
                url: `${origin}/users/${userId}/book_meeting`,
                type: "POST",
                headers: {Authorization: sessionStorage.authorization},
                data: JSON.stringify(data),
                contentType: 'application/json; charset=utf-8',
                dataType: "json"
            }).done(function (result) {
                $("#modal_add_meeting").modal('hide')
                queryMeetings()
            }).fail(function (err) {
                let text = err.responseJSON.message || '不明错误'
                toastr.error(text)
            })
        })
    }

    function editMeeting () {
        var dom = $('#modal_edit_meeting')
        initModal(dom)
        $('#edit_meeting_submit').click(function (ev) {
            ev.preventDefault()
            let data = $('#form_edit_meeting').serializeJSON()
            var ids = []
            $('#form_edit_meeting .attendees span').each(function (index, item) {
                ids.push($(item).data('id'))
            })
            data.attendee_user_ids = ids
            let userId = sessionStorage.userid
            $.ajax({
                url: `${origin}/users/${userId}/adjust_meeting`,
                type: "POST",
                headers: {Authorization: sessionStorage.authorization},
                data: JSON.stringify(data),
                contentType: 'application/json; charset=utf-8',
                dataType: "json"
            }).done(function (result) {
                $("#modal_edit_meeting").modal('hide')
                queryMeetings()
            }).fail(function (err) {
                let text = err.responseJSON.message || '不明错误'
                toastr.error(text)
            })
        })
        $('#remove_meeting_submit').click(function (ev) {
            ev.preventDefault()
            let userId = sessionStorage.userid
            let meetingId = $(this).data('meeting-id')
            $.ajax({
                url: `${origin}/users/${userId}/book_meeting?meeting_id=${meetingId}`,
                type: "DELETE",
                headers: {Authorization: sessionStorage.authorization},
                contentType: 'application/json; charset=utf-8',
                dataType: "json"
            }).done(function (result) {
                $("#modal_edit_meeting").modal('hide')
                queryMeetings()
            }).fail(function (err) {
                let text = err.responseJSON.message || '不明错误'
                toastr.error(text)
            })
        })
    }

    /*我的会议相关*/
    function handleMyMeeting () {
        $.ajax({
            url: origin + '/users/self/meetings?start=0&length=1000',
            type: "GET",
            headers: {Authorization: sessionStorage.authorization},
            contentType: 'application/json; charset=utf-8',
            dataType: "json"
        }).done(function (result) {
            myMeetings = result.data
            let data = {
                currentUserId: sessionStorage.userid,
                data: result.data
            }
            var mymeetingDot = doT.template($("#temp_my_meeting_list").text());
            $("#my-meeting-list").html(mymeetingDot(data));
            addBtnListener()
        }).fail(function (err) {
            let text = err.responseJSON.message || '不明错误'
            toastr.error(text)
        });
    }

    function addBtnListener () {
        $('#my-meeting2 .edit-meeting').click(function (ev) {
            ev.preventDefault()
            let meetingId = $(this).data('meeting-id')
            let meeting = myMeetings.find(function (item) {
                return item.meeting_id == meetingId
            })
            console.log(meeting)
            var mymeetingDot = doT.template($("#temp_edit_my_meeting").text());
            $("#nest_modal").html(mymeetingDot(meeting));
            $("#modal_edit_my_meeting").modal('show')
            editMyMeeting()
        })
    }

    function editMyMeeting () {
        var dom = $('#modal_edit_my_meeting')
        initModal(dom)
        $('#edit_my_meeting_submit').click(function (ev) {
            ev.preventDefault()
            let data = $('#form_edit_my_meeting').serializeJSON()
            let userId = sessionStorage.userid
            $.ajax({
                url: `${origin}/users/${userId}/adjust_meeting`,
                type: "POST",
                headers: {Authorization: sessionStorage.authorization},
                data: JSON.stringify(data),
                contentType: 'application/json; charset=utf-8',
                dataType: "json"
            }).done(function (result) {
                $("#modal_edit_my_meeting").modal('hide')
                handleMyMeeting()
            }).fail(function (err) {
                let text = err.responseJSON.message || '不明错误'
                toastr.error(text)
            })
        })
        $('#remove_my_meeting_submit').click(function (ev) {
            ev.preventDefault()
            let userId = sessionStorage.userid
            let meetingId = $(this).data('meeting-id')
            $.ajax({
                url: `${origin}/users/${userId}/book_meeting?meeting_id=${meetingId}`,
                type: "DELETE",
                headers: {Authorization: sessionStorage.authorization},
                contentType: 'application/json; charset=utf-8',
                dataType: "json"
            }).done(function (result) {
                $("#modal_edit_my_meeting").modal('hide')
                handleMyMeeting()
            }).fail(function (err) {
                let text = err.responseJSON.message || '不明错误'
                toastr.error(text)
            })
        })
    }

    /*返回对象*/
    return {
        init: function () {
            getBranches();
            renderUserStatus();
            handleDashboard();
            handleNavbar();
            handleBuilding();
            handleClickRoom();
        }
    };
}(user);
