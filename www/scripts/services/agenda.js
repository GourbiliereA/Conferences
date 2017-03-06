'use strict';

app.service('AgendaSrv', function($q, DataSrv){

    var allHours = DataSrv.getFileData().then(resp => { allHours = resp.hours});
	
    this.getAllHours = function() {
        return DataSrv.getFileData().then(resp => resp.hours);
    }

    this.getSessionHours = function(hourId) {    
        for (var h in allHours) {
            if (allHours[h].id == hourId) {
                var hS = allHours[h].hourStart;
                var mS = allHours[h].minStart;
                var hE = allHours[h].hourEnd;
                var mE = allHours[h].minEnd;
                var sessionHours = {
                    "id": allHours[h].id,
                    "startHourString": hS+"h"+mS,
                    "endHourString": hE+"h"+mE,
                    "startHourDate": new Date(2017, 3, 15, parseInt(hS), parseInt(mS), null, null),
                    "endHourDate": new Date(2017, 3, 15, parseInt(hE), parseInt(mE), null, null)
                };
                
                return sessionHours;
            }
        }
    }

    this.getRegisteredSessions = function(db) {
        var request = 'SELECT * FROM AGENDA;';
        var registeredSessions = [];

        var deferred = $q.defer();

        db.executeSql(request, [], function(res) {
            console.log("Requete : " + request);

            for (var i=0 ; i < res.rows.length ; i++) {
                registeredSessions.push(res.rows.item(i).sessionId);
            }

            deferred.resolve(registeredSessions);
        }, function(error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });

        return deferred.promise;
    }
    
    this.getRegisteredHourId = function(db) {
        var request = 'SELECT * FROM AGENDA GROUP BY hourId;';
        var registeredSessionsHourId = [];

        var deferred = $q.defer();

        db.executeSql(request, [], function(res) {
            console.log("Requete : " + request);

            for (var i=0 ; i < res.rows.length ; i++) {
                registeredSessionsHourId.push(res.rows.item(i).hourId);
            }

            deferred.resolve(registeredSessionsHourId);
        }, function(error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });

        return deferred.promise;
    }

    this.registerSession = function(db, sessionId, hourId) {
        var request = 'INSERT INTO AGENDA(sessionId, hourId) VALUES (\''+sessionId+'\', \''+hourId+'\');';
        var deferred = $q.defer();
        console.log("Requete INSERT session in agenda");

        db.executeSql(request, [], function(res) {
            console.log("Request Sucess !");
            deferred.resolve(sessionId);
        }, function(error) {
            console.log("Request failure...");
            console.log(error.message);
            deferred.resolve(null);
        });

        return deferred.promise;
    }

    this.unregisterSession = function(db, sessionId) {
        var request = 'DELETE FROM AGENDA WHERE sessionId=\''+sessionId+'\';';
        var deferred = $q.defer();
        console.log("Requete DELETE session from agenda");

        db.executeSql(request, [], function(res) {
            console.log("Request Sucess !");
            deferred.resolve(true);
        }, function(error) {
            console.log("Request failure...");
            console.log(error.message);
            deferred.resolve(false);
        });

        return deferred.promise;
    }

    this.checkSessionAvailability = function(sessionToCheck, registeredHours) {
        var deferred = $q.defer();
        var sTCStart = sessionToCheck.startHourDate;
        var sTCSEnd = sessionToCheck.endHourDate;
        for (var id in registeredHours) {
            var regSesHours = this.getSessionHours(registeredHours[id]);
            var regSesStart = regSesHours.startHourDate;
            var regSesEnd = regSesHours.endHourDate;

            if (sTCStart >= regSesStart && sTCStart < regSesEnd
                || sTCSEnd <= regSesEnd && sTCSEnd > regSesStart) {
                deferred.resolve(false);
                return deferred.promise;
            }
        }

        deferred.resolve(true);
        return deferred.promise;
    }
});
