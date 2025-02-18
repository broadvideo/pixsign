var submitflag = false;
function initWizard() {
	initTab1();
	initTab2();
	initTab3();
	initData1();
	
	var handleTitle = function(tab, navigation, index) {
		var total = navigation.find('li').length;
		var current = index + 1;
		$('.step-title', $('#MyWizard')).text('Step ' + (index + 1) + ' of ' + total);
		jQuery('li', $('#MyWizard')).removeClass('done');
		var li_list = navigation.find('li');
		for (var i = 0; i < index; i++) {
			jQuery(li_list[i]).addClass('done');
		}

		if (current == 1) {
			$('#MyWizard').find('.button-previous').hide();
		} else {
			$('#MyWizard').find('.button-previous').show();
		}

		if (current >= total) {
			$('#MyWizard').find('.button-next').hide();
			$('#MyWizard').find('.button-submit').show();
		} else {
			$('#MyWizard').find('.button-next').show();
			$('#MyWizard').find('.button-submit').hide();
		}
		Metronic.scrollTo($('.page-title'));
		$('.form-group').removeClass('has-error');
	};

	// default form wizard
	$('#MyWizard').bootstrapWizard({
		'nextSelector': '.button-next',
		'previousSelector': '.button-previous',
		onTabClick: function (tab, navigation, index, clickedIndex) {
			if ((clickedIndex-index)>1) {
				return false;
			}
			if (index == 0 && clickedIndex == 1) {
				if (validBundleOption(CurrentBundle)) {
					initData2();
				} else {
					return false;
				}
			} else if (index == 1 && clickedIndex == 2) {
				if (validLayoutdtl(CurrentBundledtl)) {
					initData3();
				} else {
					return false;
				}
			} 
		},
		onNext: function (tab, navigation, index) {
			if (index == 1) {
				if (validBundleOption(CurrentBundle)) {
					initData2();
				} else {
					return false;
				}
			} else if (index == 2) {
				if (validLayoutdtl(CurrentBundledtl)) {
					initData3();
				} else {
					return false;
				}
			}
		},
		onPrevious: function (tab, navigation, index) {
		},
		onTabShow: function (tab, navigation, index) {
			handleTitle(tab, navigation, index);
			if (index == 1) {
				redrawLayout($('#LayoutDiv'), CurrentBundle, CurrentBundledtl);
				enterLayoutdtlFocus(CurrentBundledtl);
			} else if (index == 2) {
				enterBundledtlFocus(CurrentBundledtl);
				$('#VideoTable').dataTable()._fnAjaxUpdate();
			}
		}
	});

	$('#MyWizard').find('.button-previous').hide();
	$('#MyWizard .button-submit').click(function () {
		$('#MyWizard .button-submit').attr('disabled', 'true');
		if (CurrentBundledtl != null && validBundledtl(CurrentBundledtl)) {
			submitData();
		}
		$('#MyWizard .button-submit').removeAttr('disabled');
	}).hide();
	
	$('#MyWizard').bootstrapWizard('first');
}

function initTab1() {
	
}

function initData1() {
	$('#BundleOptionForm').loadJSON(CurrentBundle);
	refreshLayoutBgImageSelect2();
}

function initTab2() {
	
}

function initData2() {
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	if (CurrentBundle.ratio == 1 || CurrentBundle.ratio == 3 || CurrentBundle.ratio == 5) {
		$('#LayoutCol1').attr('class', 'col-md-7 col-sm-7');
		$('#LayoutCol2').attr('class', 'col-md-5 col-sm-5');
	} else if (CurrentBundle.ratio == 2 || CurrentBundle.ratio == 4) {
		$('#LayoutCol1').attr('class', 'col-md-5 col-sm-5');
		$('#LayoutCol2').attr('class', 'col-md-7 col-sm-7');
	} else if (CurrentBundle.ratio == 6) {
		$('#LayoutCol1').attr('class', 'col-md-2 col-sm-2');
		$('#LayoutCol2').attr('class', 'col-md-7 col-sm-7');
	}
	$('.touch-ctrl').css('display', TouchCtrl?'':'none');
	$('.calendar-ctrl').css('display', SchoolCtrl?'':'none');
	$('.lift-ctrl').css('display', LiftCtrl?'':'none');
	$('.stream-ctrl').css('display', StreamCtrl?'':'none');
	$('.dvb-ctrl').css('display', DvbCtrl?'':'none');
	$('.videoin-ctrl').css('display', VideoinCtrl?'':'none');
	updateRegionBtns();
}

function initTab3() {
}

function initData3() {
	CurrentBundledtl = CurrentBundle.bundledtls[0];

	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	if (CurrentBundle.width > CurrentBundle.height) {
		$('#BundleCol1').attr('class', 'col-md-3 col-sm-3');
		$('#BundleCol2').attr('class', 'col-md-9 col-sm-9');
	} else {
		$('#BundleCol1').attr('class', 'col-md-2 col-sm-2');
		$('#BundleCol2').attr('class', 'col-md-10 col-sm-10');
	}
}

function submitData() {
	if (submitflag) {
		return;
	}
	submitflag = true;
	Metronic.blockUI({
		zIndex: 20000,
		animate: true
	});
	$('#snapshot_div').show();
	redrawBundlePreview($('#snapshot_div'), CurrentBundle, 512, 0);
	html2canvas($('#snapshot_div'), {
		onrendered: function(canvas) {
			//console.log(canvas.toDataURL());
			CurrentBundle.snapshotdtl = canvas.toDataURL();
			$('#snapshot_div').hide();

			for (var i=0; i<CurrentBundle.bundledtls.length; i++) {
				var bundledtl = CurrentBundle.bundledtls[i];
				bundledtl.medialist0 = undefined;
				bundledtl.text0 = undefined;
				bundledtl.widget0 = undefined;
				bundledtl.stream0 = undefined;
				bundledtl.rss0 = undefined;
				if (bundledtl.medialist != undefined) {
					for (var j=0; j<bundledtl.medialist.medialistdtls.length; j++) {
						var medialistdtl = bundledtl.medialist.medialistdtls[j];
						medialistdtl.image = undefined;
						medialistdtl.video = undefined;
						medialistdtl.stream = undefined;
						medialistdtl.audio = undefined;
					}
				} 
			}
			
			$.ajax({
				type : 'POST',
				url : myurls['bundle.design'],
				data : '{"bundle":' + $.toJSON(CurrentBundle) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					submitflag = false;
					Metronic.unblockUI();
					$('#BundleModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
						$('#MyTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					submitflag = false;
					Metronic.unblockUI();
					$('#BundleModal').modal('hide');
					console.log('failue');
				}
			});
		}
	});
}
