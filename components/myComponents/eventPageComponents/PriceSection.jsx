import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import themeColor2 from "../../../assets/themeColors";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createEventToGoogleCalendar from "../../../functions/createEventToGoogleCalendar";

export default function PriceSection({ event }) {
  const [user, setUser] = useState(null);
  const [googleToken, setGoogleToken] = useState(null);

  useEffect(() => {
    async function getUser() {
      const userFromStorage = await AsyncStorage.getItem("@user");
      const token = await AsyncStorage.getItem("@token");
      const currentUser = JSON.parse(userFromStorage);
      if (currentUser) {
        setUser(currentUser);
      }
      if (token) {
        setGoogleToken(token);
      }
    }

    getUser();
  }, []);

  async function buyTicketHandler() {
    console.log(user);
    console.log(googleToken);

    //Checks if the user has logged in with google account
    if (googleToken) {
      createEventToGoogleCalendar(googleToken, event);
    }
  }

  return (
    <View style={styles.mainDiv}>
      {user && (
        <TouchableOpacity
          style={styles.buyTicketButton}
          onPress={buyTicketHandler}
        >
          <Text style={styles.buttonText}>Buy ticket</Text>
        </TouchableOpacity>
      )}
      <View style={styles.priceDiv}>
        <Text style={styles.priceText}>Price:</Text>
        <Text style={[styles.priceText, { color: themeColor2.accent }]}>
          {event.price} BGN
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 3,
    marginTop: 10,
  },
  buyTicketButton: {
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  priceDiv: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    margin: 10,
  },
  priceText: {
    fontSize: 20,
    color: themeColor2.text,
    fontWeight: "bold",
  },
});
