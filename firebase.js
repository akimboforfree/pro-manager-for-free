// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js"; // Latest version as of November 2025
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAc2lgqmAAxBjuik3yEOO26T6IlT3qmAQI",
  authDomain: "auto-clean-40-pro.firebaseapp.com",
  projectId: "auto-clean-40-pro",
  storageBucket: "auto-clean-40-pro.firebasestorage.app",
  messagingSenderId: "1088322147826",
  appId: "1:1088322147826:web:e08aaf7babd6c9bf68876b",
  measurementId: "G-FDWWWTCNDF",
  databaseURL: "https://auto-clean-40-pro-default-rtdb.firebaseio.com/" // Added for Realtime Database; confirm in your Firebase console if different
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

// Exemple : Créer un compte utilisateur
async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Utilisateur créé :", userCredential.user.uid);
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error.message);
  }
}

// Exemple : Connexion utilisateur
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Utilisateur connecté :", userCredential.user.uid);
  } catch (error) {
    console.error("Erreur lors de la connexion :", error.message);
  }
}

// Écouter les changements d'état d'authentification
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Utilisateur authentifié :", user.uid);
    // Exemple : Enregistrer et écouter des données pour cet utilisateur
    saveUserData(user.uid, { element1: "Valeur en temps réel", element2: 42 });
    listenToUserData(user.uid);
  } else {
    console.log("Aucun utilisateur connecté.");
  }
});

// Fonction pour enregistrer des éléments en temps réel pour un utilisateur
function saveUserData(userId, data) {
  const userRef = ref(db, `users/${userId}/elements`);
  set(userRef, data)
    .then(() => console.log("Données enregistrées avec succès !"))
    .catch((error) => console.error("Erreur lors de l'enregistrement :", error));
}

// Fonction pour écouter les changements en temps réel
function listenToUserData(userId) {
  const userRef = ref(db, `users/${userId}/elements`);
  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Données mises à jour en temps réel :", data);
    // Mets à jour ton UI ici si besoin
  });
}

// Pour tester : Décommente ces lignes et recharge ta page (attention : utilise des credentials de test)
// registerUser("test@example.com", "password123");
// loginUser("test@example.com", "password123");