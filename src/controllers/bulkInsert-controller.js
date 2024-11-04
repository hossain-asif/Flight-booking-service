const { StatusCodes } = require("http-status-codes");
const { BulkInsertService } = require("../services");
const {SuccessResponse, ErrorResponse} = require('../utils/response');



function BulkInsert(req, res){
    try{

        BulkInsertService.processCsvFile();
        SuccessResponse.message = 'SuccessFully inserted records.';
        // SuccessResponse.data = response;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);

    }catch(error){

        console.log(error);
    }
}


module.exports = {
    BulkInsert
}