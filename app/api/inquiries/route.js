// app/api/inquiries/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, getDocs, query, where, doc, 
  addDoc, updateDoc, orderBy, serverTimestamp, 
  limit 
} from 'firebase/firestore';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicID = searchParams.get('clinicID');
    const inquiryId = searchParams.get('inquiryId');

    // 1. Fetching ALL conversations for the sidebar
    if (clinicID && !inquiryId) {
      const q = query(
        collection(db, "inquiries"),
        where("clinicID", "==", clinicID),
        orderBy("lastUpdatedAt", "desc")
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return NextResponse.json({ success: true, data });
    }

    // 2. Fetching MESSAGES for a specific conversation
    if (inquiryId) {
      const q = query(
        collection(db, "inquiries", inquiryId, "messages"),
        orderBy("createdAt", "asc")
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { inquiryId, text, sender, clinicID } = await req.json();

    // 1. Add the new message to the sub-collection
    const messageRef = collection(db, "inquiries", inquiryId, "messages");
    await addDoc(messageRef, {
      text,
      sender, // 'clinic'
      createdAt: serverTimestamp(),
    });

    // 2. Update the parent inquiry document for the sidebar preview
    const inquiryRef = doc(db, "inquiries", inquiryId);
    await updateDoc(inquiryRef, {
      lastMessage: text,
      lastUpdatedAt: serverTimestamp(),
      unreadByClinic: false // Clinic just replied, so it's read
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}