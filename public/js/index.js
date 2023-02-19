const SERVER = "https://foxnerdsaysmoo-ubiquitous-sniffle-55gjrpwxpvqc45g9-8001.preview.app.github.dev";  // Set this to Caspian instance

fetch(SERVER + "/getkey")
  .then(async (response) => {

let json = await Promise.resolve(response.json());
window["DB_URL"] = json["URL"];
window["DB_KEY"] = json["KEY"];

let supa = supabase.createClient(window["DB_URL"], window["DB_KEY"]);
// No security moment
var player = null;
var rate = 1.0;

async function getMetadata() {
    return await supa.from("song_metadata").select();
}
console.log(getMetadata());

async function getSong(path) {
    const { data, error } = await supa.storage.from("files").download(path);
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
});


