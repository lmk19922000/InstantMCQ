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

document.onload = function(){				//google drawing stuffs, need to load later.
	google.load('visualization', '1.0', {'packages':['corechart']});
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
	var chart = document.getElementById('chart_div');
	vpw = window.innerWidth;
	vph = window.innerHeight;
	chart.style.width=vpw+'px';
	chart.style.height=vph+'px';
	var room_id = 'room1';
	var screen_data = {name: 'screen'};
	UnaScreen.register(room_id, screen_data, function(res) {
		if (res.success) {
				// Screen registered successfully
			} else {
				// Screen registration failed
			}
		});
	var userTable = new Object();
	UnaScreen.onControllerInput("buttonClicked", function(res) {	
		if(!userTable[res.una.id]){
			console.log("recieve  "+res.payload.buttonID);

		}else{

		}
		updateDate(res.payload.buttonID);
		drawChart();
	});
	var tempData = [];
	var indexTable = new Object();
	indexTable['A']=0;indexTable['B']=0;indexTable['C']=0;indexTable['D']=0;
	function updateDate(buttonID){
		indexTable[buttonID]++;
		tempData=[['A',indexTable['A']],['B',indexTable['B']],['C',indexTable['C']],['D',indexTable['D']]];
	}

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