import themeColor2 from "@/assets/themeColors";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function EventCardView({ event }) {
  const dateOfPerformance = new Date(event.dateOfPerformance.seconds * 1000);
  const postDate = new Date(event.postDate.seconds * 1000);

  return (
    <Link href={"eventPage/" + event.id} style={styles.boxDiv}>
      <View style={styles.topDiv}>
        <View style={styles.imageDiv}>
          <Image
            source={{ uri: event.images[0] }}
            resizeMode="cover"
            style={styles.image}
            alt="null"
          />
        </View>

        <View
          style={{
            display: "flex",
            alignItems: "flex-end",
            width: "40%",
          }}
        >
          {event?.location &&
            Object.keys(event.location).map((key) => (
              <View key={key} style={{ margin: 3 }}>
                <Text style={styles.locationText}>{key}:</Text>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {event.location[key]}
                </Text>
              </View>
            ))}
        </View>
      </View>
      <View style={{ width: "100%" }}>
        <Text style={styles.eventTitle}>{event.name}</Text>
      </View>
      <View style={styles.bottomDiv}>
        <View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.dateOfPerformanceText}>
              Date of performance
            </Text>
            <Text style={styles.performanceDate}>
              {dateOfPerformance.toLocaleDateString()}
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: themeColor2.text }}>Post date</Text>
            <Text style={{ color: themeColor2.text }}>
              {postDate.toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.priceDiv}>
          <Text style={{ fontSize: 15, color: themeColor2.text }}>Places:</Text>
          <Text style={styles.placesText}>{event.places}</Text>
          <View style={styles.priceTextDiv}>
            <Text style={{ fontSize: 25, color: themeColor2.text }}>
              Price:{" "}
            </Text>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                color: themeColor2.text,
              }}
            >
              {event.price} BGN
            </Text>
          </View>
        </View>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  boxDiv: {
    height: "auto",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 18,
    padding: 10,
    margin: 20,
    backgroundColor: themeColor2.background,
  },
  topDiv: {
    display: "flex",
    flexDirection: "row",
  },
  bottomDiv: {
    display: "flex",
    flexDirection: "row",
  },
  titleDiv: {
    display: "flex",
    flexDirection: "column",
  },
  imageDiv: {
    flexBasis: "60%",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  eventTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: themeColor2.text,
  },
  dateOfPerformanceText: {
    fontSize: 15,
    color: themeColor2.text,
  },
  performanceDate: {
    fontSize: 25,
    fontWeight: "bold",
    color: themeColor2.text,
  },
  priceDiv: {
    flex: 1,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  priceTextDiv: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-end",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    paddingLeft: 5,
  },
  placesText: {
    fontSize: 25,
    fontWeight: "bold",
    color: themeColor2.text,
  },
  locationText: {
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "right",
  },
});
