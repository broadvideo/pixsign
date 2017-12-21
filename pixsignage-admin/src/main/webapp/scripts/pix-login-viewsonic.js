var Login = function () {
	var _subsystem;
	var _privileges;
	
	var init = function (subsystem) {
		_subsystem = subsystem;
		if (subsystem == 'org') {
			$('.login').css('display', 'none');
			$('.level-1').css('display', '');
			$('.level-2-1').css('display', 'none');
			$('.level-2-2').css('display', 'none');
			$('.level-2-3').css('display', 'none');
			$('.level-2-4').css('display', 'none');
		} else {
			$('.login').css('display', '');
			$('.level-1').css('display', 'none');
			$('.level-2-1').css('display', 'none');
			$('.level-2-2').css('display', 'none');
			$('.level-2-3').css('display', 'none');
			$('.level-2-4').css('display', 'none');
		}
		refreshPrivilege();
		handleMenu();
		handleLogin();
	};
	
	var refreshPrivilege = function() {
		$.ajax({
			type : 'GET',
			url : 'org/staff!get.action',
			data : {},
			success : function(data, status) {
				if (data.staff != null) {
					_privileges = data.staff.privileges[0].children;
				}
			},
			error : function() {
				console.log('failue');
			}
		});
	}
	
	var getPrivilege = function(privilegeid) {
		for (var i=0; i<_privileges.length; i++) {
			if (_privileges[i].privilegeid == privilegeid) {
				return _privileges[i];
			}
			var children = _privileges[i].children;
			for (var j=0; j<children.length; j++) {
				if (children[j].privilegeid == privilegeid) {
					return children[j];
				}
			}
		}
		return null;
	}
	
	var handleMenu = function() {
		refreshPrivilege();
		$('body').on('click', '.menu-devicemanage', function(event) {
			$('.login').css('display', 'none');
			$('.level-1').css('display', 'none');
			$('.level-2-1').css('display', '');
			$('.level-2-2').css('display', 'none');
			$('.level-2-3').css('display', 'none');
			$('.level-2-4').css('display', 'none');
		});			
		$('body').on('click', '.menu-program', function(event) {
			$('.login').css('display', 'none');
			$('.level-1').css('display', 'none');
			$('.level-2-1').css('display', 'none');
			$('.level-2-2').css('display', '');
			$('.level-2-3').css('display', 'none');
			$('.level-2-4').css('display', 'none');
		});			
		$('body').on('click', '.menu-stat', function(event) {
			$('.login').css('display', 'none');
			$('.level-1').css('display', 'none');
			$('.level-2-1').css('display', 'none');
			$('.level-2-2').css('display', 'none');
			$('.level-2-3').css('display', '');
			$('.level-2-4').css('display', 'none');
		});			
		$('body').on('click', '.menu-system', function(event) {
			$('.login').css('display', 'none');
			$('.level-1').css('display', 'none');
			$('.level-2-1').css('display', 'none');
			$('.level-2-2').css('display', 'none');
			$('.level-2-3').css('display', 'none');
			$('.level-2-4').css('display', '');
		});			

		$('body').on('click', '.submenu-return', function(event) {
			$('.login').css('display', 'none');
			$('.level-1').css('display', '');
			$('.level-2-1').css('display', 'none');
			$('.level-2-2').css('display', 'none');
			$('.level-2-3').css('display', 'none');
			$('.level-2-4').css('display', 'none');
		});			

		$('body').on('click', '.submenu', function(event) {
			var privilegeid = $(event.target).closest('.submenu').attr('privilegeid');
			var privilege = getPrivilege(privilegeid);
			console.log(privilege, privilege.menuurl);
			if (privilege != null) {
				window.location.href = 'org/' + privilege.menuurl;
			}
		});
	}

	var handleLogin = function() {
		$('input[name=username]', $('#LoginForm')).attr('value', $.cookie('pixsignage.username'));
		$('input[name=password]', $('#LoginForm')).attr('value', '');

		if ($.cookie('pixsignage.remember') == 'true') {
			$('input[name=remember]', $('#LoginForm')).attr('checked', true);
			$('input[name=remember]', $('#LoginForm')).parent().addClass('checked');
		}

		$('#LoginForm').validate({
	            errorElement: 'span', 
	            errorClass: 'help-block', 
	            focusInvalid: false, 
	            rules: {
	                username: {
	                    required: true
	                },
	                password: {
	                    required: true
	                },
	                remember: {
	                    required: false
	                }
	            },
	            messages: {
	                username: {
	                    required: common.tips.username_required
	                },
	                password: {
	                    required: common.tips.password_required
	                },
	            },
	            invalidHandler: function (event, validator) {
	            	$('.alert-danger span', $('#LoginForm')).html(common.tips.input_check);
	            	$('.alert-danger', $('#LoginForm')).show();
	            },
	            highlight: function (element) {
	                $(element).closest('.form-group').addClass('has-error');
	            },
	            success: function (label) {
	                label.closest('.form-group').removeClass('has-error');
	                label.remove();
	            },
	            errorPlacement: function (error, element) {
	                error.insertAfter(element.closest('.input-icon'));
	            },
	            submitHandler: function (form) {
	            	if ($('input[name=remember]', $('#LoginForm')).prop('checked')) {
		            	$.cookie('pixsignage.username', $('input[name=username]', $('#LoginForm')).attr('value'), {expires:10});
		            	$.cookie('pixsignage.remember', true, {expires:10});
	            	} else {
		            	$.removeCookie('pixsignage.username');
		            	$.cookie('pixsignage.remember', false);
	            	}
					$.ajax({
						type : 'POST',
						url : 'login.action',
						data : $('#LoginForm').serialize(),
						beforeSend: function ( xhr ) {
							Metronic.startPageLoading({animate: true});
						},
						success : function(data, status) {
							Metronic.stopPageLoading();
							if (data.errorcode == 0) {
								if (data.staff.subsystem == 0) {
									window.location.href = 'sys/main.jsp';
								} else if (data.staff.subsystem == 1) {
									window.location.href = 'vsp/main.jsp';
								} else if (data.staff.subsystem == 2) {
									refreshPrivilege();
									$('.login').css('display', 'none');
									$('.level-1').css('display', '');
									$('.level-2-1').css('display', 'none');
									$('.level-2-2').css('display', 'none');
									$('.level-2-3').css('display', 'none');
									$('.level-2-4').css('display', 'none');
								}
							} else {
								$('.alert-danger span', $('#LoginForm')).html(common.tips.login_failed);
				            	$('.alert-danger', $('#LoginForm')).show();
							}
						},
						error : function() {
							Metronic.stopPageLoading();
							console.log('failue');
						}
					});
	            }
	        });

	        $('#LoginForm input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('#LoginForm').validate().form()) {
	                    $('#LoginForm').submit();
	                }
	                return false;
	            }
	        });
	};

	
	return {
		init: init,
	}
	
}();
