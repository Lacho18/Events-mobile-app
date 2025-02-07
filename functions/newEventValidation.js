//Function for validation of the event
function newEventValidation(newEvent) {
    Object.defineProperties(newEvent, {
        participants: { enumerable: false }
    });

    const keys = Object.keys(newEvent);
    let validNewEvent = true;

    keys.forEach(key => {
        if (newEvent[key] === "" || newEvent[key] === 0 || (Array.isArray(newEvent[key]) && newEvent[key].length === 0)) {
            validNewEvent = false;
        }
    });

    if (newEvent.location) {
        if (newEvent.location.country === "" || newEvent.location.town === "" || newEvent.location.address === "") {
            validNewEvent = false;
        }
    }

    if (!validNewEvent) {
        throw new Error("All fields are required!");
    }

    let currentDate = new Date();

    if (currentDate > newEvent.dateOfPerformance) {
        throw new Error("Date of performance of the event should be in a future date.");
    }

    if (newEvent.places < 0) {
        throw new Error("The places of the event should be a positive number!");
    }

    if (newEvent.price < 0) {
        throw new Error("The price of the event ticket should be a positive number!");
    }

    if (newEvent.dateOfPerformance > newEvent.endOfPerformance) {
        throw new Error("The event can not end before it has begun. You should chang your end date!");
    }
}

export default newEventValidation;