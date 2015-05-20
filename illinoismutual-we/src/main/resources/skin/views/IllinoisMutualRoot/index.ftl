<@extends src="base.ftl">
<@block name="header">You signed in as ${Context.principal}</@block>

<@block name="content">

<div id="mainDiv">
	<table id="mainTable" class="mainTable">
		<tr>
		<td style="width: 20%;">
			<div class="mainLeft">
				<div id="navigation">
			NAVIGATION
				</div>
				<div id="recentActivity">
					<u>Recent Activity</u>
					<div style="font-size:smaller;">
					<p>12 Enrollments Started</p>
					<p>34 Applications to Submit</p>
					<p>. . .</p>
					</div>
				</div>
			</div>
		</td>
		<td style="width: 60%;">
			<p><b>Workplace Enrollment</b></p>
			<div class="mainCenter">
				<p>View Reports</p>
				<p>Work open Cases</p>
				<p>Add New Employer</p>
				<p>Set up Enrollment</p>
				<p>Enrollment</p>
			</div>
		</td>
		<td style="width: 20%;">
			<div id="messageCenter" class="mainRight">
				<div style="border-style: solid">
				MESSAGE CENTER
				</div>
			</div>
		</td>
		</tr>
	</table>
</div>

<div style="width:80%">
  <table id="table_id" class="display">
    <thead>
        <tr>
            <th>Title</th>
            <th>Type</th>
        </tr>
    </thead>
</table>
</div>

<div style="margin: 10px 10px 10px 10px">
<p>
This is the view corresponding your root object: ${This.class.simpleName}.
</p>
<p>
You can find the code of this view in: src/main/resources/skin/views/${This.class.simpleName}
</p>

<p>
To render a view from an WebEngine object you should create @GET annotated method which is returning the view: getView("viewname") where <i>viewname</i> is the file name (without the ftl extension) in the views/ObjectName folder.   
</p>

<p>
In a view you can access the object instance owning the view using ${r"${This}"} variable or the request context using the ${r"${Context}"} variable.  
</p>

<p>
Also, you can use @block statements to create reusable layouts.
</p>

</div>

</@block>
</@extends>
