const VError = require('verror');
const DataLoader = require('dataloader');

const { debug } = require('../logger');

module.exports = {
    name: 'user',

    getLoader: ({ knex }) => {
        return new DataLoader(keys => {
            return knex('users').whereIn('id', keys);
        });
    },

    schema: `
        extend type Query {
            user (id: Int): User
        }

        type User {
            email: String,
            first_name: String,
            last_name: String,
        }
    `,
    resolvers: {
        Query: {
            user: (obj, { id }, { loaders }, info) => {
                return loaders.user.load(id).catch(err => {
                    throw new VError(err, `failed to find user ${id}`);
                });
            },
        },
    },
};
