'use strict';

app.service('SessionsSrv', function(DataSrv){
	this.getAll = function() {
		return DataSrv.getFileData().then(resp => resp.sessions);
	};

	this.getSession = function(sessionId) {
		return this.getAll().then(sessions => {
				// Looking for the right session in all sessions
				for (var s in sessions ) {
					if (sessions[s].id == sessionId) {
						return sessions[s];
					}
				}

				return {};
			});
	};

	this.getSpeakerSessions = function(speakerId) {
		return this.getAll().then(sessions => {
				var speakerSessions = [];
				for (var s in sessions ) {
					var sessionSpeakers = sessions[s].speakers;
					for (var sp in sessionSpeakers) {
						if (sessionSpeakers[sp] == speakerId) {
							speakerSessions.push(sessions[s]);
						}
					}
				}

				return speakerSessions;
		});
	};
});