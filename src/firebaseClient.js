import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDkwf1IzcGsjS6K5RkhBTA_oQ1QGRXyWQA",
  authDomain: "livrr-boutique.firebaseapp.com",
  databaseURL: "https://livrr-boutique-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "livrr-boutique",
  storageBucket: "livrr-boutique.firebasestorage.app",
  messagingSenderId: "960089639102",
  appId: "1:960089639102:web:3b0ae9c9c401d39885f6ef"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);