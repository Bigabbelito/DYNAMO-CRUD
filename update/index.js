const AWS = require('aws-sdk');
const dynamoClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-north-1' });

exports.handler = async (event) => {


    const { OldName, NewName, NewAge }  = JSON.parse(event.body);
    // const { OldName, NewName, NewAge } = event.body;

    // Sök efter personer med det gamla namnet
    const searchParams = {
        TableName: 'persons',
        FilterExpression: '#name = :oldName',
        ExpressionAttributeNames: {
            '#name': 'Name'
        },
        ExpressionAttributeValues: {
            ':oldName': OldName
        }
    };
    

    try {
        const searchResult = await dynamoClient.scan(searchParams).promise();

        if (searchResult.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify('Person not found')
            };
        }

        // Uppdatera attributen "PersonName" och "Author" för alla personer med det gamla namnet
        for (const person of searchResult.Items) {
            const updateParams = {
                TableName: 'persons',
                Key: {
                    "personId": person.personId
                },
                UpdateExpression: 'set #name = :newName, Age = :newAge',
                ExpressionAttributeNames:{
                    '#name': 'Name'
                },
                ExpressionAttributeValues: {
                    ':newName': NewName,
                    ':newAge': NewAge
                },
                ReturnValues: 'UPDATED_NEW'
            };
            await dynamoClient.update(updateParams).promise();
        }

        return {
            statusCode: 204,
            body: ''
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error updating person name: ' + error.message)
        };
    }
};
