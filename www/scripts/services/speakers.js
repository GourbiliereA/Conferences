'use strict';

app.service('SpeakersSrv', function($cordovaContacts, $q, DataSrv){
	this.getAll = function() {
		return DataSrv.getFileData().then(resp => resp.speakers);
	};

	this.getSpeaker = function(speakerId) {
		return this.getAll().then(speakers => {
				// Looking for the right speaker in all speakers
				for (var s in speakers ) {
					if (speakers[s].id == speakerId) {
						return speakers[s];
					}
				}

				return {};
		});
	}

	this.getConfSpeakers = function(speakersIds) {
		return this.getAll().then(speakers => {
				var confSpeakers = [];
				// Looking for the right speakers in all speakers
				for (var s in speakers ) {
					for (var id in speakersIds) {
						if (speakers[s].id == speakersIds[id]) {
							confSpeakers.push(speakers[s]);
						}
					}
				}

				return confSpeakers;
		});
	}

	this.findContactByNickname = function(searchTerm) {
	    var opts = {
	      filter : searchTerm,
	      multiple: false,
	      fields:  ['nickname']
	    };
		var deferred = $q.defer();

	    $cordovaContacts.find(opts).then(function (contactFound) {
			deferred.resolve(contactFound[0]);
	    });

	    return deferred.promise;
	}

	this.addContact = function(contact) {
	    $cordovaContacts.save(contact).then(function(result) {
	      // Contact saved
	    }, function(err) {
	      // Contact error
	    });
	}

	this.deleteContact = function(contact) {
	    $cordovaContacts.remove(contact).then(function(result) {
	      // Contact deleted
	    }, function(err) {
	      // Contact error
	    });
	}

	this.addIconLink = function(speaker) {
		var socialsWithIcon = speaker.socials;

		for (var s in speaker.socials) {
			if (speaker.socials[s].class == 'google-plus') {
				socialsWithIcon[s].icon = "img/google_plus.png";

			} else if (speaker.socials[s].class == 'twitter') {
				socialsWithIcon[s].icon = "img/twitter.png";

			} else if (speaker.socials[s].class == 'github') {
				socialsWithIcon[s].icon = "img/github.png";

			} else if (speaker.socials[s].class == 'link') {
				socialsWithIcon[s].icon = "img/website.png";

			} else if (speaker.socials[s].class == 'linkedin') {
				socialsWithIcon[s].icon = "img/linkedin.png";
				
			} else if (speaker.socials[s].class == 'facebook') {
				socialsWithIcon[s].icon = "img/facebook.ico";
			}
		}

		speaker.socials = socialsWithIcon;

		return speaker;
	}
});