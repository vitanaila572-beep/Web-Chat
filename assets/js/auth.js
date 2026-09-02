// assets/js/auth.js

import { app } from "./firebase.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// LOGIN
export async function loginGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  await setDoc(doc(db, "users", user.uid), {
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    lastLogin: serverTimestamp()
  }, { merge: true });

  location.href = "chat.html";
}

// LOGOUT
export function logout() {
  signOut(auth).then(() => {
    location.href = "index.html";
  });
}

// CEK STATUS LOGIN
export function checkLogin(callback) {
  onAuthStateChanged(auth, callback);
}
