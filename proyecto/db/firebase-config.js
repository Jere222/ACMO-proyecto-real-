import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDIWp-SvmNdmBy2P1okFz-c6vk1jGq10hY",
  authDomain: "acmo-47c97.firebaseapp.com",
  projectId: "acmo-47c97",
  storageBucket: "acmo-47c97.appspot.com",
  messagingSenderId: "309022617161",
  appId: "1:309022617161:web:9717dfcc52c4d1ec441998"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;