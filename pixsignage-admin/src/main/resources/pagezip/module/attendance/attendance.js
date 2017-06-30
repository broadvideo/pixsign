/**
 * Created by Elvis on 2017/6/29.
 */
var Attendance = function () {
    var baseUrl = 'http://192.168.2.102/pixsignage-api/service'
    var terminalId = window.android && window.android.getTerminalId() || '00002'
    var classRoom = {}
    var students = []
    var timer = 0

    var checkin = function (student) {
        if(!student.id) return
        var id = student.id
        var nodes = document.getElementsByClassName('student')
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes.item(i)
            if (node.dataset.id == id) {
                node.getElementsByTagName('img').item(0).classList.remove('opacity')
                node.classList.add('rubberBand')
                setTimeout(function () {
                    node.classList.remove('rubberBand')
                }, 3000)
            }
        }
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
            $(tpl).load('module/attendance/attendance.tpl', function(){
                var templ = doT.template(tpl.children[0].textContent)
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
        var student = students.filter(function (student) {
            return student['hard_id'] == hardId
        })
        clearTimeout(timer)
        if (student.length) {
            var st = student[0]
            timer = setTimeout(checkin, 300, st)
            var data = JSON.stringify({
                'hard_id': st.hard_id,
                'student_id': st.student_id,
                'classroom_id': classRoom.id
            })
            $.ajax({
                url: baseUrl + '/students/' + st.id + '/attendance',
                type: 'post',
                contentType: 'json',
                data: data
            }).then(function (res) {
                console.log(res.data)
            }).catch(function (err) {
                console.log(err.message)
            })
        }
    }

    var swipe2 = function (hardId) {
        var st = students[Math.floor(Math.random() * 10)]
        clearTimeout(timer)
        timer = setTimeout(checkin, 300, st)
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
            console.log(err.message)
        })
    }

    return {
        init: init,
        swipe: swipe,
        keyup: swipe2
    }
}()
Attendance.init()
document.body.onkeyup = Attendance.keyup