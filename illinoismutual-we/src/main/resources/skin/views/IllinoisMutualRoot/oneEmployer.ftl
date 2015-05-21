<@extends src="base.ftl">
<@block name="header">You signed in as ${Context.principal}</@block>

<@block name="content">

<div style="margin:10px;">

	<div class="ui grid">
		<div class="equal height row">
			<div id="mainLeft" class="three wide column">
				<div class="ui blue segment">
					<div class="ui dividing tiny header">Navigation</div>
					<div id="mainNavidation">
						Manage employers<br/>
						Server Setup<br/>
						. . .
					</div>
				</div>
				<div id="enrollmentSummaryContainer" class="ui blue loading segment">
					<div class="ui dividing tiny header">Enrollment Summary</div>
					<div id="enrollmentSummary">
						
					</div>
				</div>
			</div>
			<div id="mainCenter" class="ui ten wide column">

				<div id="enrollmentForEmployerTitle" class="ui header center aligned segment">Entrollment for </div>

				<!--
				<div class="ui dividing header">Employees</div>
				-->
				<div id="employeesList">

					<div id="employeesLoading" class="ui center aligned segment" style="height:16em;">
						<div class="ui active inverted dimmer">
							<div class="ui large text loader">
								Loading...
							</div>
						</div>
					</div>

				</div>
			</div>
			<div id="mainRight" class="ui three wide column">
				<div class="ui green segment">
					<div class="ui dividing tiny header">Message Center</div>
					<div id="mainMessages" class="ui disabled segment">
						<p></p>
						<p></p>
						<p></p>
						<p></p>
						<p>No messages</p>
						<p></p>
						<p></p>
						<p></p>
						<p></p>
					</div>
				</div>
			</div>

		</div>
	</div>
</div>

<script type="text/javascript" charset="utf-8">
	enrollmentForEmployer_init('${Context.getProperty("employerId")}', '${Context.getProperty("employerName")}');
</script>


</@block>
</@extends>
