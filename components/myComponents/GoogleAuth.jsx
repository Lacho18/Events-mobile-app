import { Button, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";

const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

/*const REDIRECT_URI = AuthSession.makeRedirectUri({
  useProxy: true,
});*/

//const DEV_REDIRECT_URI = "https://auth.expo.io/@Lachezar_Genov/my-app";
//const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];

export default function GoogleAuth() {
  /*const [authResult, setAuthResult] = useState(null);
  const DEV_REDIRECT_URI = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  console.log(DEV_REDIRECT_URI);

  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
  };

  const handleAuth = async () => {
    console.log(DEV_REDIRECT_URI);
    const authRequest = new AuthSession.AuthRequest({
      clientId: CLIENT_ID,
      redirectUri: DEV_REDIRECT_URI,
      scopes,
    });

    const result = await authRequest.promptAsync(discovery);
    setAuthResult(result);
  };

  console.log(authResult);*/

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: CLIENT_ID,
    redirectUri: "http://localhost:8081/--/auth", // URI you set in Google Cloud Console
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

/*<View>
      <Text>Something here</Text>
      <Button title="Connect to Google Calendar" onPress={handleAuth}>
        {authResult && (
          <Text>Access Token: {authResult.authentication?.accessToken}</Text>
        )}
      </Button>
    </View>*/
