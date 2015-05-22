// newEnrollment.js
/*
 * WARNINGS
 * 		- Handling only "Accident" here, so it's hard coded
 * 		- Name of the tab must strictly === id of the product in the Benefit documents
 */
var gEmployeeJson, gEmployerJson;

jQuery(document).ready(function() {

});

function newEnrollment_init(inEmployeeId, inEmployerId) {
	
	$('#enrollmentTabs .item')
		.tab({
			onTabLoad(inTabName) {
				loadBenefits(inTabName);
			}
		});
//		.tab();
	
	loadEmployee(inEmployeeId, inEmployerId);
	loadBenefits("Accident");
}

function loadBenefits(inTabName) {
	
	var nxql, tableId;
	
	tableId = "table-" + inTabName.replace(/\s+/g, '-')
	
	nxql = "SELECT * FROM Benefit"
			+ " WHERE benefit:product = '" + inTabName + "' "
			+ " AND ecm:isCheckedInVersion = 0 AND ecm:isProxy = 0 AND ecm:currentLifeCycleState != 'deleted'"
			+ " ORDER BY benefit:line_order";
	
	jQuery("#" + tableId).DataTable({
		processing	: false,
		paging		: false,
		//pagingType	: "full",
		//pageLength	: 20,
		ordering	: false,
		scrollX		: false,
		scrollY		: "18em",
		scrollCollapse: true,
		searching	: false,
		serverSide	: true,
		ajax: {
			url: "/nuxeo/api/v1/query?query=" + nxql,
			headers : {"X-NXProperties": "benefit"},
			dataSrc: function(json) {
				var result = [], loaderDiv;
				currentEntries = json.entries;
				json.entries.forEach(function(oneEntry) {
					var props = oneEntry.properties;
					result.push([oneEntry.title,
					             props["benefit:economy"],
					             props["benefit:standard"],
					             props["benefit:preferred"],
					             props["benefit:premium"]
								]);
				});
				
				loaderDiv = $("#loaderDiv");
				if(loaderDiv != null) {
					loaderDiv.remove();
				}
				
				return result;
			}
		}
	});
	
}

function loadEmployee(inEmployeeId, inEmployerId) {
	
	gEmployeeJson = null;
	gEmployerJson = null;
	
	// Employee
	jQuery.ajax({
		
		url : "/nuxeo/api/v1/id/" + inEmployeeId,
		contentType : "application/json+nxrequest",
		headers : {"X-NXProperties": "dublincore, employee"}
	
	}).done(function(inData, inStatusText, inXHR) {
		
		gEmployeeJson = inData;
		
		// Employer
		jQuery.ajax({
			url : "/nuxeo/api/v1/id/" + inEmployerId,
			contentType : "application/json+nxrequest",
			headers : {"X-NXDProperties": "dublincore, employer"}
		}).done(function(inData, inStatusText, inXHR) {
			
			gEmployerJson = inData;
			updateMainTitle();
			
		}).fail(function(inXHR, inStatusText, inErrorText) {
			updateMainTitle(inErrorText);
		});
		
	}).fail(function(inXHR, inStatusText, inErrorText) {
		updateMainTitle(inErrorText);
	});
	
}

function updateMainTitle(inError) {
	var html = "",
		obj = $("#enrollmentTitle");
	
	if(gEmployeeJson != null) {
		html += gEmployeeJson.title;
	} else {
		html += "Failed to get employee's info: " + inError;
	}
	if(gEmployerJson != null) {
		html += " <span>(" + gEmployerJson.title + ")</span>";
	} else {
		html += "<br/>(" + "Failed to get employer's info: " + inError + ")";
	}
	
	obj.html( html );
	if(typeof inError === "string") {
		obj.addClass("negative message");
	}
}


