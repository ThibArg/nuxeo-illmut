<@extends src="base.ftl">
<@block name="header">You signed in as ${Context.principal}</@block>

<@block name="content">

<div style="margin: 10 20 10 20;">
<!--
	<div id="mainTop">
		<p></p>
		<p></p>
	</div>
-->
	<div class="ui grid">
		<div class="four wide column"></div>
		<div class="ui eight wide column">
			<div class="ui dividing header">Workplace Enrollment</div>
		</div>
		<div class="ui four wide column"></div>
	</div>

	<div class="ui grid">
		<div class="equal height row">
			<div id="mainLeft" class="four wide column">
				<div class="ui blue segment">
					<div class="ui dividing tiny header">Navigation</div>
					<div id="mainNavidation">
						Manage employers<br/>
						Server Setup<br/>
						. . .
					</div>
				</div>
				<div class="ui blue segment">
					<div class="ui dividing tiny header">Recent Activity</div>
					<div id="mainRecentActivity">
						14 Enrollments started<br/>
						15 Applications to submit<br/>
						. . .
					</div>
				</div>
			</div>
			<div id="mainCenter" class="ui eight wide column">
				<div id="mainActiveEnrollment" class="ui segment">
					You have no active enrollment
				</div>
				<div class="ui segment">
					<div class="ui small header segment">
						<div class="workplaceChoiceLeft"><a>View Reports</a></div>
					</div>
					<div class="ui small header segment">
						<div class="workplaceChoiceLeft"><a>Work Open Cases</a></div>
						<div id="nbOpenCases" class="workplaceChoiceRight">2 currently open</div>
					</div>
					<div class="ui small header segment">
						<div class="workplaceChoiceLeft"><a>Add New Employer</a></div>
						<div id="nbEmployers" class="workplaceChoiceRight">78 existing employers</div>
					</div>
					<div class="ui small header segment">
						<div class="workplaceChoiceLeft"><a>Set up Enrollment</a></div>
					</div>
					<div class="ui small header segment">
						<div class="workplaceChoiceLeft"><a>Enrollment</a></div>
					</div>
				</div>
			</div>
			<div id="mainRight" class="ui four wide column">
				<div class="ui red segment">
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

</@block>
</@extends>
