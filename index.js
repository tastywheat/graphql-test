const _ = require('lodash');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const bodyParser = require('body-parser');
const DataLoader = require('dataloader');
const VError = require('verror');

const { log } = require('./logger');
const resources = require('./resources');
const requestLogger = require('./middleware/request-logger');



function main () {
    log('============== Starting App ==============');
    const knex = require('knex')({
        client: 'sqlite3',
        connection: {
            filename: "./mydb.sqlite"
        }
    });

    const server = new ApolloServer({
        typeDefs: _.map(resources, r => r.schema),
        resolvers: _.merge(..._.map(resources, r => r.resolvers)),
        context: () => {
            const loaders = getLoaders(knex);

            return {
                knex,
                loaders,
            };
        },
    });

    // Initialize the app
    const app = express();

    app.use(bodyParser.json());
    app.use(requestLogger());

    // The GraphQL endpoint
    server.applyMiddleware({ app });

    // Start the server
    app.listen(4000, () => {
        log('Go to http://localhost:4000/graphiql to run queries!');
    });
};

function getLoaders (knex) {
    const loaders = {};
    _.each(resources, r => {
        if (!r.getLoader) {
            return;
        }
        loaders[r.name] = r.getLoader({ knex });
    });

    return loaders;
}


main();
