const AWS = require('aws-sdk');
const dynamoClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-north-1' });

exports.handler = async (event) => {
   
    const { Name, Age } = JSON.parse(event.body);
    // const { Name, Age } = event.body;

    
    const params = {
        TableName: 'persons',
        Item: {
            "personId": AWS.util.uuid.v4(),
            "Name": Name, 
            "Age": Age 
        }
    };

    try {
        await dynamoClient.put(params).promise();
        return {
            statusCode: 201,
            body: ''
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error creating name: ' + error.message)
        };
    }
};
