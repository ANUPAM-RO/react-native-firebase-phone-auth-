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
import AuthForm from "../components/AuthForm";

const LogInScreen = ({ navigation }) => {
  const isLogin = true;
  const {
    setVerificationId,

    setAppVerifier,

    verificationId,
    verificationCode,
    setVerificationCode,
    handleVerifyCode,
    resendOtp,
  } = useHandleUserData(isLogin, navigation);
  console.log("verificationId", verificationId);

  return (
    <View style={styles.container}>
      {!!verificationId ? (
        <>
          <View style={styles}>
            <Text style={styles.otp}>
              Enter <Text style={styles}>OTP</Text>
            </Text>
          </View>

          <View style={styles}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              name="otp"
              value={verificationCode}
              placeholder="OTP"
              autoComplete="sms-otp" // android
              textContentType="oneTimeCode" // ios
              onChangeText={(number) => setVerificationCode(number)}
            />

            <View style={styles.resendEdit}>
              <Pressable onPress={resendOtp}>
                <Text style={styles.text3}> Resend OTP </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setAppVerifier(null);
                  setVerificationId(null);
                }}
              >
                <Text style={styles.text3}>Edit Details</Text>
              </Pressable>
            </View>
            {/* 
            <p>
              <u onPress={setVerificationId(null)}>Edit Details</u>
            </p> */}

            <Button
              title=" Verify"
              onPress={(e) => {
                e.preventDefault();
                handleVerifyCode();
              }}
            ></Button>
          </View>
        </>
      ) : (
        <AuthForm isLogin={true} navigation={navigation} />
      )}
    </View>
  );
};

export default LogInScreen;

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
