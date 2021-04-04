import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import axios from './axios/axios';
const firebaseConfig = {
    apiKey: "AIzaSyCFElhOLLq6-V8mZO54dgGLsUaEoB8TvS0",
    authDomain: "whatsapp-mern-35259.firebaseapp.com",
    projectId: "whatsapp-mern-35259",
    storageBucket: "whatsapp-mern-35259.appspot.com",
    messagingSenderId: "475357521730",
    appId: "1:475357521730:web:b3ab87a49022d23f678adb",
    measurementId: "G-WFBV0R4LED"
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) {
        return;
    }
    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();

    if (!snapShot.exists) {
        const { displayName, email, uid, photoURL } = userAuth;
        const createdAt = new Date();

        try {
            await userRef.set({
                displayName,
                uid,
                photoURL,
                email,
                createdAt,
                ...additionalData
            })

            if(userAuth.providerData[0].providerId === 'google.com'){
                axios.post('/new/conversation', {
                    _id: uid,
                    chatName: displayName
                });
            }
            

        } catch (error) {
            console.log('error while creating user', error.message);
        }
    }
    return userRef;
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;