'use strict';

app.controller('AgendaCtrl', function($scope, $cordovaCalendar, SessionsSrv, AgendaSrv, NotesSrv) {

	var db = $scope.db;
	$scope.registeredSessions = [];

	AgendaSrv.getRegisteredSessions(db).then(sessionsIds => {
		AgendaSrv.getAllHours().then(hours => {	
			for (var i in sessionsIds) {
				SessionsSrv.getSession(sessionsIds[i]).then(session => {
			        session.hours = AgendaSrv.getSessionHours(session.hour);

			        $scope.registeredSessions.push(session);
				});
			}
		});
	});

	$scope.saveInAgenda = function(sessionId) {
		SessionsSrv.getSession(sessionId).then(session => {
			var hours = AgendaSrv.getSessionHours(session.hour);

			NotesSrv.getSessionNotes(db, session.id).then(notes => {
				if (!notes){
					notes = {
						"sessionId": session.id,
						"comment": ""
					}
				}

				var optionsEvent = {
				    title: session.title,
				    location: session.confRoom,
				    notes: session.desc,
				    startDate: hours.startHourDate,
				    endDate: hours.endHourDate
				};

				$cordovaCalendar.createEventInteractively(optionsEvent).then(function (result) {
				    // success
				}, function (err) {
				    // error
				});
			})
		});
	}
});
