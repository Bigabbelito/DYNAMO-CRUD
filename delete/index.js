const AWS = require('aws-sdk');
const dynamoClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-north-1' });

exports.handler = async (event) => {
    
    const { Name } = JSON.parse(event.body); 
    // const { Name } = event.body; 
    

    // Sök efter namn som matchar det angivna namnet
    const searchParams = {
        TableName: 'persons',
        FilterExpression: 'Name = :personName',
        ExpressionAttributeValues: {
            ':personName': Name
        }
    };

    try {
        const searchResult = await dynamoClient.scan(searchParams).promise();

        if (searchResult.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify('Name not found')
            };
        }

        // Ta bort allt som matchar namnet
        for (const name of searchResult.Items) {
            const deleteParams = {
                TableName: 'persons',
                Key: {
                    "NameId": name.personId
                }
            };
            await dynamoClient.delete(deleteParams).promise();
        }

        return {
            statusCode: 204, 
            body: ''
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error deleting name: ' + error.message)
        };
    }
};