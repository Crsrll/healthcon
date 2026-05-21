import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection, query, where, getDocs,
  doc, addDoc, updateDoc, getDoc,
  orderBy, serverTimestamp, limit, setDoc
} from "firebase/firestore";

// Helper function to create notification (inside the same file)
async function createNotification({ recipientID, type, title, body, linkTo, meta = {} }) {
  if (!recipientID) return;
  
  try {
    const notificationId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const notificationRef = doc(db, "notifications", recipientID, "items", notificationId);
    
    await setDoc(notificationRef, {
      id: notificationId,
      type,
      title,
      body,
      linkTo: linkTo || "/",
      read: false,
      createdAt: serverTimestamp(),
      ...meta,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

// GET - Fetch reply thread messages
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const replyId = searchParams.get("replyId");
    const reportId = searchParams.get("reportId");
    const clinicID = searchParams.get("clinicID");
    const patientID = searchParams.get("patientID");

    if (replyId) {
      const messagesRef = collection(db, "clinicReplies", replyId, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"));
      const snap = await getDocs(q);
      const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return NextResponse.json({ success: true, messages });
    }

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

      // Add message to subcollection
      await addDoc(collection(db, "clinicReplies", replyId, "messages"), {
        text,
        sender,
        senderName: senderName || (sender === "clinic" ? "Clinic Staff" : "Patient"),
        seen: false,
        createdAt: serverTimestamp(),
      });

      // Get the reply thread to know who to notify
      const replyDoc = await getDoc(doc(db, "clinicReplies", replyId));
      const replyThread = replyDoc.data();

      // Update unread status based on sender
      const updateData = {
        lastMessage: text,
        updatedAt: serverTimestamp(),
      };
      
      if (sender === "clinic") {
        updateData.unreadByClinic = false;
        updateData.unreadByPatient = true;
      } else if (sender === "patient") {
        updateData.unreadByClinic = true;
        updateData.unreadByPatient = false;
      }

      await updateDoc(doc(db, "clinicReplies", replyId), updateData);

      // ── SEND NOTIFICATION ──
      if (sender === "patient" && replyThread && replyThread.clinicID) {
        await createNotification({
          recipientID: replyThread.clinicID,
          type: "new_patient_response",
          title: "New Patient Response",
          body: `${replyThread.patientName || "A patient"} responded to their report: "${text.substring(0, 80)}${text.length > 80 ? '...' : ''}"`,
          linkTo: "/clinic/reports-reviews",
          meta: {
            reportId: replyThread.reportId,
            replyId: replyId,
          },
        });
      }

      if (sender === "clinic" && replyThread && replyThread.patientID) {
        await createNotification({
          recipientID: replyThread.patientID,
          type: "clinic_response",
          title: "Clinic Responded to Your Report",
          body: `${replyThread.clinicName || "The clinic"} responded to your report: "${text.substring(0, 80)}${text.length > 80 ? '...' : ''}"`,
          linkTo: "/patient/reports-responses",
          meta: {
            reportId: replyThread.reportId,
            replyId: replyId,
          },
        });
      }

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

      // ── SEND NOTIFICATION TO CLINIC FOR NEW REPORT ──
      await createNotification({
        recipientID: clinicID,
        type: "new_report",
        title: "New Patient Report",
        body: `${patientName || "A patient"} submitted a new report: "${firstMessage.substring(0, 80)}${firstMessage.length > 80 ? '...' : ''}"`,
        linkTo: "/clinic/reports-reviews",
        meta: {
          reportId: reportId,
          replyId: replyRef.id,
        },
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

// PUT - Mark messages as read
export async function PUT(req) {
  try {
    const body = await req.json();
    const { replyId } = body;

    if (!replyId) {
      return NextResponse.json({ error: "replyId required" }, { status: 400 });
    }

    await updateDoc(doc(db, "clinicReplies", replyId), {
      unreadByPatient: false,
      unreadByClinic: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking as read:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}