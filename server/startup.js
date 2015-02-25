/*jshint strict : false */
/*global Meteor : false */
/*global Readers : false */
/*global Cylon : false */
/*global console : false */
/*global Npm : false */

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
};


var buttonTimeout = {
	warm : undefined,
	cold : undefined
};
var initCylon = Meteor.bindEnvironment(function(){
	
	Cylon.robot({
		name: "Number Six",
		description: "Description is optional...",

		connections: {
			arduino: { 
				adaptor: "firmata", 
				port: "/dev/tty.usbmodem1411" 
			}
		},

		devices: {
			warm: { 
				driver: "button", 
				pin: 8
			},
			cold: { 
				driver: "button", 
				pin: 9
			}
		},
		work: function (my) {
			var Fiber = Npm.require("fibers");
			my.warm.on("push", function(){
				Fiber(function() { 
					Meteor.clearTimeout(buttonTimeout.warm);
					buttonTimeout.warm = Meteor.setTimeout(function() {
						console.log("bruno ON");
						Readers.update({
							name : "bruno"
						},
						{
							$set : {
								reading : true
							}
						});
					}, 50);
				}).run();
			});
			my.warm.on("release", function(){
				Fiber(function() { 
					Meteor.clearTimeout(buttonTimeout.warm);
					buttonTimeout.warm = Meteor.setTimeout(function() {
						console.log("bruno OFF");
						Readers.update({
							name : "bruno"
						},
						{
							$set : {
								reading : false
							}
						});
					}, 50);
				}).run();
			});
			my.cold.on("push", function(){
				Fiber(function() { 
					Meteor.clearTimeout(buttonTimeout.cold);
					buttonTimeout.cold = Meteor.setTimeout(function() {
						console.log("juliette ON");
						Readers.update({
							name : "juliette"
						},
						{
							$set : {
								reading : true
							}
						});
					}, 50);
				}).run();
			});
			my.cold.on("release", function(){
				Fiber(function() { 
					Meteor.clearTimeout(buttonTimeout.cold);
					buttonTimeout.cold = Meteor.setTimeout(function() {
						console.log("juliette OFF");
						Readers.update({
							name : "juliette"
						},
						{
							$set : {
								reading : false
							}
						});
					}, 50);
				}).run();
			});
		}
	}).start();
});

Meteor.startup(function () {
	initCylon();
});