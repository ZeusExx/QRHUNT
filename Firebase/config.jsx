import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Adicionei isso para o Firebase Storage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAspADeHSl7L2NmnYwSKb2I13anIuS0FjA",
  authDomain: "qrhunt-001.firebaseapp.com",
  projectId: "qrhunt-001",
  storageBucket: "qrhunt-001.appspot.com",
  messagingSenderId: "337222098490",
  appId: "1:337222098490:web:0f0334dc10ac6b778a9f03",
  measurementId: "G-RGM86B2SKX"
}; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Check if Auth has already been initialized
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  if (e.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw e;  // Re-throw other errors
  }
}

const db = getFirestore(app);
const storage = getStorage(app); // Inicializando o Storage

export { auth, db, storage }; // Exportando o Storage também
