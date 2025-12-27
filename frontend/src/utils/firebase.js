// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "clone-7ab08.firebaseapp.com",
  projectId: "clone-7ab08",
  storageBucket: "clone-7ab08.firebasestorage.app",
  messagingSenderId: "1046801953260",
  appId: "1:1046801953260:web:b929d7090fe33bdaff90c9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
