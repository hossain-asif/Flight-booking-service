
const redis = require('redis');
const {createClient} = require('redis');

const client = createClient();

async function connection(){
    

    client.on('error', (err)=>{
        console.error("Redis client error", err);
    });

    client.on('ready', ()=>{
        console.log("redis connection established.");
    });
    await client.connect();


}

module.exports = {
    connection,
    client
}