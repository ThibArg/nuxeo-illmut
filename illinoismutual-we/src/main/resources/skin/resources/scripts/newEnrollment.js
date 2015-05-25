// newEnrollment.js
/*
 * WARNINGS
 * 		- Handling _only_ "Accident" here, so it's hard coded
 * 		- Name of the tab must strictly === id of the product in the Benefit documents
 * 		- id of the main parent of the <table> elements must be "table" + Name-of-Product + "-benefits"
 */
var gEmployeeJson = null,
	gEmployerJson = null,
	gEmployeeId,
	gEmployerId,
	gSelected = {};

jQuery(document).ready(function() {

});

function newEnrollment_init(inEmployeeId, inEmployerId) {
	
	gEmployeeId = inEmployeeId;
	gEmployerId = inEmployerId;
	
	$('#enrollmentTabs .item')
		.tab({
			onTabLoad(inTabName) {
				loadBenefits(inTabName);
			}
		});
	
	$("#coverageEmployee").checkbox("toggle");
	$("#coverageSpouse").checkbox();
	$("#coverageChidren").checkbox();
	
	loadEmployee();
	loadBenefits("Accident");
}

function loadBenefits(inTabName) {
	
	var nxql, tableId, tableObj;
	
	tableId = "table-" + inTabName.replace(/\s+/g, '-');
	
	// If it was already loaded, we on't re-load it
	tableObj = $("#" + tableId);
	if(tableObj != null && tableObj.length > 0) {
		return;
	}
	
	buildTableMainHTML(tableId, inTabName);
	
	nxql = "SELECT * FROM Benefit"
			+ " WHERE benefit:product = '" + inTabName + "' "
			+ " AND ecm:isCheckedInVersion = 0 AND ecm:isProxy = 0 AND ecm:currentLifeCycleState != 'deleted'"
			+ " ORDER BY benefit:line_order";
	
	jQuery("#" + tableId).DataTable({
		processing	: false,
		paging		: false,
		info		: false,
		//pagingType	: "full",
		//pageLength	: 20,
		ordering	: false,
		scrollX		: false,
		scrollY		: "18em",
		scrollCollapse: true,
		searching	: false,
		serverSide	: true,
		columnDefs	: [
		               { className: "dt-body-right", "targets": [ 1, 2, 3, 4 ] }
		             ],
		ajax: {
			url: "/nuxeo/api/v1/query?query=" + nxql,
			headers : {"X-NXProperties": "benefit"},
			dataSrc: function(json) {
				var result = [], loaderDiv, totEconomy, totStandard, totPreferred, totPremium;
				
				totEconomy = 0;
				totStandard = 0;
				totPreferred = 0;
				totPremium = 0;
				currentEntries = json.entries;
				json.entries.forEach(function(oneEntry) {
					var props = oneEntry.properties;
					result.push([oneEntry.title,
					             myFormatCurrency( props["benefit:economy"] ),
			            		 myFormatCurrency( props["benefit:standard"] ),
	            				 myFormatCurrency( props["benefit:preferred"] ),
        						 myFormatCurrency( props["benefit:premium"] )
								]);
					totEconomy += props["benefit:economy"];
					totStandard += props["benefit:standard"];
					totPreferred += props["benefit:preferred"];
					totPremium += props["benefit:premium"];
				});
				
				$("#" + tableId + "-totEconomy").text( myFormatCurrency(totEconomy) );
				$("#" + tableId + "-totStandard").text( myFormatCurrency(totStandard) );
				$("#" + tableId + "-totPreferred").text( myFormatCurrency(totPreferred) );
				$("#" + tableId + "-totPremium").text( myFormatCurrency(totPremium) );
				
				// Stop the "loading" animation
				loaderDiv = $("#" + tableId + "-loaderDiv");
				if(loaderDiv != null) {
					loaderDiv.remove();
				}
				
				return result;
			}
		}
	});
	
}

var TABLE_BASE = "<table id='TABLE_ID' class='display cell-border' style='height:19em' cellspacing='0' width='100%'>"
				+ "<thead class='benefitsHeader'>"
					+ "<tr>"
						+ "<th>Benefits</th>"
						+ "<th>Economy</th>"
						+ "<th>Standard</th>"
						+ "<th>Preferred</th>"
						+ "<th>Premium</th>"
					+ "</tr>"
				+ "</thead>"
				+ "<tbody class='benefitsBody'></tbody>"
				+ "<tfoot class='benefitsFooter'>"
					+ "<tr>"
						+ "<th>Total Weekly Premium</th>"
						+ "<th><div id='ID_TOT_ECONOMY'   class='ui small circular button TOTAL_COLUMN_CLASS' theType='Economy'></div></th>"
						+ "<th><div id='ID_TOT_STANDARD'  class='ui small circular button TOTAL_COLUMN_CLASS' theType='Standard'></div></th>"
						+ "<th><div id='ID_TOT_PREFERRED' class='ui small circular button TOTAL_COLUMN_CLASS' theType='Preferred'></div></th>"
						+ "<th><div id='ID_TOT_PREMIUM'   class='ui small circular button TOTAL_COLUMN_CLASS' theType='Premium'></div></th>"
					+ "</tr>"
				+ "</tfoot>"
				+ "</table>";
function buildTableMainHTML(inTableId, inUILabel) {
	
	var html,
		valueStr, value,
		table = $("#" + inTableId);
	if(table == null || table.length === 0) {
		html = TABLE_BASE
					.replace("TABLE_ID", inTableId)
					.replace("ID_TOT_ECONOMY", inTableId + "-totEconomy")
					.replace("ID_TOT_STANDARD", inTableId + "-totStandard")
					.replace("ID_TOT_PREFERRED", inTableId + "-totPreferred")
					.replace("ID_TOT_PREMIUM", inTableId + "-totPremium")
					.replace(/TOTAL_COLUMN_CLASS/g, inTableId + "-totalColumn");
		
		$("#" + inTableId + "-benefits").append(html);
		$("." + inTableId + "-totalColumn").on("click", function(inEvt) {
			updateTotalInfo($(inEvt.target), inEvt.altKey, inTableId, inUILabel);
		});
	}
}

function updateTotalInfo(inTotalObj, inReset, inTableId, inUILabel) {
	
	var valueStr, value, tot, htmlTot;

	$("." + inTableId + "-totalColumn").removeClass("blue");
	if(inReset) {
		if(inUILabel in gSelected) {
			delete gSelected[inUILabel];
		}
	} else {
		// Get the value as number, store it
		valueStr = inTotalObj.text();
		value = parseFloat( valueStr.replace("$", "").trim() );
		gSelected[inUILabel] = {"value": value, "level": inTotalObj.attr("theType")};
		
		// Set the selected button to blue
		inTotalObj.addClass("blue");
	}
	updateTotal();
}

function updateTotal() {
	tot = 0;
	htmlTot = "";
	for(prop in gSelected) {
		if(gSelected.hasOwnProperty(prop)) {
			tot += gSelected[prop].value;
			htmlTot += "<div class='ui left aligned small header' style='margin: 0.8em 0 0.4em 0;'>" + prop + "</div>";
			htmlTot += gSelected[prop].level + ": " + myFormatCurrency( gSelected[prop].value );
		}
	}
	$("#selectionTotal").text( myFormatCurrency(tot) );
	$("#selectionDesc").html(htmlTot);
	
	if(tot > 0) {
		$("#submitApplication").removeClass("disabled");
	} else {
		$("#submitApplication").addClass("disabled");
	}
}

function loadEmployee() {
	
	gEmployeeJson = null;
	gEmployerJson = null;
	
	// Employee
	jQuery.ajax({
		
		url : "/nuxeo/api/v1/id/" + gEmployeeId,
		contentType : "application/json+nxrequest",
		headers : {"X-NXProperties": "dublincore, employee"}
	
	}).done(function(inData, inStatusText, inXHR) {
		
		gEmployeeJson = inData;
		gEmployeeJson.imIsDirty = false;
		
		// Employer
		jQuery.ajax({
			url : "/nuxeo/api/v1/id/" + gEmployerId,
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

function displayEmployeeInfo() {
	
	var props, ok;
	
	if(gEmployeeJson != null) {
		
		props = gEmployeeJson.properties;
		
		$("#modalEmployeeTitle").text("Info for " + gEmployeeJson.title);
		$("#field_firstName").val(props["employee:first_name"]);
		$("#field_lastName").val(props["employee:last_name"]);
		$("#field_gender").val(props["employee:gender"]);
		$("#field_dob").val( props["employee:dob"].substring(0, 10) );
		//$("#field_ssn").val(props["employee:ssn"]);
		$("#field_street").val(props["employee:address_street"]);
		$("#field_city").val(props["employee:address_city"]);
		$("#field_zip").val(props["employee:address_zip"]);
		$("#field_state").val(props["employee:address_state"]);
		
		$("#modalEmployee")
			.modal( {
				onApprove: function() {
					ok = true;
					return true;
				},
				onHidden: function() {
					var data;
					if(ok) {
						// Store values locally
						gEmployeeJson.imIsDirty = true; // Custom property
						
						props["employee:first_name"] = $("#field_firstName").val();
						props["employee:last_name"] = $("#field_lastName").val();
						props["employee:gender"] = $("#field_gender").val();
						props["employee:dob"] = $("#field_dob").val() + "T00:00:00Z"; // Build a JSON date
						props["employee:address_street"] = $("#field_street").val();
						props["employee:address_city"] = $("#field_city").val();
						props["employee:address_zip"] = $("#field_zip").val();
						props["employee:address_state"] = $("#field_state").val();
						
						// Now, save on the server. . .
						data = {
							"entity-type": "document",
							"uid" : gEmployeeJson.uid,
							"properties": {
								"employee:first_name": props["employee:first_name"],
								"employee:last_name": props["employee:last_name"],
								"employee:gender": props["employee:gender"],
								"employee:dob": props["employee:dob"],
								"employee:address_street": props["employee:address_street"],
								"employee:address_city": props["employee:address_city"],
								"employee:address_zip": props["employee:address_zip"],
								"employee:address_state": props["employee:address_state"],
							}
						};
						jQuery.ajax({
							
							url : "/nuxeo/api/v1/id/" + gEmployeeJson.uid,
							type: "PUT",
							data  : JSON.stringify(data),
							contentType: "application/json"
							
						}).done(function(inData, inStatusText, inXHR) {
							
							// Reload the employee + employer.
							// Some server-side business rules may have apply
							loadEmployee();
							
						}).fail(function(inXHR, inStatusText, inErrorText) {
							console.log("Error updating the employee: " + inErrorText);
						});
					}
				}
			})
			.modal("show");
	}
}

function submitApplication() {
	
	var startTime = new Date(),
		product,
		coverageLevel,
		html,
		automationParams;
	
	if(gSelected["Accident"] == null) {
		alert("Only 'Accident' product is handled in this example.");
	} else {
		
		product = "Accident";
		coverageLevel = gSelected["Accident"].level;

		html = "<p>Product: " + product + " - Coverage: " + coverageLevel +"</p>"
				+ "<p>Sending Application...</p>";
		$("#submitApplicationText").html(html);
		$("#submitApplicationMessage").dimmer("show");
		
		automationParams = {
			params : {
				employeeId	: gEmployeeId,
				product		: product,
				coverageLevel : coverageLevel 
			},
			context : {}
		};
		jQuery.ajax({
			url : "/nuxeo/site/automation/Employee_REST_NewApplication_JS",
			contentType : "application/json+nxrequest",
			type : "POST",
			data : JSON.stringify(automationParams)
		}).done(function(inData, inStatusText, inXHR) {
			
			// As usual (well. _mY- "as usual" :-)
			// If it's too fast, let it be displayed for 1-2s so the user does
			// not wonder if they have missed something.
			if((startTime - (new Date())) < 2000) {
				setTimeout(function() {
					displaySuccess();
				}, 1500);
			} else {
				displaySuccess();
			}
			
		}).fail(function(inXHR, inStatusText, inErrorText) {
			alert("Error creating the aplication\n" + inErrorText);
			$("#submitApplicationMessage").dimmer("hide");
		});
	}
	
	function displaySuccess() {
		
		$("#submitApplicationMessage").addClass("inverted");
		
		html = "<p style='color: green'>Product: " + product + " - Coverage: " + coverageLevel +"</p>"
				+ "<p style='color: green; font-size: larger; font-weight: bold;'>Application created</p>";
		$("#submitApplicationText").html(html);
		setTimeout(function() {
			$("#submitApplicationMessage").dimmer("hide");
		}, 2000);
		
	}
	
}


