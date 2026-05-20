import { NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SETTINGS_DOC_ID = "platform_settings";

// GET settings
export async function GET() {
  try {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return NextResponse.json({ success: true, data: docSnap.data() });
    } else {
      // Return default settings
      return NextResponse.json({ 
        success: true, 
        data: {
          emailNotifs: true,
          autoApprove: false,
          maintenance: false,
          maxBookings: 20,
          commissionPct: 5,
        }
      });
    }
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - Update settings
export async function PUT(request) {
  try {
    const body = await request.json();
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    
    await setDoc(docRef, {
      ...body,
      updatedAt: new Date().toISOString(),
    });
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/settings error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - Reset settings to default
export async function DELETE() {
  try {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    const defaultSettings = {
      emailNotifs: true,
      autoApprove: false,
      maintenance: false,
      maxBookings: 20,
      commissionPct: 5,
      updatedAt: new Date().toISOString(),
    };
    
    await setDoc(docRef, defaultSettings);
    
    return NextResponse.json({ success: true, data: defaultSettings });
  } catch (err) {
    console.error("DELETE /api/settings error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}