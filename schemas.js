const Joi = require('joi')

module.exports.listSchema  = Joi.object({
    listName: Joi.string().required()
})