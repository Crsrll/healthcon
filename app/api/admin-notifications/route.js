import { NextResponse } from "next/server";
import { collection, addDoc, getDocs, query, where, orderBy, limit, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// GET admin notifications
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId");
    
    let q = query(collection(db, "adminNotifications"), orderBy("createdAt", "desc"), limit(50));
    
    if (adminId && adminId !== "all") {
      q = query(
        collection(db, "adminNotifications"), 
        where("adminId", "==", adminId), 
        orderBy("createdAt", "desc"), 
        limit(50)
      );
    }
    
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

// POST - Create a new admin notification
export async function POST(request) {
  try {
    const body = await request.json();
    const { adminId, type, title, body: message, linkTo, targetId, targetType } = body;
    
    const newNotification = {
      adminId: adminId || "all", // "all" for all admins, or specific admin ID
      type,
      title,
      body: message,
      linkTo: linkTo || null,
      targetId: targetId || null,
      targetType: targetType || null,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    const docRef = await addDoc(collection(db, "adminNotifications"), newNotification);
    
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("POST /api/admin-notifications error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - Mark notification as read
export async function PUT(request) {
  try {
    const { notificationId, markAll } = await request.json();
    
    if (markAll) {
      const snapshot = await getDocs(collection(db, "adminNotifications"));
      const updates = snapshot.docs.map(d => updateDoc(doc(db, "adminNotifications", d.id), { read: true }));
      await Promise.all(updates);
    } else if (notificationId) {
      await updateDoc(doc(db, "adminNotifications", notificationId), { read: true });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/admin-notifications error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}