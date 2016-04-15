/* jshint node: true */
'use strict';
module.change_code = 1

var Alexa = require('alexa-app');
var moment = require('moment');
var TVRobot = require('./tvrobot');

var app = new Alexa.app('tvrobot');
var tvr = new TVRobot();

var shows = require('sample-shows');

app.launch(function(req, res) {
    var prompt = 'lol?';
    res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.dictionary = {
    "show_names": shows.titles
};

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
            var sayText = result.data.episodeName + ' airs ' + moment(result.data.episodeAirtimestamp).format('dddd, MMMM Do, [at] h:mm a');
            var cardTitle = result.data.showName;
            var cardText = 'Next Episode: ' + result.data.episodeName + ' \n airs on: ' + moment(result.dataepisodeAirtimestamp).format('dddd, MMMM Do YYYY, h:mm a');

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