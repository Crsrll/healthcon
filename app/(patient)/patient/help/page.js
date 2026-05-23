"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, HelpCircle, ChevronRight, MessageCircle } from "lucide-react";

export default function HelpSupportPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const tutorials = [
    {
      question: "How do I book a new appointment?",
      answer: "To book an appointment: \n1. Go to your Dashboard. \n2. Click the 'Book Appointment' card at the top. \n3. Browse the Clinic Directory. \n4. Select a clinic and choose an available doctor and time slot. \n5. Confirm your booking."
    },
    {
      question: "How can I view or upload my medical records?",
      answer: "Click on 'Medical Records' from your dashboard. You can view existing records by clicking 'View Details'. To add a new one, click 'Upload Record', fill in the clinic details, and attach a photo or PDF of your document."
    },
    {
      question: "Where do I find my digital prescriptions (Rx)?",
      answer: "Your active medications are listed on your Dashboard under 'Active Prescriptions'. For a full history or to see the official medical slip, click 'View All' or go to the Prescriptions page. Click 'View Rx' to show the digital slip to your pharmacist."
    },
    {
      question: "How do I pay my clinic bills?",
      answer: "Click your Profile Icon (top right) and select 'Billing & Payments'. Find any invoice marked as 'Unpaid' and click 'Pay Now'. You can currently simulate payments using your GCash wallet balance."
    },
    {
      question: "How do I change my profile picture?",
      answer: "Go to your Profile page via the top-right menu. Click 'Edit Profile'. Click on the camera icon over your initials to select a photo from your device. Don't forget to hit 'Save Changes' at the top."
    },
    {
      question: "What should I do in an emergency?",
      answer: "If you are experiencing a medical emergency, do not use the booking system. Click the red 'Emergency' card in your dashboard sidebar to immediately call our 24/7 hotline or dial 911."
    }
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 font-sans">

      {/* HEADER — matches AccountSettingsPage exactly */}
      <div className="bg-[#1a365d] text-white pt-10 pb-14 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
              <Link href="/patient/dashboard" className="hover:text-white transition-colors">Patient</Link>
              <ChevronRight size={10} />
              <span className="text-white/60">Help & Support</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-bold">Help & Support</h1>
            <p className="text-blue-200/70 text-sm mt-1">Quick tutorials on how to use the Healthcon platform.</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 mt-8 space-y-4">

        {/* Accordion section */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <HelpCircle className="text-teal-500" size={18} />
            <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">User Guide</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {tutorials.map((item, index) => (
              <div key={index}>
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      openIndex === index ? "bg-teal-50 text-teal-600" : "bg-slate-100 text-slate-400"
                    }`}>
                      <HelpCircle size={14} />
                    </div>
                    <span className={`text-sm font-semibold ${openIndex === index ? "text-slate-900" : "text-slate-600"}`}>
                      {item.question}
                    </span>
                  </div>
                  {openIndex === index
                    ? <ChevronUp size={16} className="text-slate-400 shrink-0 ml-3" />
                    : <ChevronDown size={16} className="text-slate-400 shrink-0 ml-3" />}
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <div className="ml-10 border-l-2 border-teal-500 pl-4">
                      <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact support — matches the info box style from settings */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <MessageCircle size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Still need help?</p>
                <p className="text-sm font-semibold text-slate-700">Contact our support team</p>
                <p className="text-xs text-slate-500 mt-0.5">Our administrators are here to help with technical issues.</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="shrink-0 bg-[#1a365d] hover:bg-[#1e3f6e] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 text-center"
            >
              Contact Support
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}