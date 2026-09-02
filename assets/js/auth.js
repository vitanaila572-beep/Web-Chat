
import { auth, db } from "./firebase.js";

import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
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

// LOGIN
export async function loginGoogle() {
  await signInWithRedirect(auth, provider);
}

// HASIL LOGIN
getRedirectResult(auth)
  .then(async (result) => {
    if (!result) return;

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

    window.location.href = "chat.html";
  })
  .catch((err) => {
    console.error(err);
    alert("Login gagal: " + err.message);
  });

// LOGOUT
export async function logout() {
  await signOut(auth);
  window.location.href = "index.html";
}

// CEK LOGIN
export function checkLogin(callback) {
  return onAuthStateChanged(auth, callback);
}
