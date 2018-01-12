moment.locale('zh-cn');
//日历初始化
var Meeting = function (zonediv, zone) {
    this.zonediv = zonediv;
    this.zone = zone;
    this.scalew = 1;
    this.scaleh = 1;
    this.host = window.android && window.android.getHost() || '192.168.0.71';
    this.baseUrl = 'http://' + this.host + '/pixmrbs-api/meetings';
    this.terminalId = window.android && window.android.getTerminalId() || 'zszq00001';
    this.meetingRoom = {};
    this.hasToday = false;
    this.isToday = false;
    this.isCurrent = false;
    this.todayMeetings = [];
    this.weekMeetings = [];
    var thiz = this

    /*界面缩放，提供给外部调用*/
    this.resize = function (scalew, scaleh) {
        thiz.scalew = scalew
        thiz.scaleh = scaleh
        let scalew2 = thiz.zone.width / (1080 * scalew)
        let scaleh2 = thiz.zone.height / (1920 * scaleh)
        $(zonediv).css({'transform': `scale(${scalew2}, ${scaleh2})`, 'transform-origin': '0 0 0'})
    };

    /*更新头部时间*/
    function refreshTime () {
        let now = moment()
        let timeStr = `<p class="date">${now.format('YYYY年MM月DD日')}</p><p class="time">${now.format('HH:mm')}</p>`
        thiz.zonediv.find('.current-time').html(timeStr)
    }
    setInterval(refreshTime, 5000)

    /*初始化布局，根据情况提供两种布局*/
    function initLayout () {
        let layoutTpl = null
        if (thiz.isToday) {
            layoutTpl = `
                <div class="room-name">${thiz.meetingRoom.name}</div>
                <div class="current-time"></div>
                <div class="meeting-details"></div>
                <div class="today-meeting-list"></div>
                <div class="week-btn"></div>`
            thiz.zonediv.addClass('today').removeClass('week')
            thiz.zonediv.html(layoutTpl)
            renderTodayMeetings()
        } else {
            layoutTpl = `
                <div class="room-name">${thiz.meetingRoom.name}</div>
                <div class="current-time"></div>
                <div class="day-list"></div>
                <div class="day-meeting-list"></div>
                <div class="today-btn"></div>`
            thiz.zonediv.addClass('week').removeClass('today')
            thiz.zonediv.html(layoutTpl)
            if (thiz.hasToday) {
                thiz.zonediv.addClass('has-today')
                thiz.zonediv.find('.today-btn').show()
            } else {
                thiz.zonediv.removeClass('has-today')
                thiz.zonediv.find('.today-btn').hide()
            }
            renderDayList()
        }
        refreshTime()
    }

    /*渲染当天会议列表*/
    function renderTodayMeetings () {
        let meetingListTpl = `
            {{~it.meetings:meeting:index}}
            <div class="meeting-row {{? it.current == index}}current{{?}}" data-id="{{=meeting.meeting_id}}" data-index="{{=index}}">
                <p class="info"><span class="time">{{=moment(meeting.start_time).format('HH:mm')}}</span><span class="subject">&nbsp;| {{=meeting.subject}}</span></p>
                <div class="qrcode"><img src="./module/meeting/qrcode.png"/></div>
            </div>
            {{~}}`
        let currentIndex = 0
        let now = moment()
        thiz.todayMeetings.find(function (item, index) {
            if (now.isBefore(moment(item.end_time))) {
                currentIndex = index
                return true
            }
        })
        let data = {meetings: thiz.todayMeetings, current: currentIndex}
        let templ = doT.template(meetingListTpl)
        thiz.zonediv.find('.today-meeting-list').html('')
        thiz.zonediv.find('.today-meeting-list').html(templ(data))
        thiz.zonediv.find('.today-meeting-list .meeting-row.current').click()
    }

    /*渲染被选中的会议详情*/
    function renderMeetingDetails () {
        thiz.zonediv.find('.meeting-details').html('')
        let detailTpl = `
            <div><p class="subject">{{=it.meeting.subject}}</p></div>
            <div class="details">
                <p class="time">起止时间：{{=moment(it.meeting.start_time).format('HH:mm')}} ~ {{=moment(it.meeting.end_time).format('HH:mm')}}</p>
                <p class="booker">预订人：{{=it.meeting.book_user}}</p>
                <p class="attendee">参会人员：{{~it.meeting.attendees:attendee:index}}{{=attendee.name}} {{~}}</p>
            </div>`
        let activeDom = thiz.zonediv.find('.today-meeting-list .meeting-row.active')
        let index = activeDom.data('index')
        if (activeDom.hasClass('current')) {
            thiz.zonediv.addClass('current')
        } else {
            thiz.zonediv.removeClass('current')
        }
        let data2 = {meeting: thiz.todayMeetings[index]}
        let dtlTpl = doT.template(detailTpl)
        thiz.zonediv.find('.meeting-details').html(dtlTpl(data2))
    }

    /*渲染星期天列表*/
    function renderDayList () {
        thiz.zonediv.find('.day-list').html('')
        let dayListTpl = `
            {{~it:day:index}}
            <div class="day" width="20%" data-index="{{=index}}">
                <p class="date">{{=day.date}}</p>
                <p class="weekday">{{=day.weekday}}</p>
            </div>
            {{~}}`
        let days = []
        console.log(days)
        let now = moment()
        for(let i=1; i<=5; i++) {
            let date = now.add(1, 'day').format('MM月DD日')
            let weekday = now.format('dddd')
            days.push({date: date, weekday: weekday})
        }
        let dtlTpl = doT.template(dayListTpl)
        thiz.zonediv.find('.day-list').html(dtlTpl(days))
        thiz.zonediv.find('.day-list>div:first').click()
    }

    function renderDayMeetingList () {
        let dayMeetingListTpl = `
            {{~it:meeting:index}}
            <div class="day-meeting" data-index="{{=index}}">
                <div class="info"><span class="time">{{=moment(meeting.start_time).format('HH:mm')}}</span><span class="subject">&nbsp;| {{=meeting.subject}}</span></div>
                <div class="details">
                    <p class="time">起止时间：{{=moment(meeting.start_time).format('HH:mm')}} ~ {{=moment(meeting.end_time).format('HH:mm')}}</p>
                    <p class="booker">预订人：{{=meeting.book_user}}</p>
                    <p class="attendee">参会人员：{{~meeting.attendees:attendee:index2}}{{=attendee.name}} {{~}}</p>
                </div>
            </div>
            {{~}}`
        let index = thiz.zonediv.find('.day-list div.active').data('index')
        let day = moment().add(index + 1, 'day')
        var dayMeetings = thiz.weekMeetings.filter(function (item) {
            return moment(item.start_time).isSame(day, 'day')
        })
        if (dayMeetings.length > 0) {
            let templ = doT.template(dayMeetingListTpl)
            thiz.zonediv.find('.day-meeting-list').html(templ(dayMeetings))
            thiz.zonediv.find('.day-meeting-list .day-meeting:first').click()
        } else {
            let templ = '<p class="no-meeting">无会议</p>'
            thiz.zonediv.find('.day-meeting-list').html(templ)
        }
    }

    function addTouchListener () {
        thiz.zonediv.on('click', '.week-btn', function () {
            thiz.isToday = false
            initLayout()
        })
        thiz.zonediv.on('click', '.today-btn', function () {
            thiz.isToday = true
            initLayout()
        })
        thiz.zonediv.on('click', '.today-meeting-list .meeting-row', function () {
            $(this).addClass('active')
            $(this).siblings('.meeting-row').removeClass('active')
            renderMeetingDetails()
        })
        thiz.zonediv.on('click', '.day-list>div', function () {
            $(this).addClass('active')
            $(this).siblings().removeClass('active')
            renderDayMeetingList()
        })
        thiz.zonediv.on('click', '.day-meeting', function () {
            $(this).addClass('active')
            $(this).siblings().removeClass('active')
        })
    }
    addTouchListener()

    // 数据初始化
    this.init = function () {
        $.ajax({
            url: `${thiz.baseUrl}/meeting_rooms?terminal_id=${thiz.terminalId}&ts=${Date.now()}`,
            dataType: 'json'
        }).then(function (res) {
            thiz.meetingRoom = res.data;
            if (res.data.length > 0) thiz.meetingRoom = res.data[0]
            else throw new Error('未绑定会议室')
            var start_time = moment().startOf('day').format('YYYYMMDDHHmm')
            var end_time = moment().endOf('day').add(5, 'd').format('YYYYMMDDHHmm')
            var data = {
                ts: Date.now(),
                meeting_room_id: thiz.meetingRoom.meeting_room_id,
                start_time: start_time,
                end_time: end_time
            }
            return $.ajax({
                url: `${thiz.baseUrl}`,
                data: data,
                dataType: 'json'
            });
        }).then(function (res) {
            let now = moment()
            thiz.todayMeetings = []
            thiz.weekMeetings = []
            res.data.forEach(function (item) {
                if (moment(item.start_time).isSame(now, 'day')) {
                    thiz.todayMeetings.push(item)
                } else {
                    thiz.weekMeetings.push(item)
                }
            })
            if (thiz.todayMeetings.length > 0) {
                thiz.hasToday = true
                thiz.isToday = true
            } else {
                thiz.hasToday = false
                thiz.isToday = false
            }
            initLayout()
        }).catch(function (err) {
            console.log(err.message);
        });
    }

    this.init()
    //周期性更新数据
    setInterval(this.init, 300000)
};
