import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection, query, where, getDocs,
  doc, updateDoc
} from "firebase/firestore";

export async function PATCH(req) {
  try {
    const { inquiryId, role } = await req.json();
    if (!inquiryId || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const field = role === "patient" ? "unreadByPatient" : "unreadByClinic";
    await updateDoc(doc(db, "inquiries", inquiryId), { [field]: false });

    // Mark all messages from the other sender as seen
    const otherSender = role === "patient" ? "clinic" : "patient";
    const messagesRef = collection(db, "inquiries", inquiryId, "messages");
    const q = query(
      messagesRef,
      where("sender", "==", otherSender),
      where("seen", "==", false)
    );
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map(d => updateDoc(d.ref, { seen: true })));

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}