'use strict';var WeeklyCourse=function(f,a,g,c){this.zonediv=f,this.zone=a,common.weeklyCourse.push(this),this.resize=function(b){var c=Math.ceil,d=this;f.css({"box-sizing":'border-box',"border-color":a.bdcolor,"border-style":a.bdstyle,"border-width":parseInt(a.bdwidth)/b+'px',"border-radius":parseInt(a.bdradius)/b+'px',color:a.color,"font-family":a.fontfamily,"font-size":parseInt(a.fontsize)/b+'px',"text-align":a.align,"font-weight":a.fontweight,"font-style":a.fontstyle}),f.find('table').css({"table-layout":'fixed'}),f.find('td').css({"border-width":c(a.rulewidth/b)+'px',"border-color":a.rulecolor,"word-wrap":'break-word',"white-space":'pre-wrap',"text-decoration":a.decoration,height:d.zonediv.height()/a.rows-c(a.rulewidth/b)})},this.init=function(){var d=this;$.ajax({url:common.baseUrl+'/classrooms/'+common.classRoom.id+'/schedules?ts='+Date.now(),contentType:'application/json; charset=UTF-8',dataType:'json'}).then(function(a){if(0!=a.retcode)throw new Error('failed to get day course list.');a.course_schedules.forEach(function(b){b.current=moment().format('E')==b.workday&&moment(b.start_time,'HH:mm').isBefore(moment())&&moment(b.end_time,'HH:mm').isAfter(moment())}),a.scheme.workdays=a.scheme.workdays.map(function(b){return 1===b?{index:b,dayname:'\u661F\u671F\u4E00'}:2===b?{index:b,dayname:'\u661F\u671F\u4E8C'}:3===b?{index:b,dayname:'\u661F\u671F\u4E09'}:4===b?{index:b,dayname:'\u661F\u671F\u56DB'}:5===b?{index:b,dayname:'\u661F\u671F\u4E94'}:6===b?{index:b,dayname:'\u661F\u671F\u516D'}:7===b?{index:b,dayname:'\u661F\u671F\u5929'}:void 0}).slice(0,d.zone.cols-1),a.scheme.morning.dtls.forEach(function(b){switch(b.period_num){case 1:b.courseName='\u7B2C\u4E00\u8282';break;case 2:b.courseName='\u7B2C\u4E8C\u8282';break;case 3:b.courseName='\u7B2C\u4E09\u8282';break;case 4:b.courseName='\u7B2C\u56DB\u8282';break;case 5:b.courseName='\u7B2C\u4E94\u8282';break;case 6:b.courseName='\u7B2C\u516D\u8282';break;case 7:b.courseName='\u7B2C\u4E03\u8282';}}),a.scheme.afternoon.dtls.forEach(function(b){switch(b.period_num){case 1:b.courseName='\u7B2C\u4E00\u8282';break;case 2:b.courseName='\u7B2C\u4E8C\u8282';break;case 3:b.courseName='\u7B2C\u4E09\u8282';break;case 4:b.courseName='\u7B2C\u56DB\u8282';break;case 5:b.courseName='\u7B2C\u4E94\u8282';break;case 6:b.courseName='\u7B2C\u516D\u8282';}}),a.scheme.night.dtls.forEach(function(b){switch(b.period_num){case 1:b.courseName='\u7B2C\u4E00\u8282';break;case 2:b.courseName='\u7B2C\u4E8C\u8282';break;case 3:b.courseName='\u7B2C\u4E09\u8282';break;case 4:b.courseName='\u7B2C\u56DB\u8282';}}),a.cols=d.zone.cols;var b=doT.template('<table>\n            <tbody>\n            <tr>\n                <td>\u65F6\u95F4</td>\n                {{~it.scheme.workdays:day:index}}\n                <td>{{=day.dayname}}</td>\n                {{~}}\n            </tr>\n            {{~it.scheme.morning.dtls:courseIndex:index}}\n            <tr>\n                <td><span>{{=courseIndex.courseName}}</span><span>{{=courseIndex.start_time}}</span></td>\n                {{~it.scheme.workdays:day:index2}}\n                <td data-periodnum="{{=index+1}}" data-type="0" data-workday="{{=index2+1}}"> </td>\n                {{~}}\n            </tr>\n            {{~}}\n            <tr><td colspan="{{=it.cols}}"> </td></tr>\n            {{~it.scheme.afternoon.dtls:courseIndex:index}}\n            <tr>\n                <td><span>{{=courseIndex.courseName}}</span><span>{{=courseIndex.start_time}}</span></td>\n                {{~it.scheme.workdays:day:index2}}\n                <td data-periodnum="{{=index+1}}" data-type="2" data-workday="{{=index2+1}}"> </td>\n                {{~}}\n            </tr>\n            {{~}}\n            <tr></tr>\n            {{~it.scheme.night.dtls:courseIndex:index}}\n            <tr>\n                <td><span>{{=courseIndex.courseName}}</span><span>{{=courseIndex.start_time}}</span></td>\n                {{~it.scheme.workdays:day:index2}}\n                <td data-periodnum="{{=index+1}}" data-type="3" data-workday="{{=index2+1}}"> </td>\n                {{~}}\n            </tr>\n            {{~}}\n            </tbody>\n        </table>');d.zonediv.html(b(a)),a.course_schedules.forEach(function(e){d.zonediv.find('td').each(function(b,a){if($(a).data('periodnum')==e.period_num&&$(a).data('type')==e.type&&$(a).data('workday')==e.workday){var c='';c=e.teacher_name?'<span>'+e.course_name+'</span>&nbsp;<span>('+e.teacher_name+')</span>':'<span>'+e.course_name+'</span>',$(a).html(c)}})}),d.zonediv.find('tr').each(function(a,b){a>=d.zone.rows&&$(b).remove()}),d.zonediv.find('table').css({width:'100%',height:'100%'}),d.zonediv.find('table').attr('rules',d.zone.rules),d.resize(g,c)}).catch(function(b){console.log(b.message)})}};

//# sourceMappingURL=index.js.map