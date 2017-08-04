/**
 * Created by Elvis on 2017/6/29.
 */
var Attendance = function (zonediv, zone) {
    this.zonediv = zonediv;
    this.zone = zone;
    common.attendance.push(this)
    var timer = 0

    var attendanceListTpl = `<div class="attendance-list">
            {{~it:student:index}}
            <div class="attendance-item animated" data-id="{{=student.id}}">
                <div class="attendance-avatar">
                    <img src="{{=student.avatar}}" class="opacity"/>
                </div>
                <div class="attendance-info">
                    <p>{{=student.name}}</p>
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

    this.init = function () {
        var templ = doT.template(attendanceListTpl)
        this.zonediv.html(templ(common.students))
    }

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
        console.log(hardId)
        var student = common.students.filter(function (student) {
            return student['hard_id'] == hardId
        })
        clearTimeout(timer)
        if (student.length) {
            var st = student[0]
            checkin(st)
            var data = JSON.stringify({
                'hard_id': st['hard_id'],
                'student_id': st.id,
                'classroom_id': common.classRoom.id,
                ts: Date.now()
            })
            $.ajax({
                url: `${common.baseUrl}/students/${st.id}/attendance?ts=${Date.now()}`,
                type: 'post',
                contentType: 'application/json',
                data: data
            }).then(function (res) {
                console.log(res.data)
            }).catch(function (err) {
                console.log(JSON.stringify(err))
            })
        }
    }

    this.keyup = function () {
        var st = common.students[Math.floor(Math.random() * 10)]
        checkin(st)
        var data = JSON.stringify({
            'hard_id': st['hard_id'],
            'student_id': st.id,
            'classroom_id': common.classRoom.id,
            ts: Date.now()
        })
        $.ajax({
            url: `${common.baseUrl}/students/${st.id}/attendance?ts=${Date.now()}`,
            type: 'post',
            contentType: 'application/json',
            data: data
        }).then(function (res) {
            console.log(res.data)
        }).catch(function (err) {
            console.log(JSON.stringify(err))
        })
    }
}
