const DynamoDBHandler = require("../helpers/DynamoDBHandler")
const {
    SEAT_RESERVATION_TABLE
} = process.env
let seats = [
    {
        "Coach":"COACH_1",
        "Row":1,
        "TotalSeats": 7,
        "AvailableSeats":7,
        "TotalSeatsList": ["A","B","C","D","E","F","G"],
        "AvailableSeatsList": ["A","B","C","D","E","F","G"]
    },
    {
        "Coach":"COACH_1",
        "Row":2,
        "TotalSeats": 7,
        "AvailableSeats":7,
        "TotalSeatsList": ["A","B","C","D","E","F","G"],
        "AvailableSeatsList": ["A","B","C","D","E","F","G"]
    },
    {
        "Coach":"COACH_1",
        "Row":3,
        "TotalSeats": 7,
        "AvailableSeats":7,
        "TotalSeatsList": ["A","B","C","D","E","F","G"],
        "AvailableSeatsList": ["A","B","C","D","E","F","G"]
    },
    {
        "Coach":"COACH_1",
        "Row":4,
        "TotalSeats": 7,
        "AvailableSeats":7,
        "TotalSeatsList": ["A","B","C","D","E","F","G"],
        "AvailableSeatsList": ["A","B","C","D","E","F","G"]
    },
    {
        "Coach":"COACH_1",
        "Row":5,
        "TotalSeats": 7,
        "AvailableSeats":7,
        "TotalSeatsList": ["A","B","C","D","E","F","G"],
        "AvailableSeatsList": ["A","B","C","D","E","F","G"]
    },
    {
        "Coach":"COACH_1",
        "Row":6,
        "TotalSeats": 7,
        "AvailableSeats":7,
        "TotalSeatsList": ["A","B","C","D","E","F","G"],
        "AvailableSeatsList": ["A","B","C","D","E","F","G"]
    },
    {
        "Coach":"COACH_1",
        "Row":7,
        "TotalSeats": 7,
        "AvailableSeats":7,
        "TotalSeatsList": ["A","B","C","D","E","F","G"],
        "AvailableSeatsList": ["A","B","C","D","E","F","G"]
    },
    {
        "Coach":"COACH_1",
        "Row":8,
        "TotalSeats": 7,
        "AvailableSeats":7,
        "TotalSeatsList": ["A","B","C","D","E","F","G"],
        "AvailableSeatsList": ["A","B","C","D","E","F","G"]
    },
    {
        "Coach":"COACH_1",
        "Row":9,
        "TotalSeats": 7,
        "AvailableSeats":7,
        "TotalSeatsList": ["A","B","C","D","E","F","G"],
        "AvailableSeatsList": ["A","B","C","D","E","F","G"]
    },
    {
        "Coach":"COACH_1",
        "Row":10,
        "TotalSeats": 7,
        "AvailableSeats":7,
        "TotalSeatsList": ["A","B","C","D","E","F","G"],
        "AvailableSeatsList": ["A","B","C","D","E","F","G"]
    },
    {
        "Coach":"COACH_1",
        "Row":11,
        "TotalSeats": 3,
        "AvailableSeats":3,
        "TotalSeatsList": ["A","B","C"],
        "AvailableSeatsList": ["A","B","C"]
    }
]

//The main purpose of this function is to Seed the basic layout of the seats in the Database
//Only needed to be run for the first time to push the data
seed = async() => {
    for(let item of seats){
        let dynamoDB = new DynamoDBHandler("dev-seat-reservation-table")
      //  let seats = await dynamoDB.queryDBForOneKey("Coach", "COACH_1");
        console.log(seats)
        await dynamoDB.putItem(item);
    }
}

seed()