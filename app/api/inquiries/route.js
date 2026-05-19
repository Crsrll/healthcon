import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection, query, where, getDocs,
  doc, addDoc, updateDoc,
  orderBy, serverTimestamp, limit
} from "firebase/firestore";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clinicID  = searchParams.get("clinicID");
  const inquiryId = searchParams.get("inquiryId");
  const patientID = searchParams.get("patientID");

  // 1. Messages for a specific inquiry
  if (inquiryId) {
    try {
      const messagesRef = collection(db, "inquiries", inquiryId, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"));
      const snap = await getDocs(q);
      const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return NextResponse.json({ success: true, data: messages });
    } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
  }

  // 2. Find ONE inquiry between a patient and a specific clinic
  if (patientID && clinicID) {
    try {
      const q = query(
        collection(db, "inquiries"),
        where("patientID", "==", patientID),
        where("clinicID",  "==", clinicID),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) return NextResponse.json({ success: true, inquiry: null });
      const d = snap.docs[0];
      return NextResponse.json({ success: true, inquiry: { id: d.id, ...d.data() } });
    } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
  }

  // 3. All inquiries for a clinic (sidebar)
  if (clinicID) {
    try {
      const q = query(
        collection(db, "inquiries"),
        where("clinicID", "==", clinicID),
        orderBy("updatedAt", "desc")
      );
      const snap = await getDocs(q);
      const inquiries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return NextResponse.json({ success: true, data: inquiries });
    } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
  }

  // 4. All inquiries for a patient
  if (patientID) {
    try {
      const q = query(
        collection(db, "inquiries"),
        where("patientID", "==", patientID),
        orderBy("updatedAt", "desc")
      );
      const snap = await getDocs(q);
      const inquiries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return NextResponse.json({ success: true, data: inquiries });
    } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Missing params" }, { status: 400 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    // Create new inquiry + first message
    if (action === "create") {
      const { clinicID, clinicName, patientID, patientName, firstMessage } = body;
      if (!clinicID || !patientID || !firstMessage) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }
      const inquiryRef = await addDoc(collection(db, "inquiries"), {
        clinicID,
        clinicName,
        patientID,
        patientName,
        lastMessage: firstMessage,
        unreadByClinic: true,
        unreadByPatient: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await addDoc(collection(db, "inquiries", inquiryRef.id, "messages"), {
        text: firstMessage,
        sender: "patient",
        seen: false,
        createdAt: serverTimestamp(),
      });
      return NextResponse.json({ success: true, inquiryId: inquiryRef.id });
    }

    // Send message to existing inquiry
    if (action === "message") {
      const { inquiryId, text, sender } = body;
      if (!inquiryId || !text || !sender) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }
      await addDoc(collection(db, "inquiries", inquiryId, "messages"), {
        text,
        sender,
        seen: false,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "inquiries", inquiryId), {
        lastMessage: text,
        updatedAt: serverTimestamp(),
        unreadByClinic:  sender === "patient",
        unreadByPatient: sender === "clinic",
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}