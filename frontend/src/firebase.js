import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// Web app's Firebase configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyCAXXcdowuMZMCHxTsSkGDxJQZ2GzEw2aY",
  authDomain: "lasthope-55af5.firebaseapp.com",
  projectId: "lasthope-55af5",
  storageBucket: "lasthope-55af5.firebasestorage.app",
  messagingSenderId: "882099681522",
  appId: "1:882099681522:web:7f1edf70d35291c36f786b",
  measurementId: "G-MBYWZCYTZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Custom parameters for Google OAuth prompt
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // Analytics optional
  }
}

export { app, auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, analytics };
