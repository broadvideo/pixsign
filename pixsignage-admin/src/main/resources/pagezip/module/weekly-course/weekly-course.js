//日历初始化
var WeeklyCourse = function (zonediv, zone, scalew, scaleh) {
    this.zonediv = zonediv;
    this.zone = zone;
    common.weeklyCourse.push(this)

    var WeeklyCourseTpl = `<table>
            <tbody>
            <tr>
                <td>时间</td>
                {{~it.scheme.workdays:day:index}}
                <td>{{=day.dayname}}</td>
                {{~}}
            </tr>
            {{~it.scheme.morning.dtls:courseIndex:index}}
            <tr>
                <td><span>{{=courseIndex.courseName}}</span><span>{{=courseIndex.start_time}}</span></td>
                {{~it.scheme.workdays:day:index2}}
                <td data-periodnum="{{=index+1}}" data-type="0" data-workday="{{=index2+1}}"> </td>
                {{~}}
            </tr>
            {{~}}
            <tr><td colspan="{{=it.cols}}"> </td></tr>
            {{~it.scheme.afternoon.dtls:courseIndex:index}}
            <tr>
                <td><span>{{=courseIndex.courseName}}</span><span>{{=courseIndex.start_time}}</span></td>
                {{~it.scheme.workdays:day:index2}}
                <td data-periodnum="{{=index+1}}" data-type="2" data-workday="{{=index2+1}}"> </td>
                {{~}}
            </tr>
            {{~}}
            <tr></tr>
            {{~it.scheme.night.dtls:courseIndex:index}}
            <tr>
                <td><span>{{=courseIndex.courseName}}</span><span>{{=courseIndex.start_time}}</span></td>
                {{~it.scheme.workdays:day:index2}}
                <td data-periodnum="{{=index+1}}" data-type="3" data-workday="{{=index2+1}}"> </td>
                {{~}}
            </tr>
            {{~}}
            </tbody>
        </table>`

    this.resize = function (scalew, scaleh) {
        let thiz = this
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
        });
        zonediv.find('table').css({'table-layout': 'fixed'})
        zonediv.find('td').css({
            'border-width': Math.ceil(zone.rulewidth / scalew) + 'px',
            'border-color': zone.rulecolor,
            'word-wrap': 'break-word',
            'white-space': 'pre-wrap',
            'text-decoration': zone.decoration,
            'height': thiz.zonediv.height() / zone.rows - Math.ceil(zone.rulewidth / scalew),
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
            res.course_schedules.forEach(function (item) {
                if (moment().format('E') == item.workday && moment(item['start_time'], 'HH:mm').isBefore(moment()) && moment(item['end_time'], 'HH:mm').isAfter(moment())) {
                    item.current = true
                }
                else {
                    item.current = false
                }
            });
            res.scheme.workdays = res.scheme.workdays.map(item => {
                switch (item) {
                    case 1:
                        return {index: item, dayname: '星期一'}
                    case 2:
                        return {index: item, dayname: '星期二'}
                    case 3:
                        return {index: item, dayname: '星期三'}
                    case 4:
                        return {index: item, dayname: '星期四'}
                    case 5:
                        return {index: item, dayname: '星期五'}
                    case 6:
                        return {index: item, dayname: '星期六'}
                    case 7:
                        return {index: item, dayname: '星期天'}
                }
            }).slice(0, thiz.zone.cols - 1)
            res.scheme.morning.dtls.forEach(item => {
                switch (item.period_num) {
                    case 1:
                        item.courseName = '第一节'
                        break;
                    case 2:
                        item.courseName = '第二节'
                        break;
                    case 3:
                        item.courseName = '第三节'
                        break;
                    case 4:
                        item.courseName = '第四节'
                        break;
                }
            })
            res.scheme.afternoon.dtls.forEach(item => {
                switch (item.period_num) {
                    case 1:
                        item.courseName = '第一节'
                        break;
                    case 2:
                        item.courseName = '第二节'
                        break;
                    case 3:
                        item.courseName = '第三节'
                        break;
                    case 4:
                        item.courseName = '第四节'
                        break;
                }
            })
            res.scheme.night.dtls.forEach(item => {
                switch (item.period_num) {
                    case 1:
                        item.courseName = '第一节'
                        break;
                    case 2:
                        item.courseName = '第二节'
                        break;
                    case 3:
                        item.courseName = '第三节'
                        break;
                    case 4:
                        item.courseName = '第四节'
                        break;
                }
            })
            res.cols = thiz.zone.cols
            var templ = doT.template(WeeklyCourseTpl)
            thiz.zonediv.html(templ(res))
            res.course_schedules.forEach(item => {
                thiz.zonediv.find('td').each(function (i, item2) {
                    if ($(item2).data('periodnum') == item['period_num'] && $(item2).data('type') == item['type'] && $(item2).data('workday') == item['workday']) {
                        $(item2).html(`<span>${item.course_name}</span><span>(${item.teacher_name})</span>`)
                    }
                })
            })
            thiz.zonediv.find('tr').each(function (index, item) {
                if (index >= thiz.zone.rows) {
                    $(item).remove()
                }
            })
            thiz.zonediv.find('table').css({width: '100%', height: '100%'});
            thiz.zonediv.find('table').attr('rules', thiz.zone.rules);
            thiz.resize(scalew, scaleh)
        }).catch(function (err) {
            console.log(err.message)
        })
    }
};
