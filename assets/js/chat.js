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
let unsubscribe = null;

// Cek login
onAuthStateChanged(auth, (u) => {
  if (!u) {
    window.location.href = "index.html";
    return;
  }

  user = u;
  username.textContent = u.displayName || "User";
  photo.src = u.photoURL || "assets/img/default-avatar.png";

  if (unsubscribe) unsubscribe();
  loadMessages();
});

// Ambil pesan realtime
function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));

  unsubscribe = onSnapshot(q, (snapshot) => {
    messages.innerHTML = "";

    snapshot.forEach((doc) => {
      const m = doc.data();
      const me = m.uid === user.uid;

      messages.innerHTML += `
        <div class="row ${me ? "me" : "other"}">
          ${!me ? `<img class="avatar" src="${m.photoURL || "assets/img/default-avatar.png"}">` : ""}
          <div class="bubble">
            ${!me ? `<div class="sender">${m.name || "User"}</div>` : ""}
            <div>${m.text}</div>
          </div>
        </div>`;
    });

    messages.scrollTop = messages.scrollHeight;
  });
}

// Kirim pesan
async function sendMessage() {
  const isi = text.value.trim();
  if (!isi || !user) return;

  try {
    await addDoc(collection(db, "messages"), {
      uid: user.uid,
      name: user.displayName,
      photoURL: user.photoURL,
      text: isi,
      timestamp: Timestamp.now()
    });

    text.value = "";
  } catch (err) {
    alert("Gagal mengirim: " + err.message);
    console.error(err);
  }
}

send.addEventListener("click", sendMessage);

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
