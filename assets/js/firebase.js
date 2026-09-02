import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "API_KEY_KAMU",
  authDomain: "chat-c639a.firebaseapp.com",
  projectId: "chat-c639a",
  storageBucket: "chat-c639a.firebasestorage.app",
  messagingSenderId: "1012375212670",
  appId: "1:1012375212670:web:7aca174953055b1c62be2f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
