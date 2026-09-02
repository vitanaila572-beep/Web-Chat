import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const username = document.getElementById("username");
const photo = document.getElementById("photo");
const messages = document.getElementById("messages");
const text = document.getElementById("text");
const send = document.getElementById("send");

let user = null;
let unsub = null;

onAuthStateChanged(auth, (u) => {
  if (!u) {
    location.href = "index.html";
    return;
  }

  user = u;
  username.textContent = u.displayName;
  photo.src = u.photoURL || "assets/img/default-avatar.png";

  if (unsub) unsub();
  loadMessages();
});

function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));

  unsub = onSnapshot(q, (snap) => {
    messages.innerHTML = "";

    snap.forEach((doc) => {
      const m = doc.data();
      const me = m.uid === user.uid;

      messages.innerHTML += `
        <div class="row ${me ? "me" : "other"}">
          ${!me ? `<img class="avatar" src="${m.photoURL || "assets/img/default-avatar.png"}">` : ""}
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
  if (!isi || !user) return;

  try {
    await addDoc(collection(db, "messages"), {
      uid: user.uid,
      name: user.displayName,
      photoURL: user.photoURL || "",
      text: isi,
      timestamp: Timestamp.now()
    });

    text.value = "";
  } catch (e) {
    console.error(e);
    alert("Gagal mengirim pesan");
  }
}

send.addEventListener("click", sendMessage);

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
