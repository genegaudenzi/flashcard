import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "flashcard-60334.firebaseapp.com",
  projectId: "flashcard-60334",
  storageBucket: "flashcard-60334.appspot.com",
  messagingSenderId: "409878544664",
  appId: "1:409878544664:web:cab1d309f82a4fc62ede6d",
  measurementId: "G-P4H2HED4LM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google Sign-In Successful:", result.user);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    return { success: false, error: error.message };
  }
};

// 🔹 Updated Logout Function to Handle Google Users
const logoutUser = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      console.log("Logging out user:", user.email);
    }

    await signOut(auth);
    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};

// Other authentication functions
const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Registration Error:", error.message);
    return { success: false, error: error.message };
  }
};

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const authStateListener = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Export Firebase instances and functions
export { app, auth, db, googleSignIn, registerUser, loginUser, logoutUser, authStateListener };
