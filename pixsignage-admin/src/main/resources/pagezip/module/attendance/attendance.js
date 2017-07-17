/**
 * Created by Elvis on 2017/6/29.
 */
var Attendance = function () {
    var host = window.android && window.android.getHost() || '192.168.0.102'
    var baseUrl = 'http://' + host + '/pixsignage-api/service'
    var terminalId = window.android && window.android.getTerminalId() || '00002'
    var classRoom = {}
    var students = []
    var timer = 0

    var checkin = function (student) {
        if(!student.id) return
        $('.attendance-item').each(function(index, node){
            if ($(node).data('id') == student.id) {
                $(node).find('img').removeClass('opacity')
                $(node).addClass('rubberBand')
                setTimeout(function () {
                    $(node).removeClass('rubberBand')
                }, 1000)
                $('.attendance-popup').remove()
                clearTimeout(timer)
                $(node).clone().removeClass('attendance-item animated rubberBand').addClass('attendance-popup').appendTo('body')
                timer = setTimeout(function(){
                    $('.attendance-popup').remove()
                },5000)
            }
        })
    }
    /*function checkout() {
     students.forEach(function (student) {
     document.getElementById('i' + student.id).classList.add('opacity')
     })
     }*/
    var init = function () {
        $.ajax({
            url: baseUrl + '/terminals/' + terminalId + '/classroom',
            dataType: 'json'
        }).then(function (res) {
            classRoom = res.classroom
            return $.ajax({
                url: baseUrl + '/classrooms/' + classRoom.id + '/students',
                dataType: 'json'
            })
        }).then(function (res) {
            students = res.data
            var tpl = document.createElement('div')
            $('<div />').load('module/attendance/attendance.tpl', function(){
                var templ = doT.template($(this).text())
                var nodes = document.getElementsByClassName('attendance')
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes.item(i)
                    node.innerHTML = templ(res.data)
                }
            })
        }).catch(function (err) {
            console.log(err.message)
        })
    }

    var swipe = function (hardId) {
        console.log(hardId)
        var student = students.filter(function (student) {
            return student['hard_id'] == hardId
        })
        clearTimeout(timer)
        if (student.length) {
            var st = student[0]
            checkin(st)
            var data = JSON.stringify({
                'hard_id': st.hard_id,
                'student_id': st.id,
                'classroom_id': classRoom.id
            })
            $.ajax({
                url: baseUrl + '/students/' + st.id + '/attendance',
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
    var keyup = function (hardId) {
        var st = students[Math.floor(Math.random() * 10)]
        checkin(st)
        var data = JSON.stringify({
            'hard_id': st['hard_id'],
            'student_id': st.id,
            'classroom_id': classRoom.id,
            ts: Date.now()
        })
        $.ajax({
            url: baseUrl + '/students/' + st.id + '/attendance',
            type: 'post',
            contentType: 'application/json',
            data: data
        }).then(function (res) {
            console.log(res.data)
        }).catch(function (err) {
            console.log(JSON.stringify(err))
        })
    }

    return {
        init: init,
        swipe: swipe,
        keyup: keyup
    }
}()
$(function(){
    Attendance.init()
})
document.body.addEventListener('keyup', Attendance.keyup)