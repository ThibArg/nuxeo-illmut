<@extends src="base.ftl">

<@block name="header_scripts">
<script src="${skinPath}/scripts/newEnrollment.js"></script>
</@block>

<@block name="header">You signed in as ${Context.principal}</@block>

<@block name="content">

<div style="margin:10px;">

	<div id="enrollmentTitle" class="ui small header center aligned segment" style="padding: 0.5em 0 0.5em 0;">Enrollment for </div>

	<div class="ui grid">
		<div id="mainLeft" class="twelve wide column">

			<div id="enrollmentTabs" class="ui top attached tabular menu">
				<a class="active item" data-tab="Accident">Accident</a>
				<a class="item" data-tab="Disability">Disability</a>
				<a class="item" data-tab="Term Life">Term Life</a>
				<a class="item" data-tab="Critical Illness">Critical Illness</a>
				<a class="item" data-tab="Short Term Disability">Short Term Disability</a>
			</div>
			<div class="ui bottom attached active tab segment productTab" data-tab="Accident" style="padding-top: 0em">
				<div id="benefitsTable">
					<table id="table-Accident" class="display" style="height:19em" cellspacing="0" width="100%">
						<thead class="benefitsHeader">
							<tr>
								<th>Benefits</th>
								<th>Economy</th>
								<th>Standard</th>
								<th>Preferred</th>
								<th>Premium</th>
							</tr>
						</thead>
						<tbody class="benefitsBody">
						</tbody>
					</table>
					<div id="loaderDiv">
						<div class="ui active inverted dimmer">
							<div class="ui large text loader">
								Loading...
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="ui bottom attached tab segment productTab" data-tab="Disability">
				(Disability enrollment details)
			</div>
			<div class="ui bottom attached tab segment productTab" data-tab="Term Life">
				(Term Life enrollment details)
			</div>
			<div class="ui bottom attached tab segment productTab" data-tab="Critical Illness">
				(Critical Illness enrollment details)
			</div>
			<div class="ui bottom attached tab segment productTab" data-tab="Short Term Disability">
				(Short Term Disability enrollment details)
			</div>

		</div>
		<div id="mainRight" class="ui four wide column">
			<div class="ui segment" style="margin-top:37px;">
				<div class="ui center aligned dividing tiny header">Total Weekly Premium</div>
				<div id="totalPremium" class="ui center aligned huge header">$0.00</div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript" charset="utf-8">
	newEnrollment_init('${Context.getProperty("employeeId")}', '${Context.getProperty("employerId")}');
</script>


</@block>
</@extends>
