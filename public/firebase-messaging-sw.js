importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDruvFW37mi0hnc6a5soL9svsxqgxodqgM",
  authDomain: "sari-app-1859a.firebaseapp.com",
  projectId: "sari-app-1859a",
  storageBucket: "sari-app-1859a.firebasestorage.app",
  messagingSenderId: "97773308399",
  appId: "1:97773308399:web:47eb6d75f5820aa6540e1a",
  measurementId: "G-49H2WLGJSE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
