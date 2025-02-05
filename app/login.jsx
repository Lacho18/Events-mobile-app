import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import themeColor from "../assets/themeColors";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../FirebaseConfig";
import { router } from "expo-router";
import GoogleAuth from "../components/myComponents/GoogleAuth";
import GoogleAuth2 from "../components/myComponents/GoogleAuth2";
import createUserWithGoogleData from "../functions/createUserWithGoogleData";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Opravi Firebase auth s Google. Ima problem s google proektite. Svurji firebase proekta s tozi v google cloud

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  function changeHandler(text, field) {
    setLoginData((oldValue) => {
      return { ...oldValue, [field]: text };
    });
  }

  async function submitHandler() {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );

      if (user) {
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        router.replace("/");
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  //Logs in with google authentication
  async function loginWithGoogle(accessToken) {
    try {
      // Create a Google credential with the access token
      const credential = GoogleAuthProvider.credential(null, accessToken);

      // Sign in with Firebase using the Google credential
      const userCredential = await signInWithCredential(auth, credential);

      // User is signed in
      console.log("User signed in with Firebase:", userCredential.user);

      await createUserWithGoogleData(userCredential.user);

      // Return the user data
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  return (
    <View style={styles.mainDiv}>
      <Text style={styles.titleText}>Login</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={(text) => changeHandler(text, "email")}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={(text) => changeHandler(text, "password")}
        />
      </View>
      <TouchableOpacity style={styles.logInButton} onPress={submitHandler}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <GoogleAuth2 logInHandler={loginWithGoogle} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainDiv: {
    backgroundColor: themeColor.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  titleText: {
    fontSize: 45,
    fontWeight: "bold",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: 250,
  },
  label: {
    fontSize: 20,
    margin: 4,
  },
  input: {
    backgroundColor: "white",
    margin: 2,
    padding: 7,
    fontSize: 18,
    width: 250,
  },
  logInButton: {
    backgroundColor: "#03a7ff",
    borderRadius: 18,
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    fontSize: 25,
    color: "white",
  },
});
