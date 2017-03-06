var app = angular.module('conferenceApp', ['ngRoute', 'ngCordova']);

app.run(function($rootScope, $cordovaSQLite, $cordovaInAppBrowser) {

    document.addEventListener("deviceready", function () {
        $rootScope.db = $cordovaSQLite.openDB({name: "cordova_conferences.db", location: 2, createFromLocation: 1});

        /* Tables creation */
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS NOTES (sessionId text primary key, comment text);");

        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS PICTURE (pictureId text primary key, sessionId text, picture text);");

        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS AUDIO (audioId text primary key, sessionId text, audio text);");

        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS VIDEO (videoId text primary key, sessionId text, video text);");

        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS AGENDA (sessionId text primary key, hourId text);");

        /* Open links with class "webLink" in internal browser */
        var options = {
	      location: 'yes',
	      clearcache: 'yes',
	      toolbar: 'no'
	    };
        $('body').on('click', 'a.webLink', function (event) {
        	event.preventDefault();
		    $cordovaInAppBrowser.open(this.href, '_blank', options)
			    .then(function(event) {
			    	// success
			    })
			    .catch(function(event) {
			    	// error
			    });
 		});
    });
});