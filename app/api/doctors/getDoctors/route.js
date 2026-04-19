// app/api/doctors/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  orderBy 
} from 'firebase/firestore';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicID = searchParams.get('clinicID');

    if (!clinicID) {
      return NextResponse.json({ error: 'clinicID is required' }, { status: 400 });
    }

    const q = query(collection(db, 'doctors'), where('clinicID', '==', clinicID));
    const snap = await getDocs(q);
    
    const doctors = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, data: doctors });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, name, specialty, availability, clinicID, available } = body;

    if (id) {
      // --- UPDATE EXISTING DOCTOR ---
      const docRef = doc(db, 'doctors', id);
      await updateDoc(docRef, {
        name,
        specialty,
        availability, // Nested: { days: [], startTime: "", endTime: "" }
        available,
        updatedAt: new Date().toISOString()
      });
      return NextResponse.json({ success: true, id });
    } else {
      // --- CREATE NEW DOCTOR (Custom ID logic: doc1, doc2...) ---
      const snapshot = await getDocs(collection(db, 'doctors'));
      const nextNum = snapshot.size + 1;
      const customId = `doc${nextNum}`;

      const newDoctor = {
        name,
        specialty,
        availability,
        clinicID,
        available: true,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'doctors', customId), newDoctor);
      return NextResponse.json({ success: true, id: customId });
    }
  } catch (err) {
    console.error("POST /api/doctors error:", err);
    return NextResponse.json({ error: 'Failed to save doctor' }, { status: 500 });
  }
}