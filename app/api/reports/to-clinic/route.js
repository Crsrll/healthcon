import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection, query, where, getDocs,
  doc, addDoc, updateDoc, getDoc,
  serverTimestamp
} from "firebase/firestore";

// POST - Submit a report to clinic
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      clinicID,
      clinicName,
      reporterID,
      reporterName,
      reporterEmail,
      subject,
      message,
      doctorId,
      doctorName,
      preferredDate,
      preferredTime,
      appointmentType,
    } = body;

    if (!clinicID || !reporterID || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: clinicID, reporterID, subject, message" },
        { status: 400 }
      );
    }

    const reportData = {
      clinicID,
      clinicName: clinicName || "",
      reporterID,
      reporterName: reporterName || "Anonymous Patient",
      reporterEmail: reporterEmail || "",
      subject,
      message,
      doctorId: doctorId || null,
      doctorName: doctorName || null,
      preferredDate: preferredDate || null,
      preferredTime: preferredTime || null,
      appointmentType: appointmentType || null,
      status: "pending",
      type: "clinic_report",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const reportRef = await addDoc(collection(db, "clinicReports"), reportData);

    return NextResponse.json({
      success: true,
      reportId: reportRef.id,
      message: "Report submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting clinic report:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET - Fetch reports
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicID = searchParams.get("clinicID");
    const reporterID = searchParams.get("reporterID");
    const reportId = searchParams.get("reportId");

    // Get a single report
    if (reportId) {
      const reportDoc = await getDoc(doc(db, "clinicReports", reportId));
      if (!reportDoc.exists()) {
        return NextResponse.json({ error: "Report not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        report: { id: reportDoc.id, ...reportDoc.data() },
      });
    }

    // Get reports for a clinic
    if (clinicID) {
      const q = query(collection(db, "clinicReports"), where("clinicID", "==", clinicID));
      const snap = await getDocs(q);
      let reports = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      reports = reports.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
      return NextResponse.json({ success: true, reports });
    }

    // Get reports by a specific patient
    if (reporterID) {
      const q = query(collection(db, "clinicReports"), where("reporterID", "==", reporterID));
      const snap = await getDocs(q);
      let reports = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      reports = reports.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
      return NextResponse.json({ success: true, reports });
    }

    return NextResponse.json(
      { error: "Missing query parameter: clinicID, reporterID, or reportId" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update report status
export async function PUT(req) {
  try {
    const body = await req.json();
    const { reportId, status } = body;

    if (!reportId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: reportId, status" },
        { status: 400 }
      );
    }

    const reportRef = doc(db, "clinicReports", reportId);
    await updateDoc(reportRef, {
      status: status,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "Report updated successfully",
    });
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}