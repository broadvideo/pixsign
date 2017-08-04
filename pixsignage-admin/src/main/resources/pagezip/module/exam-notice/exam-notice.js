/**
 * Created by Elvis on 2017/6/29.
 */
var ExamNotice = function (zonediv, zone) {
    this.zonediv = zonediv;
    this.zone = zone;
    common.exam.push(this)

    var examListTpl = `<div class="exam-list">
            <div class="current-exam-item" data-id="{{=it[0].id}}">
                <p class="exam-name">{{=it[0].name}} - {{=it[0].coursename}}</p>
                <p class="exam-time">{{=moment(it[0].starttime).format('MM-DD HH:mm')}} - {{=moment(it[0].endtime).format('HH:mm')}}</p>
            </div>
            <div class="future-exams">
                {{~it:exam:index}}
                {{? index > 0}}
                <div class="future-exam-item" data-id="{{=exam.id}}">
                    <p class="exam-name">下一场 {{=exam.coursename}}</p>
                    <p class="exam-time">{{=moment(exam.starttime).format('MM-DD HH:mm')}} - {{=moment(exam.endtime).format('HH:mm')}}</p>
                </div>
                {{?}}
                {{~}}
            </div>
        </div>`

    this.examList = function () {
        var thiz = this
        $.ajax({
            url: `${common.baseUrl}/classrooms/${common.classRoom.id}/examinationrooms`,
            dataType: 'json',
        }).then(function (res) {
            if (res.retcode != 0) throw new Error('failed to get exam list.');
            var templ = doT.template(examListTpl)
            thiz.zonediv.html(templ(res.data))
        }).catch(function (err) {
            console.log(err.message)
        })
    }

    this.init = function () {
        setInterval(this.examList, 600000)
        this.examList()
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
            'overflow': 'hidden'
        });
    };
}
