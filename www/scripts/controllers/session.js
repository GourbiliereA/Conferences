'use strict';

app.controller('SessionCtrl', function($scope, SessionsSrv, $routeParams, SpeakersSrv) {
	
	var sessionId = $routeParams.sessionId;
	$scope.descriptionAccordeon = {};
	$scope.descriptionAccordeon.style = "display: none;"
	$scope.descriptionAccordeonChevron = {};
	$scope.descriptionAccordeonChevron.class = "glyphicon glyphicon-chevron-down";

	// Retrieving the session
	$scope.session = SessionsSrv.getSession(sessionId).then(session => {
		$scope.session = session;
	});

	// Getting the speakers of the session
	$scope.speakers = $scope.session.then(session => {
		SpeakersSrv.getConfSpeakers($scope.session.speakers).then(speakers => {
			$scope.speakers = speakers;
		});

		/* Display or not session's description */
		$scope.updateDescriptionDisplay = function() {
			if ($scope.descriptionAccordeon.style == "display: initial;") {
				$scope.descriptionAccordeon.style = "display: none;";
				$scope.descriptionAccordeonChevron.class = "glyphicon glyphicon-chevron-down";
			} else {
				$scope.descriptionAccordeon.style = "display: initial;";
				$scope.descriptionAccordeonChevron.class = "glyphicon glyphicon-chevron-up";
			}
		}
	});
});