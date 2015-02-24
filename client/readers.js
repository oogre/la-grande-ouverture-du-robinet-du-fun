/*jshint strict : false */
/*global Template : false */
/*global Readers : false */
/*global JOKES : false */
/*global Session : false */


Template.readers.helpers({
	readers : function(){
		return Readers.find();
	}
});

Template.reader.helpers({
	randomJoke : function(){
		var jokes = JOKES.find({
						reader : this.name,
						error : {$ne : true}
					}).fetch();
		var t = jokes[Math.floor(Math.random()*jokes.length)];
		Session.set("search_query", t);
		return t;
	}
});