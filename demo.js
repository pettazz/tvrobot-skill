var TVMaze = require('tvmaze');
var tvm = new TVMaze();
 
// Search for a show 
var searchName = '79tf8tucg80gyivg98yvg9y';
tvm.findShow(searchName).then( function (shows) {
    console.log(shows);
    if(shows && shows.length > 0){
        var show = shows[0].show;
        if(show && show._links && show._links.nextepisode){
            var epid = show._links.nextepisode.href.split('/').pop();
            tvm.getEpisodeById(epid).then( function (episode) {
              console.log(episode.name + ' airs ' + episode.airstamp);
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
    }else{
        console.log('Couldn\'t find a show named ' + searchName);
    }
});