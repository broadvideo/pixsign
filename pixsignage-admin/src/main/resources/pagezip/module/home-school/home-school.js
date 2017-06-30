/**
 * Created by Elvis on 2017/6/29.
 */
var HomeSchool = function () {
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
            $.ajax({ url: baseUrl + '/students/' + st.id + '/messages', dataType: 'text' }).then(function (res) {
                var messages = Base64.decode(res)
                var messages2 = JSON.parse(messages)
                console.log(messages2)
                var tpl = document.createElement('div')
                $(tpl).load('module/home-school/home-school.tpl', function(){
                    var templ = doT.template(tpl.children[0].textContent)
                    var nodes = document.getElementsByClassName('home-school')
                    for (var i = 0; i < nodes.length; i++) {
                        var node = nodes.item(i)
                        node.innerHTML = templ(messages2)
                    }
                })
            }).catch(function (err) {
                console.log(err.message)
            })
        }
    }

    var keyup = function (event) {
        event.preventDefault()
        var st = students[Math.floor(Math.random() * 10)]
        $.ajax({ url: baseUrl + '/students/' + 11 + '/messages', dataType: 'text' }).then(function (res) {
            var messages = Base64.decode(res)
            var messages2 = JSON.parse(messages)
            console.log(messages2)
            var tpl = document.createElement('div')
            $(tpl).load('module/home-school/home-school.tpl', function(){
                var templ = doT.template(tpl.children[0].textContent)
                var nodes = document.getElementsByClassName('home-school')
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes.item(i)
                    node.innerHTML = templ(messages2)
                }
            })
        }).catch(function (err) {
            console.log(err.message)
        })
    }

    return {
        init: init,
        swipe: swipe,
        keyup: keyup
    }
}()
document.body.onkeyup = HomeSchool.keyup