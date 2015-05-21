// appcommon.js
/*
 * WARNING: WILL NOT SCALE: We get all the employees, with no pagination, no "infinite scrolling", etc.
 * 
 */
var currentEntries, currentEmployees;

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
	$("#mainNavidation").html(html);

	// Dynamically get the enrollment summary
	enrollmentForEmployer_loadSummary(inEmployerId);

	// Dynamically get the list of employees
	// IMPORTANT: NO PAGINATION HERE, WE GET ALL THE EMPLOYEES
	enrollmentForEmployer_loadEmployees(inEmployerId);
}

function enrollmentForEmployer_loadEmployees(inEmployerId) {
	
	var nxql,
		objContainer = $("#employeesList"),
		objWaiting = $("#employeesLoading"),
		html,
		start = new Date();
	
	nxql = "SELECT * FROM Employee"
			+ " WHERE employee:employer = '" + inEmployerId + "'"
			+ " AND ecm:isCheckedInVersion = 0 AND ecm:isProxy = 0 AND ecm:currentLifeCycleState != 'deleted'"
			+ " ORDER BY employee:last_name, employee:first_name ASC";
	
	jQuery.ajax({
		url : "/nuxeo/api/v1/query?query=" + nxql,
		contentType : "application/json+nxrequest",
		headers : {"X-NXDocumentProperties": "dublincore, employee"}
	}).done(function(inData, inStatusText, inXHR) {
		
		currentEmployees = inData.entries;
		if ((new Date() - start) < 2000) {
			setTimeout(function() {
				displayResults();
			}, 500);
		} else {
			displayResults();
		}
		
	}).fail(function(inXHR, inStatusText, inErrorText) {
		
		currentEmployees = [];

		html += "<p></p><p></p><p>Error getting the info</p>"
				+ inErrorText + "<p></p><p></p>";
		
		objWaiting.removeClass("loading");
		objWaiting.addClass("yellow inverted");
		objWaiting.html( html );
		
	});
	
	var displayResults = function () {
		
		html = "<table class='ui table'>";
			html += "<thead>";
				html += "<th>Name</th>";
				html += "<th>DoB</th>";
				html += "<th>Updated</th>";
				html += "<th>Application</th>";
				html += "<th></th>";
			html += "</thead>";
			
			html += "<tbody>";
			currentEmployees.forEach(function(inOneEmployee, inIndex) {
				var properties = inOneEmployee.properties,
					state, label;
				
				console.log(inIndex);
				
				state = properties["employee:enrollment_state"];
				html += "<tr>";
					html += "<td>" + properties["dc:title"] + "</td>";
					html += "<td>" + myFormatJsonDate( properties["employee:dob"] ) + "</td>";
					html += "<td>" + myFormatJsonDate( properties["dc:modified"] ) + "</td>";
					html += "<td>" + state + "</td>";
					
					switch(state.toLowerCase()) {
					case "not enrolled":
						label = "Enroll";
						break;
						
					case "not signed":
						label = "Edit";
						break;
						
					case "incomplete":
						label = "Complete";
						break;
						
					default:
						label = "Open";
						break;
					}
					
					if(label !== "") {
						html += "<td style='text-align:center;'>";
						html += "<div id='" + inOneEmployee.uid + "' class='ui tiny button' style='width:80%;' onclick='employeeButtonClick(this, " + inIndex + ")'>" + label + "</div>"
						html += "</td>";
					}
					
				html += "</tr>";
			})
			html += "</tbody>";
		html += "</table>";
		
		objWaiting.remove();
		objContainer.html( html );
	}
}

function employeeButtonClick(inThisDivButton, inIndex) {
	
	var employeeId = inThisDivButton.id,
		action = $(inThisDivButton).text();
	
	var employee = currentEmployees[inIndex];
	
	alert(employee.properties["dc:title"]);
	
}

function enrollmentForEmployer_loadSummary(inEmployerId) {

	var obj = $("#enrollmentSummary"),
		objContainer = $("#enrollmentSummaryContainer"),
		html,
		jsonResult,
		start = new Date();

	var automationParams = {
		params : {
			"employerId" : inEmployerId
		},
		context : {}
	};
	jQuery.ajax({
		url : "/nuxeo/site/automation/Employer_GetStats_JS",
		contentType : "application/json+nxrequest",
		type : "POST",
		data : JSON.stringify(automationParams),

	}).done(function(inData, inStatusText, inXHR) {

		jsonResult = JSON.parse(inData.value);

		// This is just for the UI. I don't like when you have a waiting UI displayed only half a second,
		// I always feel like maybe something went wrong
		if ((new Date() - start) < 2000) {
			setTimeout(function() {
				displayResults();
			}, 500);
		} else {
			displayResults();
		}
		
	}).fail(function(inXHR, inStatusText, inErrorText) {
		obj.html("<p></p><p></p><p>Error getting the info</p>"
				+ inErrorText + "<p></p><p></p>");
		objContainer.removeClass("loading");
	});

	var displayResults = function () {

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


