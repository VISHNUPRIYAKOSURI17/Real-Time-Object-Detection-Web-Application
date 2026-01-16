// src/firebase.jsx
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, collection, addDoc, getDocs } from "firebase/firestore";
import { getStorage, connectStorageEmulator, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase config (your project, no billing needed)
const firebaseConfig = {
  apiKey: "AIzaSyA0j8XqRnsl9CPNmRx0Ib0zRPUlve5FmgE",
  authDomain: "project-54235.firebaseapp.com",
  projectId: "project-54235",
  storageBucket: "project-54235.appspot.com",
  messagingSenderId: "457482545426",
  appId: "1:457482545426:web:85a36eded05ec097aeebcb",
  measurementId: "G-GZHBVG06CT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Connect to Emulators if on localhost
if (window.location.hostname === "localhost") {
  console.log("Connecting to Firebase Emulators");

  connectFirestoreEmulator(firestore, "localhost", 8090);
  connectStorageEmulator(storage, "localhost", 9199);
}

export { firestore, storage, collection, addDoc, getDocs, ref, uploadBytes, getDownloadURL };
