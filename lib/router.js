/*global Meteor : false */
/*jshint strict : false */
/*global Router : false */
/*global console : false */
/*global BaseController : true */
/*global RouteController : true */
/*global Npm : false */
/*global process : false */

BaseController = RouteController.extend({
  layoutTemplate: "layout",
  before: function () {
    this.next();
  },
  action: function () {
    console.log("this should be overridden!");
  }
});

Router.configure({
});

var fail = function(response) {
    response.statusCode = 404;
    response.end();
};

var dataFile = function() {
  if(Meteor.isServer){
    var fs = Npm.require("fs");
    // The hard-coded attachment filename
    var attachmentFilename = this.params.name+".mp3";
    var file = process.env.PWD+"/.uploads/"+attachmentFilename;

    // Attempt to read the file size
    var stat = null;
    try {
      stat = fs.statSync(file);
    } catch (_error) {
      return fail(this.response);
    }

    // Set the headers
    this.response.writeHead(200, {
      "Content-Type": "audio/mpeg",
      // TO DOWNLOAD //"Content-Disposition": "attachment; filename=" + attachmentFilename,
      "Content-Length": stat.size
    });

    // Pipe the file contents to the response
    fs.createReadStream(file).pipe(this.response);
  }
};

Router.route("/upload/:name", dataFile, {where: "server"});

Router.route("/", {
  controller : "BaseController",
  name: "home",
  action : function () {
     this.render("downloader");
  }
});