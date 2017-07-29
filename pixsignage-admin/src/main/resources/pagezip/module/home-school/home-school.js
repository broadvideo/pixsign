/**
 * Created by Elvis on 2017/6/29.
 */
var HomeSchool = function (zonediv, zone) {
    this.zonediv = zonediv;
    this.zone = zone;
    common.homeSchool.push(this)
    var student = {}
    var msgSumTpl = `<table class="home-school-table">
            <tbody>
            {{? it.length == 0}}
            无留言记录
            {{?}}
            {{~it:msgSum:index}}
            <tr class="home-school-tr">
                <td class="home-school-avatar">
                    <img src="{{=msgSum.avatar}}"/>
                </td>
                <td class="home-school-name">
                    <span>{{=msgSum.student_name}}</span>
                </td>
                <td class="home-school-sum">
                    <span>{{=msgSum.num}}</span>
                </td>
            </tr>
            {{~}}
            </tbody>
        </table>`
    var msgListTpl = `<div class="home-school-popup">
            <div style="padding: 0 5px;">
                <span class="home-school-close"><i class="fa fa-times"></i></span>
                <p class="home-school-title">消息列表</p>
            </div>
            <hr style="margin: 0">
            <table class="home-school-table">
                <tbody>
                {{~it:message:index}}
                <tr class="home-school-tr">
                    <td class="home-school-avatar">
                        <img src="{{=message.headimgurl}}"/>
                    </td>
                    <td class="home-school-name">
                        <span>{{=message.name}}</span>
                    </td>
                    <td class="home-school-message">
                        {{? message.message_info}}
                        <span>{{=message.message_info}}</span>
                        {{?}}
                        {{? message.mp3_file}}
                        <audio src="{{=message.mp3_file}}" controls=controls></audio>
                        {{?}}
                    </td>
                    <td class="home-school-ts">
                        <span>{{=message.send_time}}</span>
                    </td>
                </tr>
                {{~}}
                </tbody>
            </table>
            <hr style="margin: 0">
            <div style="padding:0 5px">
                <span class="home-school-audio"><i class="fa fa-bullhorn"></i></span>
            </div>
        </div>`

    var messageSum = function () {
        $.ajax({
            url: `${common.baseUrl}/classrooms/${common.classRoom.id}/messagesum?ts=${Date.now()}`,
            dataType: 'text'
        }).then(function (res) {
            console.log(JSON.stringify(res))
            var msgSum = Base64.decode(res)
            var msgSum2 = JSON.parse(msgSum)
            console.log(msgSum2)
            msgSum2.forEach(sum => {
                common.students.forEach(student => {
                    if (student.student_no === sum.student_no) {
                        sum.avatar = student.avatar
                    }
                })
            })
            var templ = doT.template(msgSumTpl)
            $(zonediv).html(templ(msgSum2))
        }).catch(function (err) {
            console.log(JSON.stringify(err))
        })
    }

    this.init = function () {
        messageSum()
        setInterval(messageSum, 5000)
        $('body').on('click', '.home-school-close', function () {
            $('.home-school-popup').remove()
        })
        $('body').on('click', '.home-school-audio', function (event) {
            event.preventDefault()
            console.log('recording button is clicked')
            if ($(this).hasClass('recording')) {
                $(this).removeClass('recording')
                let audioData = window.android.closeVoiceRecorder()
                let data = {
                    student_id: student.id,
                    text: '',
                    audio: audioData,
                    msg_time: Date.now()
                }
                $.ajax({
                    url: `${common.baseUrl}/students/${student.id}/message?ts=${Date.now()}`,
                    type: 'POST',
                    cache: false,
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    dataType: 'json'
                }).then(function (res) {
                    console.log('send message successfully')
                }).catch(function (err) {
                    console.log(JSON.stringify(err))
                })
            } else {
                $(this).addClass('recording')
                window.android.openVoiceRecorder()
            }
        })
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
        });
    };

    this.swipe = function (hardId) {
        var studentFilter = common.students.filter(function (student) {
            return student['hard_id'] == hardId
        })
        if (studentFilter.length) {
            student = studentFilter[0]
            $.ajax({url: `${common.baseUrl}/students/${student.id}/messages?ts=${Date.now()}`, dataType: 'text'}).then(function (res) {
                var messages = Base64.decode(res)
                var messages2 = JSON.parse(messages)
                $('.home-school-popup').remove()
                var templ = doT.template(msgListTpl)
                $(document.body).append(templ(messages2))
            }).catch(function (err) {
                console.log(err)
            })
        }
    }

    this.keyup = function () {
        student = common.students[Math.floor(Math.random() * 10)]
        $.ajax({url: `${common.baseUrl}/students/18/messages?ts=${Date.now()}`, dataType: 'text'}).then(function (res) {
            var messages = Base64.decode(res)
            var messages2 = JSON.parse(messages)
            console.log(messages2)
            $('.home-school-popup').remove()
            var templ = doT.template(msgListTpl)
            $(document.body).append(templ(messages2))
        }).catch(function (err) {
            console.log(err)
        })
    }
}