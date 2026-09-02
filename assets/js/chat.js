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
  Timestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

const username = document.getElementById("username");
const photo = document.getElementById("photo");
const messages = document.getElementById("messages");
const text = document.getElementById("text");
const send = document.getElementById("send");

let user = null;

onAuthStateChanged(auth, (u) => {
  if (!u) return location.href = "index.html";

  user = u;
  username.textContent = u.displayName;
  photo.src = u.photoURL;

  loadMessages();
});

function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("timestamp"));

  onSnapshot(q, (snap) => {
    messages.innerHTML = "";

    snap.forEach((d) => {
      const m = d.data();
      const me = m.uid === user.uid;

      messages.innerHTML += `
        <div class="row ${me ? "me" : "other"}">
          ${!me ? `<img class="avatar" src="${m.photoURL}">` : ""}
          <div class="bubble">
            ${!me ? `<div class="sender">${m.name}</div>` : ""}
            <div>${m.text}</div>
          </div>
        </div>`;
    });

    messages.scrollTop = messages.scrollHeight;
  });
}

async function sendMessage() {
  const isi = text.value.trim();
  if (!isi) return;

  await addDoc(collection(db, "messages"), {
    uid: user.uid,
    name: user.displayName,
    photoURL: user.photoURL,
    text: isi,
    timestamp: Timestamp.now()
  });

  text.value = "";
}

send.onclick = sendMessage;
text.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
