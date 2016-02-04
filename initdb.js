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


// Initialize our db if the db is empty.
r.dbList().then(function(result) {

    // if our db doesn't exist, create it
    if (result.indexOf(config.rethinkdb.db) == -1)
    {
        return r.dbCreate(config.rethinkdb.db);
    }

}).then(function(result) {
    return r.tableList();

}).then(function(result) {

    // if our table doesn't exist, create it
    if (result.indexOf('articles') == -1)
    {
        return r.tableCreate('articles');
    }

}).then(function(result) {
    process.exit(0);
});
