
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA9XRsI9dAvCyjjB7QX-WxIRXsMXDhZq30",
  authDomain: "peers-support.firebaseapp.com",
  projectId: "peers-support",
  storageBucket: "peers-support.firebasestorage.app",
  messagingSenderId: "441955285477",
  appId: "1:441955285477:web:a52b5b886f00c435d2970c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);