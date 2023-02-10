const URL = "";
const KEY = "";

var supabase = supabase.createClient(URL, KEY);
// No security moment
var player = null;
var rate = 1.0;

async function getMetadata() {
    return await supabase.from("song_metadata").select();
}

async function getSong(path) {
    const { data, error } = await supabase.storage.from("files").download(path);
    if (error) { throw error; }
    const url = URL.createObjectURL(data)
    if (player) { player.unload(); }
    player = new Howl({
        src: [url],
        format: "mp3"  // Hope this is true
    });
    player.rate(rate);
    return player
}

async function playSong(path) {
    player = await getSong(path);
    player.play();
}

function pauseSong() {
    player.pause();
}

function setVolume(vol) {
    Howler.volume(vol);
}

function setRate(rate_) {
    rate = rate_;
    player.rate(rate);
}



