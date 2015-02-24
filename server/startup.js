/*jshint strict : false */
/*global Meteor : false */
/*global JOKES : false */
/*global Readers : false */

var resetReaders = function(){
	Readers.remove({});
	Readers.insert({
		name : "juliette",
		id : 8,
		reading : false
	});
	Readers.insert({
		name : "bruno",
		id : 22,
		reading : false
	});
}

Meteor.startup(function () {

});