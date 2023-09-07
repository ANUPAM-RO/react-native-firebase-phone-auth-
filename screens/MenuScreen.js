import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "react-native";

function MenuScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>User is logged in </Text>
    </View>
  );
}

export default MenuScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7e6df",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
