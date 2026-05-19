import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    // Query for clinics that are not approved yet
    const q = query(
      collection(db, "users"),
      where("role", "==", "clinic"),
      where("approved", "==", false),
    );
    const snapshot = await getDocs(q);

    const pendingClinics = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: pendingClinics });
  } catch (err) {
    console.error("getPendingClinics error:", err);
    return NextResponse.json(
      { error: "Failed to fetch pending clinics." },
      { status: 500 },
    );
  }
}
