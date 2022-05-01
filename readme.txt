RAILWAY SEATS RESERVATION SYSTEM

 - This service exposes one endpoint which will book the best possible number of seats for a particular user. Endpoint Details can be found in a seperate JSON file.
 - The API is protected by a api key that is automatically generated when the service is deployed. The Key:Value example for the api is  "x-api-key" : "API_KEY_HERE"
 - DynamoDB has been used to store the state of varios seats. COACH is used as the hash key to query the data directly and ROW number is used as the query key.
 - Since DyanmoDB is a no sql database. An example of a single row data schema of DynamoDB is  - 
    {
        "Coach":"COACH_1",
        "Row":1,
        "TotalSeats": 7,
        "AvailableSeats":7,
        "TotalSeatsList": ["A","B","C","D","E","F","G"],
        "AvailableSeatsList": ["A","B","C","D","E","F","G"]
    }
  - The Service is build on a serverless architechture that uses lambda and api gateways and will be deployed with a single command - sls deploy --stage ENV_NAME
  - serverless.yml is a template that contains the resources that will be created when the above command is executed

