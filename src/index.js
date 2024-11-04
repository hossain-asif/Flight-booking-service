
const express = require('express');
const { ServerConfig, Queue } = require('./config');
const apiRoutes = require('./routes');
const CRON = require('./utils/response/cron-jobs');
const redis = require('./config/radis-config');

// testing for inserting csv file

const {Record} = require('./models');
const { BulkInsertService } = require('./services');
const { BulkInsertController } = require('./controllers');





const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);
app.use('/bookingService/api', apiRoutes);



app.listen(ServerConfig.PORT,async ()=>{
    console.log(`Successfully started the server on PORT: ${ServerConfig.PORT}`);

    CRON();

    // message queue connection
    Queue.connectQueue();
    // redis connection
    redis.connection();

});






