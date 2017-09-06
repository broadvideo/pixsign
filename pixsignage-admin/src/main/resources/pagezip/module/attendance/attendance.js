/**
 * Created by Elvis on 2017/6/29.
 */
var Attendance = function (zonediv, zone) {
    this.zonediv = zonediv;
    this.zone = zone;
    this.currentEvent = null;
    common.attendance.push(this)
    var timer = 0

    var attendanceSummaryTpl = `<div class="attendance-summary">
            <h3 class="title">{{=it.event_name}}</h3>
            <p class="info">应到人数&nbsp;{{=it.total}}</p>
            <p class="info">已到&nbsp;{{=it.avail_total}}</p>
        </div>`
    var attendanceNullTpl = `<div class="attendance-summary">
            <p>当前无考勤</p>
        </div>`

    var attendanceListTpl = `<div class="attendance-list" id="attendanceList">
            {{~it:student:index}}
            <div class="attendance-item animated" data-id="{{=student.student_id}}">
                <div class="attendance-avatar">
                    <img src="{{=student.avatar}}" {{?student.state == '2'}}class="opacity"{{?}}/>
                </div>
                <div class="attendance-info">
                    <p>{{=student.student_name}}</p>
                </div>
            </div>
            {{~}}
        </div>`

    var attendancePopupTpl = `<div class="attendance-popup animated" data-id="{{=it.id}}">
                <div class="attendance-popup-avatar">
                    <img src="{{=it.avatar}}"/>
                </div>
                <div class="attendance-popup-info">
                    <p>签到时间：{{=moment().format('HH:mm:ss')}}</p>
                </div>
            </div>`

    var checkin = function (student) {
        if (!student.id) return
        $('.attendance-item').each(function (index, node) {
            if ($(node).data('id') == student.id) {
                $(node).find('img').removeClass('opacity')
                $(node).addClass('rubberBand')
                setTimeout(function () {
                    $(node).removeClass('rubberBand')
                }, 1000)
            }
        })
        $('.attendance-popup').remove()
        var templ = doT.template(attendancePopupTpl)
        $('body').append(templ(student))
        clearTimeout(timer)
        timer = setTimeout(function () {
            $('.attendance-popup').remove()
        }, 5000)
    }

    this.refreshAttendance = function () {
        var self = this
        var now = Date.now()
        var events = common.attendanceEvents.filter(function (event) {
            return event.start_time < now
        })
        if (events.length > 0) {
            self.currentEvent = events[events.length - 1]
            $.ajax({
                url: `${common.baseUrl}/classrooms/${common.classRoom.id}/attendancesummary?event_id=${self.currentEvent.id}`,
                dataType: 'json'
            }).then(function (res) {
                console.log('get attendancesummary', res)
                var templ = doT.template(attendanceSummaryTpl)
                $(self.zonediv).html(templ(res.data))
                $('#attendanceList').remove()
                if (now < self.currentEvent.end_time) {
                    var templ = doT.template(attendanceListTpl)
                    $('body').append(templ(res.data.dtls))
                }
            }).catch(function (err) {
                console.log(err.message)
            })
        } else {
            this.zonediv.html(attendanceNullTpl)
        }
    }

    this.init = function () {
        var self = this
        setInterval(self.refreshAttendance, 300000)
        self.refreshAttendance()
    }

    this.resize = function (scalew, scaleh) {
        zonediv.css({
            'box-sizing': 'border-box',
            'border-color': zone.bdcolor,
            'border-style': zone.bdstyle,
            'border-width': (parseInt(zone.bdwidth) / scalew) + 'px',
            'border-radius': (parseInt(zone.bdradius) / scalew) + 'px',
            'color': zone.color,
            'font-family': zone.fontfamily,
            'font-size': (parseInt(zone.fontsize) / scalew) + 'px',
            'text-align': zone.align,
            'font-weight': zone.fontweight,
            'font-style': zone.fontstyle,
            'overflow': 'auto'
        });
    };

    this.swipe = function (hardId) {
        var self = this
        if (self.currentEvent && self.currentEvent.end_time < Date.now) {
            var student = common.students.find(function (student) {
                return student['hard_id'] == hardId
            })
            if (student) {
                checkin(student)
                var data = JSON.stringify({
                    'hard_id': student['hard_id'],
                    'student_id': student.id,
                    'classroom_id': common.classRoom.id,
                    ts: Date.now()
                })
                $.ajax({
                    url: `${common.baseUrl}/students/${student.id}/attendance?event_time=${Date.now()}&event_id=${self.currentEvent.id}`,
                    type: 'post',
                    contentType: 'application/json',
                    data: data
                }).then(function (res) {
                    self.refreshAttendance()
                }).catch(function (err) {
                    console.log(JSON.stringify(err))
                })
            }
        }
    }
}
