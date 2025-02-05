import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import themeColor from "../assets/themeColors";
import { useState } from "react";
import DateSelectionComponent from "../components/myComponents/DateSelectionComponent";
import newUserValidation from "../functions/newUserValidations";
import { auth } from "../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore/lite";
import { db } from "@/FirebaseConfig";
import { router } from "expo-router";

export default function SignUp() {
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null,
    dateOfCreation: new Date(),
  });
  const [radioButtons, setRadioButtons] = useState([
    { id: "1", label: "Male", value: "male", isSelected: false },
    { id: "2", label: "Female", value: "female", isSelected: false },
  ]);
  const [showDate, setShowDate] = useState(false);
  const [error, setError] = useState("");

  function changeHandler(text, name) {
    setNewUser((oldValue) => {
      return { ...oldValue, [name]: text };
    });
  }

  function onRadioButtonPress(buttonId) {
    setRadioButtons((oldValue) => {
      let newValue = oldValue.map((indexValue) =>
        indexValue.id === buttonId
          ? { ...indexValue, isSelected: true }
          : { ...indexValue, isSelected: false }
      );

      return newValue;
    });

    setNewUser((oldValue) => {
      return { ...oldValue, gender: radioButtons[buttonId - 1].value };
    });
  }

  function dateSelection(field, value) {
    setShowDate(false);
    setNewUser((oldValue) => {
      return { ...oldValue, [field]: new Date(value) };
    });
  }

  async function submitHandler() {
    try {
      //Checks for valid input data. Throws error is there is one
      newUserValidation(newUser);
      //Makes copy of the state
      let postUserData = { ...newUser };
      //deletes confirmPassword field
      delete postUserData.confirmPassword;
      //Removes all capital letters
      postUserData.email = postUserData.email.toLowerCase();
      //Adds fields to complete the structure of the users
      postUserData.wiiParticipate = [];
      postUserData.haveParticipated = [];
      postUserData.organizedEvents = [];
      //Adds auth data with email and password
      console.log(postUserData);
      const user = await createUserWithEmailAndPassword(
        auth,
        postUserData.email,
        postUserData.password
      );
      //Gets the 'Users' collection
      const usersCollection = collection(db, "Users");
      //Post the new user to the database
      await addDoc(usersCollection, postUserData);
      //Navigates to the login page
      router.replace("/login");
    } catch (err) {
      console.error(err.message);
      setError(err.message);
      setTimeout(() => setError(""), 5000);
    }
  }

  return (
    <SafeAreaView style={styles.mainDiv}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.titleText}>Sign up</Text>
        {error !== "" && <Text style={styles.errorMessage}>{error}</Text>}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={(value) => {
              changeHandler(value, "email");
            }}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Password"
            style={styles.input}
            onChangeText={(value) => changeHandler(value, "password")}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            placeholder="Password"
            style={styles.input}
            onChangeText={(value) => changeHandler(value, "confirmPassword")}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            placeholder="Name"
            style={styles.input}
            onChangeText={(value) => changeHandler(value, "firstName")}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last name</Text>
          <TextInput
            placeholder="Name"
            style={styles.input}
            onChangeText={(value) => changeHandler(value, "lastName")}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          {radioButtons.map((button) => (
            <View
              key={button.id}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
                marginTop: 7,
              }}
            >
              <TouchableOpacity
                style={styles.radioCircle}
                onPress={() => onRadioButtonPress(button.id)}
              >
                {button.isSelected && (
                  <View style={styles.radioInnerCircle}></View>
                )}
              </TouchableOpacity>
              <Text>{button.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of birth</Text>
          {showDate ? (
            <DateSelectionComponent
              dateSelection={dateSelection}
              objectField={"dateOfBirth"}
            />
          ) : (
            <View>
              <Text style={{ color: "red", fontStyle: "italic" }}>
                {newUser.dateOfBirth && newUser.dateOfBirth !== undefined
                  ? newUser.dateOfBirth.toLocaleDateString()
                  : "No date of birth selected"}
              </Text>
              <TouchableOpacity
                style={styles.selectDateButton}
                onPress={() => setShowDate(true)}
              >
                <Text style={{ color: "white" }}>Select date</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.logInButton} onPress={submitHandler}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainDiv: {
    backgroundColor: themeColor.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    overflow: "scroll",
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
  radioCircle: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderRadius: 9999,
    backgroundColor: "black",
  },
  selectDateButton: {
    padding: 3,
    fontSize: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "darkblue",
    width: 100,
    height: 50,
    borderRadius: 18,
  },
  errorMessage: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
    position: "fixed",
    top: 20,
    zIndex: 10,
  },
});
