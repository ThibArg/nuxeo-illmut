// appcommon.js
jQuery(document).ready(function() {

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

function jsonDateToDate(inJsonDate) {
	var y, m, d, h, mn;
	
	function _myParseInt(inStr) {
		if(inStr[0] === '0') {
			return parseInt(inStr[1]);
		}
		
		return parseInt(inStr);
	}
	
	y = parseInt(inJsonDate.substr(0, 4));
	m = _myParseInt(inJsonDate.substr(5, 2)) - 1;
	d = _myParseInt(inJsonDate.substr(8, 2));
	h = _myParseInt(inJsonDate.substr(11, 2));
	mn = _myParseInt(inJsonDate.substr(14, 2));
	s = _myParseInt(inJsonDate.substr(17, 2));
	
	return new Date(y, m, d, h, mn, s);
}

function myFormatCurrency(inValue) {
		
	inValue = inValue.toFixed(2);
	
	return "$" + inValue;
}


