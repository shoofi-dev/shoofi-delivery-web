import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDruvFW37mi0hnc6a5soL9svsxqgxodqgM",
    authDomain: "sari-app-1859a.firebaseapp.com",
    projectId: "sari-app-1859a",
    storageBucket: "sari-app-1859a.firebasestorage.app",
    messagingSenderId: "97773308399",
    appId: "1:97773308399:web:47eb6d75f5820aa6540e1a",
    measurementId: "G-49H2WLGJSE"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BPtN4f-Ilagn3-nIjsN6D52smAFuTF5j3cJJgLyOfSzLr-HWyv0epvdZutTelPCNVW9rx4v53240PiXg_8P58wo",
    });
    return token;
  } catch (err) {
    alert("Permission denied:   ---  " + err);
    console.error("Permission denied:", err);
    return null;
  }
};

export default messaging;
