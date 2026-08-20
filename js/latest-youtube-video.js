(function () {
    // Restricted to euniceinsideglow.com in Google Cloud Console — safe to keep here.
    var YOUTUBE_API_KEY = 'AIzaSyAZ968IrrSvC6tjfkTJHhAhoS2WoJdb5l0';
    var UPLOADS_PLAYLIST_ID = 'UUCexm_vPVUW6ScX812j5qGw'; // @euniceinsideglow uploads playlist

    var iframe = document.getElementById('latest-podcast-iframe');
    if (!iframe) return;

    var url = 'https://www.googleapis.com/youtube/v3/playlistItems'
        + '?part=snippet&maxResults=1&playlistId=' + UPLOADS_PLAYLIST_ID
        + '&key=' + YOUTUBE_API_KEY;

    fetch(url)
        .then(function (res) { return res.json(); })
        .then(function (data) {
            var item = data.items && data.items[0];
            var videoId = item && item.snippet.resourceId.videoId;
            if (videoId) {
                iframe.src = 'https://www.youtube.com/embed/' + videoId;
            }
        })
        .catch(function () {
            // Network error, quota exceeded, etc. — leave the fallback video already in the iframe.
        });
})();
