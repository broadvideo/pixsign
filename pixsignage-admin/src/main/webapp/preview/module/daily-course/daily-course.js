//日历初始化
var DailyCourse = function (zonediv, zone) {
    this.zonediv = zonediv;
    this.zone = zone;
    common.dailyCourse.push(this)
    var DailyCourseTpl = `<table>
            <tbody>
            {{~it:course:index}}
            <tr class="day-course-tr {{? course.current}}is-current{{?}}">
                <td>{{=course.start_time}}</td>
                <td>{{=course.course_name}}</td>
            </tr>
            {{~}}
            </tbody>
        </table>`

    this.resize = function (scalew, scaleh) {
        $(zonediv).css({
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
            'line-height': '1px',
        });
        $(zonediv).find('td').css({
            'border-width': Math.ceil(zone.rulewidth / scalew) + 'px',
            'border-color': zone.rulecolor,
            'word-wrap': 'break-word',
            'white-space': 'pre-wrap',
            'text-decoration': zone.decoration,
        });
    };

    // 数据初始化
    this.init = function () {
        var thiz = this
        $.ajax({
            url: `${common.baseUrl}/classrooms/${common.classRoom.id}/schedules?ts=${Date.now()}`,
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json',
        }).then(function (res) {
            if (res.retcode != 0) throw new Error('failed to get day course list.');
            var courses = res.course_schedules.filter(function (item) {
                return moment().format('E') == item.workday
            }).map(function (item) {
                if (moment(item['start_time'], 'HH:mm').isBefore(moment()) && moment(item['end_time'], 'HH:mm').isAfter(moment())) {
                    item.current = true
                }
                else {
                    item.current = false
                }
                return item
            });
            var courses2 = []
            for (var i = 0; i < thiz.zone.rows; i++) {
                if (courses[i]) {
                    courses2.push(courses[i])
                } else {
                    courses2.push({start_time: ' ', course_name: ' '})
                }
            }
            var templ = doT.template(DailyCourseTpl)
            thiz.zonediv.html(templ(courses2))
            thiz.zonediv.find('table').css({width: '100%', height: '100%'});
            thiz.zonediv.find('table').attr('rules', zone.rules);
            thiz.zonediv.find('tr td:first').attr('width', '30%');
        }).catch(function (err) {
            console.log(err.message)
        })
    }
};
