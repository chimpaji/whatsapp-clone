import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyCNwOoZHeNEP-0SjZf2bVVprqHsb-Fq0Ig",
  authDomain: "kieng-ddb81.firebaseapp.com",
  databaseURL: "https://kieng-ddb81.firebaseio.com",
  projectId: "kieng-ddb81",
  storageBucket: "kieng-ddb81.appspot.com",
  messagingSenderId: "756304258143",
  appId: "1:756304258143:web:2b658d3a6d29479d2a27ea",
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp;
export const db = firebase.firestore();
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
