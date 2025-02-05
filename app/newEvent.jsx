import { getAuth } from "firebase/auth";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import themeColor2 from "../assets/themeColors";
import DateSelectionComponent from "../components/myComponents/DateSelectionComponent";
import { useEffect, useState } from "react";
import ImagePicker from "../components/myComponents/ImagePicker";
import newEventValidation from "../functions/newEventValidation";
import { addDoc, collection } from "firebase/firestore/lite";
import { db } from "@/FirebaseConfig";
import { router } from "expo-router";
import DatesSelectors from "../components/myComponents/newEventComponents/DatesSelectors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NewEvent() {
  //Structure of an event
  const OBJECT_STRUCTURE = {
    name: "",
    description: "",
    images: [],
    location: {
      country: "",
      town: "",
      address: "",
    },
    organizer_ID: "",
    places: 0,
    price: 0,
    dateOfPerformance: new Date(),
    endOfPerformance: new Date(),
    postDate: new Date(),
    participants: [],
  };

  const OBJECT_STRUCTURE_FOR_STATES = { ...OBJECT_STRUCTURE };

  //Removing the enumerable in order to the fields to be skipped when called Object.keys()
  Object.defineProperties(OBJECT_STRUCTURE_FOR_STATES, {
    images: { enumerable: false },
    organizer_ID: { enumerable: false },
    location: { enumerable: false },
    participants: { enumerable: false },
    postDate: { enumerable: false },
    dateOfPerformance: { enumerable: false },
    endOfPerformance: { enumerable: false },
  });

  //Getting the keys of all the enumerable fields in the object
  const structureKeys = Object.keys(OBJECT_STRUCTURE_FOR_STATES);

  //Gets the user authentication
  //const user = getAuth();

  const [user, setUser] = useState(null);
  //State to store the current data for the event that will be uploaded to the database
  const [newEvent, setNewEvent] = useState(OBJECT_STRUCTURE);
  //State to follow whether to show the date window or not
  const [showDate, setShowDate] = useState(false);
  //State that shows the errors on the current component
  const [error, setError] = useState("");
  //The keys of the location object
  const locationKeys = Object.keys(OBJECT_STRUCTURE.location);

  useEffect(() => {
    async function getUser() {
      const userFromStorage = await AsyncStorage.getItem("@user");
      const currentUser = JSON.parse(userFromStorage);
      if (currentUser) {
        setUser(currentUser);
      }
    }

    getUser();
  }, []);

  //Function that handles the changes on every textfield fulfilling every field
  function changeHandler(field, text) {
    setNewEvent((oldValue) => {
      return { ...oldValue, [field]: text };
    });
  }

  //Function that sets the field of the date object selected from the date picker
  function dateSelection(field, value) {
    setShowDate(false);
    setNewEvent((oldValue) => {
      return { ...oldValue, [field]: new Date(value) };
    });
  }

  //Function that sets the fields images with all urls to the posted to the Cloudinary images
  function setImages(imagesUrls) {
    setNewEvent((oldValue) => {
      return { ...oldValue, images: imagesUrls };
    });
  }

  //Function that handles the input text for location object
  function setEventLocationHandler(field, value) {
    setNewEvent((oldValue) => {
      return {
        ...oldValue,
        location: {
          ...oldValue.location,
          [field]: value,
        },
      };
    });
  }

  //Function that checks for valid data and if so inset the newEvent object to the Firebase database
  async function submitEventHandler() {
    try {
      //Creating copy of the state that will be checked and used on the POST request
      const postNewEvent = {
        ...newEvent,
        organizer_ID: user._tokenResponse.email,
        postDate: new Date(),
      };

      console.log(postNewEvent);
      //Function that checks for valid data on the fields
      newEventValidation(postNewEvent);

      //Selecting collection "Events"
      const eventsCollection = collection(db, "Events");
      //Inserting the object to selected collection
      const insObject = await addDoc(eventsCollection, postNewEvent);
      //Navigation to the page of newly created object
      router.replace("/eventPage/" + insObject.id);
    } catch (err) {
      //If error appears setting the state for errors to its message
      setError(err.message);
      setTimeout(() => setError(""), 5000);
    }
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 30, color: "red" }}>
          Log in to your account in order to create event
        </Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.mainDiv}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.titleText}>Event creation</Text>
        <View style={styles.sidesDiv}>
          <Text style={styles.subTitleText}>
            Here you can create new event and make it visible for the others
          </Text>
        </View>
        {error !== "" && <Text style={styles.errorMessage}>{error}</Text>}
        {structureKeys.map((field) => {
          return (
            <View key={field} style={styles.inputGroup}>
              <Text style={styles.label}>Event {field.formatFields()}</Text>

              <TextInput
                placeholder={field}
                style={styles.input}
                onChangeText={(text) => changeHandler(field, text)}
              />
            </View>
          );
        })}
        <DatesSelectors
          dateSelection={dateSelection}
          beginDate={newEvent.dateOfPerformance}
          endDate={newEvent.endOfPerformance}
        />
        <View>
          <ImagePicker getImages={setImages} />
        </View>
        <View style={{ marginTop: 25, borderTopWidth: 3 }}>
          <Text
            style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
          >
            Event Location
          </Text>
          <Text style={{ fontStyle: "italic" }}>
            Insert the event country, town and address
          </Text>
          {locationKeys.map((field) => {
            return (
              <View key={field} style={styles.inputGroup}>
                <Text style={styles.label}>Event {field.formatFields()}</Text>
                <TextInput
                  placeholder={field}
                  style={styles.input}
                  onChangeText={(text) => setEventLocationHandler(field, text)}
                />
              </View>
            );
          })}
        </View>
        <View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              submitEventHandler();
            }}
          >
            <Text style={{ color: "white", padding: 5 }}>Create event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainDiv: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: themeColor2.text,
    backgroundColor: themeColor2.background,
  },
  sidesDiv: {
    width: 275,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subTitleText: {
    fontSize: 15,
    fontStyle: "italic",
    color: "gray",
    textAlign: "center",
    marginTop: 10,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: 250,
    margin: 20,
  },
  label: {
    fontSize: 20,
    margin: 4,
  },
  input: {
    backgroundColor: "white",
    margin: 2,
    padding: 7,
    fontSize: 20,
    width: 250,
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
  submitButton: {
    backgroundColor: "#03a7ff",
    borderRadius: 18,
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  errorMessage: {
    color: "red",
    fontWeight: "bold",
    fontSize: 25,
    position: "fixed",
    top: 300,
    zIndex: 1,
    backgroundColor: "white",
  },
});
