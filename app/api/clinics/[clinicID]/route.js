import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req, { params }) {
  try {
    const { clinicID } = await params;

    const docRef = doc(db, "users", clinicID);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: "Clinic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: snapshot.id,
        ...snapshot.data(),
      },
    });

  } catch (err) {
    console.error("getClinic error:", err);
    return NextResponse.json(
      { error: "Failed to fetch clinic." },
      { status: 500 }
    );
  }
}