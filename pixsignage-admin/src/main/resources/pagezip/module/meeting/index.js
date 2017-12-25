'use strict';var Meeting=function(a,b){this.zonediv=a,this.zone=b,this.scalew=1,this.scaleh=1,this.host=window.android&&window.android.getHost()||'192.168.0.102:8080',this.baseUrl='http://'+this.host+'/pixmrbs-api/meetings',this.terminalId=window.android&&window.android.getTerminalId()||'00001',this.meetingRoom={},this.meetings=[];this.resize=function(c,d){this.scalew=c,this.scaleh=d,$(a).css({"box-sizing":'border-box',"border-color":b.bdcolor,"border-style":b.bdstyle,"border-width":parseInt(b.bdwidth)/c+'px',"border-radius":parseInt(b.bdradius)/c+'px',color:b.color,"font-family":b.fontfamily,"font-size":parseInt(b.fontsize)/c+'px',"text-align":b.align,"font-weight":b.fontweight,"font-style":b.fontstyle,"line-height":'1px'});var e=Math.ceil(b.height/(2*(b.rows*d))),f=b.fontsize/d;$(a).find('p').css({"line-height":e-3+'px',"text-align":b.align,"font-size":f+'px',"text-overflow":'ellipsis',overflow:'hidden',"white-space":'nowrap',margin:0}),$(a).find('img').css({height:1.4*e+'px',"text-align":b.align})},this.init=function(){var a=this;$.ajax({url:a.baseUrl+'/meeting_rooms?terminal_id='+a.terminalId+'&ts='+Date.now(),dataType:'json'}).then(function(b){if(a.meetingRoom=b.data,0<b.data.length)a.meetingRoom=b.data[0];else throw new Error('\u672A\u7ED1\u5B9A\u4F1A\u8BAE\u5BA4');var c=moment().startOf('day').format('YYYYMMDDHHmm'),d=moment().endOf('day').format('YYYYMMDDHHmm'),e={ts:Date.now(),meeting_room_id:a.meetingRoom.meeting_room_id,start_time:c,end_time:d};return $.ajax({url:''+a.baseUrl,data:e,dataType:'json'})}).then(function(b){a.meetings=b.data;var c=doT.template('\n        <table>\n            <tbody>\n            {{~it:meeting:index}}\n            <tr class="meeting" data-id="{{=meeting.id}}">\n                <td width="20%">\n                <p class="time"><i class="fa fa-star"></i> {{=moment(meeting.start_time).format(\'HH:mm\')}} - {{=moment(meeting.end_time).format(\'HH:mm\')}}</p>\n                <p class="booker">{{=meeting.book_user}}</p>\n                </td>\n                <td width="60%">\n                <p class="title">{{=meeting.subject}}</p>\n                <p>&nbsp;</p>\n                </td>\n                <td width="20%" align="right"><img src="./module/meeting/qrcode.png" /></td>\n            </tr>\n            {{~}}\n            </tbody>\n        </table>');a.zonediv.html(c(a.meetings)),a.resize(a.scalew,a.scaleh)}).catch(function(a){console.log(a.message)}),$(a.zonediv).on('click','.meeting',function(a){a.preventDefault(),$('#meeting-detail').remove();var b=$(this).data('id'),c=meetings[b-1],d=doT.template('<div class="modal" id="meeting-detail">\n        <h1>{{=it.title}}</h1>\n        <p>\u65F6\u95F4\uFF1A {{=it.start_time}} - {{=it.end_time}}</p>\n        <p>\u90E8\u95E8\uFF1A {{=it.department}}</p>\n        <p>\u4EBA\u5458\uFF1A {{=it.attendee}}</p>\n        <p>\u9884\u5B9A\u4EBA\uFF1A {{=it.booker}}</p>\n        <img src="./module/meeting/qrcode.png"/>\n        <a href="#close-modal" rel="modal:close" class="close-modal ">Close</a></div>');$(document.body).append(d(c)),$('#meeting-detail').modal(),$('#meeting-detail').css('z-index',500)})},this.init(),setTimeout(this.init,3e5)};

//# sourceMappingURL=index.js.map