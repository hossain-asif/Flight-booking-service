
const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services");
const {SuccessResponse, ErrorResponse} = require('../utils/response');

const {Redis} = require('../config');

const inMemDb = {};

async function createBooking(req, res){
    try{
        let booking = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats
        });
        SuccessResponse.message = 'SuccessFully create booking';
        SuccessResponse.data = booking;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    }catch(error){

        ErrorResponse.error = error;
        ErrorResponse.message = 'Something went wrong while creating booking';
        return res
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}


async function makePayment(req, res){
    
    // console.log(req.headers);
    try{
        const idempotencyKey = req.headers['x-idempotency-key'];
        if(!idempotencyKey ) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: 'idempotency key missing'});
        }

        const inMemoryData = await Redis.client.get(idempotencyKey);
        // console.log(inMemoryData);

        const sameUserAndCost = await Redis.client.get(`${req.body.userId} ${req.body.totalCost}`);

        if(sameUserAndCost){
            return(StatusCodes.BAD_REQUEST)
            .json('Can not payment same amount of money for 100 seconds');
        }
    
        if(inMemoryData) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({message: 'Cannot retry on a successful payment'});
        } 
    
        const response = await BookingService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId
        });

        

        await Redis.client.set(`${req.body.userId} ${req.body.totalCost}`, req.body.totalCost);
        await Redis.client.expire(`${req.body.userId} ${req.body.totalCost}`, 100);
        await Redis.client.ttl(`${req.body.userId} ${req.body.totalCost}`);

    
        // inMemDb[idempotencyKey] = idempotencyKey;
        await Redis.client.set(idempotencyKey, req.body.userId);
        await Redis.client.expire(idempotencyKey, 2*24*60*60);
        await Redis.client.ttl(idempotencyKey);

        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
                
    }
    catch(error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}



module.exports = {
    createBooking,
    makePayment
}