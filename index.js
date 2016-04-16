/* jshint node: true */
'use strict';
module.change_code = 1

var Alexa = require('alexa-app');
var moment = require('moment-timezone');
var TVRobot = require('./tvrobot');

var app = new Alexa.app('tvrobot');
var tvr = new TVRobot();

var shows = require('./sample-shows');

app.launch(function(req, res) {
    var prompt = 'Sup everybody. I\'m a friendly TvRobot. Beep and whatnot. You can ask me when the next episode of any show is on. For examples, say help. To exit, say that thing.';
    res.say(prompt);
    res.shouldEndSession(false, 'What show are you looking for?');
});

app.dictionary = {
    "show_names": shows.titles
};

app.intent('HelpIntent', {
   'slots': {},
    'utterances': [
        "help"
    ]},
    function(req, res) {
        res.say("You can say something like, when's the next game of thrones, or, when is rick and morty on");
        res.shouldEndSession(false);
    }
);

app.intent('NextEpisodeIntent', {
   'slots': {
        'SHOWNAME': 'LITERAL'
    },
    'utterances': [
        "{when is|when's} {the next|} {show_names|SHOWNAME} {on|}"
    ]},
    function(req, res) {
        handleNextEpisodeResponse(res, req.slot('SHOWNAME'));
        return false;
    }
);

function handleNextEpisodeResponse(response, showName){
    var result = tvr.getNextEpisode(showName).then(function(result){
        if(result.success){
            var sayText = result.data.episodeName + ' airs ' + moment(result.data.episodeAirtimestamp).tz('America/New_York').format('dddd, MMMM Do, [at] h:mm a [eastern time]');
            var cardTitle = result.data.showName;
            var cardText = 'Next Episode: ' + result.data.episodeName + ' \n airs on: ' + moment(result.dataepisodeAirtimestamp).tz('America/New_York').format('dddd, MMMM Do YYYY, h:mm a z');

            response.say(sayText);
            response.card(cardTitle, cardText);
            if (response.session('open_session') === 'true'){
                response.shouldEndSession(false);
            }
            response.send();
        }else{
            response.say(result.data.message);
            if (response.session('open_session') === 'true'){
                response.shouldEndSession(false);
            }
            response.send();
        }
    });
}

module.exports = app;