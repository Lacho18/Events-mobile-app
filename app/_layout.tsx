import { NavigationContainer } from "@react-navigation/native";
import { Stack } from "expo-router";
import { GlobalStateProvider } from "../context/globalUserProvider";

export default function RootLayout() {
  return (
    <GlobalStateProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signUp" options={{ headerShown: false }} />
        <Stack.Screen name="newEvent" options={{ headerShown: false }} />
        <Stack.Screen name="eventPage/[id]" options={{ headerShown: false }} />
      </Stack>
    </GlobalStateProvider>
  );
}
