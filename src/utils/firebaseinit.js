// FIREBASE METHODS
// Initialize Firebase
import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyCXyjAOvBKDEX5pckTwuI7LODWKNlL21gc',
  authDomain: 'townhallproject-86312.firebaseapp.com',
  databaseURL: 'https://townhallproject-86312.firebaseio.com',
  storageBucket: 'townhallproject-86312.appspot.com',
  messagingSenderId: '208752196071',
};

firebase.initializeApp(config);
export const firebasedb = firebase.database();
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;