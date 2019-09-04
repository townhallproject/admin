// FIREBASE METHODS
// Initialize Firebase
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const PREFIX = process.env.NODE_ENV === "production" ? "REACT_APP_PROD" : "REACT_APP_TESTING";
const config = {
  apiKey: process.env[`${PREFIX}_FIREBASE_API_KEY`],
  authDomain: process.env[`${PREFIX}_FIREBASE_AUTH_DOMAIN`],
  databaseURL: process.env[`${PREFIX}_DATABASE_URL`],
  storageBucket: process.env[`${PREFIX}_STORAGE_BUCKET`],
  messagingSenderId: process.env[`${PREFIX}_MESSAGING_SENDER_ID`],
};

firebase.initializeApp(config);
export const firebasedb = firebase.database();
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;