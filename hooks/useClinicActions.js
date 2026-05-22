import { useCallback } from "react";

export function useClinicActions() {
  const fetchInquiry = useCallback(async (patientID, clinicID) => {
    const res = await fetch(`/api/inquiries?patientID=${patientID}&clinicID=${clinicID}`);
    return res.json();
  }, []);

  const fetchInquiryMessages = useCallback(async (inquiryId) => {
    const res = await fetch(`/api/inquiries?inquiryId=${inquiryId}`);
    return res.json();
  }, []);

  const sendInquiry = useCallback(async (data) => {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error("Failed to send inquiry");
    return json;
  }, []);

  const fetchDoctors = useCallback(async (clinicID) => {
    const res = await fetch(`/api/doctors?clinicID=${clinicID}`);
    return res.json();
  }, []);

  const reportToClinic = useCallback(async (data) => {
    const res = await fetch("/api/reports/to-clinic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to submit report");
    return json;
  }, []);

  const reportToAdmin = useCallback(async (data) => {
    const res = await fetch("/api/reports/to-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to submit report");
    return json;
  }, []);

  const submitReview = useCallback(async (data) => {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to submit review");
    return json;
  }, []);

  const fetchReviews = useCallback(async (clinicID) => {
    const res = await fetch(`/api/reviews?clinicID=${clinicID}`);
    return res.json();
  }, []);

  const createBooking = useCallback(async (data) => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to create booking");
    return json;
  }, []);

  return {
    fetchInquiry,
    fetchInquiryMessages,
    sendInquiry,
    fetchDoctors,
    reportToClinic,
    reportToAdmin,
    submitReview,
    fetchReviews,
    createBooking,
  };
}
