'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useClinic } from '@/hooks/useClinic';
import { useDoctors } from '@/hooks/useDoctors';
import { useAuth } from '@/hooks/useAuth';
import { useBookedSlots } from '@/hooks/useBookedSlots';
import { generateTimeSlots } from '@/lib/generateTimeSlots';
import { MessageCircle, Send, X, ChevronDown } from 'lucide-react';

// ── Helpers ─────────────────────────────────────────────────────
const ALL_DAYS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const DAY_NAME_MAP = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday",
  Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
};

function parseAvailableDays(scheduleStr = '') {
  return ALL_DAYS.filter(d => scheduleStr.includes(d));
}

function getNextDateForDay(dayName) {
  const dayMap = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };
  const target = dayMap[dayName];
  const today  = new Date();
  const diff   = (target - today.getDay() + 7) % 7 || 7;
  const next   = new Date(today);
  next.setDate(today.getDate() + diff);
  return next.toISOString().split('T')[0];
}

function formatDate(isoDate) {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('en-PH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function InfoChip({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="text-[#3182ce]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-[#1a355d]">{title}</h2>
      {count !== undefined && (
        <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
          {count}
        </span>
      )}
    </div>
  );
}

// ── Inquiry Chat Drawer ──────────────────────────────────────────
function InquiryDrawer({ clinicID, clinicName, user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inquiryId, setInquiryId] = useState(null);
  const messagesEndRef = useRef(null);
  const inquiryIdRef = useRef(null); // ← ref so polling can access latest value

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (id) => {
    try {
      const msgRes  = await fetch(`/api/inquiries?inquiryId=${id}`);
      const msgJson = await msgRes.json();
      if (msgJson.success) setMessages(msgJson.data);
    } catch (e) { console.error(e); }
  };

  // Load existing inquiry
  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return;
      try {
        const res  = await fetch(`/api/inquiries?patientID=${user.uid}&clinicID=${clinicID}`);
        const json = await res.json();
        if (json.success && json.inquiry) {
          setInquiryId(json.inquiry.id);
          inquiryIdRef.current = json.inquiry.id;
          await fetchMessages(json.inquiry.id);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [user, clinicID]);

  // ✅ Poll every 5 seconds for new messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (inquiryIdRef.current) {
        fetchMessages(inquiryIdRef.current);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;
    const text = inputText.trim();
    setInputText('');
    setSending(true);

    const tempMsg = { id: Date.now(), text, sender: 'patient', seen: false, createdAt: new Date() };
    setMessages(prev => [...prev, tempMsg]);

    try {
      let currentInquiryId = inquiryId;

      if (!currentInquiryId) {
        const createRes  = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            clinicID,
            clinicName,
            patientID: user.uid,
            patientName: user.displayName || user.email,
            firstMessage: text,
          }),
        });
        const createJson = await createRes.json();
        if (!createJson.success) throw new Error('Failed to create inquiry');
        currentInquiryId = createJson.inquiryId;
        setInquiryId(currentInquiryId);
        inquiryIdRef.current = currentInquiryId; // ← keep ref in sync
      } else {
        await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'message',
            inquiryId: currentInquiryId,
            text,
            sender: 'patient',
          }),
        });
      }

      await fetchMessages(currentInquiryId);
    } catch (e) {
      console.error(e);
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col bg-white"
      style={{ height: 480, boxShadow: '0 24px 64px rgba(26,53,93,0.18)' }}>

      {/* Header */}
      <div className="bg-[#1a355d] px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-sm">
          {clinicName?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm leading-tight">{clinicName}</p>
          <p className="text-teal-300 text-[10px] font-semibold uppercase tracking-wide">Direct Message</p>
        </div>
        <button onClick={onClose}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all">
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3 bg-slate-50/40" style={{ paddingLeft: 16, paddingRight: 10 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1a355d]/8 flex items-center justify-center">
              <MessageCircle size={24} className="text-[#1a355d]/40" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">No messages yet</p>
              <p className="text-xs text-slate-400 mt-1">Send a message to start your inquiry</p>
            </div>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isLast = idx === messages.length - 1;
            return (
              <div key={m.id} className={`flex flex-col ${m.sender === 'patient' ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-end gap-1 w-full ${m.sender === 'patient' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {m.sender === 'clinic' && (
                    <div className="w-6 h-6 rounded-full bg-[#1a355d] text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                      {clinicName?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className={`max-w-[calc(100%-16px)] mr-2 px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${m.sender === 'patient'
                      ? 'bg-[#1a355d] text-white rounded-tr-sm'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
                    }`}>
                    {m.text}
                  </div>
                </div>
                {/*Delivered on last patient message */}
                {m.sender === 'patient' && isLast && (
                  <span className="text-[10px] text-slate-400 mt-1">✓ Delivered</span>
                )}  
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white flex items-center gap-2">
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-teal-400 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || sending}
          className="w-10 h-10 bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0"
        >
          <Send size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

// ── Booking Modal ────────────────────────────────────────────────
function BookingModal({ doctor, services, clinicID, patientID, onClose }) {
  const { userData, loading: authLoading } = useAuth();

  const firstName = userData?.firstName || "";
  const lastName = userData?.lastName || "";
  const mi = userData?.middleInitial ? `${userData.middleInitial} ` : "";
  const uiPatientName = `${firstName} ${mi}${lastName}`.replace(/\s+/g, ' ').trim();

  const databaseDays = doctor?.availability?.days || [];

  const availableShortDays = ALL_DAYS.filter(shortDay =>
    databaseDays.includes(DAY_NAME_MAP[shortDay])
  );

  const validSlots = doctor?.availability
    ? generateTimeSlots(doctor.availability.startTime, doctor.availability.endTime)
    : [];

  const [selectedDay, setSelectedDay] = useState(availableShortDays[0] ?? null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const selectedDate = selectedDay ? getNextDateForDay(selectedDay) : null;

  const { bookedSlots, loading: slotsLoading } = useBookedSlots(clinicID, doctor.id, selectedDate);

  function handleDayChange(day) {
    setSelectedDay(day);
    setSelectedTime(null);
  }

  async function handleConfirm() {
    if (!uiPatientName) { setError("Account details not loaded."); return; }
    if (!selectedDay || !selectedTime || !selectedService) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicID, doctorID: doctor.id, patientID,
          service: selectedService, day: selectedDay,
          time: selectedTime, date: selectedDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create booking');
      setConfirmed(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const canConfirm = selectedDay && selectedTime && selectedService && !submitting;

  if (confirmed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm p-8 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
          <h3 className="text-lg font-bold text-[#1a355d] mb-2">Appointment Requested</h3>
          <p className="text-sm text-gray-500 mb-1"><span className="font-medium text-gray-700">Dr. {doctor.name}</span> — {selectedService}</p>
          <p className="text-sm text-gray-500 mb-1">{formatDate(selectedDate)}</p>
          <p className="text-sm font-medium text-[#1a355d] mb-6">{selectedTime}</p>
          <button onClick={onClose} className="w-full py-2.5 bg-[#1a355d] text-white rounded-xl text-sm font-bold">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
        <div className="bg-[#1a355d] px-6 py-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#2a4f8a] border-2 border-white/20 flex items-center justify-center text-white font-bold text-lg">
            {doctor.name?.[0]}
          </div>
          <div className="flex-1">
            <p className="text-white font-bold">Dr. {doctor.name}</p>
            <p className="text-white/60 text-xs">{doctor.specialty}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <p className="text-[10px] font-bold text-blue-400 uppercase mb-1 tracking-widest">Booking for</p>
            {authLoading
              ? <div className="h-4 w-32 bg-blue-100 animate-pulse rounded mt-1" />
              : <p className="text-sm font-bold text-[#1a355d]">{uiPatientName || "Loading profile..."}</p>
            }
          </div>

          <div>
            <label htmlFor="service-select" className="block text-xs font-semibold text-gray-500 mb-2">Service</label>
            <select id="service-select" value={selectedService} onChange={e => setSelectedService(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 outline-none">
              <option value="">Select a service...</option>
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <p className="block text-xs font-semibold text-gray-500 mb-2">Select Day</p>
            <div className="grid grid-cols-7 gap-1.5">
              {ALL_DAYS.map(day => {
                const isAvailable = databaseDays.includes(DAY_NAME_MAP[day]);
                return (
                  <button key={day} type="button" disabled={!isAvailable} onClick={() => handleDayChange(day)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all
                      ${selectedDay === day ? 'bg-[#1a355d] text-white' : isAvailable ? 'border border-gray-200 text-gray-600' : 'bg-gray-50 text-gray-200'}`}>
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="block text-xs font-semibold text-gray-500 mb-2">Time Slot</p>
            <div className="grid grid-cols-4 gap-2">
              {validSlots.map(slot => {
                const isBooked = bookedSlots.includes(slot);
                return (
                  <button key={slot} type="button" disabled={isBooked || slotsLoading}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-all
                      ${selectedTime === slot ? 'bg-[#1a355d] text-white' : 'border-gray-200 text-gray-600'}`}>
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
          )}

          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl px-4 py-3">
            <p className="text-xs text-blue-700">Booking is subject to clinic confirmation. You will receive a notification once approved.</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/30">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500">Cancel</button>
          <button onClick={handleConfirm} disabled={!canConfirm}
            className="flex-[2] py-2.5 bg-[#1a355d] text-white rounded-xl text-sm font-bold disabled:opacity-30">
            {submitting ? 'Processing...' : 'Confirm Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function ClinicProfilePage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { user }     = useAuth();

  const { clinic,  loading: clinicLoading } = useClinic(params.clinicID);
  const { doctors, loading: doctorLoading } = useDoctors(params.clinicID);

  const isLoading = clinicLoading || doctorLoading;
  const today = "Monday";
  const todayHours = clinic?.hours?.[today];

  const [highlightDoctor, setHighlightDoctor] = useState(null);
  const [bookingDoctor,   setBookingDoctor]   = useState(null);
  const [showInquiry,     setShowInquiry]     = useState(false);
  const doctorRefs = useRef({});

  useEffect(() => {
    if (!clinic) return;
    const doctorID = searchParams.get('doctor');
    if (!doctorID) return;
    setHighlightDoctor(doctorID);
    const scrollTimer    = setTimeout(() => {
      doctorRefs.current[doctorID]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
    const highlightTimer = setTimeout(() => setHighlightDoctor(null), 2000);
    return () => { clearTimeout(scrollTimer); clearTimeout(highlightTimer); };
  }, [clinic, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#1a355d] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading clinic profile...</p>
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-[#1a355d] mb-4">Clinic not found</p>
          <button onClick={() => router.push('/clinics')}
            className="px-4 py-2 bg-[#1a355d] text-white rounded-lg text-sm">
            Back to directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fafc] pb-20">

      {/* Booking Modal */}
      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          services={clinic.services ?? []}
          clinicID={params.clinicID}
          patientID={user?.uid}
          onClose={() => setBookingDoctor(null)}
        />
      )}

      {/* Inquiry Drawer */}
      {showInquiry && (
        <InquiryDrawer
          clinicID={params.clinicID}
          clinicName={clinic.clinicName}
          user={user}
          onClose={() => setShowInquiry(false)}
        />
      )}

      {!showInquiry && (
      <button
        onClick={() => setShowInquiry(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#1a355d] hover:bg-[#22447a] text-white px-5 py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95"
        style={{ boxShadow: '0 8px 32px rgba(26,53,93,0.35)' }}
      >
        <MessageCircle size={20} strokeWidth={2.5} className="shrink-0" />
        <div className="flex flex-col items-start">
          <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider leading-none mb-0.5">Have a question?</p>
          <span className="text-sm font-bold leading-none">Message Clinic</span>
        </div>
      </button>
    )}

      {/* ── HERO ── */}
      <div className="relative h-72 bg-[#1a355d] overflow-hidden">
        {clinic.image && (
          <img src={clinic.image} alt={clinic.clinicName} className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#1a355d] via-[#1a355d]/40 to-transparent" />
        <button
          onClick={() => router.push('/clinics')}
          className="absolute top-6 left-6 bg-white/10 backdrop-blur-md text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all border border-white/20"
        >
          <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to directory
        </button>
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {(clinic.specialty ?? []).map(s => (
              <span key={s} className="text-xs font-bold bg-blue-400/20 text-blue-100 backdrop-blur-sm border border-blue-100/20 rounded-full px-3 py-1">
                {s}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-2">{clinic.clinicName}</h1>
          <div className="flex items-center gap-2 text-white/80 text-sm">{clinic.address}</div>
        </div>
      </div>

      {/* ── QUICK INFO ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-8 py-4 flex flex-wrap gap-x-10 gap-y-3">
          <InfoChip icon="🕒" text={todayHours ? `${todayHours.open} to ${todayHours.close}` : 'No schedule'} />
          <InfoChip icon="📞" text={clinic.phone} />
          <InfoChip icon="✉️" text={clinic.email} />
          <InfoChip icon="📍" text={clinic.city} />
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-12">

          {/* About */}
          <section>
            <SectionHeader title="About the Clinic" />
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <p className="text-gray-600 leading-relaxed">{clinic.about}</p>
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
                {(clinic.amenities ?? []).map(a => (
                  <span key={a} className="text-xs font-medium bg-gray-50 border border-gray-200 text-gray-500 rounded-lg px-3 py-1.5">
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Doctors */}
          <section>
            <SectionHeader title="Medical Staff" count={`${doctors.length} Registered`} />
            <div className="flex flex-col gap-4">
              {doctors.map(doctor => (
                <div
                  key={doctor.id}
                  ref={el => (doctorRefs.current[doctor.id] = el)}
                  className={`bg-white rounded-2xl border p-5 flex items-center gap-5 transition-all duration-500
                    ${doctor.id === highlightDoctor
                      ? 'border-blue-500 ring-4 ring-blue-50 bg-blue-50/20 scale-[1.02]'
                      : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold shrink-0">
                    {doctor.name?.split(' ').pop()?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">Dr. {doctor.name}</p>
                    <p className="text-sm text-blue-600 font-medium mb-1">{doctor.specialty}</p>
                    <p className="text-xs text-gray-400">{doctor.schedule}</p>
                  </div>
                  <button
                    disabled={!doctor.available}
                    onClick={() => setBookingDoctor(doctor)}
                    className="shrink-0 bg-[#1a355d] hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed shadow-md"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="space-y-8">

          {/* Clinic Info */}
          <section>
            <SectionHeader title="Clinic Info" />
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Specialty</p>
                  <p className="text-sm text-gray-700 font-medium">
                    {(clinic.specialty ?? []).join(', ') || '—'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          <section>
            <SectionHeader title="Services" />
            <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm">
              {(clinic.services ?? []).map((service, i) => (
                <div key={i} className="p-3 text-sm text-gray-700 border-b border-gray-50 last:border-0">
                  {service}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}