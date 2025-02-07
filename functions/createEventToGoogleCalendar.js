import axios from "axios";

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
        console.log(response.data); // The event is created
    } catch (error) {
        console.error(error);
    }
}

export default createEventToGoogleCalendar;