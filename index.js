const client = require('discord-rich-presence')('864326540736331778');
const express = require('express');
var song = 'Waiting for music...';
var artist = 'No Artist';
const app = express();
var tempTime = '0:00';
var songPause = true;

console.log('Starting YouTubeMusicDiscordRichPresence...')
update(song,artist);

app.use(express.json());
app.post("/", (request, response) => {
  let content = request.body;

  if (content.isPause === songPause && content.song === song) {
    response.sendStatus(202);
    return;
  }

  tempTime = content.timeMax.replace(' ', '');
  song = content.song
  artist = content.artist.replace(/\n/gm, "");

  if (content.isPause) {
    songPause = true;
    console.log(`Pauseing now ${content.song}, by ${artist}, Time: ${content.nowTime}/${timeToMilli(content.timeMax.replace(' ', '')) - Date.now()}`);
    update(content.song, artist, Date.now());
    response.sendStatus(200);
    return;
  }
  songPause = false;

  console.log(`Playing now ${content.song}, by ${artist}, Time: ${content.nowTime}/${timeToMilli(content.timeMax.replace(' ', '')) - Date.now()}`);
  update(content.song, artist,Date.now(), timeToMilli(content.timeMax.replace(' ', '')) - content.nowTime);
  response.sendStatus(200);
});

app.listen(3000, () => console.log('Ready Senpai!'));

function update(song, artist, timeNow, timeMax) {
  if (!timeMax) {
    client.updatePresence({
      state: artist,
      details: song,
      largeImageKey: 'ytmusic',
      largeImageText: "Music Paused",
      smallImageKey: 'pause',
      instance: true,
    });
    return;
  }
  client.updatePresence({
    state: artist,
    details: song,
    startTimestamp: timeNow,
    endTimestamp: timeMax,
    largeImageKey: "ytmusic",
    largeImageText: "Music Playing",
    smallImageKey: "play",
    instance: true,
  });
}

function timeToMilli(time) {
  var temp = Date.now();
  if(time.split(':').length == 2) {
    temp += Math.round(parseFloat(time.split(':')[0]) * 60000);
    temp += Math.round(parseFloat(time.split(':')[1]) * 1000);
  } else if (time.split(':').length == 3) {
    temp += Math.round(parseFloat(time.split(':')[0]) * 3600000);
    temp += Math.round(parseFloat(time.split(':')[1]) * 60000);
    temp += Math.round(parseFloat(time.split(':')[2]) * 1000);
  }
  return temp;
}
