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
	for (var i in ans){
		var div = $(document.createElement("div"));
		var button = $(document.createElement("button"));
		var id = ans[i];
		button.text(ans[i].trim());
		button.attr("id",i);
		$(div).append(button);
		$("body").append(div);
		var buttonID = document.getElementById(i);
		buttonID.onclick = function(){
			console.log("clicked  "+ $(this).text());
			UnaController.sendToScreen("buttonClicked", { answer: $(this).text()});
			console.log("sent");
		}
		
	}
})

