// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7GXsRYWXIl27JhAV5Rg__GBKmem58dms",
  authDomain: "se3290-team26-projecta.firebaseapp.com",
  projectId: "se3290-team26-projecta",
  storageBucket: "se3290-team26-projecta.firebasestorage.app",
  messagingSenderId: "993260906003",
  appId: "1:993260906003:web:93e92f05ec621dd95141e6"
};

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);

export default firebase_app