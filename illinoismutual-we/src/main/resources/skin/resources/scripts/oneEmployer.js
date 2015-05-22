// oneEmployer.js
/*
 * WARNING: WILL NOT SCALE: We get all the employees, with no pagination, no "infinite scrolling", etc.
 * 
 */
var gEmployees;

jQuery(document).ready(function() {

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
		headers : {"X-NXProperties": "dublincore, employee"}
	}).done(function(inData, inStatusText, inXHR) {
		
		gEmployees = inData.entries;
		if ((new Date() - start) < 2000) {
			setTimeout(function() {
				displayResults();
			}, 500);
		} else {
			displayResults();
		}
		
	}).fail(function(inXHR, inStatusText, inErrorText) {
		
		gEmployees = [];

		html = "";
		html += "<p>&nbsp;</p><p class='ui header'>Error getting the info</p><p>"
				+ inErrorText + "</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>";
		
		objWaiting.removeClass("loading");
		objWaiting.addClass("negative message");
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
			gEmployees.forEach(function(inOneEmployee, inIndex) {
				var properties = inOneEmployee.properties,
					state, label;
								
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
		action = $(inThisDivButton).text(),
		modalTitleObj = $("#modalConfirmTitle"),
		modalPromptObj = $("#modalConfirmPrompt"),
		ok = false;
		
	var employee = gEmployees[inIndex];
	
	action = action.toLowerCase();
	switch(action) {
	case "enroll":
		modalTitleObj.text("New Enrollment");
		modalPromptObj.html("Start a new enrollment process for <b>" + employee.title + "</b>?");
		break;

	case "edit":
		modalTitleObj.text("Edit");
		modalPromptObj.html("Edit data for <b>" + employee.title + "</b>?");
		break;

	case "open":
		modalTitleObj.text("Open");
		modalPromptObj.html("Open file of <b>" + employee.title + "</b>?");
		break;

	case "complete":
		modalTitleObj.text("Complete Enrollment");
		modalPromptObj.html("Continue enrollment process for <b>" + employee.title + "</b>?");
		break;
	}
	
	$("#modalConfirm")
		.modal( {
			onApprove: function() {
				ok = true;
				return true;
			},
			onHidden: function() {
				if(ok) {
					window.location.href = window.location.origin + "/nuxeo/site/IllinoisMutual/newEnrollment?p1=" + employeeId;
				}
			}
		})
		.modal("show");

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




