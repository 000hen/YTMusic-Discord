window.addEventListener('load', e => {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        sendResponse({
            response: "Message Received! (content)"
        });
        if(document.getElementsByClassName("byline style-scope ytmusic-player-bar complex-string")[0] != undefined) {
            sendMessage();
        }
    });
    var pause = false;

    var observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type == "attributes") {
                var i = document.querySelector("[d='M6 19h4V5H6v14zm8-14v14h4V5h-4z']").ownerSVGElement.parentElement.parentElement;
                var playEle = document.getElementById("play-pause-button");
                pause = i !== playEle;
                sendMessage();
            }
        });
    });

    observer.observe(document.getElementById("play-pause-button"), {
        attributes: true,
    });

    function sendMessage() {
        try {
            var songName = document.getElementsByClassName("title style-scope ytmusic-player-bar")[0].innerText;
            var artistName = document.getElementsByClassName("byline style-scope ytmusic-player-bar complex-string")[0].innerText;
            var time = document.getElementsByClassName("time-info style-scope ytmusic-player-bar")[0].innerText.toString().split('/')[1];
            var nowTime = Number(document.getElementById("progress-bar").getAttribute("value")) * 1000;
            chrome.runtime.sendMessage({
                song: songName,
                artist: artistName,
                timeMax: time,
                nowTime: nowTime,
                isPause: pause
            });
        } catch (e) {
            console.log("[TYMusic Discord] Waiting for song.")
        }
    }
})
