import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Elements
const loginBox = document.getElementById("login-box");
const appBox = document.getElementById("app");
const noteBox = document.getElementById("note");

document.getElementById("login").onclick = async () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  await signInWithEmailAndPassword(auth, email, pass);
};

document.getElementById("google-login").onclick = async () => {
  await signInWithPopup(auth, provider);
};

document.getElementById("logout").onclick = () => signOut(auth);

noteBox.oninput = async () => {
  if (auth.currentUser) {
    const ref = doc(db, "users", auth.currentUser.uid);
    await setDoc(ref, { text: noteBox.value });
  }
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginBox.style.display = "none";
    appBox.style.display = "block";

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      noteBox.value = snap.data().text || "";
    }
  } else {
    loginBox.style.display = "block";
    appBox.style.display = "none";
  }
});
