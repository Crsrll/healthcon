import { NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function PUT(request) {
  try {
    const { clinicId, action } = await request.json();

    if (!clinicId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const clinicRef = doc(db, "users", clinicId);
    let updates = {};

    switch (action) {
      case "approve":
        updates = {
          approved: true,
          suspended: false,
          approvedAt: new Date().toISOString(),
          status: "approved",
        };
        break;
      case "reject":
        updates = {
          rejected: true,
          suspended: false,
          rejectedAt: new Date().toISOString(),
          status: "rejected",
        };
        break;
      case "suspend":
        updates = {
          suspended: true,
          approved: false,
          suspendedAt: new Date().toISOString(),
          status: "suspended",
        };
        break;
      case "reinstate":
        updates = {
          suspended: false,
          approved: true,
          reinstatedAt: new Date().toISOString(),
          status: "reinstated",
        };
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await updateDoc(clinicRef, updates);

    return NextResponse.json({
      success: true,
      message: `Clinic ${action}d successfully`,
    });
  } catch (err) {
    console.error("updateClinicStatus error:", err);
    return NextResponse.json(
      { error: "Failed to update clinic." },
      { status: 500 },
    );
  }
}
