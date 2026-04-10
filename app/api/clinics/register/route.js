import { NextResponse } from "next/server";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req) {
  try {
    const { uid, clinicName, phone, email, ltoNumber } = await req.json();

    if (!uid || !clinicName || !phone || !email || !ltoNumber) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await setDoc(doc(db, "users", uid), {
      clinicName,
      phone,
      email,
      ltoNumber,
      role: "clinic",
      approved: false,        // ← fixed typo from "aprroved: false"
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Register clinic error:", err);
    return NextResponse.json({ error: "Failed to register clinic." }, { status: 500 });
  }
}