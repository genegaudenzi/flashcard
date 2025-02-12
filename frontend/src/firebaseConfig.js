// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6VdZaIiW4BWrT7ekA_qWiExusxkgCS2w",
  authDomain: "flashcard-60334.firebaseapp.com",
  projectId: "flashcard-60334",
  storageBucket: "flashcard-60334.firebasestorage.app",
  messagingSenderId: "409878544664",
  appId: "1:409878544664:web:cab1d309f82a4fc62ede6d",
  measurementId: "G-P4H2HED4LM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "./firebaseConfig"; // Import initialized Firebase

const db = getFirestore(app);

async function testFirebase() {
  try {
    const querySnapshot = await getDocs(collection(db, "flashcards"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
  }
}

testFirebase();