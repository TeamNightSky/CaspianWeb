const SERVER = "http://localhost:8001";  // Set this to Caspian instance

fetch(SERVER + "/db/credentials")
  .then(async (response) => {

let json = await Promise.resolve(response.json());
window["DB_URL"] = "http://" + json["URL"] + ":8000";
window["DB_KEY"] = json["KEY"];

let supa = supabase.createClient(window["DB_URL"], window["DB_KEY"]);
window["CLIENT"] = supa;

window["register"] = async () => {
    const { data, error } = await supa.auth.signInWithOAuth({
        provider: 'discord'
        },{
        redirectTo: 'localhost:8080/loginsuccess.html'
    });
    console.log(data);
}
await window["register"]();

});