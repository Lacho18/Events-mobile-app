import { View, Text, StyleSheet } from "react-native";
import themeColor2 from "../../../assets/themeColors";

export default function DescriptionSection({ description }) {
  return (
    <View style={styles.mainDiv}>
      <Text style={styles.largeText}>Description</Text>
      <View style={styles.descriptionDiv}>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainDiv: {
    marginTop: 18,
  },
  descriptionDiv: {
    flex: 1,
    padding: 3,
  },
  largeText: {
    fontSize: 25,
    fontWeight: "bold",
    color: themeColor2.text,
  },
  descriptionText: {
    fontSize: 15,
  },
});
