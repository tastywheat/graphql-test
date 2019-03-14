const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./mydb.sqlite"
    }
});

(async function main () {
    await createAccounts();
    await createUsers();
    await createQuestions();

    const accountId = await populateAccounts();
    const userId = await populateUsers(accountId);
    await populateQuestions(userId);

    process.exit(0);
})();

async function createAccounts () {
    console.log('adding accounts');

    await knex.schema.dropTableIfExists('accounts');
    await knex.schema.createTable('accounts', function (table) {
        table.increments();
        table.string('password');
        table.string('salt');
        table.timestamps();
    });
}

async function createUsers () {
    console.log('adding users');

    await knex.schema.dropTableIfExists('users');
    await knex.schema.createTable('users', function (table) {
        table.increments();
        table.string('name');
        table.string('email');
        table.string('first_name');
        table.string('last_name');
        table.integer('account_id').unsigned().notNullable();
        table.timestamps();

        table.foreign('account_id').references('id').inTable('accounts');
    });
}

async function createQuestions () {
    console.log('adding questions');

    await knex.schema.dropTableIfExists('questions');
    await knex.schema.createTable('questions', function (table) {
        table.increments();
        table.string('question_type');
        table.string('question');
        table.integer('owner_id').unsigned().notNullable();
        table.timestamps();

        table.foreign('owner_id').references('id').inTable('users');
    });
}

async function populateAccounts () {
    const [id] = await knex('accounts').insert({
        password: 'pass',
        salt: 'pepper',
        created_at: new Date(),
        updated_at: new Date(),
    });

    return id;
}

async function populateUsers (accountId) {
    const [id] = await knex('users').insert({
        name: 'tasty',
        email: 'brian@law.com',
        first_name: 'brian',
        last_name: 'law',
        account_id: accountId,
        created_at: new Date(),
        updated_at: new Date(),
    });

    return id;
}

async function populateQuestions (ownerId) {
    await knex('questions').insert({
        question_type: 'meaning',
        question: '먹다',
        owner_id: ownerId,
        created_at: new Date(),
        updated_at: new Date(),
    });
}
