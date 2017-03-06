'use strict';

app.controller('SpeakerCtrl', function($scope, $routeParams, SpeakersSrv, SessionsSrv) {
	
	var speakerId = $routeParams.speakerId;
	$scope.speaker = {};

	// Retrieving the speaker
	SpeakersSrv.getSpeaker(speakerId).then(speaker => {
		var speakerWithIconLink = SpeakersSrv.addIconLink(speaker);

		$scope.speaker.id = speakerId;
		$scope.speaker.firstname = speakerWithIconLink.firstname;
		$scope.speaker.lastname = speakerWithIconLink.lastname;
		$scope.speaker.socials = speakerWithIconLink.socials;
		$scope.speaker.image = speakerWithIconLink.image;
		$scope.speaker.company = speakerWithIconLink.company;

		// Checking if the speaker is already in contacts
		SpeakersSrv.findContactByNickname($scope.speaker.id)
			.then(contact => {
				if (contact) {
					$scope.speaker.inContacts = true;
				} else {
					$scope.speaker.inContacts = false;
				}
			});
	});

	// Getting the sessions of the speaker
	$scope.sessions = SessionsSrv.getSpeakerSessions(speakerId).then(sessions => {
		$scope.sessions = sessions;		
	});

	$scope.addOrDeleteContact = function() {
		if ($scope.speaker.inContacts) {
			/* ADDING A CONTACT */
			var contactLinks = [];
			for (var l in $scope.speaker.socials) {
				var link = $scope.speaker.socials[l];
				contactLinks.push({
					"id": new Date().getUTCMilliseconds(),
					"type": link.class,
					"value": link.link
				});
			}

			var contactOrganizations = [];
			contactOrganizations.push({
				"id": new Date().getUTCMilliseconds(),
				"name": $scope.speaker.company,
				"pref": false,
				"type": "other"
			});

			var contact = {
				"displayName": $scope.speaker.firstname + " " + $scope.speaker.lastname,
				"nickname": $scope.speaker.id,
				"name": {
					"familyName": $scope.speaker.lastname,
					"formatted": $scope.speaker.firstname + " " + $scope.speaker.lastname,
					"givenName": $scope.speaker.firstname
				},
				"urls": contactLinks,
				"note": "Conférence : " + $scope.sessions[0].title,
				"organizations": contactOrganizations
			};

			SpeakersSrv.addContact(contact);
		} else {
			/* DELETING A CONTACT */
			SpeakersSrv.findContactByNickname($scope.speaker.id)
				.then(contact => SpeakersSrv.deleteContact(contact)
						.then(booleanRes => $scope.speaker.inContacts = false));
		}
	} 
});