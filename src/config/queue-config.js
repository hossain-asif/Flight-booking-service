
const amqplib = require('amqplib');

let channel, connection;

async function connectQueue(){
    try {
        connection = await amqplib.connect("amqp://localhost");
        channel = await connection.createChannel();
        await channel.assertQueue("noti-queue");

    } catch (error) {
        console.log(error);
        throw error;

    }
}


async function sendData(data){
    try {
        channel.sendToQueue(
            "noti-queue", 
            Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.log(error);
        throw error;
    }
}



module.exports = {
    connectQueue,
    sendData
}




