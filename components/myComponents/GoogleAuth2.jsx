import { Button, ScrollView, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

/*
  Scopes se pishat oshte pri vikane na useAuthRequest(). Crez tqh se kazva konkretnoto prilojenie kum kakvi API ima dostup, kato pri logvane na potrebitelq se pita dali
  da se dade dostup na prilojenieto da boravi s tezi danni
*/

WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuth2({ logInHandler }) {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_GOOGLE_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    scopes: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });

  useEffect(() => {
    console.log(response);
    handleSignIn();
  }, [response]);

  //Handles the sign in request
  async function handleSignIn() {
    //Finds the user in the Async storage
    const user = await AsyncStorage.getItem("@user");
    //If user not found, it means no user has logged in
    if (!user) {
      if (response?.type === "success") {
        setToken(response.authentication.accessToken);
        await getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  //Function that gets information about the user
  async function getUserInfo(token) {
    if (!token) return;
    try {
      const response = await axios.get(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      const user = response.data;
      //Calls the props function, which logs in the user and creates account in the database if not already created
      logInHandler(token);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      await AsyncStorage.setItem("@token", token);
      setUserInfo(user);
    } catch (err) {
      console.error(err);
    }
  }

  //Signs out the user. It removes the user object from the async storage
  function signOut() {
    AsyncStorage.removeItem("@user");
    setUserInfo(null);
  }

  //Primerna funciq za chetene ot google calendar
  async function getCalendarEvents(accessToken) {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(response.data);
    } catch (err) {
      console.error(err.message);
    }
  }

  //Primerna funciq za vpisvane na subitie
  async function postEventToCalendar(accessToken) {
    const event = {
      summary: "New Event",
      location: "Somewhere",
      description: "This is a test event.",
      start: {
        dateTime: "2024-12-07T09:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: "2024-12-09T10:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      attendees: [{ email: "test@example.com" }],
    };
    try {
      const response = await axios.post(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        event,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data); // Събитието е създадено
    } catch (error) {
      console.error(error);
    }
  }

  console.log(token);

  return (
    <ScrollView>
      <Button
        title="Sign in with google"
        onPress={() => promptAsync()}
      ></Button>
    </ScrollView>
  );
}
