function updateRichPresence(songName, artistName, timeMax, nowTime, isPause) {
    var data = {
        song: songName,
        artist: artistName,
        timeMax: timeMax,
        nowTime: nowTime,
        isPause: isPause
    };

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:3000/",
        "method": "POST",
        "headers": {
            "content-type": "application/json"
        },
        "processData": false,
        "data": JSON.stringify(data)
    }

    $.ajax(settings)
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.tabs.sendMessage(tabId, {
        message: 'send'
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    updateRichPresence(request.song, request.artist, request.timeMax, request.nowTime, request.isPause)
});
