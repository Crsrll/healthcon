import { NextResponse } from "next/server";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req) {
  try {
    const { uid, firstName, middleInitial, lastName, phone, email } = await req.json();

    if (!uid || !firstName || !lastName || !phone || !email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await setDoc(doc(db, "users", uid), {
      firstName,
      middleInitial,
      lastName,
      phone,
      email,
      role: "patient",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Register patient error:", err);
    return NextResponse.json({ error: "Failed to register patient." }, { status: 500 });
  }
}