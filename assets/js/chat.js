// assets/js/chat.js

import { app } from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

const username = document.getElementById("username");
const photo = document.getElementById("photo");
const messages = document.getElementById("messages");
const text = document.getElementById("text");
const send = document.getElementById("send");

let user = null;
let unsubscribe = null;

// Cek login
onAuthStateChanged(auth, (u) => {
  if (!u) {
    window.location.href = "index.html";
    return;
  }

  user = u;

  username.textContent = user.displayName || "User";
  photo.src = user.photoURL || "assets/img/default-avatar.png";

  if (unsubscribe) unsubscribe();
  loadMessages();
});

// Ambil semua pesan grup secara realtime
function loadMessages() {
  const q = query(
    collection(db, "messages"),
    orderBy("timestamp", "asc")
  );

  unsubscribe = onSnapshot(q, (snapshot) => {
    messages.innerHTML = "";

    snapshot.forEach((doc) => {
      const m = doc.data();
      const isMe = m.uid === user.uid;

      const div = document.createElement("div");
      div.className = `row ${isMe ? "me" : "other"}`;

      div.innerHTML = `
        ${!isMe ? `<img class="avatar" src="${m.photoURL || "assets/img/default-avatar.png"}">` : ""}
        <div class="bubble">
          ${!isMe ? `<div class="sender">${m.name}</div>` : ""}
          <div>${m.text}</div>
        </div>
      `;

      messages.appendChild(div);
    });

    messages.scrollTop = messages.scrollHeight;
  });
}

// Kirim pesan ke koleksi messages
async function sendMessage() {
  const isi = text.value.trim();
  if (!isi || !user) return;

  await addDoc(collection(db, "messages"), {
    uid: user.uid,
    name: user.displayName,
    photoURL: user.photoURL,
    text: isi,
    timestamp: serverTimestamp()
  });

  text.value = "";
}

send.addEventListener("click", sendMessage);

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
