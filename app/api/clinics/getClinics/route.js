import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const q = query(
      collection(db, "users"),
      where("role", "==", "clinic"),
      where("approved", "==", true)
    );
    const snapshot = await getDocs(q);

    const clinics = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: clinics });

  } catch (err) {
    console.error("getClinics error:", err);
    return NextResponse.json({ error: "Failed to fetch clinics." }, { status: 500 });
  }
}