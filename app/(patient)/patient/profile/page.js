"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { User, Mail, Phone, Calendar, MapPin, Droplets, AlertCircle, ShieldCheck, Camera, Edit3, Save, X,ChevronRight } from "lucide-react";

export default function PatientProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    firstName: "Melissa",
    lastName: "Doe",
    email: "melissa.doe@email.com",
    phone: "+63 912 345 6789",
    dob: "1995-06-12",
    address: "Sunrise St., Dapitan City, Zamboanga del Norte",
    bloodType: "O+",
    allergies: "Penicillin, Peanuts",
    emergencyContact: "John Doe (+63 911 222 3333)",
    memberSince: "March 2024",
    image: null
  });

  // Temporary state for the form while editing
  const [tempProfile, setTempProfile] = useState({ ...profile });

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click(); // Trigger the hidden file input
    }
  };

  const handleSave = () => {
    setProfile({ ...tempProfile });
    setIsEditing(false);
    // In a real app, you'd send this to your database here
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setTempProfile({ ...tempProfile, image: imageUrl });
    }
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      
      {/* ── HEADER ── */}
      <div className="bg-[#1a365d] text-white pt-12 pb-16 px-8">
        <div className="max-w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <Link href="/patient/dashboard" className="hover:text-white transition-colors">Patient</Link>
              <ChevronRight size={10} />
              <span className="text-white/60">Profile</span>
            </nav>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-blue-200/70 text-sm mt-2 font-medium">Manage your personal information and medical preferences.</p>
          </div>
          
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-xl shadow-teal-900/40 active:scale-95"
            >
              <Edit3 size={18} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={handleSave}
                className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-xl shadow-teal-900/40 active:scale-95"
              >
                <Save size={18} /> Save Changes
              </button>
              <button 
                onClick={handleCancel}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all border border-white/10"
              >
                <X size={18} /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-full mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── LEFT COLUMN: AVATAR CARD ── */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-teal-400 shadow-xl shadow-slate-200/50 p-8 text-center">
            <div className="relative inline-block">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />

               {/* Avatar Display */}
              <div 
                onClick={handleImageClick}
                className={`w-30 h-30 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden bg-teal-50 ${isEditing ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
              >
                {tempProfile.image ? (
                  <img src={tempProfile.image} alt="Profile" className="w-full h-full  object-cover" />
                ) : (
                  <span className="text-4xl font-black text-teal-600">
                    {tempProfile.firstName[0]}{tempProfile.lastName[0]}
                  </span>
                )}
              </div>

              {/* Camera Overlay (Only shows in Edit Mode) */}
              {isEditing && (
                <div 
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 p-2.5 bg-[#1a365d] text-white rounded-2xl border-4 shadow-lg cursor-pointer hover:scale-110 transition-transform"
                >
                  <Camera size={14} />
                </div>
              )}
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-900">{profile.firstName} {profile.lastName}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Patient ID: #HC-9920</p>
            
            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-center gap-4">
              <div className="text-center">
                <p className="text-xs font-black text-slate-800">12</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Visits</p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="text-center">
                <p className="text-xs font-black text-slate-800">{profile.memberSince}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Joined</p>
              </div>
            </div>
          </section>

          {/* SECURITY BADGE */}
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 flex items-center gap-4">
            <ShieldCheck className="text-teal-600" size={24} />
            <div>
              <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Verified Account</p>
              <p className="text-[11px] text-teal-600/80 font-medium">Your data is protected with AES-256 encryption.</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: INFORMATION ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PERSONAL INFORMATION */}
          <section className="bg-white rounded-xl border border-teal-400 shadow-sm p-8">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] mb-8">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <User size={12} /> First Name
                </label>
                {isEditing ? (
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                    value={tempProfile.firstName}
                    onChange={(e) => setTempProfile({...tempProfile, firstName: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-700 px-1">{profile.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <User size={12} /> Last Name
                </label>
                {isEditing ? (
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                    value={tempProfile.lastName}
                    onChange={(e) => setTempProfile({...tempProfile, lastName: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-700 px-1">{profile.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={12} /> Email Address
                </label>
                {isEditing ? (
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-700 px-1">{profile.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Phone size={12} /> Phone Number
                </label>
                {isEditing ? (
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-700 px-1">{profile.phone}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} /> Date of Birth
                </label>
                {isEditing ? (
                  <input 
                    type="date"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                    value={tempProfile.dob}
                    onChange={(e) => setTempProfile({...tempProfile, dob: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-700 px-1">{profile.dob}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="mt-6 space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} /> Residential Address
              </label>
              {isEditing ? (
                <textarea 
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all resize-none"
                  value={tempProfile.address}
                  onChange={(e) => setTempProfile({...tempProfile, address: e.target.value})}
                />
              ) : (
                <p className="text-sm font-bold text-slate-700 px-1">{profile.address}</p>
              )}
            </div>
          </section>

          {/* MEDICAL INFORMATION */}
          <section className="bg-white rounded-xl border border-teal-400 shadow-sm p-8">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] mb-8">Medical Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Droplets size={12} className="text-red-500" /> Blood Type
                </label>
                {isEditing ? (
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
                    value={tempProfile.bloodType}
                    onChange={(e) => setTempProfile({...tempProfile, bloodType: e.target.value})}
                  >
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                  </select>
                ) : (
                  <p className="text-sm font-bold text-slate-700 px-1">{profile.bloodType}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle size={12} className="text-amber-500" /> Known Allergies
                </label>
                {isEditing ? (
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
                    value={tempProfile.allergies}
                    onChange={(e) => setTempProfile({...tempProfile, allergies: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-700 px-1">{profile.allergies}</p>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Emergency Contact
              </label>
              {isEditing ? (
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
                  value={tempProfile.emergencyContact}
                  onChange={(e) => setTempProfile({...tempProfile, emergencyContact: e.target.value})}
                />
              ) : (
                <p className="text-sm font-bold text-slate-700 px-1">{profile.emergencyContact}</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}