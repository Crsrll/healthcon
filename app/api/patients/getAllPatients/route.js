import { NextResponse } from "next/server";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// GET all patients
export async function GET() {
  try {
    const q = query(collection(db, "users"), where("role", "==", "patient"));
    const snapshot = await getDocs(q);

    const patients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: patients });
  } catch (err) {
    console.error("GET /api/patients/getAllPatients error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE patient status (suspend/reinstate)
export async function PUT(request) {
  try {
    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userRef = doc(db, "users", userId);
    let updates = {};

    if (action === "suspend") {
      updates = {
        suspended: true,
        status: "suspended",
        suspendedAt: new Date().toISOString(),
      };
    } else if (action === "reinstate") {
      updates = {
        suspended: false,
        status: "active",
        reinstatedAt: new Date().toISOString(),
      };
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await updateDoc(userRef, updates);

    return NextResponse.json({
      success: true,
      message: `Patient ${action}d successfully`,
    });
  } catch (err) {
    console.error("PUT /api/patients/getAllPatients error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}