import { NextResponse } from "next/server";
import { collection, getDocs, query, orderBy, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// GET all reports
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    let q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    
    if (status && status !== "All") {
      q = query(collection(db, "reports"), where("status", "==", status.toLowerCase()), orderBy("createdAt", "desc"));
    }
    
    const snapshot = await getDocs(q);
    const reports = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return NextResponse.json({ success: true, data: reports });
  } catch (err) {
    console.error("GET /api/reports error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - Create a new report
export async function POST(request) {
  try {
    const body = await request.json();
    const { reporterId, reporterName, targetType, targetId, targetName, reason, description, severity } = body;
    
    const newReport = {
      reporterId,
      reporterName,
      targetType,
      targetId,
      targetName,
      reason,
      description: description || "",
      severity: severity || "medium",
      status: "pending",
      createdAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
      reviewedNotes: null,
    };
    
    const docRef = await addDoc(collection(db, "reports"), newReport);
    
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("POST /api/reports error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - Update report status (review/dismiss/resolve)
export async function PUT(request) {
  try {
    const { reportId, status, reviewedNotes } = await request.json();
    
    const reportRef = doc(db, "reports", reportId);
    await updateDoc(reportRef, {
      status: status.toLowerCase(),
      reviewedAt: new Date().toISOString(),
      reviewedNotes: reviewedNotes || "",
    });
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/reports error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

//your orig code pasted here