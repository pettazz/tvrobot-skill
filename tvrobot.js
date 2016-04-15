/* jshint node: true */
'use strict';
module.change_code = 1

var TVMaze = require('tvmaze');

function TVRobot(){
    console.log("Sup everybody. I'm a friendly TvRobot. Beep and whatnot.");
    this._tvm = new TVMaze();
}

TVRobot.prototype.getShowBestMatch = function(searchName){
    return this._tvm.findShow(searchName).then(function(shows){
        if(shows && shows.length > 0){
            return shows[0].show;
        }else{
            return false;
        }
    });
};

TVRobot.prototype.constructResult = function(success, data){
    return {
        success: success,
        data: data
    };
};

TVRobot.prototype.getNextEpisode = function(searchName){
    console.log('looking for next episode of ' + searchName);
    var that = this;
    return this.getShowBestMatch(searchName).then(function(show){
        
        if(show && show._links && show._links.nextepisode){
            var showName = show.name;
            var epid = show._links.nextepisode.href.split('/').pop();
            var that2 = that;

            console.log('using best match: ' + showName);
            return  that2._tvm.getEpisodeById(epid).then(function(episode){
                console.log('good job: ' + episode.name + ' @ ' + episode.airstamp);
                return that2.constructResult(true, {
                    showName: showName, 
                    episodeName: episode.name, 
                    airTimestamp: episode.airstamp
                });
            });
        }else{
            var message;
            if(!show){
                message = "I couldn't find a show named " + searchName;
            }else if(show.status === 'Ended'){
                message = "Looks like " + searchName + " has ended. Bummer.";
            }else{
                message = "We don't know when the next episode of " + searchName + " is yet. Check back later.";
            }
            console.log('bad job: ' + message);
            return that.constructResult(false, {message: message});
        }
    });
};

module.exports = TVRobot;