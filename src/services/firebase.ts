// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlU79FltsUkY_ErJ-XXE25IrEjbUteVTY",
  authDomain: "agenda-citas-dd097.firebaseapp.com",
  projectId: "agenda-citas-dd097",
  storageBucket: "agenda-citas-dd097.firebasestorage.app",
  messagingSenderId: "216717229724",
  appId: "1:216717229724:web:7152c274a34f4ae5d67759",
  measurementId: "G-V8M7MM17KX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional for React Native)
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.log('Analytics not available in React Native environment');
}

export { auth, analytics };
export default app;
