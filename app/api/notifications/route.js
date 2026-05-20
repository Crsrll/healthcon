    // app/api/notifications/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection, query, orderBy, limit,
  getDocs, doc, updateDoc, writeBatch,
  where
} from "firebase/firestore";

// ── GET /api/notifications?uid=xxx ──────────────────────────────
// Returns the 30 most recent notifications for a user.
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 });

  try {
    const q = query(
      collection(db, "notifications", uid, "items"),
      orderBy("createdAt", "desc"),
      limit(30)
    );
    const snap = await getDocs(q);
    const notifications = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        // Convert Firestore Timestamp → ISO string so it survives JSON serialisation
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
      };
    });
    return NextResponse.json({ success: true, data: notifications });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// ── PATCH /api/notifications ─────────────────────────────────────
// Body: { uid, action: "read_one", notificationId }
//    or { uid, action: "read_all" }
export async function PATCH(req) {
  try {
    const { uid, action, notificationId } = await req.json();
    if (!uid || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    if (action === "read_one") {
      if (!notificationId) return NextResponse.json({ error: "Missing notificationId" }, { status: 400 });
      await updateDoc(doc(db, "notifications", uid, "items", notificationId), { read: true });
      return NextResponse.json({ success: true });
    }

    if (action === "read_all") {
      const q = query(
        collection(db, "notifications", uid, "items"),
        where("read", "==", false)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const batch = writeBatch(db);
        snap.docs.forEach(d => batch.update(d.ref, { read: true }));
        await batch.commit();
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}