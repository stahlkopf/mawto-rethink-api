// Validation of our articles

var Joi = require('joi');

const schemas = {

    articles: {

        id:           Joi.string().guid(),
        title:        Joi.string().max(100).required(),
        body:         Joi.string().required(),
        dateCreated:  Joi.date().timestamp(),
        dateModified: Joi.date().timestamp()

    }
}

module.exports = schemas;
