import { NextResponse } from "next/server";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
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

    if (action === "approve") {
      // Update clinic to approved
      await updateDoc(clinicRef, {
        approved: true,
        approvedAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, message: "Clinic approved" });
    } else if (action === "reject") {
      // Option 1: Delete the clinic document
      await deleteDoc(clinicRef);
      // Option 2: Or update with rejected status
      // await updateDoc(clinicRef, {
      //   approved: "rejected",
      //   rejectedAt: new Date().toISOString()
      // });
      return NextResponse.json({ success: true, message: "Clinic rejected" });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (err) {
    console.error("updateClinicStatus error:", err);
    return NextResponse.json(
      { error: "Failed to update clinic status." },
      { status: 500 },
    );
  }
}
