/*jshint strict : false */
/*global Meteor : false */
/*global Npm : false */
/*global HTTP : false */
/*global process : false */
/*global JOKES : false */
/*global Readers : false */

Meteor.methods({
    getaJoke : function(){
      var fs = Npm.require("fs");
      var Future = Npm.require("fibers/future");
      var myFuture = new Future();


      /*
        INTERMEDE : 
heuu 
mheu
à oui! j'en ai une
attend... comment elle marche déjà
ha oui celle là. elle est marrante
trop marrant hin
celle la je viens de la voir sur la toile
moi j'ai pas compris et toi
c'est de l'humour au 2.0 degré
j'ai un blague 3.0

toi t'en a une ?
moi j'ai pas compris. et toi?
celle la est plus marrante avec un carolo
hé ! tu m'as piquer ma blague
celle là, elle est pas mal
haaa
oui
holala
et oui 
qui ne tente rien...

je la connaissait mais avec *
elle avait fait rigoler *
* =   ta grand mère
      un rabbin



READER 8 : Juliette
READER 22 : Bruno
      */
      var readers = Readers.find().fetch();
      var getAJokeUrl = "http://noussommesquatrevingt.com/ESSAYER/?justAJoke=1";
      var SpeechRequestTokenUrl = "http://api.naturalreaders.com/v2/auth/requesttoken?appid=pelc790w2bx&appsecret=2ma3jkhafcyscswg8wgk00w0kwsog4s&_="+(new Date()).getTime();
      var textToSpeechUrl = "http://api.naturalreaders.com/v2/tts/?t=[SENTECE]&r=[READER]&s=0&requesttoken=[TOKEN]";

      HTTP.get(getAJokeUrl, {
        followRedirects : true
      }, function (error, result) {
        if(error) myFuture.throw(error);
        if(result.statusCode != 200) myFuture.throw(new Meteor.Error("statusCode-"+result.statusCode));
          var joke = result.content.replace(/\"/g, "");
          HTTP.get(SpeechRequestTokenUrl, {
            followRedirects : true
          }, function (error, result) {
            if(error) myFuture.throw(error);
            if(result.statusCode != 200) myFuture.throw(new Meteor.Error("statusCode-"+result.statusCode));
            var token = JSON.parse(result.content);
            if(!token) myFuture.throw(new Meteor.Error("TOKEN ERROR"));
            token = token.requesttoken;
            textToSpeechUrl = textToSpeechUrl.replace("[SENTECE]", joke).replace("[TOKEN]", token);
           
            var currentReader = readers[1];//Math.floor(Math.random()*readers.length)
            HTTP.get(textToSpeechUrl.replace("[READER]", currentReader.id), {
              followRedirects : true,
              responseType : "buffer",
            }, function (error, result) {
              if(error) myFuture.throw(error);
              if(result.statusCode != 200) myFuture.throw(new Meteor.Error("statusCode-"+result.statusCode));
              if(result.data) myFuture.throw(new Meteor.Error(result.data));

                var filename = +(new Date()).getTime();
                fs.writeFileSync(process.env.PWD+"/.uploads/"+filename+".mp3", result.content, {encoding : "binary"});
                JOKES.insert({
                  url : "/upload/"+filename,
                  reader : currentReader.name,
                  createdAt : (new Date()).getTime(),
                  joke : joke
                });
                myFuture.return({
                  url : "/upload/"+filename
                });
            });
          });
      });
      return myFuture.wait();
    }
  });