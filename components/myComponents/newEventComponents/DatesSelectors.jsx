import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateSelectionComponent from "../DateSelectionComponent";
import { useState } from "react";

export default function DatesSelectors({ dateSelection, beginDate, endDate }) {
  const [showDate, setShowDate] = useState(false);
  const [dateType, setDateType] = useState("dateOfPerformance");

  return (
    <View>
      {showDate ? (
        <DateSelectionComponent
          dateSelection={dateSelection}
          objectField={dateType}
          hideDate={() => setShowDate(false)}
        />
      ) : (
        <View>
          <Text style={{ color: "red", fontStyle: "italic", margin: 5 }}>
            Current date : {beginDate.toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.selectDateButton}
            onPress={() => {
              setShowDate(true);
              setDateType("dateOfPerformance");
            }}
          >
            <Text style={{ color: "white" }}>Select date of performance</Text>
          </TouchableOpacity>
          <Text style={{ color: "red", fontStyle: "italic", margin: 5 }}>
            Current date : {endDate.toLocaleDateString()}
          </Text>
          <TouchableOpacity
            style={styles.selectDateButton}
            onPress={() => {
              setShowDate(true);
              setDateType("endOfPerformance");
            }}
          >
            <Text style={{ color: "white" }}>
              Select event end of performance
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  selectDateButton: {
    padding: 3,
    fontSize: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "darkblue",
    width: 130,
    height: 70,
    borderRadius: 18,
    margin: 5,
    padding: 5,
  },
});
