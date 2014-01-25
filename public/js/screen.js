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