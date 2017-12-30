const Sequelize = require('sequelize');
let usersDB;

// connection to DB:
const sequelize = new Sequelize('db', 'user', 'pass', {
    host: 'postgres.domain',
    dialect: 'postgres'
});
// test connection to Postgres DB
sequelize
    .authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

// create a test Table
const User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    }
});

// force: true will drop the table if it already exists
// User.sync({force: fasle}).then(() => {
//     // Table created
//     return User.create({
//         firstName: 'Nu',
//         lastName: 'Pogodi'
//     });
// });

module.exports.getContacts = (event, context, callback) => {

    context.callbackWaitsForEmptyEventLoop = false;

    User.findAll().then(
        users => {
                console.log('DB users: ', users);
                const response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        users: users
                    })
                };
                callback(null, response);
        },
        error => console.log('error:', error)
    );

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.addContact = (event, context, callback) => {

    const body = JSON.parse(event.body);
    console.log('body', body);

    // if(event.body.firstName & event.body.lastName) {
    if(body.firstName) {
        // it allows to avoid the lambda function timeout
        context.callbackWaitsForEmptyEventLoop = false;
        User.create({
            firstName:body.firstName,
            lastName:body.lastName
        }).then(
            res => {
                console.log('Result of creating new record: ', res);
                const response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: res,
                        input: event
                    }),
                };
                callback(null, response);
            },
            error => {
                console.log('error:', error);
                callback(error);
            }
        );
    } else {
        callback('Please provide first and last name.');
    }
};