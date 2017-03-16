//========== Design Wizard =====================//
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
				if (validTempletOption(CurrentTemplet)) {
					initData2();
				} else {
					return false;
				}
			} else if (index == 1 && clickedIndex == 2) {
				if (validLayoutdtl(CurrentTempletdtl)) {
					initData3();
				} else {
					return false;
				}
			} 
		},
		onNext: function (tab, navigation, index) {
			if (index == 1) {
				if (validTempletOption(CurrentTemplet)) {
					initData2();
				} else {
					return false;
				}
			} else if (index == 2) {
				if (validLayoutdtl(CurrentTempletdtl)) {
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
				redrawLayout($('#LayoutDiv'), CurrentTemplet, CurrentTempletdtl);
				enterLayoutdtlFocus(CurrentTempletdtl);
				//initMediaBranchTree();
			} else if (index == 2) {
				enterBundledtlFocus(CurrentTempletdtl);
				$('#IntVideoTable').dataTable()._fnAjaxUpdate();
			}
		}
	});

	$('#MyWizard').find('.button-previous').hide();
	$('#MyWizard .button-submit').click(function () {
		if (CurrentTempletdtl != null && validBundledtl(CurrentTempletdtl)) {
			submitData();
		}
	}).hide();
	
	$('#MyWizard').bootstrapWizard('first');
}

function initTab1() {
	
}

function initData1() {
	$('#TempletOptionForm').loadJSON(CurrentTemplet);
	refreshLayoutBgImageSelect2();
}

function initTab2() {
	
}

function initData2() {
	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	if (CurrentTemplet.width > CurrentTemplet.height) {
		$('#LayoutCol1').attr('class', 'col-md-7 col-sm-7');
		$('#LayoutCol2').attr('class', 'col-md-5 col-sm-5');
	} else {
		$('#LayoutCol1').attr('class', 'col-md-5 col-sm-5');
		$('#LayoutCol2').attr('class', 'col-md-7 col-sm-7');
	}
	$('.touch-ctrl').css('display', TouchCtrl?'':'none');
	$('.calendar-ctrl').css('display', CalendarCtrl?'':'none');
	$('.lift-ctrl').css('display', LiftCtrl?'':'none');
	$('.stream-ctrl').css('display', StreamCtrl?'':'none');
	$('.dvb-ctrl').css('display', DvbCtrl?'':'none');
	$('.videoin-ctrl').css('display', VideoinCtrl?'':'none');
	updateRegionBtns();
}

function initTab3() {
	initMediaBranchTree();
}

function initData3() {
	CurrentTempletdtl = CurrentTemplet.templetdtls[0];

	$('.form-group').removeClass('has-error');
	$('.help-block').remove();
	if (CurrentTempletdtl.width > CurrentTempletdtl.height) {
		$('#BundleCol1').attr('class', 'col-md-3 col-sm-3');
		$('#BundleCol2').attr('class', 'col-md-9 col-sm-9');
	} else {
		$('#BundleCol1').attr('class', 'col-md-2 col-sm-2');
		$('#BundleCol2').attr('class', 'col-md-10 col-sm-10');
	}
}

function submitData() {
	$('#snapshot_div').show();
	redrawTempletPreview($('#snapshot_div'), CurrentTemplet, 512, 0);
	html2canvas($('#snapshot_div'), {
		onrendered: function(canvas) {
			//console.log(canvas.toDataURL());
			CurrentTemplet.snapshotdtl = canvas.toDataURL();
			$('#snapshot_div').hide();

			for (var i=0; i<CurrentTemplet.templetdtls.length; i++) {
				var templetdtl = CurrentTemplet.templetdtls[i];
				templetdtl.layoutdtl = undefined;
				if (templetdtl.medialist != undefined) {
					for (var j=0; j<templetdtl.medialist.medialistdtls.length; j++) {
						var medialistdtl = templetdtl.medialist.medialistdtls[j];
						medialistdtl.image = undefined;
						medialistdtl.video = undefined;
						medialistdtl.stream = undefined;
						medialistdtl.audio = undefined;
					}
				} 
			}
			
			$.ajax({
				type : 'POST',
				url : myurls['templet.design'],
				data : '{"templet":' + $.toJSON(CurrentTemplet) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				beforeSend: function ( xhr ) {
					Metronic.startPageLoading({animate: true});
				},
				success : function(data, status) {
					Metronic.stopPageLoading();
					$('#TempletModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
						$('#MyTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					$('#TempletModal').modal('hide');
					console.log('failue');
				}
			});
		}
	});
}