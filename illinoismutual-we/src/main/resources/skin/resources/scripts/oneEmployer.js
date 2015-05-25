// oneEmployer.js
/*
 * WARNING: WILL NOT SCALE: We get all the employees, with no pagination, no "infinite scrolling", etc.
 * 
 * (laos: Using nuxeo.js. This is not a warning. Just think about including nuxeo.js)
 */
var gEmployees,
	gEmployerId;

jQuery(document).ready(function() {
	// . . . some init . . .
});

function enrollmentForEmployer_init(inEmployerId, inEmployerName) {

	var html;
	
	gEmployerId = inEmployerId;

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
	enrollmentForEmployer_loadSummary();

	// Dynamically get the list of employees
	// IMPORTANT: NO PAGINATION HERE, WE GET ALL THE EMPLOYEES
	enrollmentForEmployer_loadEmployees();
}

function enrollmentForEmployer_loadEmployees() {

	var nxql,
		objContainer = $("#employeesList"),
		objWaiting = $("#employeesLoading"),
		html,
		nxClient,
		start = new Date();

	nxql = "SELECT * FROM Employee"
			+ " WHERE employee:employer = '"
			+ gEmployerId
			+ "'"
			+ " AND ecm:isCheckedInVersion = 0 AND ecm:isProxy = 0 AND ecm:currentLifeCycleState != 'deleted'"
			+ " ORDER BY employee:last_name, employee:first_name ASC";
	
	nxClient = new nuxeo.Client({
		timeout : 10000
	});

	nxClient
		.headers({"X-NXProperties" : "dublincore, employee" })
		.request("query?query=" + nxql)
		.get(function(inError, inData) {
			if(inError) {
				gEmployees = [];

				html = "";
				html += "<p>&nbsp;</p><p class='ui header'>Error getting the info</p><p>"
						+ inError
						+ "</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>";

				objWaiting.removeClass("loading");
				objWaiting.addClass("negative message");
				objWaiting.html(html);
				
			} else {
				gEmployees = inData.entries;

				waitOrDo(start, displayResults, 1500, 750);
			}
		})

	var displayResults = function() {

		html = "<table class='ui table'>";
		html += "<thead>";
		html += "<th>Name</th>";
		html += "<th>DoB</th>";
		html += "<th>Updated</th>";
		html += "<th>Application</th>";
		html += "<th></th>";
		html += "</thead>";

		html += "<tbody>";
		gEmployees
				.forEach(function(inOneEmployee, inIndex) {
					var properties = inOneEmployee.properties, state, label;

					state = properties["employee:enrollment_state"];
					html += "<tr>";
					html += "<td>" + properties["dc:title"] + "</td>";
					html += "<td>"
							+ myFormatJsonDate(properties["employee:dob"])
							+ "</td>";
					html += "<td>"
							+ myFormatJsonDate(properties["dc:modified"])
							+ "</td>";
					html += "<td>" + state + "</td>";

					switch (state.toLowerCase()) {
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

					if (label !== "") {
						html += "<td style='text-align:center;'>";
						html += "<div id='"
								+ inOneEmployee.uid
								+ "' class='ui tiny button' style='width:80%;' onclick='employeeButtonClick(this, "
								+ inIndex + ")'>" + label + "</div>"
						html += "</td>";
					}

					html += "</tr>";
				})
		html += "</tbody>";
		html += "</table>";

		objWaiting.remove();
		objContainer.html(html);
	}
}

function employeeButtonClick(inThisDivButton, inIndex) {

	var employeeId = inThisDivButton.id,
		action = $(inThisDivButton).text(),
		modalTitleObj = $("#modalConfirmTitle"),
		modalPromptObj = $("#modalConfirmPrompt"),
		ok = false,
		employee = gEmployees[inIndex];

	action = action.toLowerCase();
	switch (action) {
	case "enroll":
		modalTitleObj.text("New Enrollment");
		modalPromptObj.html("Start a new enrollment process for <b>"
				+ employee.title + "</b>?");
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
		modalPromptObj.html("Continue enrollment process for <b>"
				+ employee.title + "</b>?");
		break;
	}

	$("#modalConfirm")
		.modal({
			onApprove : function() {
				ok = true;
				return true;
			},
			onHidden : function() {
				if (ok) {
					window.location.href = window.location.origin
							+ "/nuxeo/site/IllinoisMutual/newEnrollment?p1="
							+ employeeId;
				}
			}
		})
		.modal("show");

}

function enrollmentForEmployer_loadSummary() {

	var obj = $("#enrollmentSummary"),
		objContainer = $("#enrollmentSummaryContainer"),
		html,
		jsonResult,
		automationParams,
		start = new Date(),
		nxClient;

	nxClient = new nuxeo.Client({
		timeout : 10000
	});
	
	nxClient
		.operation("Employer_GetStats_JS")
		.params({ "employerId" : gEmployerId })
		.execute(function(inError, inData) {
			
			if(inError) {
				
				obj.html("<p></p><p></p><p>Error getting the info</p>"
						+ inError + "<p></p><p></p>");
				objContainer.removeClass("loading");
				
			} else {
				
				jsonResult = JSON.parse(inData.value);
				
				waitOrDo(start, displayResults, 1500, 750);
			}
		});

	var displayResults = function() {

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

