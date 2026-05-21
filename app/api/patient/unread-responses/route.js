import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json({ error: "patientId required" }, { status: 400 });
    }

    // Query replies where patient has unread messages
    const repliesQuery = query(
      collection(db, "clinicReplies"),
      where("patientID", "==", patientId),
      where("unreadByPatient", "==", true)
    );
    const snapshot = await getDocs(repliesQuery);

    return NextResponse.json({ success: true, count: snapshot.size });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}