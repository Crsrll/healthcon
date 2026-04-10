import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "UID is required." }, { status: 400 });
  }

  const userDocRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    return NextResponse.json({ error: "User record not found." }, { status: 404 });
  }

  const userData = userDocSnap.data();

  if (!userData.role) {
    return NextResponse.json({ error: "User role is not defined." }, { status: 403 });
  }

  if (userData.role === "clinic" && !userData.approved) {
    return NextResponse.json({ error: "Your clinic account is pending admin approval." }, { status: 403 });
  }

  return NextResponse.json({ success: true, data: userData });
}