const _ = require('lodash');
const VError = require('verror');
const DataLoader = require('dataloader');

module.exports = {
    name: 'question',

    getLoader: ({ knex }) => {
        return new DataLoader(keys => {
            return knex('questions').whereIn('id', keys);
        });
    },

    schema: `
        extend type Query {
            question (id: Int): Question
        }

        type Question {
            question: String,
            question_type: String,
            owner: User,
        }
    `,

    resolvers: {
        Query: {
            question: (obj, { id }, { loaders }, info) => {
                return loaders.question.load(id).catch(err => {
                    throw new VError(err, `failed to find question ${id}`)
                });
            },
        },
        Question: {
            owner: (question, args, { loaders }, info) => {
                return loaders.user.load(question.owner_id).catch(err => {
                    throw new VError(err, `failed to find question owner ${question.owner_id}`);
                });
            },
        },
    },
};

