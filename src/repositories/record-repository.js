

const CrudRepository = require('./crud-repository');

const { Record } = require('../models');
const { AppError } = require('../utils/errors');
const { StatusCodes } = require('http-status-codes');

class RecordRepository extends CrudRepository{
    constructor(){
        super(Record);
    }

    async createRecord(data){
        let response = await Record.bulkCreate(data);
        return response;
    }


}


module.exports = RecordRepository;