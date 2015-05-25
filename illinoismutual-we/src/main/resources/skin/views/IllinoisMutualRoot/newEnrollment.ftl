<@extends src="base.ftl">

<@block name="header_scripts">
<script src="${skinPath}/scripts/newEnrollment.js"></script>
</@block>

<@block name="header">You signed in as ${Context.principal}</@block>

<@block name="content">

<div style="margin: 10 20 10 20;">

	<!-- Big dimer/loader indicator -->
	<div id="submitApplicationMessage" class="ui page dimmer">
		<div class="content">
			<div class="center">
				<div id="submitApplicationText" class="ui text active large loader">
					<p>Sending application...</p>
				</div>
			</div>
		</div>
	</div>

	<!-- This is the (initially hidden) modal letting the user modify the employee's info -->
	<div id="modalEmployee" class="ui small modal" >
		<i class="close icon"></i>
		<div id="modalEmployeeTitle" class="header">Info for</div>
		<div id="modalForm" class="ui form" style="margin:1.2em;">
			<div class="fields">
				<div class="field">
					<label>First name</label>
					<input id="field_firstName" type="text" placeholder="First Name">
				</div>
				<div class="field">
					<label>Last name</label>
					<input id="field_lastName" type="text" placeholder="Last Name">
				</div>
			</div>
			<div class="fields">
				<div class="field">
					<label>Gender</label>
					<input id="field_gender" type="text" placeholder="Gender" size="3">
				</div>
				<div class="field">
					<label>Date of Birth</label>
					<input id="field_dob" type="date">
				</div>
			</div>
			<div class="fields">
				<div class="field">
					<label>Street</label>
					<input id="field_street" type="text" placeholder="Street">
				</div>
			</div>
			<div class="fields">
				<div class="field">
					<label>City</label>
					<input id="field_city" type="text" placeholder="City">
				</div>
				<div class="field">
					<label>Zip</label>
					<input id="field_zip" type="text" placeholder="Zip" size="10">
				</div>
				<div class="field">
					<label>State</label>
					<input id="field_state" type="text" placeholder="State" size="10">
				</div>
			</div>

		</div>
		<div class="actions">
			<div class="ui negative button">Cancel</div>
			<div class="ui positive button">Save</div>
		</div>
	</div>

	<!-- Now, the main UI -->
	<div class="ui center aligned segment" style="padding-top: 0.3em; padding-bottom: 0.8em;">
		<div id="enrollmentTitle" class="ui small header center aligned basic segment" style="padding: 0;margin-bottom: 0.4em;">Enrollment for</div>
		<div class="ui ordered steps" style="width:100%;">
			<div id="stepEmployeeInfo" class="completed step" onclick="displayEmployeeInfo();" onmouseover="$(this).addClass('highlight');" onmouseout="$(this).removeClass('highlight');">
				<div>Employee's Information</div>
			</div>
			<div id="stepSelection" class="active step">
				<div>Product &amp; Coverage Level</div>
			</div>
			<div id="stepSignature" class="step">
				<div>Signature</div>
			</div>
			<div id="stepSigned" class="step">
				<div>Signed</div>
			</div>
		</div>
	</div>

	<div id="mainGrid" class="ui grid">

		<div id="mainLeft" class="twelve wide column">

			<div id="enrollmentTabs" class="ui top attached tabular menu">
				<a class="active item" data-tab="Accident">Accident</a>
				<a class="item" data-tab="Disability">Disability</a>
				<a class="item" data-tab="Term Life">Term Life</a>
				<a class="item" data-tab="Critical Illness">Critical Illness</a>
				<a class="item" data-tab="Short Term Disability">Short Term Disability</a>
			</div>
			<div class="ui bottom attached active tab segment productTab" data-tab="Accident" style="padding-top: 0em">
				<div style="text-align:center; padding: 0.7em 0 0.3em 0">
					<label class="horizDivider">Coverage for</label>
					<div id="coverageEmployee" class="ui checkbox horizDivider">
						<input type="checkbox" name="Employee">
						<label >Employee</label>
					</div>
					<div id="coverageSpouse" class="ui checkbox horizDivider">
						<input if type="checkbox" name="Spouse">
						<label>Spouse</label>
					</div>
					<div id="coverageChildren" class="ui checkbox horizDivider">
						<input type="checkbox" name="Children">
						<label>Children</label>
					</div>
					<div class="horizDivider"></div>
					<div class="field" style="display: inline;">
						<label class="horizDivider">Start date</label>
						<input id="fieldStartDate" type="date">
					</div>
				</div>
				<hr style=" margin-top: 0.4em;">
				<div id="table-Accident-benefits">
					<div id="table-Accident-loaderDiv">
						<div class="ui active inverted dimmer">
							<div class="ui large text loader">
								Loading...
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="ui bottom attached tab segment productTab" data-tab="Disability">
				<div id="table-Disability-benefits">
					<div id="table-Disability-loaderDiv">
						<div class="ui active inverted dimmer">
							<div class="ui large text loader">
								Loading...
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="ui bottom attached tab segment productTab" data-tab="Term Life">
				<div id="table-Term-Life-benefits">
					<div id="table-Term-Life-loaderDiv">
						<div class="ui active inverted dimmer">
							<div class="ui large text loader">
								Loading...
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="ui bottom attached tab segment productTab" data-tab="Critical Illness">
				<div id="table-Critical-Illness-benefits">
					<div id="table-Critical-Illness-loaderDiv">
						<div class="ui active inverted dimmer">
							<div class="ui large text loader">
								Loading...
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="ui bottom attached tab segment productTab" data-tab="Short Term Disability">
				<div id="table-Short-Term-Disability-benefits">
					<div id="table-Short-Term-Disability-loaderDiv">
						<div class="ui active inverted dimmer">
							<div class="ui large text loader">
								Loading...
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div id="mainRight" class="ui four wide column">
			<div id="mainRightSegment" class="ui segment" style="margin-top:37px; text-align:center;">
				<div class="ui center aligned dividing tiny header">Weekly Total</div>
				<div id="selectionTotal" class="ui center aligned huge header">$0.00</div>
				<div class="ui divider"></div>
				<div id="selectionDesc" class="ui right aligned segment" style="font-size:smaller;">
				</div>
				<div id="submitApplication" class="ui fluid primary disabled button" onclick="submitApplication();">Apply</div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript" charset="utf-8">
	newEnrollment_init('${Context.getProperty("employeeId")}', '${Context.getProperty("employerId")}');
</script>


</@block>
</@extends>
