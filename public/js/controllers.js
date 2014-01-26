google.load('visualization', '1.0', {'packages':['corechart']});

instantMCQControllers = angular.module('instantMCQControllers',['timer']);

instantMCQControllers.controller('IndexCtrl', ['$scope','$location','$routeParams',
	function($scope, $location,$routeParams) {
		if ($routeParams)
		$scope.createRoom = function() {
			$location.path('/screen/' + $scope.roomId);
		};
		$scope.joinRoom = function() {
			$location.path('/controller/' + $scope.roomId);
		};
	}]);

instantMCQControllers.controller('ScreenCtrl', ['$scope', '$location','$routeParams',
	function($scope, $location, $routeParams) {

		UnaScreen.register(room_id, screen_data, function(res) {
			if (res.success) {
				// event_key = "REGISTER";
				// handler = function(res){
				// 	var a = document.createElement("h2");
				// 	a.textContent = res.payload.mes;
				// 	document.body.appendChild(a);
				// }
				// UnaScreen.onControllerInput(event_key,handler);
			} else {
				$location.path('/error');
			}
		});
		$scope.error = $routeParams.error;
		$scope.roomName = $routeParams.screenName
		var room_id = $scope.roomName;
		var screen_data = {name: 'screen'};
		var student_ids = [];
		var current = {};

		$scope.buttonSaveImage = function(){
			$scope.saveAsImg(document.getElementById('chart_div'));
		}
		$scope.getImageData = function(chartContainer) {
			var chartArea = chartContainer.getElementsByTagName('svg')[0].parentNode;
			var svg = chartArea.innerHTML;
			var doc = chartContainer.ownerDocument;
			var canvas = doc.createElement('canvas');
			canvas.setAttribute('width', chartArea.offsetWidth);
			canvas.setAttribute('height', chartArea.offsetHeight);


			canvas.setAttribute(
				'style',
				'position: absolute; ' +
				'top: ' + (-chartArea.offsetHeight * 2) + 'px;' +
				'left: ' + (-chartArea.offsetWidth * 2) + 'px;');
			doc.body.appendChild(canvas);
			canvg(canvas, svg);
			var imgData = canvas.toDataURL('image/png');
			canvas.parentNode.removeChild(canvas);
			return imgData;
		}

		$scope.saveAsImg = function(chartContainer) {
			var imgData = $scope.getImageData(chartContainer);

			// Replacing the mime-type will force the browser to trigger a download
			// rather than displaying the image in the browser window.
			var currentdate = new Date();
			var datetime =  currentdate.getFullYear()+ "-"+(currentdate.getMonth()+1) + "-" + currentdate.getDate() + " @ " 
			+ currentdate.getHours() + ":" 
			+ currentdate.getMinutes() + ":" + currentdate.getSeconds();
			var imageLink = document.createElement("a");
			imageLink.href = imgData;
			imageLink.download = current.ques.trim()+'.png';
			imageLink.click();
			//window.location = imgData.replace('image/png', 'image/octet-stream');
		}

		$scope.toImg = function(chartContainer, imgContainer) { 
			var doc = chartContainer.ownerDocument;
			var img = doc.createElement('img');
			img.src = $scope.getImgData(chartContainer);

			while (imgContainer.firstChild) {
				imgContainer.removeChild(imgContainer.firstChild);
			}
			imgContainer.appendChild(img);
		}

		$scope.SaveAsPDF = function(){
			var doc = new jsPDF();
			var doc = new jsPDF();
			var imgData = $scope.getImgData(document.getElementById('chart_div'));
			doc.addImage(imgData, 'JPEG', 0, 0, window.innerWidth*0.2, window.innerHeight*0.2);

			doc.save(current.ques.trim() + '.pdf');
		}

		$scope.getImgData = function(chartContainer) {
			var chartArea = chartContainer.getElementsByTagName('svg')[0].parentNode;
			var svg = chartArea.innerHTML;
			var doc = chartContainer.ownerDocument;
			var canvas = doc.createElement('canvas');
			canvas.setAttribute('width', chartArea.offsetWidth);
			canvas.setAttribute('height', chartArea.offsetHeight);

			canvas.setAttribute(
				'style',
				'position: absolute; ' +
				'top: ' + (-chartArea.offsetHeight * 2) + 'px;' +
				'left: ' + (-chartArea.offsetWidth * 2) + 'px;');
			doc.body.appendChild(canvas);
			canvg(canvas, svg);
			canvas.parentNode.removeChild(canvas);

			var imgData = canvas.toDataURL('image/jpeg').slice('data:image/jpeg;base64,'.length);
			// Convert the data to binary form
			imgData = atob(imgData);

			return imgData;
		}

		$scope.startTimer = function (){
			$scope.$broadcast('timer-start');
			$scope.timerRunning = true;
		};

		$scope.stopTimer = function (){
			$scope.$broadcast('timer-stop');
			$scope.timerRunning = false;
		};

		$scope.$on('timer-stopped', function (event, data){
			console.log('Timer Stopped - data = ', data);
		});


		UnaScreen.onControllerJoin(function(data){
			if (typeof (student_ids[data.una.id]) == 'undefined'){
				student_ids.push(data.una.id);
			}
			if ('ques' in current && 'ans' in current){
				console.log('hey');
				UnaScreen.sendToController(data.una.id, "TESTUNA", 
				{
					question: current['ques'],
					answers: current['ans']
				});
			}
			return true;
		});

		UnaScreen.onControllerLeave(function(data){
			var index = student_ids.indexOf(data.una.id);
			student_ids.splice(index, 1);
		})


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
		function drawChart() {
			var data = new google.visualization.DataTable();
			data.addColumn('string', 'Choices');
			data.addColumn('number', 'Slices');
			data.addRows(tempData);
			vpw = window.innerWidth*0.9;
			vph = window.innerHeight*0.9;
			var options = {'title':'Multiple Choices Questions','width':vpw,'height':vph, pieSliceText: 'value'};

			var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
			chart.draw(data, options);
			$("#save_div").css('visibility','visible');
		}

		$scope.createQuestion = function(){
			$scope.startTimer();
			var question = $("form").serializeArray()[0]["value"];
			var ans = $("form").serializeArray()[1]["value"];
			current['ques'] = question;
			current['ans'] = ans;
			for (i in student_ids){
				UnaScreen.sendToController(student_ids[i],"TESTUNA", 
				{
					question: question,
					answers: ans,
				});	
			}
		}

		$scope.clearQuestion = function(){
			$scope.startTimer();
			$scope.stopTimer();
			current = {};
			$("input").val("");
			$("#chart_div").empty();
			$("#save_div").css('visibility','hidden');
			for (i in student_ids){
				UnaScreen.sendToController(student_ids[i], "newQuestion");
			}
		};
	}]);

instantMCQControllers.controller('ControllerCtrl',['$scope', '$location', '$routeParams', '$rootScope',
	function($scope,$location, $routeParams, $rootScope) {
		$scope.roomName = $routeParams.screenName;
		var room_id = $scope.roomName;
		var controller_data = {name : 'player1'};
		$scope.current = {
		};
		
		UnaController.register(room_id, controller_data, function(res) {
			if (res.success) {
			} 
			else {
			}
		});

		UnaController.onScreenInput("TESTUNA", function(res){
			console.log("hey");
			console.log(res);
			var ques = res.payload.question;
			var ans = res.payload.answers.split(",");
			$rootScope.$apply(
				$scope.current = {
					ans:ans,
					ques:ques
				});
		});

		$scope.buttonHandler = function(ans) {
			console.log("clicked  "+ ans);
			UnaController.sendToScreen("buttonClicked", { answer: ans});
			console.log("sent");
		};

		UnaController.onScreenInput("newQuestion", function(res){
			$rootScope.$apply($scope.current = {});
		});


	}]);