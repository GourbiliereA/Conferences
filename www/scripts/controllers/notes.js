'use strict';

app.controller('NotesCtrl', function($scope, $routeParams, $cordovaSQLite, $cordovaCamera, $cordovaCapture, $q, $cordovaActionSheet, $cordovaFileOpener2, $cordovaSocialSharing, NotesSrv, SessionsSrv) {

	var sessionId = $routeParams.sessionId;
	var db = $scope.db;
	var emptyNotes = true;
	var lastSavedComment = '';
	var sharingOptions = {
		title: 'Que voulez-vous faire ?',
		buttonLabels: ['Partager'],
		addCancelButtonWithLabel: 'Annuler',
		androidEnableCancelButton : true,
		winphoneEnableCancelButton : true,
		addDestructiveButtonWithLabel : 'Supprimer'
	};

	$scope.session = {};

	$scope.pictures = [];
	$scope.picturesAccordeon = {};
	$scope.picturesAccordeonChevron = {};
	$scope.currentPicture = {};

	$scope.audios = [];
	$scope.audiosAccordeon = {};
	$scope.audiosAccordeonChevron = {};

	$scope.videos = [];	
	$scope.videosAccordeon = {};
	$scope.videosAccordeonChevron = {};
	$scope.currentVideo = {};
	$scope.videosThumbnails = [];

	$scope.notes = NotesSrv.getSessionNotes(db, sessionId).then(notes => {
		$scope.notes = notes;
		
		if ($scope.notes) {
			emptyNotes = false;
		} else {
			$scope.notes = {
				"sessionId": sessionId,
				"comment": ""
			};
		}

		lastSavedComment = $scope.notes.comment;
		$scope.textareaComment = $scope.notes.comment;
	});
	
	$scope.session = SessionsSrv.getSession(sessionId).then(session => {
		$scope.session = session;
	});

	document.addEventListener("deviceready", function () {
		/* PICTURES */
		NotesSrv.getMultimedias(db, sessionId, "PICTURE").then(pictures => {	
			$scope.picturesAccordeon.style = "display: none;";
			$scope.picturesAccordeonChevron.class = "glyphicon glyphicon-chevron-down";

			// Loading pictures
			if (pictures.length > 0) {
				// Displaying first picture
				$scope.currentPicture.src = "data:image/png;base64," + pictures[0].picture;
				$scope.currentPicture.id = pictures[0].pictureId;
			}
			for (var p in pictures) {
				$scope.pictures.push(pictures[p]);
			}
		});

		/* AUDIOS */
		NotesSrv.getMultimedias(db, sessionId, "AUDIO").then(audios => {
			$scope.audiosAccordeon.style = "display: none;";
			$scope.audiosAccordeonChevron.class = "glyphicon glyphicon-chevron-down";

			// Loading audios
			for (var a in audios) {
				/* Adding the name of the audio to the objects */
				var filename = audios[a].audio.replace(/^.*[\\\/]/, '');
				filename = filename.replace(/%20/g, " ");
				audios[a].filename = filename;

				/* Replacing %20 by space in file location */
				audios[a].audioWithSpaces = audios[a].audio.replace(/%20/g, " ");

				$scope.audios.push(audios[a]);
			}
		});

		/* VIDEOS */
		NotesSrv.getMultimedias(db, sessionId, "VIDEO").then(videos => {
			$scope.videosAccordeon.style = "display: none;";
			$scope.videosAccordeonChevron.class = "glyphicon glyphicon-chevron-down";

			for (var v in videos) {
				$scope.videos.push(videos[v]);
			}


			// Loading videos
			if (videos.length > 0) {
				// Loading first video
				$scope.currentVideo.id = videos[0].videoId;
				$scope.currentVideo.src = videos[0].video;
				$("#divVideo video")[0].load();
				
				for (var v in videos) {
					NotesSrv.createThumbnail(videos[v].videoId, videos[v].video).then(thumbnail => {
						$scope.videosThumbnails.push({
							"videoId": thumbnail.videoId,
							"videoSrc": thumbnail.videoSrc,
							"imageData": thumbnail.imageData
						});
					});
				}
			}
		});
	});



	/*****************************
	************ NOTES ***********
	*****************************/
	/* Save the actual notes with the comment written in the textarea */
	$scope.saveNotes = function() {
		NotesSrv.saveNotes(db, $scope.session.id, $scope.textareaComment, emptyNotes).then(booleanRes => {
			if (booleanRes) {
				emptyNotes = false;
				lastSavedComment = comment;
				$("#labelSaved").removeClass("label-primary");
				$("#labelSaved").addClass("label-success");
				$("#labelSaved").text("Saved");
				$("#btnSaveNotes").attr("disabled", true);
			}
		});
	}

	/* Update the label to "Saved" or "Modified" when modifying notes' textarea value */
	$scope.updateLabelSaved = function () {
		if (lastSavedComment == $scope.textareaComment) {
			$("#labelSaved").removeClass("label-primary");
			$("#labelSaved").addClass("label-success");
			$("#labelSaved").text("Saved");
			$("#btnSaveNotes").attr("disabled", true);
		} else {
			$("#labelSaved").addClass("label-primary");
			$("#labelSaved").removeClass("label-success");
			$("#labelSaved").text("Modified");
			$("#btnSaveNotes").attr("disabled", false);
		}		
	}


	/*****************************
	********** PICTURES **********
	*****************************/
	/* Take a picture with the camera */
	$scope.takePicture = function() {
		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA
		};

		$cordovaCamera.getPicture(options).then(function(imageData) {
			NotesSrv.savePicture(db, sessionId, imageData).then(pictureId => {
				if (pictureId) {
					$scope.pictures.push ({
						"sessionId": sessionId,
						"pictureId": pictureId,
						"picture": imageData
					});
				}
			});
		}, function(err) {
			console.log(err);
		});
	}

	/* Import a picture from gallery to the app */
	$scope.importPicture = function() {
		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY
		};

		$cordovaCamera.getPicture(options).then(function(imageData) {
			NotesSrv.savePicture(db, sessionId, imageData).then(pictureId => {
				if (pictureId) {
					$scope.pictures.push ({
						"sessionId": sessionId,
						"pictureId": pictureId,
						"picture": imageData
					});
				}
			});
		}, function(err) {
			console.log(err);
		});
	}

	/* Change the main picutre displayed */
	$scope.changeCurrentPicture = function(id, src) {
		$scope.currentPicture.id = id;
		$scope.currentPicture.src = "data:image/png;base64," + src;
	}

	/* Show the action sheet for the current picture displayed */
	$scope.showPicturesActionSheet = function() {
		$cordovaActionSheet.show(sharingOptions)
		.then(function(btnIndex) {
			var index = btnIndex;
			if (index == 1) {
	        	// Deleting
	        	var pictureId = $scope.currentPicture.id;
	        	NotesSrv.deletePicture(db, sessionId, pictureId).then(booleanRes => {
	        		if (booleanRes) {
	        			for (var p = 0 ; p < $scope.pictures.length ; p++) {
	        				if ($scope.pictures[p].pictureId == pictureId) {
	        					$scope.pictures.splice(p, 1);

	        					if ($scope.pictures.length > 0) {
	        						$scope.currentPicture.id = $scope.pictures[0].pictureId;
	        						$scope.currentPicture.src = "data:image/png;base64," + $scope.pictures[0].picture;
	        					} else {
	        						$scope.currentPicture.id = "";
	        						$scope.currentPicture.src = "";
	        					}
	        					
	        					break;
	        				} 
	        			}	
	        		}
	        	});
	        } else if (index == 2) {
	        	// Sharing
	        	$cordovaSocialSharing
	        	.share($scope.notes.comment, $scope.session.title, $scope.currentPicture.src, "")
	        	.then(function(result) {
				      // Success!
				  }, function(err) {
				  	console.log(err);
				  });
	        }
	    });
	}

	/* Show/Hide the pictures */
	$scope.updatePicturesDisplay = function() {
		if ($scope.picturesAccordeon.style == "display: initial;") {
			$scope.picturesAccordeon.style = "display: none;";
			$scope.picturesAccordeonChevron.class = "glyphicon glyphicon-chevron-down";
		} else {
			$scope.picturesAccordeon.style = "display: initial;";
			$scope.picturesAccordeonChevron.class = "glyphicon glyphicon-chevron-up";
		}
	}


	/*****************************
	*********** AUDIOS ***********
	*****************************/

	/* Record an audio file */
	$scope.recordAudio = function() {
		var options = { limit: 3, duration: 10 };

		$cordovaCapture.captureAudio(options).then(function(audioData) {
			NotesSrv.saveAudio(db, sessionId, audioData).then(audioId => {
				if (audioId) {
					var fullPath = audioData[0].fullPath;
					fullPath = fullPath.replace(/%20/g, " ");
					var filename = fullPath.replace(/^.*[\\\/]/, '');

		      		// Adding the new sound to the audios displayed
		      		$scope.audios.push({
		      			"audioId": audioId,
		      			"sessionId": sessionId,
		      			"audio": audioData[0],
		      			"audioWithSpaces": fullPath,
		      			"filename": filename
		      		});
		      	}
		      });
		}, function(err) {
			console.log(err);
		});
	}

	/* Show/Hide the pictures */
	$scope.updateAudiosDisplay = function() {
		if ($scope.audiosAccordeon.style == "display: initial;") {
			$scope.audiosAccordeon.style = "display: none;";
			$scope.audiosAccordeonChevron.class = "glyphicon glyphicon-chevron-down";
		} else {
			$scope.audiosAccordeon.style = "display: initial;";
			$scope.audiosAccordeonChevron.class = "glyphicon glyphicon-chevron-up";
		}
	}

	/* Play an audio file (thanks to installed apps on phone) */
	$scope.playAudio = function(src) {
		$cordovaFileOpener2.open(
			src,
			'audio/AMR'			   
			).then(function() {
			      // Success!
		 	}, function(err) {
		  		console.log(err);
			});
	}

	/* Show the action sheet for an audio file */
	$scope.showAudiosActionSheet = function(audioId, audioSrc) {
		$cordovaActionSheet.show(sharingOptions)
		.then(function(btnIndex) {
			var index = btnIndex;
			if (index == 1) {
		        	// Deleting
		        	NotesSrv.deleteAudio(db, sessionId, audioId).then(booleanRes => {
		        		if (booleanRes) {
		        			for (var a = 0 ; a < $scope.audios.length ; a++) {
		        				if ($scope.audios[a].audioId == audioId) {
		        					$scope.audios.splice(a, 1);

		        					break;
		        				} 
		        			}	
		        		}
		        	});
		        } else if (index == 2) {
		        	// Sharing
		        	$cordovaSocialSharing
		        	.share($scope.notes.comment, $scope.session.title, audioSrc, "")
		        	.then(function(result) {
					      // Success!
					  }, function(err) {
					  	console.log(err);
					  });
		        }
		    });
	}


	/*****************************
	*********** VIDEOS ***********
	*****************************/

	/* Record a video */
	$scope.recordVideo = function() {	
		var options = { limit: 3, duration: 15 };

		$cordovaCapture.captureVideo(options).then(function(videoData) {
			NotesSrv.saveVideo(db, sessionId, videoData).then(videoId => {
				if (videoId) {
					$scope.videos.push({
						"sessionId": sessionId,
						"videoId": videoId,
						"video": videoData[0].fullPath
					});

		      		// Adding the new video to the thumbnails
		      		NotesSrv.createThumbnail(videoId, videoData[0].fullPath).then(thumbnail => {
		      			$scope.videosThumbnails.push({
								"videoId": thumbnail.videoId,
								"videoSrc": thumbnail.videoSrc,
								"imageData": thumbnail.imageData
		      			});
		      		});
	      		}
	      	});
		}, function(err) {
			console.log(err);
		});
	}

	/* Show/Hide the videos */
	$scope.updateVideosDisplay = function() {
		if ($scope.videosAccordeon.style == "display: initial;") {
			$scope.videosAccordeon.style = "display: none;";
			$scope.videosAccordeonChevron.class = "glyphicon glyphicon-chevron-down";
		} else {
			$scope.videosAccordeon.style = "display: initial;";
			$scope.videosAccordeonChevron.class = "glyphicon glyphicon-chevron-up";
		}
	}

	/* Change current video displayed */
	$scope.changeCurrentVideo = function(id, src) {
		$scope.currentVideo.id = id;
		$scope.currentVideo.src = src;
		$("#divVideo video")[0].load();
	}

	/* Show the action sheet for the current picture displayed */
	$scope.showVideosActionSheet = function() {
		// Action Popup
		$cordovaActionSheet.show(sharingOptions)
			.then(function(btnIndex) {
				var index = btnIndex;
				if (index == 1) {
		        	// Deleting
	        		var videoId = $scope.currentVideo.id;
		        	NotesSrv.deleteVideo(db, sessionId, videoId).then(booleanRes => {	
		        		if (booleanRes) {
		        			for (var v = 0 ; v < $scope.videos.length ; v++) {
		        				if ($scope.videos[v].videoId == videoId) {
		        					$scope.videos.splice(v, 1);
		        					$scope.videosThumbnails.splice(v, 1);

		        					if ($scope.videos.length > 0) {
		        						$scope.currentVideo.id = $scope.videos[0].videoId;
		        						$scope.currentVideo.src = $scope.videos[0].video;
		        					} else {
		        						$scope.currentVideo.id = "";
		        						$scope.currentVideo.src = "";
		        					}
		        					
		        					break;
		        				} 
		        			}	
		        		}
		        	});
				} else if (index == 2) {
		        	// Sharing
		        	$cordovaSocialSharing
		        		.share($scope.notes.comment, $scope.session.title, $scope.currentVideo.src, "")
		        		.then(function(result) {
						    // Success!
						}, function(err) {
						  	console.log(err);
						});
		        }
	    	});
	}
});