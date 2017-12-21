//日历初始化
var Meeting = function (zonediv, zone) {
    this.zonediv = zonediv;
    this.zone = zone;
    this.scalew = 1;
    this.scaleh = 1;
    this.host = window.android && window.android.getHost() || '192.168.0.102:8080';
    this.baseUrl = 'http://' + this.host + '/pixmrbs-api/meetings';
    this.terminalId = window.android && window.android.getTerminalId() || '00001';
    this.meetingRoom = {};
    this.meetings = [];

    var meetingTpl = `
        <table>
            <tbody>
            {{~it:meeting:index}}
            <tr class="meeting" data-id="{{=meeting.id}}">
                <td width="20%">
                <p class="time"><i class="fa fa-star"></i> {{=moment(meeting.start_time).format('HH:mm')}} - {{=moment(meeting.end_time).format('HH:mm')}}</p>
                <p class="booker">{{=meeting.book_user}}</p>
                </td>
                <td width="60%">
                <p class="title">{{=meeting.subject}}</p>
                <p>&nbsp;</p>
                </td>
                <td width="20%" align="right"><img src="./module/meeting/qrcode.png" /></td>
            </tr>
            {{~}}
            </tbody>
        </table>`

    var detailTpl = `<div class="modal" id="meeting-detail">
        <h1>{{=it.title}}</h1>
        <p>时间： {{=it.start_time}} - {{=it.end_time}}</p>
        <p>部门： {{=it.department}}</p>
        <p>人员： {{=it.attendee}}</p>
        <p>预定人： {{=it.booker}}</p>
        <img src="./module/meeting/qrcode.png"/>
        <a href="#close-modal" rel="modal:close" class="close-modal ">Close</a></div>`

    this.resize = function (scalew, scaleh) {
        this.scalew = scalew
        this.scaleh = scaleh
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
            'line-height': '1px'
        });
        var lineHeight = Math.ceil(zone.height / (zone.rows * scaleh * 2))
        var fontsize = zone.fontsize / scaleh
        $(zonediv).find('p').css({
            'line-height': lineHeight - 3 + 'px',
            'text-align': zone.align,
            'font-size': fontsize + 'px',
            'text-overflow': 'ellipsis',
            overflow: 'hidden',
            'white-space': 'nowrap',
            margin: 0
        });
        $(zonediv).find('img').css({
            'height': 1.4 * lineHeight + 'px',
            'text-align': zone.align
        });
    };

    // 数据初始化
    this.init = function () {
        var thiz = this
        $.ajax({
            url: `${thiz.baseUrl}/meeting_rooms?terminal_id=${thiz.terminalId}&ts=${Date.now()}`,
            dataType: 'json'
        }).then(function (res) {
            thiz.meetingRoom = res.data;
            if (res.data.length > 0) thiz.meetingRoom = res.data[0]
            else throw new Error('未绑定会议室')
            var start_time = moment().startOf('day').format('YYYYMMDDHHmm')
            var end_time = moment().endOf('day').format('YYYYMMDDHHmm')
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
            thiz.meetings = res.data;
            var templ = doT.template(meetingTpl)
            thiz.zonediv.html(templ(thiz.meetings))
            thiz.resize(thiz.scalew, thiz.scaleh)
        }).catch(function (err) {
            console.log(err.message);
        });
        $(thiz.zonediv).on('click', '.meeting', function (ev) {
            ev.preventDefault()
            $('#meeting-detail').remove()
            var id = $(this).data('id')
            var meeting = meetings[id - 1]
            var dtlTpl = doT.template(detailTpl)
            $(document.body).append(dtlTpl(meeting))
            $('#meeting-detail').modal()
            $('#meeting-detail').css('z-index', 500)
        })
    }

    this.init()
    //周期性更新数据
    setTimeout(this.init, 300000)
};
