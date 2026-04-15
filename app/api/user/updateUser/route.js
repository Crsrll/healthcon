// app/api/user/updateUser/route.js
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { uid, ...data } = body;

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data); // ✅ was `body`, should be `data` (uid excluded)

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}