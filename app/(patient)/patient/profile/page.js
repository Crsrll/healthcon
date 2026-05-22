"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Mail, Phone, Calendar, MapPin, Droplets, AlertCircle, ShieldCheck, Camera, Edit3, Save, X, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useUser } from "@/hooks/useUpdate";
import { uploadImage } from "@/lib/uploadImage";

export default function PatientProfilePage() {
  const { user, loading: authLoading } = useAuth(); // ✅ Get loading state
  const { updateUser, saving } = useUser();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ Initialize with empty values
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    bloodType: "",
    allergies: "",
    emergencyContact: "",
    image: null,
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });

  // ✅ Update profile when user data becomes available
  useEffect(() => {
    if (user) {
      console.log("User data received:", user); // Debug: see what's in user
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        address: user.address || "",
        bloodType: user.bloodType || "",
        allergies: user.allergies || "",
        emergencyContact: user.emergencyContact || "",
        image: user.image || null,
      });
      setTempProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        address: user.address || "",
        bloodType: user.bloodType || "",
        allergies: user.allergies || "",
        emergencyContact: user.emergencyContact || "",
        image: user.image || null,
      });
    }
  }, [user]); // Re-run when user object changes

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-teal-500" />
      </div>
    );
  }

  // If no user after loading, show error
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Please log in to view your profile</p>
          <Link href="/auth/login" className="text-teal-500 mt-2 inline-block">Go to Login</Link>
        </div>
      </div>
    );
  }

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Show local preview immediately
    setTempProfile(p => ({ ...p, image: URL.createObjectURL(file) }));
    
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setTempProfile(p => ({ ...p, image: url }));
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    await updateUser({
      firstName: tempProfile.firstName,
      lastName: tempProfile.lastName,
      phone: tempProfile.phone,
      dob: tempProfile.dob,
      address: tempProfile.address,
      bloodType: tempProfile.bloodType,
      allergies: tempProfile.allergies,
      emergencyContact: tempProfile.emergencyContact,
      image: tempProfile.image,
    });
    setProfile({ ...tempProfile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setIsEditing(false);
  };

  const isBusy = saving || uploading;

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 font-sans">

      {/* HEADER */}
      <div className="bg-[#1a365d] text-white pt-10 pb-14 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
              <Link href="/patient/dashboard" className="hover:text-white transition-colors">Patient</Link>
              <ChevronRight size={10} />
              <span className="text-white/60">Profile</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-bold">My Account</h1>
            <p className="text-blue-200/70 text-sm mt-1">Manage your personal information and medical preferences.</p>
          </div>

          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}
              className="bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95">
              <Edit3 size={16} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={isBusy}
                className="bg-teal-500 hover:bg-teal-400 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95">
                {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {uploading ? "Uploading..." : saving ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={handleCancel} disabled={isBusy}
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all border border-white/10">
                <X size={16} /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 -mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Avatar */}
        <div className="space-y-4">
          <section className="bg-white rounded-xl border border-teal-400 shadow-xl p-6 text-center">
            <div className="relative inline-block">
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              <div onClick={handleImageClick}
                className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-md overflow-hidden bg-teal-50
                  ${isEditing ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}>
                {uploading ? (
                  <Loader2 size={28} className="animate-spin text-teal-400" />
                ) : tempProfile.image ? (
                  <img src={tempProfile.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-teal-600">
                    {tempProfile.firstName?.[0]}{tempProfile.lastName?.[0]}
                  </span>
                )}
              </div>
              {isEditing && (
                <div onClick={handleImageClick}
                  className="absolute bottom-0 right-0 p-2 bg-[#1a365d] text-white rounded-xl border-2 border-white shadow cursor-pointer hover:scale-110 transition-transform">
                  <Camera size={12} />
                </div>
              )}
            </div>
            <h2 className="mt-3 text-lg font-black text-slate-900">{profile.firstName} {profile.lastName}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Patient</p>
          </section>

          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 flex items-center gap-3">
            <ShieldCheck className="text-teal-600 shrink-0" size={20} />
            <div>
              <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Verified Account</p>
              <p className="text-[11px] text-teal-600/80">Your data is protected.</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Info - Rest of your JSX remains exactly the same */}
        <div className="lg:col-span-2 space-y-5">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "First Name",    icon: <User size={11}/>,     key: "firstName",  type: "text" },
                { label: "Last Name",     icon: <User size={11}/>,     key: "lastName",   type: "text" },
                { label: "Email Address", icon: <Mail size={11}/>,     key: "email",      type: "email", disabled: true },
                { label: "Phone Number",  icon: <Phone size={11}/>,    key: "phone",      type: "text" },
                { label: "Date of Birth", icon: <Calendar size={11}/>, key: "dob",        type: "date" },
              ].map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">{f.icon} {f.label}</label>
                  {isEditing && !f.disabled ? (
                    <input type={f.type}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500 transition-all"
                      value={tempProfile[f.key] || ""}
                      onChange={e => setTempProfile(p => ({ ...p, [f.key]: e.target.value }))} />
                  ) : (
                    <p className="text-sm font-semibold text-slate-700 px-1">{profile[f.key] || "—"}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={11}/> Address</label>
              {isEditing ? (
                <textarea rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500 resize-none"
                  value={tempProfile.address || ""}
                  onChange={e => setTempProfile(p => ({ ...p, address: e.target.value }))} />
              ) : (
                <p className="text-sm font-semibold text-slate-700 px-1">{profile.address || "—"}</p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-6">Medical Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Droplets size={11} className="text-red-500"/> Blood Type</label>
                {isEditing ? (
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500"
                    value={tempProfile.bloodType || ""}
                    onChange={e => setTempProfile(p => ({ ...p, bloodType: e.target.value }))}>
                    <option value="">Select</option>
                    {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(t => <option key={t}>{t}</option>)}
                  </select>
                ) : (
                  <p className="text-sm font-semibold text-slate-700 px-1">{profile.bloodType || "—"}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><AlertCircle size={11} className="text-amber-500"/> Known Allergies</label>
                {isEditing ? (
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500"
                    value={tempProfile.allergies || ""}
                    onChange={e => setTempProfile(p => ({ ...p, allergies: e.target.value }))} />
                ) : (
                  <p className="text-sm font-semibold text-slate-700 px-1">{profile.allergies || "—"}</p>
                )}
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact</label>
              {isEditing ? (
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500"
                  value={tempProfile.emergencyContact || ""}
                  onChange={e => setTempProfile(p => ({ ...p, emergencyContact: e.target.value }))} />
              ) : (
                <p className="text-sm font-semibold text-slate-700 px-1">{profile.emergencyContact || "—"}</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}