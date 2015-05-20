// appcommon.js

var currentEntries;
jQuery(document).ready( function () {

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

function enrollmentForEmployer_init(inEmployerId, inEmployerName) {
	
	var html;
	
	$("#enrollmentForEmployerTitle").text("Enrollment for " + inEmployerName);
	
	html = "";
	html += "<b>" + inEmployerName + "</b><br/>";
	html += "&nbsp;&nbsp;&gt;&nbsp;Enrollment<br/>";
	html += "&nbsp;&nbsp;&gt;&nbsp;. . .<br/>";
	html += "</br/><br/>";
	
	html += "<p><b>Manage Employers</b></p>";
	html += ". . .</br/><br/><br/>";
	$("#mainNavidation").html( html );
	
	// Dynamically get the enrollment summary
	enrollmentForEmployer_loadSummary(inEmployerId);
}

function enrollmentForEmployer_loadSummary(inEmployerId) {
	
	//debugger;
	
	var obj = $("#enrollmentSummary"),
	    objContainer = $("#enrollmentSummaryContainer"),
	    html, jsonResult,
	    start = new Date();
	/*
	setTimeout(function() {
		objContainer.removeClass("loading");
	}, 5000);
	*/
	var automationParams = {
			params:{
				"employerId": inEmployerId
			},
			context: {}
		};
	jQuery.ajax({
		url: "/nuxeo/site/automation/Employer_GetStats_JS",
		contentType: "application/json+nxrequest",
		type: "POST",
		data	: JSON.stringify(automationParams),
		
	})
	.done(function(inData, inStatusText, inXHR) {
		

		jsonResult = JSON.parse(inData.value);
		
		if((new Date() - start) < 2000) {
			setTimeout(function() {
				displayResults();
			}, 1000);
		} else {
			displayResults();
		}
	})
	.fail(function(inXHR, inStatusText, inErrorText) {
		obj.html("<p></p><p></p><p>Error getting the info</p>" + inErrorText + "<p></p><p></p>")
		objContainer.removeClass("loading");
	});
	
	function displayResults() {
		
		var html = "";
		html += jsonResult.nbEmployees + " employees<br/>";
		html += jsonResult.enrolled + " enrolled<br/>";
		html += jsonResult.submitted + " submitted<br/>";
		html += jsonResult.pending + " pending<br/>";
		html += jsonResult.notEnrolled + " not enrolled<br/>";
		obj.html(html);
		
		objContainer.removeClass("loading");
		
	}
}




