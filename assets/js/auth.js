import { auth, db } from "./firebase.js";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});

// LOGIN GOOGLE
export async function loginGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp()
      },
      { merge: true }
    );

    window.location.replace("chat.html");
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    alert(error.message);
  }
}

// LOGOUT
export async function logout() {
  try {
    await signOut(auth);
    window.location.replace("index.html");
  } catch (error) {
    console.error(error);
  }
}

// CEK STATUS LOGIN
export function checkLogin(callback) {
  return onAuthStateChanged(auth, callback);
}
