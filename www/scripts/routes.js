app.config(function ($routeProvider) {
        $routeProvider
          .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
          })
          .when('/sessions', {
            templateUrl: 'views/sessions.html',
            controller: 'SessionsCtrl'
          })
          .when('/sessions/:sessionId', {
            templateUrl: 'views/session.html',
            controller: 'SessionCtrl'
          })
          .when('/sessions/:sessionId/notes', {
            templateUrl: 'views/notes.html',
            controller: 'NotesCtrl'
          })
          .when('/speakers', {
            templateUrl: 'views/speakers.html',
            controller: 'SpeakersCtrl'
          })
          .when('/speakers/:speakerId', {
            templateUrl: 'views/speaker.html',
            controller: 'SpeakerCtrl'
          })
          .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl'
          })
          .when('/agenda', {
            templateUrl: 'views/agenda.html',
            controller: 'AgendaCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });
    });