"use client";
import { useState, useEffect } from "react";
import { useUser } from '@/hooks/useUpdate';
import { useClinic } from '@/hooks/useClinic';
import { useAuth } from '@/context/authContext';

export default function EditPage() {
	const { updateUser, saving } = useUser();
	const { user } = useAuth();
	const userId = user?.uid;
	const { clinic, loading:clinicLoading } = useClinic(userId);
	const [clinicName, setClinicName] = useState("");
	const [city, setCity] = useState("");
	const [email, setEmail] = useState("");
	const [address, setAddress] = useState("");
	const [about, setAbout] = useState("");
	const [specialty, setSpecialty] = useState([]);
	const [specInput, setSpecInput] = useState("");
	const [services, setServices] = useState([]);
	const [serviceInput, setServiceInput] = useState("");
	const [isClinicOpen, setIsClinicOpen] = useState(true);
	const [phone, setPhone] = useState("");
	const DEFAULT_HOURS = {
	  Monday:    { open: "8:00 AM", close: "5:00 PM" },
	  Tuesday:   { open: "8:00 AM", close: "5:00 PM" },
	  Wednesday: { open: "8:00 AM", close: "5:00 PM" },
	  Thursday:  { open: "8:00 AM", close: "5:00 PM" },
	  Friday:    { open: "8:00 AM", close: "5:00 PM" },
	  Saturday:  { open: "9:00 AM", close: "3:00 PM" },
	  Sunday:    { open: "Closed",  close: "Closed"  },
	};
	const [hours, setHours] = useState(DEFAULT_HOURS);
	
	const fields = [
	  { label: "Clinic Name", value: clinicName, setter: setClinicName },
	  { label: "Location / City", value: city, setter: setCity },
	  { label: "Contact Number", value: phone, setter: setPhone },
	  { label: "Email Address", value: email, setter: setEmail },
	];
	
	useEffect(() => {
		if (!clinic) return;
		  setClinicName(clinic.clinicName || "");
		  setCity(clinic.city || "");
		  setEmail(clinic.email || "");
		  setAddress(clinic.address || "");
		  setAbout(clinic.about || "");
		  setSpecialty(clinic.specialty || []);
		  setServices(clinic.services || []);
		  setIsClinicOpen(clinic.isClinicOpen ?? true);
		  setPhone(clinic.phone || "");
		  if (clinic.hours) setHours({ ...DEFAULT_HOURS, ...clinic.hours });
	}, [clinic]);
	
	console.log(clinic);
	console.log(user);
  
	const handleSave = async () => {
	  await updateUser({
		clinicName,
		city,
		email,
		address,
		about,
		specialty,
		services,
		isClinicOpen,
		hours
	  });
	  
	  {saving && alert("saved!");}
	};

  // --- Logic: Add Specialization ---
  const addSpec = (e) => {
    e.preventDefault();
    if (!specInput.trim()) return;
    if (!specialty.includes(specInput)) {
      setSpecialty([...specialty, specInput.trim()]);
    }
    setSpecInput(""); // Clear input
  };

  const removeSpec = (targetSpec) => {
    setSpecialty(specialty.filter(s => s !== targetSpec));
  };

  const addService = (e) => {
    e.preventDefault();
    if (!serviceInput.trim()) return;
    setServices([...services, serviceInput.trim()]);
    setServiceInput("");
  };

  const removeService = (targetService) => {
    setServices(services.filter(s => s !== targetService));
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Clinic Information</h2>
          <p className="text-xs text-slate-400 mt-0.5">Update your clinic's public profile</p>
        </div>
        <button className="bg-healthcon-blue hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors" onClick={handleSave}>
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(({ label, value, setter }) => (
				  <div key={label}>
					<label className="text-xs font-semibold text-slate-600 mb-1.5 block">
					  {label}
					</label>

					<input
					  value={value}
					  onChange={(e) => setter(e.target.value)}
					  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
					/>
				  </div>
				))}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Full Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">About / Description</label>
              <textarea rows={4} value={about} onChange={(e) => setAbout(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-400 transition-colors resize-none" />
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operating Hours</h3>
            {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
			  <div key={day} className="flex items-center gap-4">
				<span className="text-sm font-medium text-slate-700 w-24 shrink-0">{day}</span>
				<input
				  value={hours[day].open || ""}
				  onChange={(e) => setHours(prev => ({ ...prev, [day]: { ...prev[day], open: e.target.value } }))}
				  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-400 transition-colors"
				/>
				<span className="text-slate-400 text-sm shrink-0">to</span>
				<input
				  value={hours[day].close || ""}
				  onChange={(e) => setHours(prev => ({ ...prev, [day]: { ...prev[day], close: e.target.value } }))}
				  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-400 transition-colors"
				/>
			  </div>
			))}
          </section>
        </div>

        <div className="space-y-4">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Specializations</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {specialty.map(s => (
                <span key={s} className="flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full px-3 py-1.5">
                  {s}
                  <button onClick={() => removeSpec(s)} className="text-teal-400 hover:text-red-400 transition-colors">✕</button>
                </span>
              ))}
            </div>
            <form onSubmit={addSpec} className="flex gap-2">
              <input 
                placeholder="Add specialization..." 
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400 transition-colors" 
                value={specInput} 
                onChange={e => setSpecInput(e.target.value)} 
              />
              <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold px-3 py-2 rounded-lg transition-colors">+</button>
            </form>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Services Offered</h3>
            <div className="space-y-2 mb-3">
              {services.map(s => (
                <div key={s} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-slate-700">{s}</span>
                  <button onClick={() => removeService(s)} className="text-slate-300 hover:text-red-400 transition-colors text-xs">Remove</button>
                </div>
              ))}
            </div>
            <form onSubmit={addService} className="flex gap-2">
              <input 
                placeholder="Add service..." 
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-400 transition-colors" 
                value={serviceInput}
                onChange={e => setServiceInput(e.target.value)}
              />
              <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold px-3 py-2 rounded-lg transition-colors">+</button>
            </form>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Clinic Status</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {isClinicOpen ? "Currently Open" : "Currently Closed"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Visible in the public directory</p>
              </div>
              <div 
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${isClinicOpen ? 'bg-teal-500' : 'bg-slate-300'}`}
                onClick={() => setIsClinicOpen(!isClinicOpen)}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isClinicOpen ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}