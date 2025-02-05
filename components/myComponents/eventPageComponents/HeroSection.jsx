import { View, Text, Image, StyleSheet } from "react-native";
import themeColor2 from "../../../assets/themeColors";

export default function HeroSection({ image, location }) {
  return (
    <View style={styles.mainDiv}>
      <View style={{ flexBasis: "50%" }}>
        <Image
          source={{ uri: image }}
          resizeMode="cover"
          style={styles.mainImage}
        />
      </View>
      <View style={styles.locationDiv}>
        <View style={{ flexBasis: "40%", alignItems: "center" }}>
          <Image
            style={{ width: 120, height: 120 }}
            source={{ uri: "https://freesvg.org/img/3d-Earth-Globe.png" }}
          />
        </View>
        <View>
          <Text style={styles.largeText}>Location</Text>
          {Object.keys(location).map((key) => (
            <View style={styles.locationText}>
              <Text>{key.firstLetterFormat()}</Text>
              <Text style={{ fontWeight: "bold" }}>{location[key]}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainDiv: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 400,
    gap: 10,
  },
  mainImage: {
    flex: 1,
    borderRadius: 20,
  },
  locationDiv: {
    flexBasis: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationText: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    marginBottom: 5,
  },
  largeText: {
    fontSize: 25,
    fontWeight: "bold",
    color: themeColor2.text,
    marginBottom: 10,
  },
});
