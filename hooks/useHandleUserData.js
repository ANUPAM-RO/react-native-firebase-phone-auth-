import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  browserLocalPersistence,
  setPersistence,
  signInWithCredential,
  signInWithPhoneNumber,
} from "@firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { useEffect, useRef, useState } from "react";
// import { isValidPhoneNumber } from "react-phone-number-input";
import { useRecoilState } from "recoil";
import { UserDetailsAtom, getRegisterObject } from "../atom/global.atom";
import {
  COLLECTIONS,
  auth,
  db,
  getDataWithFilter,
} from "../helper/firebase.helper";
import { Alert } from "react-native";
import { useRoute } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
// import SmsRetriever from "react-native-sms-retriever";

setPersistence(auth, browserLocalPersistence);
auth.setPersistence(browserLocalPersistence);

export default function useHandleUserData(isLogin = false, navigation) {
  const [userDetails, setUserDetails] = useRecoilState(UserDetailsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetailsTemp, setUserDetailsTemp] = useState(getRegisterObject());

  const recaptchaRef = useRef();
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [appVerifier, setAppVerifier] = useState("");

  const currentUser = auth.currentUser;
  // const router = useRouter();
  const uid = currentUser?.uid;
  const route = useRoute();

  useEffect(() => {
    if (
      (route.name === "Login" && !!userDetails?.userId) ||
      (route.name === "Register" && !!userDetails?.userId)
    )
      navigation.navigate("Home");
    if (!route.name === "Register" && !userDetails?.userId)
      navigation.navigate("Login");
    if (userDetails?.userId === userDetailsTemp?.userId) return;

    setUserDetailsTemp(userDetails);
    checkLoginStatus();
  }, [userDetails, userDetailsTemp]);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData !== null) {
        // User data found, user is logged in
        // You can parse and use the user data as needed
        const parsedUserData = JSON.parse(userData);
        console.log("parsedUserData", parsedUserData);
        // Dispatch a login action or update your app's state accordingly
        navigation.navigate("Home");
      } else {
        // User data not found, user is not logged in
        // Redirect to the login or registration screen as needed
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  function handleUpdate(obj = {}) {
    setUserDetailsTemp((prev) => ({ ...prev, ...obj }));
  }

  async function registerUser() {
    console.log(isLogin);
    if (isLogin) return handleSendCode();

    if (!userDetailsTemp?.firstName)
      return Alert.alert("Please Enter First Name");
    if (!userDetailsTemp?.lastName)
      return Alert.alert("Please Enter Last Name");
    if (!userDetailsTemp?.email) return Alert.alert("Please Enter Email");
    // if (!password) return Alert.alert("Please Enter Password");

    handleSendCode();
  }

  async function handleSendCode() {
    if (!userDetailsTemp?.phone)
      return Alert.alert("Please enter phone number");
    // if (!isValidPhoneNumber(userDetailsTemp?.phone))
    // return Alert.alert("Please enter a valid phone number");
    setIsLoading(true);
    console.log(userDetailsTemp?.phone);
    const userData = await getDataWithFilter(COLLECTIONS.users, [
      { field: "phone", operator: "==", value: userDetailsTemp?.phone },
    ]).catch((err) => {
      setIsLoading(false);
      console.log(err);
    });

    console.log(userData);

    if (isLogin && !userData?.[0]?.userId) {
      setIsLoading(false);
      return Alert.alert("No User Data found");
    }

    if (!isLogin && !!userData?.[0]?.userId) {
      setIsLoading(false);
      return Alert.alert("Account Already exists");
    }

    try {
      // const applicationVerifier = new RecaptchaVerifier(
      //   "sign-in-button",
      //   { size: "invisible" },
      //   auth
      // );

      const provider = new PhoneAuthProvider(auth);
      console.log(provider);
      const vId = await provider.verifyPhoneNumber(
        userDetailsTemp?.phone,
        recaptchaRef.current
      );
      console.log("vId", vId);

      // setAppVerifier(applicationVerifier);
      setVerificationId(vId);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err?.message);
      Alert.alert("err", err?.message);
    }
    // try {
    //   // Save user data to AsyncStorage
    //   await AsyncStorage.setItem(
    //     "userData",
    //     JSON.stringify(userDetailsTemp?.phone)
    //   );
    // } catch (error) {
    //   console.error("Error saving user data:", error);
    // }
  }

  async function resendOtp() {
    signInWithPhoneNumber(
      auth,
      userDetailsTemp?.phone,
      recaptchaRef.current
    ).catch((err) => console.log(err));
  }

  async function handleVerifyCode() {
    if (!verificationCode) return Alert.alert("Please enter verification Code");

    const authCredential = PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );

    setIsLoading(true);
    await signInWithCredential(auth, authCredential)
      .then(async (userCredential) => {
        if (!isLogin) {
          const userObj = {
            userId: userCredential?.user?.uid,
            firstName: userDetailsTemp?.firstName,
            lastName: userDetailsTemp?.lastName,
            email: userDetailsTemp?.email,
            phone: userDetailsTemp?.phone,
            isActive: "true",
            createdBy: "Anupam",
            updatedBy: "Anupam",
          };

          console.log("userObj", userObj);

          await setDoc(
            doc(db, COLLECTIONS.users, `${userObj?.userId}`),
            userObj
          ).catch((err) => {
            setIsLoading(false);
            console.log("Register Error:", err);
          });
        }

        if (!!userCredential) navigation.navigate("menu");
        setIsLoading(false);
        setUserDetails(getUserObject(userObj));
      })
      .catch((err) => {
        setIsLoading(false);
        if (err?.message?.includes("invalid"))
          return Alert.alert("Invalid OTP");
      });
  }

  //   try {
  //     const registered = await SmsRetriever.startSmsRetriever();
  //     if (registered) {
  //       SmsRetriever.addSmsListener((event) => {
  //         const message = event.message;
  //         const otpCode = extractOtpFromMessage(message);
  //         if (otpCode) {
  //           setVerificationCode(otpCode);
  //         }
  //         // Now you can process the retrieved message
  //         console.log("Retrieved SMS message:", message);
  //         // Do something with the message, like extracting OTP codes
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error starting SMS retriever:", error);
  //   }
  // }
  // const extractOtpFromMessage = (message) => {
  //   const otp = /(\d{4})/g.exec(message)[1];
  //   // Implement your OTP extraction logic here
  //   // You might use regular expressions or other parsing methods
  //   return otp; // Example OTP
  // };

  return {
    userDetailsTemp,
    handleUpdate,
    handleVerifyCode,
    registerUser,
    setVerificationId,
    verificationId,
    verificationCode,
    setVerificationCode,

    appVerifier,
    setAppVerifier,
    password,
    setPassword,
    resendOtp,
    handleSendCode,
    // startSmsRetrieval,
    recaptchaRef,
  };
}
