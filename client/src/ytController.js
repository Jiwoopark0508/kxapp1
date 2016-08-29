function ytController(video_id){                    // It takes video_id param and give it to onYoutubeIframeApiReady
    let tag = document.createElement('script');     // 
    tag.src = "https://www.youtube.com/iframe_api"; // Call youtube iframe api

    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); // insert script tag in head
    let player;
    function onYouTubeIframeAPIReady() {
        console.log(video_id);
        player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: video_id ,        // insert video_id
            events: {
                'onReady' : onPlayerReady,
                'onStateChange' : onPlayerStateChange
            }
        });
    };

    function onPlayerReady(event){                     // Play video when player ready
        event.target.playVideo();
    };
    
    let done = false;
    function onPlayerStateChange(event){
        if (event.data == YT.PlayerState.PLAYING && !done ){
            setTimeout(stopVideo, 6000);
            done = true;
        }
    };
    function stopVideo(){
        player.stopVideo();
    }
}
module.exports = ytController;
