import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, query, orderBy, where,
  doc, updateDoc, serverTimestamp
} from "firebase/firestore";

// GET - fetch all reports (clinicReports collection) and all reviews
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "reports" | "reviews" | null = both

    let reports = [];
    let reviews = [];

    if (!type || type === "reports") {
      const snap = await getDocs(
        query(collection(db, "clinicReports"), orderBy("createdAt", "desc"))
      );
      reports = snap.docs.map((d) => ({
        id: d.id,
        _type: "report",
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.()?.toISOString() ?? d.data().createdAt ?? null,
        updatedAt: d.data().updatedAt?.toDate?.()?.toISOString() ?? d.data().updatedAt ?? null,
      }));
    }

    if (!type || type === "reviews") {
      const snap = await getDocs(
        query(collection(db, "reviews"), orderBy("createdAt", "desc"))
      );
      reviews = snap.docs.map((d) => ({
        id: d.id,
        _type: "review",
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.()?.toISOString() ?? d.data().createdAt ?? null,
        updatedAt: d.data().updatedAt?.toDate?.()?.toISOString() ?? d.data().updatedAt ?? null,
      }));
    }

    return NextResponse.json({ success: true, reports, reviews });
  } catch (err) {
    console.error("GET /api/admin/reports-reviews error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - update status of a report or review
export async function PUT(request) {
  try {
    const { id, collectionName, status, adminNotes } = await request.json();

    if (!id || !collectionName || !status) {
      return NextResponse.json(
        { error: "Missing required fields: id, collectionName, status" },
        { status: 400 }
      );
    }

    const allowed = {
      clinicReports: ["pending", "reviewed", "resolved", "dismissed"],
      reviews: ["pending", "approved", "rejected"],
    };

    if (!allowed[collectionName]?.includes(status)) {
      return NextResponse.json({ error: "Invalid status for collection" }, { status: 400 });
    }

    await updateDoc(doc(db, collectionName, id), {
      status,
      adminNotes: adminNotes || "",
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/admin/reports-reviews error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
