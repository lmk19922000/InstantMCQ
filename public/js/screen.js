var room_id = 'room1';
var screen_data = {name: 'screen'};
UnaScreen.register(room_id, screen_data, function(res) {
    if (res.success) {
    	event_key = "TESTUNA";
    	handler = function(res){
    		console.log(res);
    		var a = document.createElement("h2");
    		a.textContent = res.payload.mes;
    		document.body.appendChild(a);
    	}
    	UnaScreen.onControllerInput(event_key,handler);
    } else {
        // Screen registration failed
    }
});