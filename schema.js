// Validation of our articles

var Joi = require('joi');

const schemas = {

    articles: {
        article: {
            id: Joi.string().guid(),
            title: Joi.string().max(100).required(),
            body: Joi.string().required(),
            dateCreated: Joi.date().allow(null),
            dateModified: Joi.date().allow(null)
        }
    }
}

module.exports = schemas;
