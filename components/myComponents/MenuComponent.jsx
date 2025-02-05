import themeColor2 from "@/assets/themeColors";
import { auth } from "@/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuComponent({
  user,
  screenHeight,
  screenWidth,
  hideMenu,
  signOutHandler,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;

  // Function to handle slide-in and slide-out animations
  const toggleVisibility = () => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    } else {
      setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    // Trigger the animation on initial mount
    toggleVisibility();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 30,
        zIndex: 1,
      }}
    >
      {/* Animated View - only rendered if visible */}
      {isVisible && (
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: screenWidth * 0.75,
            height: screenHeight,
            backgroundColor: themeColor2.primary,
            padding: 20,
            zIndex: 1,
            flex: 1,
          }}
        >
          <Text style={styles.titleMenu}>Menu</Text>
          {user.email === "" ? (
            <View>
              <Text
                style={{
                  fontStyle: "italic",
                  textAlign: "center",
                  fontSize: 12,
                }}
              >
                Log in to your account to be able to purchase tickets
              </Text>
              <Link href="/login" style={styles.linkStyle} onPress={hideMenu}>
                <Text>Log in</Text>
              </Link>
              <Link href="/signUp" style={styles.linkStyle} onPress={hideMenu}>
                <Text>Sign up</Text>
              </Link>
            </View>
          ) : (
            <View>
              <Link
                href="/newEvent"
                style={styles.linkStyle}
                onPress={hideMenu}
              >
                <Text>Create event</Text>
              </Link>
              <Link href="/profile" style={styles.linkStyle} onPress={hideMenu}>
                <Text>View profile</Text>
              </Link>
              <TouchableOpacity
                style={styles.linkStyle}
                onPress={async () => {
                  auth.signOut();
                  await AsyncStorage.removeItem("@user");
                  await AsyncStorage.removeItem("@token");
                  signOutHandler();
                  hideMenu();
                }}
              >
                <Text style={styles.buttonText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.filtersText}>Filters</Text>
          <TouchableOpacity style={styles.linkStyle} onPress={hideMenu}>
            <Text style={styles.buttonText}>Date</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkStyle} onPress={hideMenu}>
            <Text style={styles.buttonText}>Cheapest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkStyle} onPress={hideMenu}>
            <Text style={styles.buttonText}>Most expensive</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleMenu: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  linkStyle: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 5,
    margin: 5,
    fontSize: 15,
    textAlign: "center",
    color: themeColor2.background,
  },
  filtersText: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 15,
    color: themeColor2.background,
  },
});
