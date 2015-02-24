/*jshint strict : false */
/*global Meteor : false */
/*global Template : false */
/*global Meteor : false */
/*global Session : false */
/*global JOKES : false */
/*global Readers : false */
/*global buzz : false */
/*global Tracker : false */
/*global _ : false */


Meteor.JOKES_GRABBER				= "jokesGrabber";
Session.setDefault(Meteor.JOKES_GRABBER, false);

Meteor.CURRENT_JOKE				= "newJoke";
Session.setDefault(Meteor.CURRENT_JOKE, {});

Template.downloader.helpers({
	btnTxt : function(){
		return Session.get(Meteor.JOKES_GRABBER) ? "STOP" : "START";
	},
	count : function(){
		var jokes = JOKES.find().fetch();
		jokes = _.groupBy(jokes, function(joke){ return joke.reader;});
		var result = "";
		_.keys(jokes).map(function(reader){
			result+= (reader + " : " +jokes[reader].length + " ");
		});
		return result;
	},
	lastJoke : function(){
		var jokes = JOKES.find({}, {
									sort : {
										createdAt : 1 
									},
								}).fetch();
		return jokes.slice(-1).pop();
	}
});

/* CLEAN BUGY FILES /*
	$("audio")
	.toArray()
	.map(function(a){
		if(0 == $(a).height()){
			JOKES.remove($(a).attr("id"))
		}
	})
*/
var player = {};



Template.file.rendered = function(){
	Tracker.autorun(function () {
		var self = Session.get("search_query");
		if( self && self.reader && Readers.findOne({name : self.reader}) && Readers.findOne({name : self.reader}).reading){
			if(player[self.reader]){
				player[self.reader].stop();
			}
			player[self.reader] = new buzz.sound(self.url);
			player[self.reader].bind("ended", function(){
				JOKES.update(self._id, {
					$set : {
						readAt : (new Date()).getTime()
					}
				});
			});

			player[self.reader].bind("error", function(){
				JOKES.update(self._id, {
					$set : {
						error : true
					}
				});
			});
			if(self.reader == "bruno"){
				player[self.reader].setVolume(40);
			}
			player[self.reader].play();
		}else if( self && self.reader && Readers.findOne({name : self.reader}) && !Readers.findOne({name : self.reader}).reading){
			if(player[self.reader]){
				player[self.reader].stop();
			}
		}
	});
};



Template.file.events({
	"click .play" : function(){
		var reader = Readers.findOne({
			name : this.reader
		});
		Readers.update(reader._id, {
			$set : {
				reading : true
			}
		});
	},
	"click .stop": function() {
		var reader = Readers.findOne({
			name : this.reader
		});
		Readers.update(reader._id, {
			$set : {
				reading : false
			}
		});
	},
});

Template.downloader.events({
	"click button.grabber": function () {
		// increment the counter when button is clicked

		Session.set(Meteor.JOKES_GRABBER, !Session.get(Meteor.JOKES_GRABBER));

		var getJokes = function(){
			Meteor.call("getaJoke", function(err, joke){
				if(err)return;
				if(Session.get(Meteor.JOKES_GRABBER)){
					getJokes();
				}
			});
		};
		if(Session.get(Meteor.JOKES_GRABBER)){
				getJokes();
		}
		return false;
	}
});