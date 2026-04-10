import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req) {
  try {
  const { searchParams } = new URL(req.url);
  const clinicID = searchParams.get("clinicID");

  const q = query(
    collection(db, "doctors"),
    where("clinicID", "==", clinicID)
  );

  const snapshot = await getDocs(q);

  const doctors = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  // console.log("clinicID received:", clinicID);

  return NextResponse.json({ success: true, data: doctors });
  
    } catch (err) {
      console.error("getDoctors error:", err);
      return NextResponse.json({ error: "Failed to fetch doctors." }, { status: 500 });
    }
}