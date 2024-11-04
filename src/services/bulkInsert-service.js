const fs = require('fs');
const csv = require('csv-parser');
const { RecordRepository } = require('../repositories');
const db = require('../models/index');
const { AppError } = require('../utils/errors');
const { StatusCodes } = require('http-status-codes');

const filePath = './src/public/csv/random_emails.csv';

let recordRepository = new RecordRepository();



const batchQueue = [];
let isProcessing = false;

async function processQueue() {

    // const transaction = await db.sequelize.transaction();

    if (isProcessing || batchQueue.length === 0) return;
    isProcessing = true;

    if(batchQueue.length == 0){
      await transaction.rollback();
    }
  
    while (batchQueue.length > 0) {
      const transaction = await db.sequelize.transaction();

      const batch = batchQueue.shift();
      
      try {
        
        recordRepository.createRecord(batch);
        console.log("batch inserted.");
        console.log(`Inserted batch of ${batch.length} records`);
        await transaction.commit();
        

      } catch (error) {
        await transaction.rollback();
        console.error('Failed to insert batch:', error);
      }
      
    }


    isProcessing = false;
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
            batchQueue.push(batch);
            processQueue(); 
            batch = [];
        }
      })
      .on('end', () => {
        if (batch.length > 0){
            batchQueue.push(batch);
            processQueue(); 
            batch = [];
        }
        console.log('CSV file processing complete');
      });
  }






  module.exports = {
    processCsvFile
  }