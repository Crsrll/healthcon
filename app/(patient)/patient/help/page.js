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
    <main className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* ── HEADER ── */}
      <div className="bg-[#1a365d] text-white pt-10 pb-16 px-6">
        <div className="max-w-full mx-auto">
          <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Link href="/patient/dashboard" className="hover:text-white transition-colors">Patient</Link>
            <ChevronRight size={10} />
            <span className="text-white/60">Help & Support</span>
          </nav>
          <h1 className="text-3xl font-bold">User Guide</h1>
          <p className="text-teal-300 text-sm mt-1">Quick tutorials on how to use the Healthcon platform.</p>
        </div>
      </div>

      {/* ── ACCORDION SECTION ── */}
      <div className="max-w-full mx-auto px-6 mt-4">
        <div className="bg-white border-2 border-slate-100 shadow-sm divide-y divide-slate-100">
          {tutorials.map((item, index) => (
            <div key={index} className="group">
              <button 
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <HelpCircle size={18} className={openIndex === index ? "text-teal-500" : "text-slate-300"} />
                  <span className={`text-sm font-bold ${openIndex === index ? "text-slate-900" : "text-slate-600"}`}>
                    {item.question}
                  </span>
                </div>
                {openIndex === index ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
              </button>
              
              {openIndex === index && (
                <div className="px-16 pb-6 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-sm text-slate-500 leading-relaxed border-l-2 border-teal-500 pl-4 whitespace-pre-line">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── CONTACT ADMIN FOOTER ── */}
        <div className="mt-12 p-8 bg-white border-2 border-slate-100 text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={24} />
          </div>
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Still confused?</h3>
          <p className="text-sm text-slate-500 mt-2">Our administrators are here to help you with technical issues.</p>
        <Link href="/contact"
            className="mt-6 inline-block bg-[#1a365d] text-white px-8 py-3 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-800 transition-all active:scale-95"
          >
            Contact Support
        </Link>
        </div>
      </div>
    </main>
  );
}