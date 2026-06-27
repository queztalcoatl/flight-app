import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA4PF4CYD8WFLPyE53FC9foEV1TpVELpKQ",
  authDomain: "ana-pp.firebaseapp.com",
  databaseURL: "https://ana-pp-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ana-pp",
  storageBucket: "ana-pp.firebasestorage.app",
  messagingSenderId: "724157589420",
  appId: "1:724157589420:web:c46574140ff6d1d2c9fc09"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
