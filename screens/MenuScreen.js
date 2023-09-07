import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

function MenuScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in, set the user in state
        setUser(user);
        try {
          // Store the user's UID in AsyncStorage for persistence
          await AsyncStorage.setItem("userUid", user.uid);
        } catch (error) {
          console.error("Error storing user UID: ", error);
        }
      } else {
        // User is signed out, clear the user from state
        setUser(null);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <View>
      {user ? (
        <Text>User is logged in with UID: {user.uid}</Text>
      ) : (
        <Text>User is not logged in</Text>
      )}
      {/* Render your app's content based on authentication state */}
    </View>
  );
}

export default MenuScreen;
