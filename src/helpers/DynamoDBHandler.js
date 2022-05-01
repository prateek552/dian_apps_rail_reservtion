
const AWS = require("aws-sdk");

class DynamoDBHandler{
    constructor(tableName){
        this.tableName = tableName
        this.docClient =  new AWS.DynamoDB.DocumentClient(    {
            region: 'localhost',
            endpoint: 'http://localhost:8000',
            accessKeyId: 'DEFAULT_ACCESS_KEY', 
            secretAccessKey: 'DEFAULT_SECRET' 
        });
    }

    async putItem(item){
        try {
            let params = {
              TableName: this.tableName,
              Item: item,
            };
            await this.docClient.put(params).promise();
            console.log("Inserted the Item")
          } catch (error) {
            console.log(error)
          }
    }

    async queryDBForOneKey(key, value) {
        try {
          let params = {
            TableName: this.tableName,
            KeyConditionExpression: "#key = :value",
            ExpressionAttributeValues: {
              ":value": value,
            },
            ExpressionAttributeNames: {
              "#key": key,
            },
          };
          console.log(params)
          let results = await this.docClient.query(params).promise();
          return results.Items;
        } catch (error) {
          console.log(error)
          return null;
        }
      }
}

module.exports = DynamoDBHandler;