'use strict';

app.controller('AboutCtrl', function($scope) {

	$scope.device = device;
	$scope.connection = navigator.connection;

	document.addEventListener("deviceready", function () {
	  
		$scope.application = {
			"description": "Cette application est destinée aux participants à la conférence. Il peuvent y consulter les différents intervenants ainsi que les conférences où ils interviennent.",
		  	"version": AppVersion.version,
		  	"author": "Alex GOURBILIERE",
		  	"web": "https://fr.linkedin.com/in/alex-gourbiliere-a3864793"
		};
	});
});
