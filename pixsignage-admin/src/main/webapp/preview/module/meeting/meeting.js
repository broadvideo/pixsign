var meetings = [
    {
        "id": 0,
        "title": "年中市场汇报",
        "booker": "张红兵",
        "start_time": "9:00",
        "end_time": "10:30"
    },
    {
        "id": 0,
        "title": "证券从业考试安排",
        "booker": "马鸣放",
        "start_time": "11:00",
        "end_time": "11:30"
    },
    {
        "id": 0,
        "title": "公司问题讨论会议",
        "booker": "刘海",
        "start_time": "12:00",
        "end_time": "13:00"
    },
    {
        "id": 0,
        "title": "证券公司信用汇总",
        "booker": "张红兵",
        "start_time": "14:00",
        "end_time": "15:30"
    },
    {
        "id": 0,
        "title": "客户问题汇总讨论",
        "booker": "李琼",
        "start_time": "16:00",
        "end_time": "17:00"
    },
    {
        "id": 0,
        "title": "年中市场汇报",
        "booker": "龚春红",
        "start_time": "17:30",
        "end_time": "18:30"
    },
    {
        "id": 0,
        "title": "年终茶话会",
        "booker": "龚春红",
        "start_time": "19:30",
        "end_time": "21:30"
    }
]
//日历初始化
var Meeting = function (zonediv, zone) {
    this.zonediv = zonediv;
    this.zone = zone;

    this.host = window.android && window.android.getHost() || '192.168.0.71';
    this.baseUrl = 'http://' + this.host + '/pixsignage-api/service';
    this.terminalId = window.android && window.android.getTerminalId() || '00001';
    this.meetingRoom = {};
    this.meetings = [];

    var meetingTpl = `
        <table>
            <tbody>
            {{~it:meeting:index}}
            <tr class="meeting">
                <td width="20%">
                <p class="time"><i class="fa fa-star"></i> {{=meeting.start_time}} - {{=meeting.end_time}}</p>
                <p class="booker">{{=meeting.booker}}</p>
                </td>
                <td width="60%">
                <p class="title">{{=meeting.title}}</p>
                <p>&nbsp;</p>
                </td>
                <td width="20%" align="right"><img src="./module/meeting/qrcode.png" /></td>
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
            'line-height': '1px'
        });
        var lineHeight = Math.ceil(zone.height / (zone.rows * scaleh * 2))
        var fontsize = zone.fontsize / scaleh
        $(zonediv).find('p').css({
            'line-height': lineHeight - 3 + 'px',
            'text-align': zone.align,
            'font-size': fontsize + 'px',
            'text-overflow':'ellipsis',
            overflow: 'hidden',
            'white-space':'nowrap',
            margin: 0
        });
        $(zonediv).find('img').css({
            'height': 1.4 * lineHeight + 'px',
            'text-align': zone.align
        });
    };

    // 数据初始化
    /*this.init = function () {
        var thiz = this
        $.ajax({
            url: `${thiz.baseUrl}/terminals/${thiz.terminalId}/meetingroom?ts=${Date.now()}`,
            dataType: 'json'
        }).then(function (res) {
            thiz.meetingRoom = res.meetingroom;
            return $.ajax({
                url: `${thiz.baseUrl}/meetingrooms/${thiz.meetingRoom.id}/meetings?ts=${Date.now()}`,
                dataType: 'json'
            });
        }).then(function (res) {
            thiz.meetings = res.data;
            var templ = doT.template(meetingTpl)
            thiz.zonediv.html(templ(thiz.meetings))
        }).catch(function (err) {
            console.log(err.message);
        });
    }*/

    this.init = function () {
        var thiz = this
        var templ = doT.template(meetingTpl)
        thiz.zonediv.html(templ(meetings))
    }

    this.init()

    //周期性更新数据
    //setTimeout(this.init, 300000)
};
