import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};

console.log("Admin Project ID:", process.env.FIREBASE_ADMIN_PROJECT_ID);
console.log("Admin Client Email:", process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
console.log("Private Key exists:", !!process.env.FIREBASE_ADMIN_PRIVATE_KEY);

const adminApp = getApps().find(a => a.name === "admin") 
  ?? initializeApp(firebaseAdminConfig, "admin");

export const db = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);