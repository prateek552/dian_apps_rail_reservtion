const DynamoDBHandler = require("../helpers/DynamoDBHandler")
const {
    SEAT_RESERVATION_TABLE
} = process.env
const COACH = "COACH_1"


/*
  Function - reserve
  Description -The main function that is called when the reserve api is hit. It fill get the data for the table and return the best seats for the User.
  Parameters 
      - event - The event contains all the parameters that is passed to the api.
          - seats -  it will go in the query parameter and will contain the number of seats to be booked
   Returns - Returns a json with following parameters - 
            reservationStatus: The Status for the current resurvation request "BOOKED" | "FAILED",
            reservedSeats: List of seats that are booked,
            allSeatsStatus: List of the status for all the seats in a coach
*/

module.exports.reserve = async (event) => {
let statusCode = 200
let message = null
let reserved = null
let allSeatsStatus = new Map()
try{
    console.log(event)
    let requiredSeats = Number(event.queryStringParameters?event.queryStringParameters.seats:undefined);

    //normal checks for the input
    if(requiredSeats == undefined || isNaN(requiredSeats) || requiredSeats == 0 || requiredSeats > 7){
        throw 'Invalid seat number'
    }
    let dynamoDB = new DynamoDBHandler(SEAT_RESERVATION_TABLE)

    //Getting the seat layout for the Coach (COACH_1)
    let seats = await dynamoDB.queryDBForOneKey("Coach", COACH);
    sortedSeats = [...seats]

    //Sorting based on Number of available seats
    sortedSeats.sort((item, item2) => item.AvailableSeats - item2.AvailableSeats)
    if(seats == null){
        throw 'Dynamo DB Connection Error'
    }
    for(let seat of sortedSeats){
        //Checking if we can get all the seats together
        if(seat.AvailableSeats >= requiredSeats){
            seat.AvailableSeats = seat.AvailableSeats - requiredSeats;
            reserved =  seat.AvailableSeatsList.splice(0, requiredSeats).map(item => `${seat.Row} - ${item}`)
            await dynamoDB.putItem(seat)
            break;
        }
    }
    
    if(reserved === null){
        //Algorithm to select the best seats if not available in a single row
        let start = 0;
        let minStart = 0;
        let minEnd = 0;
        let end = 0
        let curr = 0;
        let min = seats.length;
        while (end < seats.length) {
            while (curr <= requiredSeats && end < seats.length)
            {
                curr += seats[end].AvailableSeats;
                end=end+1;
            }
            while (curr >= requiredSeats && start < seats.length) {
                if (end - start < min){
                    min = end - start
                    minStart= start
                    minEnd = end
                }  
                
                curr -= seats[start].AvailableSeats;
                start = start+1
            }
        }
        if(min < seats.length){
        //Calculated the best seats for the user which are closest to each other
        let maxWeigthedSeats = seats.slice(minStart, minEnd).sort((item, item2 )=> item2.AvailableSeats-item.AvailableSeats);
        for(let seat of maxWeigthedSeats){
            if(seat.AvailableSeats <=requiredSeats){
                requiredSeats = requiredSeats - seat.AvailableSeats
                reserved = reserved == null?seat.AvailableSeatsList.map(item => `${seat.Row} - ${item}`):[...reserved,...seat.AvailableSeatsList.map(item => `${seat.Row} - ${item}`)]
                seat.AvailableSeats = 0
                seat.AvailableSeatsList = []
            }else{
                seat.AvailableSeats = seat.AvailableSeats - requiredSeats
                reserved =  [...reserved,...seat.AvailableSeatsList.splice(0, requiredSeats).map(item => `${seat.Row} - ${item}`)]
            }
            await dynamoDB.putItem(seat) 
        } 
    }

    //Making the seat layout to be returned to the user , it will show which seats are available and which are booked
    seats.map(item => {
        item.TotalSeatsList.map(seat => allSeatsStatus.set(`${item.Row}-${seat}`,"Booked"))
        item.AvailableSeatsList.map(seat => allSeatsStatus.set(`${item.Row}-${seat}`,"Available"))
     })
    }else{
        sortedSeats.map(item => {
            item.TotalSeatsList.map(seat => allSeatsStatus.set(`${item.Row}-${seat}`,"Booked"))
            item.AvailableSeatsList.map(seat => allSeatsStatus.set(`${item.Row}-${seat}`,"Available"))
        })
    }
    if(reserved == null){
        message = {
        reservationStatus:"FAILED",
        message: `No Seats Available in ${COACH}`
        }
    }else{
        message = {
            reservationStatus:"BOOKED",
            reservedSeats: reserved,
            allSeatsStatus:Object.fromEntries(new Map([...allSeatsStatus.entries()].sort((item, item2) => Number(item[0].split("-")[0])-Number(item2[0].split("-")[0]))))
        }
    }
}catch(e){
   //returning the error code if any
   statusCode = 500;
   message = {
    reservationStatus:"FAILED",
    message: `${e} --- TableName - ${SEAT_RESERVATION_TABLE}` 
    }
   
}finally{
    console.log(message)
    return {
        statusCode: statusCode,
        body: JSON.stringify({
            message: message,
        },
        null,
        2)
    }
}
};