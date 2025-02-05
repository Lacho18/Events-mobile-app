import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import themeColor2 from "../../assets/themeColors";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "@/FirebaseConfig";
import HeroSection from "../../components/myComponents/eventPageComponents/HeroSection";
import DescriptionSection from "../../components/myComponents/eventPageComponents/DescriptionSection";
import ImageSlider from "../../components/myComponents/eventPageComponents/ImageSlider";
import PriceSection from "../../components/myComponents/eventPageComponents/PriceSection";

export default function EventPage() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    async function getCurrentEvent() {
      const eventDocRef = doc(db, "Events", id);
      const eventDoc = await getDoc(eventDocRef);

      if (eventDoc.exists()) {
        const docData = eventDoc.data();
        setEvent(docData);
      }
    }

    getCurrentEvent();
  }, []);

  if (!event) {
    return (
      <SafeAreaView style={{ padding: 25 }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.mainDiv}>
      <ScrollView>
        <View style={{ display: "flex", gap: 20 }}>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.titleText}>{event.name}</Text>
          </View>
          <HeroSection image={event.images[0]} location={event.location} />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <Text style={styles.placesText}>Available places: </Text>
            <Text
              style={[
                styles.placesText,
                event.places > 0 ? { color: "green" } : { color: "red" },
              ]}
            >
              {event.places}
            </Text>
          </View>
          <DescriptionSection description={event.description} />
          <ImageSlider images={event.images} />
          <PriceSection event={event} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainDiv: {
    backgroundColor: themeColor2.background,
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontSize: 45,
    fontWeight: "bold",
    color: themeColor2.primary,
    textAlign: "center",
  },
  placesText: {
    fontSize: 30,
    color: themeColor2,
  },
});
