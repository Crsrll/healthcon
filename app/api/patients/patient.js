import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function createPatientDocument(uid, form) {
  return await addDoc(collection(db, "patients"), {
    uid,
    firstName: form.firstName,
    middleInitial: form.middleInitial,
    lastName: form.lastName,
    phone: form.phone,
    email: form.email,
    role: "patient",
    createdAt: serverTimestamp(),
  });
}