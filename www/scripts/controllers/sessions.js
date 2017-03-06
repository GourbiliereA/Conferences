'use strict';

app.controller('SessionsCtrl', function($scope, SessionsSrv, AgendaSrv) {

	var db = $scope.db;
	$scope.sessions = [];
	var registeredSessions = null;
	var registeredHours = AgendaSrv.getRegisteredHourId(db).then(hoursId => {
		registeredHours = hoursId;
	});

	// Registered Sessions
	AgendaSrv.getRegisteredSessions(db).then(regSessions => {
		registeredSessions = regSessions;

		// All sessions
		SessionsSrv.getAll().then(sessions => {

	        for (var s in sessions) {
	        	// Marking the session as registered or not
	        	var sessionId = sessions[s].id;
	        	if (registeredSessions && 
	        			$.inArray(sessionId, registeredSessions) != -1) {
	        		sessions[s].registered = true;
	        	} else {
	        		sessions[s].registered = false;
	        	}

	        	$scope.sessions.push(sessions[s]);
	        }


	        $scope.hours = AgendaSrv.getAllHours().then(hours => {
		        for (var s in $scope.sessions) {
		        	var hourId = $scope.sessions[s].hour;

		        	$scope.sessions[s].hours = AgendaSrv.getSessionHours(hourId);
		        }
	        });
	    });
	});

    $scope.changeSessionRegistration = function(sessionId, hourId, isChecked) {
        var sessionHours = AgendaSrv.getSessionHours(hourId);
    	$("#errorMessage_"+sessionId).text("");

		if (isChecked) {
        	AgendaSrv.checkSessionAvailability(sessionHours, registeredHours).then(available => {
        		 if (available) {
        		 	// No existing session on choosen hours
        		 	AgendaSrv.registerSession(db, sessionId, hourId);
					registeredSessions.push(sessionId);
					registeredHours.push(hourId);
        		 } else {
        		 	// Already an existing session in those hours
    				event.preventDefault();
    		 		$("#errorMessage_"+sessionId).text("Vous avez déjà prévu une conférence pour ce créneau. Par soucis d'organisation pour les intervenants, vous ne pouvez prévoir qu'une conférence par créneau.");
        		 }
        	});
		} else {
			AgendaSrv.unregisterSession(db, sessionId);
			for (var s = 0 ; s < registeredSessions.length ; s++) {
				if (registeredSessions[s] == sessionId) {
					registeredSessions.splice(s, 1);

					break;
				} 
			}	
			registeredHours = AgendaSrv.getRegisteredHourId(db).then(hoursId => {
				registeredHours = hoursId;
			});
		}
	};
});