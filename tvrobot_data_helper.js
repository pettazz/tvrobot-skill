'use strict';
var TVMaze = require('tvmaze');

function TVRobotDataHelper() { }

TVRobotDataHelper.prototype.getShowBestMatch = function(searchName){
    var tvm = new TVMaze();

    return tvm.findShow(searchName).then(function(shows){
        console.log(shows);
        if(shows && shows.length > 0){
            return shows[0].show;
        }else{
            console.log('Couldn\'t find a show named ' + searchName);
        }
    });
});

TVRobotDataHelper.prototype.getNextEpisode = function(searchName){
    var tvm = new TVMaze();
    var show = this.getShowBestMatch(searchName);

    if(show && show._links && show._links.nextepisode){
        var epid = show._links.nextepisode.href.split('/').pop();
        tvm.getEpisodeById(epid).then(function(episode){
            return episode;
        });
    }else{
        if(!show){
            console.log('Couldn\'t find a show named ' + searchName);
        }else if(show.status === 'Ended'){
            console.log('Looks like ' + searchName + ' has ended. Bummer.');
        }else{
            console.log('We don\'t yet know when the next episode of ' + searchName + ' is on. Check back later.');
        }
    }
});

module.exports = TVRobotDataHelper;

// console.log(episode.name + ' airs ' + episode.airstamp);