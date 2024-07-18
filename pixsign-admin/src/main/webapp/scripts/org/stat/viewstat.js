var ViewstatModule = function () {

	var init = function () {
		initViewstatTable();
	};

	var refresh = function () {
		$('#ViewstatTable').dataTable()._fnAjaxUpdate();
	};
	
	var initViewstatTable = function () {
		$('#ViewstatTable').dataTable({
			'sDom' : 'rt', 
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'playlog!statall.action',
			'aoColumns' : [ {'sTitle' : '', 'mData' : 'mediaid', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : '', 'mData' : 'mediaid', 'bSortable' : false, 'sWidth' : '20%' },
							{'sTitle' : common.view.persons, 'mData' : 'persons', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : common.view.age1, 'mData' : 'age1', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : common.view.age2, 'mData' : 'age2', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : common.view.age3, 'mData' : 'age3', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : common.view.age4, 'mData' : 'age4', 'bSortable' : false, 'sWidth' : '10%' },
							{'sTitle' : common.view.age5, 'mData' : 'age5', 'bSortable' : false, 'sWidth' : '10%' }],
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var thumbwidth = 100;
				var thumbhtml = '';
				var playhtml = '';
				if (aData.mediatype == 1 && aData.video.length > 0) {
					thumbhtml += '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigndata' + aData.video[0].thumbnail + '" class="imgthumb" width="' + thumbwidth + '%"></div>';
					playhtml = common.view.video + ': ' + aData.video[0].name;
				} else if (aData.mediatype == 2 && aData.image.length > 0) {
					thumbwidth = aData.image[0].width > aData.image[0].height? 100 : 100*aData.image[0].width/aData.image[0].height;
					thumbhtml += '<div class="thumbs" style="width:40px; height:40px;"><img src="/pixsigndata' + aData.image[0].thumbnail + '" class="imgthumb" width="' + thumbwidth + '%"></div>';
					playhtml += common.view.image + ': ' + aData.image[0].name;
				}
				$('td:eq(0)', nRow).html(thumbhtml);
				$('td:eq(1)', nRow).html(playhtml);
				return nRow;
			} 
		});
		$('#ViewstatTable_wrapper').addClass('form-inline');
		$('#ViewstatTable').css('width', '100%').css('table-layout', 'fixed');
	};
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
