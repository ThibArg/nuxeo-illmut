<@extends src="base.ftl">

<@block name="header_scripts">
<script src="${skinPath}/scripts/newEnrollment.js"></script>
</@block>

<@block name="header">You signed in as ${Context.principal}</@block>

<@block name="content">

<div style="margin: 10 20 10 20;">

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
				(Term Life enrollment details)
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
				(Critical Illness enrollment details)
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
				(Short Term Disability enrollment details)
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
			<div class="ui segment" style="margin-top:37px; text-align:center;">
				<div class="ui center aligned dividing tiny header">Total Weekly Premium</div>
				<div id="selectionTotal" class="ui center aligned huge header">$0.00</div>
				<div class="ui divider"></div>
				<div id="selectionDesc" class="ui right aligned segment" style="font-size:smaller;">
				</div>
				<div class="ui fluid primary button">Apply</div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript" charset="utf-8">
	newEnrollment_init('${Context.getProperty("employeeId")}', '${Context.getProperty("employerId")}');
</script>


</@block>
</@extends>
