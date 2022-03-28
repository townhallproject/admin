// FIREBASE METHODS
// Initialize Firebase
import firebase from 'firebase';
import { initializeApp, credential } from 'firebase-admin/app';

const PREFIX = process.env.NODE_ENV === "production" ? "REACT_APP_PROD" : "REACT_APP_TESTING";
if (process.env.NODE_ENV !== "production") {
  console.log(process.env[`${PREFIX}_PROJECT_ID`]);
}

const config = {
  apiKey: process.env[`${PREFIX}_FIREBASE_API_KEY`],
  authDomain: process.env[`${PREFIX}_FIREBASE_AUTH_DOMAIN`],
  databaseURL: process.env[`${PREFIX}_DATABASE_URL`],
  storageBucket: process.env[`${PREFIX}_STORAGE_BUCKET`],
  messagingSenderId: process.env[`${PREFIX}_MESSAGING_SENDER_ID`],
  projectId: process.env[`${PREFIX}_PROJECT_ID`],
  fbServiceAcctCreds: process.env[`${PREFIX}_FB_SERVICE_ACCT_KEY`]
};

// New Firebase init
initializeApp({
    credential: credential.cert(config.fbServiceAcctCreds),
    databaseURL: config.databaseURL
});

// OLD Firebase init
firebase.initializeApp(config);
export const firebasedb = firebase.database();
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export default firebase;