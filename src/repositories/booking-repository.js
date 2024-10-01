

const CrudRepository = require('./crud-repository');

const { Booking } = require('../models');
const { AppError } = require('../utils/errors');
const { StatusCodes } = require('http-status-codes');
const {Enums} = require('../utils/response');
const { Op } = require('sequelize');
const {BOOKED, CANCELLED} = Enums.BOOKING_STATUS;

class bookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }

    async createBooking(data, transaction){
        let response = await Booking.create(data, {transaction: transaction});
        return response;
    }

    async get(data, transaction){
        let response = await Booking.findByPk(data, {transaction: transaction});
        if(response == null){
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async update(id, data, transaction){
        let response = await Booking.update(data,{
            where: {
                id: id
            }
        },
        {transaction: transaction});
        return response;
    }

    async cancelOldBookings(timestamp){
        let response = await Booking.update({
            status : CANCELLED
        },
        {
            where:{
                [Op.and]: [
                    {
                        createdAt:{
                            [Op.lt]: timestamp
                        }
                    },
                    {
                        status: {
                            [Op.ne]: BOOKED
                        }
                    },
                    {
                        status: {
                            [Op.ne]: CANCELLED
                        }
                    }
                ]
            }
        });
        return response;
    }

}


module.exports = bookingRepository;