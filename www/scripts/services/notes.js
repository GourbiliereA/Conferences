'use strict';

app.service('NotesSrv', function($q){


	/********************************************
						NOTES
	********************************************/
	this.getSessionNotes = function(db, sessionId) {
		var request = 'SELECT * FROM NOTES WHERE sessionId=\''+sessionId+'\';';

		var deferred = $q.defer();

		db.executeSql(request, [], function(res) {
			console.log("Requete : " + request);
			deferred.resolve(res.rows.item(0));
		}, function(error) {
		  	console.log('SELECT SQL statement ERROR: ' + error.message);
		});

		return deferred.promise;
	}

	this.saveNotes = function(db, sessionId, comment, firstSave) {
		var request = '';
		if (!firstSave) {
			request = 'UPDATE NOTES SET comment=\''+comment+'\' WHERE sessionId=\''+sessionId+'\';';
			console.log("Requete UPDATE notes");
		} else {
			request = 'INSERT INTO NOTES(sessionId, comment) VALUES (\''+sessionId+'\',\''+comment+'\');';
			console.log("Requete INSERT notes");
		}

		var deferred = $q.defer();

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


	/********************************************
					ALL MULTIMEDIA
	********************************************/
	this.getMultimedias = function (db, sessionId, media) {
		var request = 'SELECT * FROM '+media+' WHERE sessionId=\''+sessionId+'\';';
		var mulitmedias = [];
		var deferred = $q.defer();

		db.executeSql(request, [], function(res) {
			console.log("Requete : " + request);

			for (var i=0 ; i < res.rows.length ; i++) {
				mulitmedias.push(res.rows.item(i));
			}

			deferred.resolve(mulitmedias);
		}, function(error) {
		  	console.log('SELECT SQL statement ERROR: ' + error.message);
		});

		return deferred.promise;
	}

	/********************************************
						PICTURES
	********************************************/
	this.savePicture = function(db, sessionId, pictureData) {
		var date = new Date();
		var pictureId = date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString()
		var request = 'INSERT INTO PICTURE(pictureId, sessionId, picture) VALUES (\''+pictureId+'\', \''+sessionId+'\', \''+pictureData+'\');';
		var deferred = $q.defer();
		console.log("Requete INSERT picture");

		db.executeSql(request, [], function(res) {
			console.log("Request Sucess !");
			deferred.resolve(pictureId);
		}, function(error) {
			console.log("Request failure...");
			console.log(error.message);
			deferred.resolve(null);
		});

		return deferred.promise;
	}

	this.deletePicture = function(db, sessionId, pictureId) {
		var request = 'DELETE FROM PICTURE WHERE sessionId=\''+sessionId+'\' AND pictureId=\''+pictureId+'\';';
		var deferred = $q.defer();
		console.log("Requete DELETE picture");

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


	/********************************************
						AUDIOS
	********************************************/
	this.saveAudio = function(db, sessionId, audioData) {
		var date = new Date();
		var audioId = date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString()
		var request = 'INSERT INTO AUDIO(audioId, sessionId, audio) VALUES (\''+audioId+'\', \''+sessionId+'\', \''+audioData[0].fullPath+'\');';
		var deferred = $q.defer();
		console.log("Requete INSERT audio");

		db.executeSql(request, [], function(res) {
			console.log("Request Sucess !");
			deferred.resolve(audioId);
		}, function(error) {
			console.log("Request failure...");
			console.log(error.message);
			deferred.resolve(null);
		});

		return deferred.promise;
	}
	
	this.deleteAudio = function(db, sessionId, audioId) {
		var request = 'DELETE FROM AUDIO WHERE sessionId=\''+sessionId+'\' AND audioId=\''+audioId+'\';';
		var deferred = $q.defer();
		console.log("Requete DELETE audio");

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

	/********************************************
						VIDEOS
	********************************************/
	this.saveVideo = function(db, sessionId, videoData) {
		var date = new Date();
		var videoId = date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString()
		var request = 'INSERT INTO VIDEO(videoId, sessionId, video) VALUES (\''+videoId+'\', \''+sessionId+'\', \''+videoData[0].fullPath+'\');';
		var deferred = $q.defer();
		console.log("Requete INSERT video");

		db.executeSql(request, [], function(res) {
			console.log("Request Sucess !");
			deferred.resolve(videoId);
		}, function(error) {
			console.log("Request failure...");
			console.log(error.message);
			deferred.resolve(null);
		});

		return deferred.promise;
	}
	
	this.deleteVideo = function(db, sessionId, videoId) {
		var request = 'DELETE FROM VIDEO WHERE sessionId=\''+sessionId+'\' AND videoId=\''+videoId+'\';';
		var deferred = $q.defer();
		console.log("Requete DELETE video");

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

	this.createThumbnail = function(videoId, video) {
		var deferred = $q.defer();
		
		navigator.createThumbnail(video, function(err, imageData) {
		    if (err)
		        throw err;
		    
			deferred.resolve({
				"videoId": videoId,
				"videoSrc": video,
				"imageData": imageData
			});
		}); 

		return deferred.promise;
	}
});