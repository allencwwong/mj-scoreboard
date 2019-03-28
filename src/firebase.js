import firebase from "firebase";

// Initialize Firebase
var config = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "mj-counter-app.firebaseapp.com",
  databaseURL: "https://mj-counter-app.firebaseio.com",
  projectId: "mj-counter-app",
  storageBucket: "",
  messagingSenderId: "546529540601"
};
firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
