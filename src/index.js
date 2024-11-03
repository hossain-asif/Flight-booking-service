
const express = require('express');
const { ServerConfig, Queue } = require('./config');
const apiRoutes = require('./routes');
const CRON = require('./utils/response/cron-jobs');
const redis = require('./config/radis-config');

// testing for inserting csv file
const fs = require('fs');
const csv = require('csv-parser');
const {Record} = require('./models');
// const { Sequelize } = require('sequelize');

const filePath = './src/public/csv/random_emails_1m.csv';


const {RecordRepository}=require('./repositories');

const recordRepository= new RecordRepository();

const db = require('../src/models/index');

// Manual queue and batch processing variables
const batchQueue = [];
let isProcessing = false;



// Function to insert a batch into the database with Sequelize

// Function to process the batch queue
async function processQueue() {

    
  
    

    if (isProcessing || batchQueue.length === 0) return;
    isProcessing = true;

    if(batchQueue.length == 0){
      await transaction.rollback();
    }
  
    while (batchQueue.length > 0) {
      const transaction = await db.sequelize.transaction();

      const batch = batchQueue.shift();
      
      try {
        
        await Record.bulkCreate(batch, { transaction: transaction});
        console.log("batch inserted.");
        console.log(`Inserted batch of ${batch.length} records`);
        transaction.commit();

      } catch (error) {
        await transaction.rollback();
        console.error('Failed to insert batch:', error);
      }
    }

    isProcessing = false;
  }




// Function to add batch to queue
function addToQueue(batch) {
    batchQueue.push(batch);
    processQueue(); // Start processing if not already
  }
  


// Function to read CSV file and batch data
function processCsvFile() {
    const batchSize = 1000;
    let batch = [];
  
    console.log("batch pushing started.");

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        
        batch.push({
          email: row.email,
          status: "completed"
        });

        if (batch.length === batchSize) {
          addToQueue(batch);
          batch = [];
        }
      })
      .on('end', () => {
        if (batch.length > 0) addToQueue(batch); // Add remaining records
        console.log('CSV file processing complete');
      });


  }





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

    //csv file processing
    processCsvFile();
    console.log("csv file process ended.")

});





