//分类列表获取，用于初始化视频列表
function get_vod() {
	var mediaID=localStorage.mediaID;
	$.ajax({
		url : '/media',
		type : 'GET',
		contentType : 'application/json; charset=utf-8',
		timeout : 5000,
		data : {media_id:mediaID,media_type:"VOD"},
		dataType : 'jsonp',
		beforeSend: function(xhr, settings) {
			var rstoken = "Token " + $.cookie('Token');
			xhr.setRequestHeader("Authorization", rstoken);
		},
		success: function(data, textStatus){
			var play_url=data.play_url;
			jwplayer("player").setup({
				skin: "assets/plugins/jwplayer/skins/roundster.xml",
				stretching: "fill",
				image: "assets/plugins/jwplayer/preview.jpg",
				bgcolor :"#fff",
				width: 640,
				height:360,
				file: play_url,
				autostart: false,
				bufferlength:10,			
				primary: 'flash',
				flashplayer: "assets/plugins/jwplayer/jwplayer.flash.swf"
			});		
		},
		error : function(jqXHR, textStatus) {
			toastr.error('读取视频信息失败。');
		}
	});
}

//根据分类获取视频列表
function messages() {
    //'use strict';
    var socket;
    var protocol_identifier = 'chat';
    var nickname = localStorage.username;
    var chatroom = localStorage.mediaTitle;
	//var chatroom = "elvis";
	var chatID=chatroom+'_'+nickname;
    var myId;
    var nicklist;
    var is_typing_indicator;
    var window_has_focus = true;
    var actual_window_title = document.title;
    var flash_title_timer;
    var enable_ssl = false;
    var connected = false;
    var connection_retry_timer;

    if (enable_ssl === false) {
        var server_url = 'ws://180.96.19.239:18020/';
		//var server_url = 'ws://192.168.0.49:8804/';
		//var server_url = 'ws://192.168.0.182:18020/';
    } else {
        var server_url = 'wss://www.pix2trans.net:8805/';
    }

    var msg_bubble_types = [
        'note-success',
        'note-info',
        'note-warning',
        'note-danger'
    ];

    /*if (!is_websocket_supported()) {
        $('#info').html('您的游览器不支持websockets。请更新版本，或者使用支持websockets的浏览器，比如Firefox、Chrome。');
    }*/
	
	$("#chatlog-clear").click(function(){
		sessionStorage.setItem(chatID,'');
		$("#messages").empty();
	});
	
	window.location.hash = '#' + chatroom;
	//connection_in_progress = true;
	show_timer();
	open_connection();

	if (myId === undefined) { // if connection not already established
		$('#info').html('服务器连接中...');
	}

    $('#message-submit').click(function () {
        send_msg_box_content();
    });

    $('#message').keypress(function (e) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
			send_msg_box_content();
        } else {
            send_user_typing_activity_alert();
        }
    });

    $(window).focus(function() {
        window_has_focus = true;
        clearInterval(flash_title_timer);
    });

    $(window).blur(function() {
        window_has_focus = false;
    });
    
    // Request permission to show desktop notifications
    if (window.webkitNotifications) {
        window.webkitNotifications.requestPermission();
    }

    function open_connection() {
        socket = new WebSocket(server_url, protocol_identifier);
        socket.addEventListener("open", connection_established);
    }

    function connection_established(event) {
        connected = true;
        clearInterval(connection_retry_timer);
		$('#info').css("visibility","hidden");
        introduce(nickname);
        socket.addEventListener('message', function (event) {
            message_received(event.data);
        });
		if(sessionStorage.getItem(chatID)){
        	$('#messages').html(sessionStorage.getItem(chatID));
		}
		else {
			sessionStorage.setItem(chatID,'');
		}
        socket.addEventListener('close', function (event) {
            connected = false;
            showConnectionLostMessage();
            reConnect();
        });
    }

    function introduce(nickname) {
        var intro = {
            type: 'intro',
            nickname: nickname,
            chatroom: chatroom
        }
        socket.send(JSON.stringify(intro));
    }

    function message_received(rmessage) {
        var message;
        message = JSON.parse(rmessage);
        if (message.type === 'welcome') {
            myId = message.userId;
			$('#chatroom-name').text(chatroom+"讨论组");
			var cDate= new Date();
			var cTime= cDate.toLocaleDateString()+' '+cDate.toLocaleTimeString();
			var welcome_msg='<div class="note note-success"><p>欢迎'+nickname+'加入讨论组!<span class="pull-right ctime">'+cTime+'<span></p></div>';
			$('#messages').append(welcome_msg);
			$("#messages").animate({
				scrollTop: $("#messages")[0].scrollHeight
			}, 1000);		
			var chatlog=sessionStorage.getItem(chatID);
			sessionStorage.setItem(chatID,chatlog+welcome_msg);
			//send_message("Hello");
        } else if (message.type === 'message' && parseInt(message.sender) !== parseInt(myId)) {
            add_new_msg_to_log(message);
            document.getElementById('chat-notification-sound').play();
        } else if (message.type === 'nicklist') {
            $('#nicklist').empty();
            nicklist = message.nicklist;
			$.each(nicklist,function(index,item){
				$('#nicklist').append('<div class="alert alert-info">'+item+'</div>');
			});
			$('#online-sum').text("在线人数："+nicklist.length);
		} else if (message.type === 'activity_typing' && parseInt(message.sender) !== parseInt(myId)) {
            var activity_msg = message.name + '正在输入中..';
            $('#info').html(activity_msg).fadeIn();
            clearTimeout(is_typing_indicator);
            is_typing_indicator = setTimeout(function () {
                $('#info').fadeOut();
            }, 2000);
        }

    }

    function send_msg_box_content() {
        var message = $('#message').val();
        if (message != '') {
            send_message(message);
            $('#message').val('');
        }
    }

    function send_message(message) {
        var message_to_send = {
            type: 'message',
            nickname: nickname,
            message: message,
            sender: myId,
            chatroom: chatroom
        };

        var msg_data_str = JSON.stringify(message_to_send);

        socket.send(msg_data_str);
        add_new_msg_to_log(message_to_send);
    }

    function add_new_msg_to_log(message) {
        var msg_string;
        var bubble_type = msg_bubble_types[message.sender % msg_bubble_types.length];

        // Lets replace \n characters with html line break before rendering to the user
        var msg_text = strip_html_tags(message.message).split('\n').join('<br />');
		var cTime= new Date().toLocaleTimeString();
		msg_string = '<div class="note '+bubble_type+'"><p>'+message.nickname+': '+msg_text+'<span class="pull-right ctime">'+cTime+'</span></p></div>';
		var chatlog=sessionStorage.getItem(chatID);
		sessionStorage.setItem(chatID,chatlog+msg_string);
        $('#messages').append(msg_string);
        $("#messages").animate({
            scrollTop: $("#messages")[0].scrollHeight
        }, 1000);
    }

    function is_websocket_supported() {
        if ('WebSocket' in window) {
            return true;
        }
        return false;
    }

    function show_timer() {
        var time_start = 5;
        var time_string;
        var tick = window.setInterval(function () {
            if (time_start-- > 0) {
                time_string = time_start + ' seconds';
            } else {
                time_string = '服务器连接中，请稍候。';
            }

            $('#info').html(time_string);
        }, 1000);
    }

    function strip_html_tags(text) {
        var temp_element = document.createElement('div');
        temp_element.innerHTML = text.replace(/(<([^>]+)>)/ig, '');
        return temp_element.textContent || temp_element.innerText || '--empty--';
    }

    function send_user_typing_activity_alert() {
        var message_to_send = {
            type: 'activity_typing',
            name: nickname,
            chatroom: chatroom
        };

        var msg_data_str = JSON.stringify(message_to_send);
        socket.send(msg_data_str);
    }

    function clear_chat_log() {
        $('#messages').html('');
    }

    function blink_window_title(msg_to_blink) {
        if (!window_has_focus) {
            play_notification_sound();
            clearInterval(flash_title_timer);
			flash_title_timer = setInterval(function () {
				if (document.title === actual_window_title) {
					document.title = msg_to_blink;
				} else {
					document.title = actual_window_title;
				}
			}, 1000);
		}
    }

    function play_notification_sound() {
        $('#chat-notification-sound').play();
    }

    function showDesktopNotification(title, message) {
        if (window.webkitNotifications === undefined) {
            // Desktop notifications are not supported
            return;
        }
        
        if (window.webkitNotifications.checkPermission() == 0) {
            var notification = window.webkitNotifications.createNotification('', title, message);
            notification.show();
            window.setTimeout(function () {
                notification.cancel();
            }, 5000);
        } else {
            window.webkitNotifications.requestPermission(function () {
                if (window.webkitNotifications.checkPermission() == 0) {
                    var notification = window.webkitNotifications.createNotification('', title, message);
                    notification.show();
                    window.setTimeout(function () {
                        notification.cancel();
                    }, 5000);
                }
            });
        }
    }
    
    function showNewMessageDesktopNotification(user, message) {
        showDesktopNotification(user, message);
    }
    
    function reConnect() {
        if (!connected) {
            connection_retry_timer = setInterval(function () {
                if (socket.readyState === 3) { // 3 => Connection closed
                    open_connection();
                }
            }, 1000);
        } else {
            clearTimeout(connection_retry_timer);
        }
    }
    
    function showConnectionLostMessage() {
        $('#info').append('<div class="alert alert-danger" style="visibility:hidden">服务器连接丢失。</div>');
    }
    
}

var VOD = function () {
    return {
        init: function () {
			toastr.options={
			  "closeButton": true,
			  "debug": false,
			  "progressBar": false,
			  "positionClass": "toast-top-right",
			  "onclick": null,
			  "showDuration": "300",
			  "hideDuration": "1000",
			  "timeOut": "5000",
			  "extendedTimeOut": "1000",
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut"
			};			
			var winHeight=window.innerHeight;
			$("#player").closest(".container").css('min-height',winHeight-340);
			$('#logoff').click(function(){
				localStorage.clear();
				window.location.href="../../index2.html";
			});

			//页面显示初始化
			if(localStorage.username) {
				$('#welcome').text(localStorage.username+", 您好");
			}
			if(localStorage.orgLogo) {
				$('#logoimg').attr("src",localStorage.orgLogo);
			}
			if(localStorage.org) {
				$('#org-name').text(" "+localStorage.org+" 欢迎您！");
			}
			if(localStorage.mediaTitle){
				$('#vod-info').append("<li><a>"+localStorage.catTitle+" > "+localStorage.mediaTitle+"</a></li>");
			}
			if(localStorage.extDesc&&localStorage.extPic) {
				$('#ext-pic').attr("src",localStorage.extPic);
				$('#ext-desc').text(localStorage.extDesc);
				$("#about").removeClass("col-md-7");
				$("#about").addClass("col-md-5");
				$("#contact").removeClass("col-md-5");
				$("#contact").addClass("col-md-4");
				$("#ext-info").css("display","");
			}
			if(localStorage.messages){
				$('#messages').append(localStorage.messages);
				$("#messages").scrollTop($("#messages")[0].scrollHeight);
			}
			//对分类进行渲染
			get_vod();
			messages();
        }
    };
}();