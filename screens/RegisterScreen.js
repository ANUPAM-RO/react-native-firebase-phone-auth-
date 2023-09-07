import React from "react";
import { StyleSheet, View } from "react-native";
import AuthForm from "../components/AuthForm";

const RegisterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <AuthForm isLogin={false} navigation={navigation} />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7e6df",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "8%",
  },
});
