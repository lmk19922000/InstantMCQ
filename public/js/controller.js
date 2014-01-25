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