const SERVER = "http://localhost:8001";  // Set this to Caspian instance

var current_artist = document.getElementById("artist_name");
var current_song = document.getElementById("song_name");

fetch(SERVER + "/api/db/credentials")
  .then(async (response) => {

let json = await Promise.resolve(response.json());
window["DB_URL"] = json["URL"];
window["DB_KEY"] = json["KEY"];

let supa = supabase.createClient(window["DB_URL"], window["DB_KEY"]);
// No security moment
var player = null;
window["player"] = player;
var rate = 1.0;

async function getMetadata() {
    return await supa.from("song_metadata").select();
}

async function getSong(path) {
    const { data, error } = await supa.storage.from("files").download(path);
    if (error) { throw error; }
    const url = URL.createObjectURL(data)  // Less than ideal
    if (player) { player.unload(); }
    player = new Howl({
        src: [url],
        format: "mp3"  // Hope this is true
    });
    player.rate(rate);
    window["player"] = player;
    return player
};

function resumeSong() {
    player.play();
};

function pauseSong() {
    player.pause();
};

async function setActiveSong(meta) {
    player = await getSong(meta['audio_path']);
    current_artist.innerHTML = meta['artist'];
    current_song.innerHTML = meta['title'];
    return player
}

async function playSong(meta) {
    setActiveSong(meta);
    resumeSong();
};

function setVolume(vol) {
    Howler.volume(vol);
};

function setRate(rate_) {
    rate = rate_;
    player.rate(rate);
};

window['resume'] = resumeSong;
window['pause'] = pauseSong;
window['play'] = playSong;
window['setvol'] = setVolume;

let metadata = await getMetadata();

console.log(metadata);

setActiveSong(
    metadata['body'][0]
);

});


