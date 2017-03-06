'use strict';

app.controller('SpeakersCtrl', function($scope, SpeakersSrv) {
	$scope.speakers = SpeakersSrv.getAll().then(speakers => {
        $scope.speakers = speakers;
    });
});