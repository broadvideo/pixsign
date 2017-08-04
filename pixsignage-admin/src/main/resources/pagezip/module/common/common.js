/**
 * Created by Elvis on 2017/6/29.
 */
var common = new function () {
    this.host = window.android && window.android.getHost() || '192.168.0.102';
    this.baseUrl = 'http://' + this.host + '/pixsignage-api/service';
    this.terminalId = window.android && window.android.getTerminalId() || '00004';
    this.classRoom = null;
    this.students = null;
    this.homeSchool = [];
    this.attendance = [];
    this.dailyCourse = [];
    this.weeklyCourse = [];
    this.exam = [];
    $.ajaxSetup({
        global: true,
        cache: false
    });
    this.init = function init() {
        var thiz = this
        $.ajax({
            url: `${thiz.baseUrl}/terminals/${thiz.terminalId}/classroom?ts=${Date.now()}`,
            dataType: 'json'
        }).then(function (res) {
            thiz.classRoom = res.classroom;
            return $.ajax({
                url: `${thiz.baseUrl}/classrooms/${thiz.classRoom.id}/students?ts=${Date.now()}`,
                dataType: 'json'
            });
        }).then(function (res) {
            thiz.students = res.data;
            thiz.dailyCourse.forEach(item => item.init());
            thiz.weeklyCourse.forEach(item => item.init());
            thiz.homeSchool.forEach(item => item.init());
            thiz.attendance.forEach(item => item.init());
            thiz.exam.forEach(item => item.init());
        }).catch(function (err) {
            console.log(err.message);
        });
    };
    this.swipe = function(hardId) {
        this.homeSchool.forEach(item => item.swipe(hardId));
        this.attendance.forEach(item => item.swipe(hardId));
    }
    this.init();
}();