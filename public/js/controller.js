var room_id = 'room1';
var controller_data = {name: 'player1'};
UnaController.register(room_id, controller_data, function(res) {
	if (res.success) {
		data = {mes: "controller connected"};
		event_key = "TESTUNA";
		UnaController.sendToScreen(event_key, data);
	} else {
        // Controller registration failed
    }
});

UnaController.onScreenInput("TESTUNA", function(res){
	var ques = res.payload.question;
	var ans = res.payload.answers.split(",");
	var a = document.createElement("h2");
	a.textContent = "Question: " + ques;
	document.body.appendChild(a);
	for (i in ans){
		var button = document.createElement("button");
		button.textContent = ans[i].trim();
		document.body.appendChild(button);
	}
})
