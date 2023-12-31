import Joi from "joi";

const seasonValidation = {

    add: {
        body: Joi.object().keys({
            series_id: Joi.string().required(),
            name: Joi.string().required().min(2).max(50),
            description: Joi.string().required().max(1000)
        })
    },

    id: {
        param: Joi.object().keys({
            id: Joi.string().required()
        })
    },

    update: {
        param: Joi.object().keys({
            id: Joi.string().required()
        }),

        body: Joi.object().keys({
            series_id: Joi.string(),
            name: Joi.string().min(2).max(50),
            description: Joi.string().max(1000)
        })
    }
}

export default seasonValidation