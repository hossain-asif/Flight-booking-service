
const { logger } = require('../config');
const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../utils/errors')
 

class CrudRepository{
    constructor(model){
        this.model = model;
    }

    async create(data){
        let response = await this.model.create(data);
        return response;
    }

    async destroy(data){
        let response = await this.model.destroy({
            where: {
                id: data
            }
        });
        if(response == null){
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async get(data){
        let response = await this.model.findByPk(data);
        if(response == null){
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async getAll(){
        let response = await this.model.findAll();
        return response;
    }

    async update(id, data){
        let response = await this.model.update(data, {
            where: {
                id: id
            }
        });

        if(response == null){
            throw new AppError('Not able to find the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }
}

module.exports = CrudRepository;