import React from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import useHandleUserData from "../hooks/useHandleUserData";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { app } from "../helper/firebase.helper";
import PhoneInput from "react-native-phone-number-input/lib";
import { TouchableOpacity } from "react-native";

const AuthForm = ({ isLogin = false, navigation }) => {
  const { userDetailsTemp, handleUpdate, registerUser, recaptchaRef } =
    useHandleUserData(isLogin, navigation);
  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaRef}
        firebaseConfig={app.options}
        style={{ opacity: 0 }}
        // attemptInvisibleVerification={true}
      />
      {isLogin ? (
        <Text style={styles.text}>Log In</Text>
      ) : (
        <Text style={styles.text}>Create your Account </Text>
      )}
      <View style={styles.loginForm}>
        {!isLogin && (
          <>
            <TextInput
              style={styles.input}
              name="firstName"
              value={userDetailsTemp?.firstName}
              placeholder="First Name"
              onChangeText={(value) => handleUpdate({ firstName: value })}
            />
            <TextInput
              style={styles.input}
              name="lastName"
              value={userDetailsTemp?.lastName}
              placeholder="Last Name"
              onChangeText={(value) => handleUpdate({ lastName: value })}
            />
            <TextInput
              style={styles.input}
              name="email"
              value={userDetailsTemp?.email}
              placeholder="Email Id"
              onChangeText={(value) => handleUpdate({ email: value })}
            />
          </>
        )}
        <PhoneInput
          textContainerStyle={styles.input}
          containerStyle={styles.phoneInput}
          value={userDetailsTemp?.phone}
          defaultCode="IN"
          layout="first"
          onChangeFormattedText={(value) => handleUpdate({ phone: value })}
          withShadow
          autoFocus
        />

        <Button
          title={!isLogin ? "Sign Up" : "Login"}
          onPress={(e) => {
            e.preventDefault();
            registerUser();
          }}
        ></Button>
      </View>
      {isLogin ? (
        <View style={styles.text1}>
          <Text>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.text2}>REGISTER HERE</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.text1}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.text2}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AuthForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7e6df",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "8%",
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  phoneInput: {
    width: "100%",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderColor: "#F7E6DF",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: { fontSize: 22, textAlign: "center", paddingBottom: 15 },
  text1: { paddingTop: 15, display: "flex", flexDirection: "row" },
  text2: { fontWeight: "bold", paddingLeft: 5 },
  otp: { fontSize: 22, paddingBottom: 10, textAlign: "center" },
  resendEdit: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  text3: { textDecorationLine: "underline" },
});
