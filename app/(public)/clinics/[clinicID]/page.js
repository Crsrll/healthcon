'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useClinic } from '@/hooks/useClinic';
import { useDoctors } from '@/hooks/useDoctors';
import { useAuth } from '@/hooks/useAuth';
import { useBookedSlots } from '@/hooks/useBookedSlots';
import { generateTimeSlots } from '@/lib/generateTimeSlots';

// ── Helpers ─────────────────────────────────────────────────────
const ALL_DAYS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const DAY_NAME_MAP = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

const ALL_SLOTS = [
  '8:00 AM','9:00 AM','10:00 AM','11:00 AM',
  '1:00 PM','2:00 PM','3:00 PM','4:00 PM',
];

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
  return next.toISOString().split('T')[0]; // "2026-04-22"
}

function formatDate(isoDate) {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('en-PH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ── Reusable UI ──────────────────────────────────────────────────
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

// ── Booking Modal ────────────────────────────────────────────────
function BookingModal({ doctor, services, clinicID, patientID, onClose }) {
  const { userData,  loading: authLoading } = useAuth(); 

  const firstName = userData?.firstName || "";
const lastName = userData?.lastName || "";
const mi = userData?.middleInitial ? `${userData.middleInitial} ` : "";
const uiPatientName = `${firstName} ${mi}${lastName}`.replace(/\s+/g, ' ').trim();
  
const databaseDays = doctor?.availability?.days || []; 
  
  const availableShortDays = ALL_DAYS.filter(shortDay => 
    databaseDays.includes(DAY_NAME_MAP[shortDay])
  );

  const validSlots = doctor?.availability
    ? generateTimeSlots(
        doctor.availability.startTime,
        doctor.availability.endTime
      )
    : [];

  const [selectedDay, setSelectedDay] = useState(availableShortDays[0] ?? null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  // const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const selectedDate = selectedDay ? getNextDateForDay(selectedDay) : null;

  const { bookedSlots, loading: slotsLoading } = useBookedSlots(
    clinicID,
    doctor.id,
    selectedDate
  );

  function handleDayChange(day) {
    setSelectedDay(day);
    setSelectedTime(null); 
  }

  async function handleConfirm() {
    if (!uiPatientName) {
      setError("Account details not loaded. Please wait a moment.");
      return;
    }

    if (!selectedDay || !selectedTime || !selectedService) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicID,
          doctorID: doctor.id,
          patientID,
          service: selectedService,
          day: selectedDay,
          time: selectedTime,
          date: selectedDate,
          // notes,
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

  // ── Confirmed Screen ──
  if (confirmed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm p-8 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mx-auto mb-4">
            ✓
          </div>
          <h3 className="text-lg font-bold text-[#1a355d] mb-2">Appointment Requested</h3>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-medium text-gray-700">Dr. {doctor.name}</span> — {selectedService}
          </p>
          <p className="text-sm text-gray-500 mb-1">{formatDate(selectedDate)}</p>
          <p className="text-sm font-medium text-[#1a355d] mb-6">{selectedTime}</p>
          <button onClick={onClose} className="w-full py-2.5 bg-[#1a355d] text-white rounded-xl text-sm font-bold">
            Done
          </button>
        </div>
      </div>
    );
  }

  // ── Main Modal Form ──
return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
        
        {/* Header */}
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
          
          {/* Booking For Box */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <p className="text-[10px] font-bold text-blue-400 uppercase mb-1 tracking-widest">Booking for</p>
            {authLoading ? (
              <div className="h-4 w-32 bg-blue-100 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-sm font-bold text-[#1a355d]">
                {uiPatientName || "Loading profile..."}
              </p>
            )}
          </div>

          {/* Service Dropdown - Fixed with ID and Label association */}
          <div>
            <label htmlFor="service-select" className="block text-xs font-semibold text-gray-500 mb-2">
              Service
            </label>
            <select
              id="service-select"
              name="service"
              value={selectedService}
              onChange={e => setSelectedService(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              <option value="">Select a service...</option>
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Day Selection */}
          <div>
            <p className="block text-xs font-semibold text-gray-500 mb-2">Select Day</p>
            <div className="grid grid-cols-7 gap-1.5">
              {ALL_DAYS.map(day => {
                const isAvailable = databaseDays.includes(DAY_NAME_MAP[day]);
                return (
                  <button
                    key={day}
                    type="button"
                    name={`day-${day}`}
                    disabled={!isAvailable}
                    onClick={() => handleDayChange(day)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all
                      ${selectedDay === day ? 'bg-[#1a355d] text-white' : isAvailable ? 'border border-gray-200 text-gray-600' : 'bg-gray-50 text-gray-200'}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <p className="block text-xs font-semibold text-gray-500 mb-2">Time Slot</p>
            <div className="grid grid-cols-4 gap-2">
              {validSlots.map(slot => {
                const isBooked = bookedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    name={`slot-${slot}`}
                    disabled={isBooked || slotsLoading}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-all
                      ${selectedTime === slot ? 'bg-[#1a355d] text-white' : 'border-gray-200 text-gray-600'}`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Notes <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. first visit, referred by Dr. Cruz..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                         text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div> */}

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* Disclaimer */}
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl px-4 py-3">
            <p className="text-xs text-blue-700">
              Booking is subject to clinic confirmation. You will receive a notification once approved.
            </p>
          </div>
        </div>

        

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/30">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500">Cancel</button>
          <button 
            onClick={handleConfirm} 
            disabled={!canConfirm}
            className="flex-[2] py-2.5 bg-[#1a355d] text-white rounded-xl text-sm font-bold disabled:opacity-30"
          >
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

  const today      = "Monday"; // make dynamic later
  const todayHours = clinic?.hours?.[today];

  const [highlightDoctor, setHighlightDoctor] = useState(null);
  const [bookingDoctor,   setBookingDoctor]   = useState(null);
  const doctorRefs = useRef({});

  useEffect(() => {
    if (!clinic) return;
    const doctorID = searchParams.get('doctor');
    if (!doctorID) return;
    setHighlightDoctor(doctorID);
    const scrollTimer     = setTimeout(() => {
      doctorRefs.current[doctorID]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
    const highlightTimer  = setTimeout(() => setHighlightDoctor(null), 2000);
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
          <button
            onClick={() => router.push('/clinics')}
            className="px-4 py-2 bg-[#1a355d] text-white rounded-lg text-sm"
          >
            Back to directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fafc] pb-20">

      {/* Booking modal */}
      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          services={clinic.services ?? []}
          clinicID={params.clinicID}
          patientID={user?.uid}
          onClose={() => setBookingDoctor(null)}
        />
      )}

      {/* ── HERO ── */}
      <div className="relative h-72 bg-[#1a355d] overflow-hidden">
        {clinic.image && (
          <img
            src={clinic.image}
            alt={clinic.clinicName}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#1a355d] via-[#1a355d]/40 to-transparent" />
        <button
          onClick={() => router.push('/clinics')}
          className="absolute top-6 left-6 bg-white/10 backdrop-blur-md text-white
                     text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2
                     hover:bg-white/20 transition-all border border-white/20"
        >
          <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to directory
        </button>
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {(clinic.specialty ?? []).map(s => (
              <span key={s}
                className="text-xs font-bold bg-blue-400/20 text-blue-100
                           backdrop-blur-sm border border-blue-100/20 rounded-full px-3 py-1">
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
                  <span key={a}
                    className="text-xs font-medium bg-gray-50 border border-gray-200
                               text-gray-500 rounded-lg px-3 py-1.5">
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
                  className={`bg-white rounded-2xl border p-5 flex items-center gap-5
                              transition-all duration-500
                              ${doctor.id === highlightDoctor
                                ? 'border-blue-500 ring-4 ring-blue-50 bg-blue-50/20 scale-[1.02]'
                                : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700
                                  flex items-center justify-center text-xl font-bold shrink-0">
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
                    className="shrink-0 bg-[#1a355d] hover:bg-blue-700 text-white
                               text-sm font-bold px-6 py-2.5 rounded-xl transition-all
                               disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed shadow-md"
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
                <div key={i}
                  className="p-3 text-sm text-gray-700 border-b border-gray-50 last:border-0">
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