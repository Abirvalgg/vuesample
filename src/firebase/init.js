 import firebase from 'firebase'
 import firestore from 'firebase/firestore'

 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyB0dPPiisFPFCk1E-uXJAszplPMWSth8C4",
    authDomain: "chat-97442.firebaseapp.com",
    databaseURL: "https://chat-97442.firebaseio.com",
    projectId: "chat-97442",
    storageBucket: "chat-97442.appspot.com",
    messagingSenderId: "208301855577"
  };
  const firebaseApp = firebase.initializeApp(config);
  firebaseApp.firestore().settings({ timestampsInSnapshots: true })

  export default firebaseApp.firestore()

  