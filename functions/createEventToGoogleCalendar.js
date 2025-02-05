import axios from "axios";

/*
    1. Pregleday vseki edin fail i mahni nenyshnite veche console.log
    2. Dobavi logika za tova pri kypyvane na bileta da se dobavq kum masiva na potrebitelq - WillParticipate
*/

async function createEventToGoogleCalendar(token, event) {
    const dateOfPerformance = event.dateOfPerformance.toDate();
    const endOfPerformance = event.endOfPerformance.toDate();

    const eventObject = {
        summary: event.name,
        location: `${event.location.country} ${event.location.town} ${event.location.address}`,
        description: event.description,
        start: {
            dateTime: dateOfPerformance,
            timeZone: "America/Los_Angeles",
        },
        end: {
            dateTime: endOfPerformance,
            timeZone: "America/Los_Angeles",
        },
        attendees: [{ email: event.organizer_ID }],
    };
    try {
        const response = await axios.post(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events",
            eventObject,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log(response.data); // Събитието е създадено
    } catch (error) {
        console.error(error);
    }
}

export default createEventToGoogleCalendar;