// appcommon.js
jQuery(document).ready(function() {

	/*
	jQuery('#table_id').DataTable({
		processing	: true,
		paging		: false,
		//pagingType	: "full",
		//pageLength	: 20,
		scrollX		: true,
		scrollY		: "300px",
		scrollCollapse: true,
		searching	: false,
		serverSide	: true,
		ajax: {
			"url": "/nuxeo/api/v1/query?query=SELECT * FROM Employee ORDER BY employee:last_name, employee:first_name",
			"dataSrc": function(json) {
				var result = [];
				currentEntries = json.entries;
				json.entries.forEach(function(oneEntry) {
					result.push([oneEntry.title, oneEntry.type]);
				});
				return result;
			}
		}
	});
	 */

});

// ========================================== UTILITIES
function myFormatJsonDate(inJsonDate) {
	var y, m, d;
	
	function _myParseInt(inStr) {
		if(inStr[0] === '0') {
			return parseInt(inStr[1]);
		}
		
		return parseInt(inStr);
	}
	
	y = parseInt(inJsonDate.substr(0, 4));
	m = _myParseInt(inJsonDate.substr(5, 2));
	d = _myParseInt(inJsonDate.substr(8, 2));
	
	return "" + (m < 10 ? '0' + m : m) + "-" + (d < 10 ? '0' + d : d) + "-" + y;
}

function myFormatCurrency(inValue) {
		
	inValue = inValue.toFixed(2);
	
	return "$" + inValue;
}


