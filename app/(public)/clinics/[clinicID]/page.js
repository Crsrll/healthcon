'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useClinic } from '@/hooks/useClinic';
import { useDoctors } from '@/hooks/useDoctors';
import { useAuth } from '@/hooks/useAuth';
import { useBookedSlots } from '@/hooks/useBookedSlots';
import { generateTimeSlots } from '@/lib/generateTimeSlots';
import { 
  MessageCircle, Send, X, ChevronDown, Star, 
  Flag, Calendar, Clock, MapPin, Phone, Mail, 
  Building2, Stethoscope, Award, ThumbsUp, 
  Share2, Heart, Loader2, CheckCircle, AlertCircle 
} from 'lucide-react';

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
    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
      <span className="text-[#3182ce]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-[#1a355d] tracking-tight">{title}</h2>
      {count !== undefined && (
        <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
          {count}
        </span>
      )}
    </div>
  );
}

function StarRating({ rating, onRatingChange, size = "md" }) {
  const [hoverRating, setHoverRating] = useState(0);
  const sizes = { sm: 16, md: 24, lg: 32 };
  const iconSize = sizes[size] || 24;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange?.(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="transition-all duration-150 hover:scale-110"
        >
          <Star
            size={iconSize}
            className={`${(hoverRating || rating) >= star 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300'} transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

// ── Report Modal ──────────────────────────────────────────────
function ReportModal({ clinicID, clinicName, user, onClose }) {
  const [reportType, setReportType] = useState('inappropriate');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!user?.uid) {
      alert('Please log in to submit a report');
      return;
    }
    if (!description.trim()) {
      alert('Please provide details for your report');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicID,
          clinicName,
          patientID: user.uid,
          patientName: user.displayName || user.email,
          reportType,
          description: description.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit report');
      setSubmitted(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-[#1a355d] mb-2">Report Submitted</h3>
          <p className="text-gray-500 text-sm mb-6">
            Thank you for helping keep our community safe. We'll review your report.
          </p>
          <button onClick={onClose} className="w-full py-3 bg-[#1a355d] text-white rounded-xl font-semibold">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden">
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
            <Flag size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-red-700">Report Clinic</h3>
            <p className="text-xs text-red-500">Help us maintain quality standards</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 focus:border-red-300 outline-none"
            >
              <option value="inappropriate">Inappropriate Content</option>
              <option value="spam">Spam or Misleading</option>
              <option value="fake">Fake Clinic</option>
              <option value="harassment">Harassment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Please provide details about your report..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-200 focus:border-red-300 outline-none resize-none"
            />
          </div>

          <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
            <AlertCircle size={14} className="inline mr-1" />
            Reports are anonymous. False reports may lead to account restrictions.
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/30">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !description.trim()}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-all"
          >
            {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reviews Section ───────────────────────────────────────────
function ReviewsSection({ clinicID }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [clinicID]);

  const loadReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?clinicID=${clinicID}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        if (user?.uid && data.reviews) {
          const userReviewExists = data.reviews.some(r => r.patientID === user.uid);
          setHasUserReviewed(userReviewExists);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user?.uid) {
      alert('Please log in to leave a review');
      return;
    }
    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!userReview.trim()) {
      alert('Please write a review message');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicID,
          patientID: user.uid,
          patientName: user.displayName || user.email,
          rating: userRating,
          message: userReview.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');
      
      await loadReviews();
      setUserRating(0);
      setUserReview('');
      setHasUserReviewed(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900">Patient Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              <Star size={18} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold ml-1">{averageRating}</span>
              <span className="text-gray-400 text-sm ml-1">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Write Review */}
      {!hasUserReviewed && user && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <p className="text-sm font-medium text-gray-700 mb-3">Share your experience</p>
          <StarRating rating={userRating} onRatingChange={setUserRating} size="md" />
          <textarea
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
            placeholder="Write your review here..."
            rows={3}
            className="w-full mt-4 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-200 outline-none resize-none"
          />
          <button
            onClick={handleSubmitReview}
            disabled={submitting || userRating === 0 || !userReview.trim()}
            className="mt-3 px-5 py-2 bg-[#1a355d] text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-all hover:bg-[#22447a]"
          >
            {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Submit Review'}
          </button>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-2xl">
          <MessageCircle size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{review.patientName}</p>
                  <p className="text-[10px] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{review.message}</p>
            </div>
          ))}
        </div>
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
  const inquiryIdRef = useRef(null);

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
        inquiryIdRef.current = currentInquiryId;
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
    <div className="fixed bottom-6 right-6 z-50 w-[380px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col bg-white overflow-hidden"
      style={{ height: 520, boxShadow: '0 24px 64px rgba(26,53,93,0.18)' }}>

      <div className="bg-gradient-to-r from-[#1a355d] to-[#22447a] px-5 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-sm">
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

      <div className="flex-1 overflow-y-auto py-4 space-y-3 bg-gradient-to-b from-slate-50/40 to-white" style={{ paddingLeft: 16, paddingRight: 10 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={24} className="animate-spin text-teal-400" />
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
                {m.sender === 'patient' && isLast && (
                  <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <CheckCircle size={10} /> Delivered
                  </span>
                )}  
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

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
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} strokeWidth={2.5} />}
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
        <div className="bg-gradient-to-r from-[#1a355d] to-[#22447a] px-6 py-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#2a4f8a] border-2 border-white/20 flex items-center justify-center text-white font-bold text-lg">
            {doctor.name?.[0]}
          </div>
          <div className="flex-1">
            <p className="text-white font-bold">Dr. {doctor.name}</p>
            <p className="text-white/60 text-xs">{doctor.specialty}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={20} />
          </button>
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
                      ${selectedDay === day ? 'bg-[#1a355d] text-white' : isAvailable ? 'border border-gray-200 text-gray-600 hover:border-[#1a355d]' : 'bg-gray-50 text-gray-200'}`}>
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
                      ${selectedTime === slot ? 'bg-[#1a355d] text-white' : 'border-gray-200 text-gray-600 hover:border-[#1a355d]'}`}>
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
  const [showReport,      setShowReport]      = useState(false);
  const [liked, setLiked] = useState(false);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-[#1a355d] mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading clinic profile...</p>
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pb-20">

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

      {/* Report Modal */}
      {showReport && (
        <ReportModal
          clinicID={params.clinicID}
          clinicName={clinic.clinicName}
          user={user}
          onClose={() => setShowReport(false)}
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

      {/* Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          onClick={() => setShowReport(true)}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-md hover:bg-red-50 text-gray-700 hover:text-red-600 px-4 py-2.5 rounded-full transition-all shadow-lg border border-gray-200"
        >
          <Flag size={18} />
          <span className="text-sm font-medium">Report</span>
        </button>
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full transition-all shadow-lg border border-gray-200 ${liked ? 'text-red-500' : 'text-gray-600'}`}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          <span className="text-sm font-medium">{liked ? 'Liked' : 'Like'}</span>
        </button>
        <button
          onClick={() => setShowInquiry(true)}
          className="flex items-center gap-3 bg-[#1a355d] hover:bg-[#22447a] text-white px-5 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
        >
          <MessageCircle size={20} strokeWidth={2.5} className="shrink-0" />
          <div className="flex flex-col items-start">
            <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider leading-none mb-0.5">Have a question?</p>
            <span className="text-sm font-bold leading-none">Message Clinic</span>
          </div>
        </button>
      </div>

      {/* HERO */}
      <div className="relative h-80 bg-[#1a355d] overflow-hidden">
        {clinic.image && (
          <img src={clinic.image} alt={clinic.clinicName} className="w-full h-full object-cover opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a355d] via-[#1a355d]/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
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
          <h1 className="text-4xl font-bold text-white leading-tight mb-2 tracking-tight">{clinic.clinicName}</h1>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <MapPin size={14} /> {clinic.address}
          </div>
        </div>
      </div>

      {/* QUICK INFO */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-4 flex flex-wrap gap-x-8 gap-y-3">
          <InfoChip icon={<Calendar size={14} />} text={todayHours ? `${todayHours.open} to ${todayHours.close}` : 'No schedule'} />
          <InfoChip icon={<Phone size={14} />} text={clinic.phone} />
          <InfoChip icon={<Mail size={14} />} text={clinic.email} />
          <InfoChip icon={<MapPin size={14} />} text={clinic.city} />
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-12">

          {/* About Section */}
          <section>
            <SectionHeader title="About the Clinic" />
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-600 leading-relaxed">{clinic.about}</p>
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
                {(clinic.amenities ?? []).map(a => (
                  <span key={a} className="text-xs font-medium bg-gray-50 border border-gray-200 text-gray-600 rounded-lg px-3 py-1.5 flex items-center gap-1">
                    <Award size={12} /> {a}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Doctors Section */}
          <section>
            <SectionHeader title="Medical Staff" count={`${doctors.length} Providers`} />
            <div className="flex flex-col gap-4">
              {doctors.map(doctor => (
                <div
                  key={doctor.id}
                  ref={el => (doctorRefs.current[doctor.id] = el)}
                  className={`bg-white rounded-2xl border p-5 flex items-center gap-5 transition-all duration-500 shadow-sm hover:shadow-md
                    ${doctor.id === highlightDoctor
                      ? 'border-blue-500 ring-4 ring-blue-50 bg-blue-50/20 scale-[1.01]'
                      : 'border-gray-100 hover:border-blue-200'}`}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center text-xl font-bold shrink-0">
                    {doctor.name?.split(' ').pop()?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-lg">Dr. {doctor.name}</p>
                    <p className="text-sm text-blue-600 font-medium mb-1 flex items-center gap-1">
                      <Stethoscope size={14} /> {doctor.specialty}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> {doctor.schedule}
                    </p>
                  </div>
                  <button
                    disabled={!doctor.available}
                    onClick={() => setBookingDoctor(doctor)}
                    className="shrink-0 bg-gradient-to-r from-[#1a355d] to-[#22447a] hover:from-[#22447a] hover:to-[#2a558a] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed shadow-md"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">

          {/* Clinic Info Card */}
          <section>
            <SectionHeader title="Clinic Information" />
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div className="flex items-start gap-3 p-2 rounded-lg bg-gray-50/50">
                <Building2 size={18} className="text-[#1a355d] mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Specialties</p>
                  <p className="text-sm text-gray-700 font-medium">
                    {(clinic.specialty ?? []).join(', ') || 'General Practice'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg">
                <Award size={18} className="text-[#1a355d] mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Established</p>
                  <p className="text-sm text-gray-700 font-medium">{clinic.established || 'Information coming soon'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section>
            <SectionHeader title="Services & Treatments" />
            <div className="bg-white rounded-2xl border border-gray-100 p-1 shadow-sm">
              {(clinic.services ?? []).map((service, i) => (
                <div key={i} className="p-3 text-sm text-gray-700 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors rounded-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  {service}
                </div>
              ))}
            </div>
          </section>

          {/* Reviews Section */}
          <section>
            <SectionHeader title="Patient Reviews" />
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <ReviewsSection clinicID={params.clinicID} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}