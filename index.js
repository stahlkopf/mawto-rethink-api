
// Require some packages we'll need
const Hapi = require('hapi');  // Rest API
const Joi = require('joi');    // Data validation
const Boom = require('boom');  // Error reporting

// Load our config file.
// Make sure you have created this file based on the contents
// of config.json.example.
var config = require('./config.json');

// Print some debug statements so we can see which database
// we're connecting to when testing.
console.log('rethinkdb connecting with: ');
console.log(config.rethinkdb);

// Load rethinkdb package and connect to our database
const r = require('rethinkdbdash')(config.rethinkdb);

var schema = require('./schema.js');

const server = new Hapi.Server();
server.connection({ port: config.port });

server.route({
    method: 'GET',
    path: '/articles',
    handler: function(request, reply) {
        var q = r.table('articles');

        q.run().then(function(result) {
            reply({articles: result});
        });
    }
});


server.route({
    method: 'GET',
    path: '/articles/{id}',
    handler: function(request, reply) {
        var q = r.table('articles').filter(r.row('id').eq(request.params.id));

        q.run().then(function(result) {
            if (result.length == 0)
                reply(Boom.notFound());
            else
                reply(result[0]);
        });
    },
    config: {
        validate: {
            params: {
                'id': Joi.string().guid()
            }
        }
    }
});

server.route({
    method: 'DELETE',
    path: '/articles/{id}',
    handler: function(request, reply) {

        var q = r.table('articles').filter(r.row('id').eq(request.params.id));

        q.delete().run().then(function(result) {
            reply(result);
        });
    },
    config: {
        validate: {
            params: {
                'id': Joi.string().guid()
            }
        }
    }
});


server.route({
    method: 'POST',
    path: '/articles',
    handler: function(request, reply) {

        article = request.payload.article;
        article.dateCreated = new Date();
        article.dateModified = new Date();
        
        r.table('articles').insert(article).run().then(function(result) {
            reply(result);
        });
    },
    config: {
        validate: {
            payload: schema.articles
        }
    }
});

server.route({
    method: 'PUT',
    path: '/articles/{id}',
    handler: function(request, reply) {

        var q = r.table('articles').filter(r.row('id').eq(request.params.id));

        q.run().then(function(result) {
            if (result.length == 0)
                reply(Boom.notFound());
            else {

                var newData = request.payload.article;
                var article = result[0];
                article.title = newData.title;
                article.body = newData.body;
                article.dateModified = new Date();

                r.table('articles').update(article).run().then(function (result) {
                    reply(result);
                });
            }
        });
    },
    config: {
        validate: {
            payload: schema.articles
        }
    }
});


server.start(() => {
    console.log('Server running at:', server.info.uri);
});
