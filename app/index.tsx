import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
//import { auth } from "@/FirebaseConfig";
import { db } from "@/FirebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore/lite";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useState } from "react";
import themeColor from "../assets/themeColors";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuComponent from "../components/myComponents/MenuComponent";
import { getAuth } from "firebase/auth";
import { useGlobalUser } from "../context/globalUserProvider";
import "../functions/stringExstencions";
import EventsMainView from "../components/myComponents/eventsComponents/EventsMainView";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserDataType = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date | null;
  dateOfCreation: Date | null;
  wiiParticipate: any[];
  haveParticipated: any[];
  organizedEvents: any[];
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Index() {
  const [showMenu, setShowMenu] = useState(false);
  //const [globalUser, setGlobalUserFunc] = useGlobalUser();
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState<UserDataType>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null,
    dateOfCreation: null,
    wiiParticipate: [],
    haveParticipated: [],
    organizedEvents: [],
  });

  useEffect(() => {
    //Gets the data for the user after he has logged in
    async function getUserData() {
      //Gets the user from the async storage
      const userFromStorage = await AsyncStorage.getItem("@user");
      //Checks if someone has logged in
      if (userFromStorage) {
        let userDataFromStorage = JSON.parse(userFromStorage);
        //If the user has logged in with email/password the data is in user inner object
        if (userDataFromStorage.user !== undefined) {
          userDataFromStorage = userDataFromStorage.user;
        }
        const usersCollection = collection(db, 'Users');
        const q = query(usersCollection, where("email", "==", userDataFromStorage.email.toLowerCase()));
        const users = await getDocs(q);
        const usersList = users.docs.map((doc) => doc.data() as UserDataType);
        setUserData(usersList[0]);
      }
    }

    getUserData();
  }, [user]);

  function signOutHandler() {
    setUserData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: null,
      dateOfCreation: null,
      wiiParticipate: [],
      haveParticipated: [],
      organizedEvents: [],
    });
  }

  return (
    <SafeAreaView
      style={styles.mainDiv}
    >
      <ScrollView>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={styles.menuIcon}>
            {showMenu ?
              <AntDesign name="closecircle" size={32} color="black" onPress={() => setShowMenu(false)} />
              :
              <Feather name="menu" size={32} color="black" onPress={() => setShowMenu(true)} />}
          </View>
          {userData.email !== "" && <Text style={{ fontSize: 20 }}>Welcome {userData.firstName} {userData.lastName}</Text>}
        </View>
        {showMenu && <MenuComponent user={userData} screenWidth={screenWidth} screenHeight={screenHeight}
          hideMenu={() => setShowMenu(false)} signOutHandler={signOutHandler} />}
        <View>
          <Text style={styles.titleText}>Application for events</Text>
          <EventsMainView />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainDiv: {
    backgroundColor: themeColor.background,
    color: themeColor.text,
    width: screenWidth,
    height: screenHeight,
    position: "relative",
  },
  menuIcon: {
    backgroundColor: themeColor.primary,
    width: 60,
    height: 60,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  titleText: {
    fontSize: 45,
    fontWeight: "bold",
    fontFamily: "Pacifico_400Regular",
    fontStyle: "italic",
    color: themeColor.text,
    textAlign: "center",
  }
});
