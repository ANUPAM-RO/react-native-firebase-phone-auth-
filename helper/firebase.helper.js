// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "@firebase/app";
import { getReactNativePersistence, initializeAuth } from "@firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "@firebase/firestore";
import { getStorage } from "@firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBp7v37kDIJaP9pm92MvQdTznJtQMmHQJY",
  authDomain: "react-routing-4b6cb.firebaseapp.com",
  databaseURL: "https://react-routing-4b6cb-default-rtdb.firebaseio.com",
  projectId: "react-routing-4b6cb",
  storageBucket: "react-routing-4b6cb.appspot.com",
  messagingSenderId: "505291103111",
  appId: "1:505291103111:web:9f4be9013ef682b82c1122",
  measurementId: "G-WZM1BSXHDD",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// export const auth = getAuth(app);

// Initialize Firebase Auth with AsyncStorage for persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
// const messaging = !!app ? getMessaging(app) : null;
export const storage = getStorage();

export const COLLECTIONS = {
  users: "users",
};

export async function getDataWithFilter(
  collectionName = "",
  filters = [],
  docLimit = 10
) {
  try {
    const dataRef = collection(db, collectionName);
    let q = query(dataRef);

    // Add filters to the query
    filters.forEach((filter) => {
      const { field, operator, value } = filter;
      q = query(q, where(field, operator, value), limit(docLimit));
    });

    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    const data = [];

    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });

    return data;
  } catch (error) {
    console.error("Error getting data:", error);
    throw error;
  }
}
