import { NextResponse } from "next/server";
import { collection, addDoc, getDocs, query, orderBy, limit, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// GET logs with pagination and filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitCount = parseInt(searchParams.get("limit") || "100");
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");

    let q = query(collection(db, "systemLogs"), orderBy("timestamp", "desc"), limit(limitCount));

    if (action) {
      q = query(
        collection(db, "systemLogs"),
        where("action", "==", action),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
    }

    if (userId) {
      q = query(
        collection(db, "systemLogs"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: logs });
  } catch (err) {
    console.error("GET /api/logs error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - Create a new log entry
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, userEmail, userRole, action, targetType, targetId, details } = body;

    const logEntry = {
      userId: userId || "system",
      userEmail: userEmail || "system@healthcon.com",
      userRole: userRole || "system",
      action,
      targetType: targetType || null,
      targetId: targetId || null,
      details: details || "",
      timestamp: new Date().toISOString(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    const docRef = await addDoc(collection(db, "systemLogs"), logEntry);

    return NextResponse.json({ success: true, id: docRef.id, data: logEntry });
  } catch (err) {
    console.error("POST /api/logs error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - Clear logs (with options)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const daysOld = parseInt(searchParams.get("days") || "30");
    const clearAll = searchParams.get("all") === "true";
    
    let q;
    
    if (clearAll) {
      // Delete ALL logs
      q = query(collection(db, "systemLogs"));
    } else {
      // Delete logs older than specified days
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      q = query(
        collection(db, "systemLogs"),
        where("timestamp", "<", cutoffDate.toISOString())
      );
    }
    
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return NextResponse.json({ 
      success: true, 
      message: clearAll 
        ? `Deleted all ${snapshot.size} logs` 
        : `Deleted ${snapshot.size} logs older than ${daysOld} days`
    });
  } catch (err) {
    console.error("DELETE /api/logs error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}