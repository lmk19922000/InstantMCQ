var room_id = 'room1';
var screen_data = {name: 'screen'};
var student_ids = [];

UnaScreen.register(room_id, screen_data, function(res) {
	if (res.success) {
		event_key = "TESTUNA";
		handler = function(res){
			var a = document.createElement("h2");
			a.textContent = res.payload.mes;
			document.body.appendChild(a);
		}
		UnaScreen.onControllerInput(event_key,handler);
	} else {
        // Screen registration failed
    }
});
UnaScreen.onControllerJoin(function(data){
	if (typeof (student_ids[data.una.id]) == 'undefined'){
		student_ids.push(data.una.id);
	}
	return true;
});


UnaScreen.onControllerInput("buttonClicked", function(res) {	
	updateDate(res);
	drawChart();
});
var userTable = new Object();
var tempData = [];
var indexTable = new Object();
function updateDate(res){
	console.log("update "+res.payload.answer);
	if(userTable[res.una.id]){
		indexTable[userTable[res.una.id]]--;
		if(indexTable[userTable[res.una.id]]<0)
			indexTable[userTable[res.una.id]]=0;
		userTable[res.una.id]=res.payload.answer;
	}else{
		userTable[res.una.id]=res.payload.answer;
	}
	if(indexTable[res.payload.answer])
		indexTable[res.payload.answer]++;
	else indexTable[res.payload.answer]=1;

	tempData = [];
	for(key in indexTable)
		tempData.push([key,indexTable[key]]);
}
google.load('visualization', '1.0', {'packages':['corechart']});
google.setOnLoadCallback(drawChart);
function drawChart() {
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Choices');
	data.addColumn('number', 'Slices');
	data.addRows(tempData);
	vpw = window.innerWidth*0.9;
	vph = window.innerHeigh*0.9;
	var options = {'title':'Multiple Choices Questions','width':vpw,'height':vph, pieSliceText: 'value'};

	var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
	chart.draw(data, options);
}

document.onload = function(){				//google drawing stuffs, need to load later.
	
};

var createQuestion = function(form){
	var question = $("form").serializeArray()[0]["value"];
	var ans = $("form").serializeArray()[1]["value"];
	for (i in student_ids){
		console.log(student_ids[i]);
		UnaScreen.sendToController(student_ids[i],"TESTUNA", 
		{
			question: question,
			answers: ans
		});	
	}
}