import { NextResponse } from "next/server";
import { collection, addDoc, updateDoc, doc, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// GET - Fetch notifications (called once)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId");
    
    const q = query(
      collection(db, "notifications"),
      where("adminId", "in", [adminId, "all"]),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return NextResponse.json({ success: true, data: notifications });
  } catch (err) {
    console.error("GET /api/admin-notifications error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - Create notification
export async function POST(request) {
  try {
    const body = await request.json();
    const { adminId, type, title, body: message, linkTo, targetId, targetType } = body;
    
    const newNotification = {
      adminId: adminId || "all",
      type,
      title,
      body: message,
      linkTo: linkTo || null,
      targetId: targetId || null,
      targetType: targetType || null,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    const docRef = await addDoc(collection(db, "notifications"), newNotification);
    
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("POST /api/admin-notifications error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - Mark as read
export async function PUT(request) {
  try {
    const { notificationId } = await request.json();
    
    if (notificationId) {
      await updateDoc(doc(db, "notifications", notificationId), { read: true });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/admin-notifications error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}