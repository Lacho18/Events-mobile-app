import { collection, getDocs } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { db } from "../../../FirebaseConfig";
import EventCardView from "./EventCardView";

export default function EventsMainView() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function getEvents() {
      const eventsCollection = collection(db, "Events");
      try {
        const eventsArraySnapshot = await getDocs(eventsCollection);
        const eventsArray = eventsArraySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(() => {
          const sortedArray = eventsArray.sort((a, b) => {
            return a.dateOfPerformance.toDate() - b.dateOfPerformance.toDate();
          });

          return sortedArray;
        });

        console.log(eventsArray);
      } catch (err) {
        console.error(err);
      }
    }

    getEvents();
  }, []);

  console.log("Array of events");

  return (
    <View>
      {events.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        events.map((event) => <EventCardView key={event.id} event={event} />)
      )}
    </View>
  );
}
