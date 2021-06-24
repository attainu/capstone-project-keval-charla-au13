// import firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// const myApp = firebase.initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig);

// export const googleAuthProvider = new firebase.auth.googleAuthProvider();

// export const auth = myApp.auth();
export const auth = firebase.auth();

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();


