import { Button, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";

const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleAuth() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: CLIENT_ID,
    redirectUri: "http://localhost:8081/--/auth", // URI set in Google Cloud Console
  });

  useEffect(() => {
    if (response?.type === "success") {
      // handle successful login here
      const { id_token } = response.params;
      console.log("ID Token:", id_token);
    }
  }, [response]);

  return (
    <Button
      title="Login with Google"
      disabled={!request}
      onPress={() => promptAsync()}
    />
  );
}
