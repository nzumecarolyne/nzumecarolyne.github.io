// ============================================================
//  🔥 FIREBASE CONFIGURATION - YOUR ACTUAL CREDENTIALS
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    push, 
    onChildAdded, 
    get, 
    set, 
    update, 
    onValue,
    remove,
    child
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDVtR2HiZL6wtsiqibj0PYzXD5vnsHd0pc",
    authDomain: "nzume-carolyne.firebaseapp.com",
    projectId: "nzume-carolyne",
    storageBucket: "nzume-carolyne.firebasestorage.app",
    messagingSenderId: "110376463201",
    appId: "1:110376463201:web:898d6efd6124d7eff13320",
    measurementId: "G-X6988WHKP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Expose everything globally
window.db = db;
window.ref = ref;
window.push = push;
window.onChildAdded = onChildAdded;
window.get = get;
window.set = set;
window.update = update;
window.onValue = onValue;
window.remove = remove;
window.child = child;

console.log("🔥 Firebase initialized successfully!");
console.log("📁 Project:", firebaseConfig.projectId);

export { db, ref, push, onChildAdded, get, set, update, onValue, remove, child };