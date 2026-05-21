import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection, query, where, getDocs,
  doc, addDoc, updateDoc,
  orderBy, serverTimestamp, limit
} from "firebase/firestore";

// GET - Fetch reply thread messages
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const replyId = searchParams.get("replyId");
    const reportId = searchParams.get("reportId");
    const clinicID = searchParams.get("clinicID");
    const patientID = searchParams.get("patientID");

    // Get messages for a specific reply thread
    if (replyId) {
      const messagesRef = collection(db, "clinicReplies", replyId, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"));
      const snap = await getDocs(q);
      const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return NextResponse.json({ success: true, messages });
    }

    // Get reply thread by report ID
    if (reportId) {
      const q = query(
        collection(db, "clinicReplies"),
        where("reportId", "==", reportId),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        return NextResponse.json({ success: true, reply: null });
      }
      const reply = { id: snap.docs[0].id, ...snap.docs[0].data() };
      return NextResponse.json({ success: true, reply });
    }

    // Get reply thread between patient and clinic
    if (patientID && clinicID) {
      const q = query(
        collection(db, "clinicReplies"),
        where("patientID", "==", patientID),
        where("clinicID", "==", clinicID),
        where("type", "==", "report"),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        return NextResponse.json({ success: true, reply: null });
      }
      const reply = { id: snap.docs[0].id, ...snap.docs[0].data() };
      return NextResponse.json({ success: true, reply });
    }

    return NextResponse.json(
      { error: "Missing required parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Send a message in a reply thread
export async function POST(req) {
  try {
    const body = await req.json();
    const { action, replyId, text, sender, senderName, reportId, clinicID, clinicName, patientID, patientName, firstMessage } = body;

    // Send message to existing reply thread
    if (action === "message") {
      if (!replyId || !text || !sender) {
        return NextResponse.json(
          { error: "Missing required fields: replyId, text, sender" },
          { status: 400 }
        );
      }

      await addDoc(collection(db, "clinicReplies", replyId, "messages"), {
        text,
        sender,
        senderName: senderName || (sender === "clinic" ? "Clinic Staff" : "Patient"),
        seen: false,
        createdAt: serverTimestamp(),
      });

      // Update reply thread
      await updateDoc(doc(db, "clinicReplies", replyId), {
        lastMessage: text,
        updatedAt: serverTimestamp(),
        unreadByClinic: sender === "patient",
        unreadByPatient: sender === "clinic", // Mark as unread for patient when clinic responds
      });

      return NextResponse.json({ success: true, message: "Message sent successfully" });
    }

    // Create new reply thread
    if (action === "create") {
      if (!clinicID || !patientID || !firstMessage) {
        return NextResponse.json(
          { error: "Missing required fields: clinicID, patientID, firstMessage" },
          { status: 400 }
        );
      }

      const replyData = {
        clinicID,
        clinicName: clinicName || "",
        patientID,
        patientName: patientName || "Anonymous Patient",
        lastMessage: firstMessage.substring(0, 100),
        unreadByClinic: true,
        unreadByPatient: false,
        reportId: reportId || null,
        type: reportId ? "report" : "general",
        status: "open",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const replyRef = await addDoc(collection(db, "clinicReplies"), replyData);

      await addDoc(collection(db, "clinicReplies", replyRef.id, "messages"), {
        text: firstMessage,
        sender: "patient",
        senderName: patientName || "Anonymous Patient",
        seen: false,
        createdAt: serverTimestamp(),
      });

      return NextResponse.json({
        success: true,
        replyId: replyRef.id,
        message: "Reply thread created successfully",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in clinic replies API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Mark messages as read when patient opens chat
export async function PUT(req) {
  try {
    const body = await req.json();
    const { replyId } = body;

    if (!replyId) {
      return NextResponse.json({ error: "replyId required" }, { status: 400 });
    }

    await updateDoc(doc(db, "clinicReplies", replyId), {
      unreadByPatient: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking as read:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}