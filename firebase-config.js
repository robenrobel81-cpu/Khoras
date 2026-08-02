// ============================================================
// حط هنا بيانات مشروع Firebase بتاعك
// (من: Firebase Console → ⚙️ Project settings → عام/General
//  → انزل لتحت لحد "Your apps" → هتلاقي الكائن ده)
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyAo7clawrdeQRTi2Lr5BqLgP36WjvjdFKc",
  authDomain: "khoras-45e1e.firebaseapp.com",
  projectId: "khoras-45e1e",
  storageBucket: "khoras-45e1e.firebasestorage.app",
  messagingSenderId: "312657988798",
  appId: "1:312657988798:web:d3834d4f1a84cfcded62ef"
};

// من: ⚙️ Project settings → Cloud Messaging → Web Push certificates
// (لو مش موجود، دوس "Generate key pair")
const FIREBASE_VAPID_KEY = "BJ6ZTUe1d4z43CR8OLgmefn3ujz8CskF-iP1UcXrEoQlZ8B1w6Iq27_magdbhyhUa3otOerTGt6EidrpMTWYpcE";
