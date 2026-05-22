import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection, query, where, getDocs,
  doc, addDoc, updateDoc, deleteDoc, getDoc,
  orderBy, serverTimestamp, setDoc
} from "firebase/firestore";

// Helper function to create notification
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

// POST - Submit a new review
export async function POST(req) {
  try {
    const body = await req.json();
    const { clinicID, clinicName, patientID, patientName, rating, review } = body;

    // Validation
    if (!clinicID || !patientID || !rating || !review) {
      return NextResponse.json(
        { error: "Missing required fields: clinicID, patientID, rating, review" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const { reviewId } = body;

    // Check if user already reviewed this clinic
    const existingQuery = query(
      collection(db, "reviews"),
      where("clinicID", "==", clinicID),
      where("patientID", "==", patientID)
    );
    const existingSnap = await getDocs(existingQuery);

    // If reviewId provided, update the existing review
    if (reviewId) {
      const reviewRef = doc(db, "reviews", reviewId);
      await updateDoc(reviewRef, {
        rating,
        review: review.trim(),
        status: "pending",
        updatedAt: serverTimestamp(),
      });
      return NextResponse.json({
        success: true,
        reviewId,
        message: "Review updated and pending re-approval",
      });
    }

    if (!existingSnap.empty) {
      return NextResponse.json(
        { error: "You have already reviewed this clinic" },
        { status: 400 }
      );
    }

    // Create review (pending approval by default)
    const reviewData = {
      clinicID,
      clinicName: clinicName || "",
      patientID,
      patientName: patientName || "Anonymous Patient",
      rating,
      review: review.trim(),
      status: "pending", // pending, approved, rejected
      helpful: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "reviews"), reviewData);

    // ── SEND NOTIFICATION TO CLINIC FOR NEW REVIEW ──
    const starRating = "⭐".repeat(rating) + "☆".repeat(5 - rating);
    await createNotification({
      recipientID: clinicID,
      type: "new_review",
      title: "New Patient Review",
      body: `${patientName || "A patient"} left a ${rating}-star review: "${review.substring(0, 80)}${review.length > 80 ? '...' : ''}"`,
      linkTo: "/clinic/reports-reviews",
      meta: {
        reviewId: docRef.id,
        rating: rating,
      },
    });

    return NextResponse.json({
      success: true,
      reviewId: docRef.id,
      message: "Review submitted successfully and pending approval",
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET - Fetch reviews
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicID = searchParams.get("clinicID");
    const patientID = searchParams.get("patientID");
    const reviewId = searchParams.get("reviewId");
    const status = searchParams.get("status");

    // Get single review by ID
    if (reviewId) {
      const reviewDoc = await getDoc(doc(db, "reviews", reviewId));
      if (!reviewDoc.exists()) {
        return NextResponse.json({ error: "Review not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        review: { id: reviewDoc.id, ...reviewDoc.data() },
      });
    }

    // Get reviews for a clinic
    if (clinicID) {
      let constraints = [where("clinicID", "==", clinicID)];
      
      // Filter by status for clinic admin
      if (status === "all") {
        // No status filter — return all reviews for this clinic
      } else if (status && ["pending", "approved", "rejected"].includes(status)) {
        constraints.push(where("status", "==", status));
      } else if (!status) {
        // For public view, only show approved reviews
        constraints.push(where("status", "==", "approved"));
      }
      
      const q = query(collection(db, "reviews"), ...constraints);
      const snap = await getDocs(q);
      let reviews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      reviews = reviews.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      // Calculate average rating (only for approved reviews)
      const approvedReviews = reviews.filter(r => r.status === "approved");
      const ratings = approvedReviews.map(r => r.rating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0;

      return NextResponse.json({
        success: true,
        reviews,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: approvedReviews.length,
      });
    }

    // Get reviews by a specific patient
    if (patientID) {
      const q = query(
        collection(db, "reviews"),
        where("patientID", "==", patientID)
      );
      const snap = await getDocs(q);
      let reviews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      reviews = reviews.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
      return NextResponse.json({ success: true, reviews });
    }

    return NextResponse.json(
      { error: "Missing required parameter: clinicID, patientID, or reviewId" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update review (approve/reject/helpful)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { reviewId, status, helpful } = body;

    if (!reviewId) {
      return NextResponse.json({ error: "Missing reviewId" }, { status: 400 });
    }

    const reviewRef = doc(db, "reviews", reviewId);
    const reviewDoc = await getDoc(reviewRef);

    if (!reviewDoc.exists()) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const updateData = { updatedAt: serverTimestamp() };
    
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      updateData.status = status;
    }
    
    if (helpful === true) {
      const current = reviewDoc.data();
      updateData.helpful = (current.helpful || 0) + 1;
    }

    await updateDoc(reviewRef, updateData);

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove a review (admin only)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json({ error: "Missing reviewId" }, { status: 400 });
    }

    await deleteDoc(doc(db, "reviews", reviewId));

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}