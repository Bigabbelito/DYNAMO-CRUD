const AWS = require('aws-sdk');
const dynamoClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-north-1' });

exports.handler = async (event, context, callback) => {

    const params = {
        TableName: 'persons',
    };

    return dynamoClient.scan(params).promise().then((persons) => {
        callback(null,{
            statusCode: 200,
            body: JSON.stringify(persons.Items) 
        });
    }) .catch((err) =>{
        console.error(err);
    })
};