"use client";
import { useState, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import { FileText, Download, Plus, Search, Clipboard, ShieldCheck, Clock, ChevronRight } from "lucide-react";

export default function MedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [records, setRecords] = useState([
    { id: 1, type: "Lab Result", title: "Complete Blood Count", clinic: "Joseph Community Health", date: "Mar 15, 2026", status: "Final", category: "Laboratory" },
    { id: 2, type: "Prescription", title: "Amoxicillin Treatment Plan", clinic: "CDO Outpatient", date: "Mar 10, 2026", status: "Active", category: "Pharmacy" },
    { id: 3, type: "Medical Cert", title: "Fit to Work Clearance", clinic: "Iligan Medical Center", date: "Feb 28, 2026", status: "Expired", category: "Documents" },
    { id: 4, type: "Imaging", title: "Chest X-Ray (PA View)", clinic: "Joseph Community Health", date: "Feb 15, 2026", status: "Final", category: "Radiology" },
  ]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesTab = activeTab === "All" || r.category === activeTab;
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.clinic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, records]);

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsDetailsOpen(true);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    // Logic to add a new record (Mock)
    const formData = new FormData(e.target);
    const newEntry = {
      id: Date.now(),
      title: formData.get("title"),
      clinic: formData.get("clinic"),
      category: formData.get("category"),
      type: "Uploaded Doc",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: "Pending Review"
    };
    setRecords([newEntry, ...records]);
    setIsUploadOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-12 font-sans">
      
      {/* ── HEADER ── */}
      <div className="bg-[#1a365d] text-white pt-10 pb-16 px-6">
            <nav className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <Link href = "/patient/dashboard" className="hover:text-white transition-colors">
              <span>Patient</span>
              </Link>
              <ChevronRight size={10} />
              <span className="text-white/60">Records</span>
            </nav>
        <div className="max-w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-">
          <div>
            <h1 className="text-3xl font-bold">Medical Records</h1>
            <p className="text-teal-300 text-sm mt-1">Your complete health history in one secure place.</p>
          </div>
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-xl shadow-teal-900/40 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Upload Record
          </button>
        </div>
      </div>

      <div className="max-w-full mx-auto px-6 mt-6 space-y-6">
        
        {/* ── 1. QUICK HEALTH PROFILE ── */}
        {/* <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Blood Type", value: healthProfile.bloodType, icon: "🩸", color: "text-red-600", bg: "bg-red-50" },
            { label: "Weight", value: healthProfile.weight, icon: "⚖️", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Allergies", value: healthProfile.allergies[0], icon: "⚠️", color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Status", value: "Verified", icon: "✅", color: "text-teal-600", bg: "bg-teal-50" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm font-black text-slate-800">{item.value}</span>
              </div>
            </div>
          ))}
        </section> */}

        {/* ── 2. SEARCH & TABS ── */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto no-scrollbar">
            {["All", "Laboratory", "Pharmacy", "Radiology", "Documents"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab ? "bg-[#1a365d] text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        {/* ── 3. RECORDS LIST ── */}
        <section className="space-y-3">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <div key={record.id} className="bg-white p-5  border border-slate-200 shadow-sm hover:border-teal-500 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                      <FileText size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800">{record.title}</h3>
                        <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase tracking-tighter">
                          {record.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{record.clinic} · {record.date}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-teal-600 uppercase">
                          <ShieldCheck size={12} /> Verified
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                          <Clock size={12} /> {record.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-auto md:ml-0">
                    <button className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all border border-transparent hover:border-teal-100">
                      <Download size={20} />
                    </button>
                    <button onClick={() => handleViewDetails(record)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white py-20 rounded-3xl border-2 border-dashed border-slate-200 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clipboard className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-bold">No records found in this category.</p>
              <p className="text-slate-400 text-xs mt-1">Try changing your filters or upload a new document.</p>
            </div>
          )}
        </section>

        {/* ── 4. SECURITY FOOTER ── */}
        <div className="flex items-center justify-center gap-2 py-6 opacity-50">
          <ShieldCheck size={14} className="text-teal-600" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            End-to-End Encrypted Health Data
          </p>
        </div>
      </div>

    <Modal 
        isOpen={isUploadOpen} 
        onClose={() => {
            setIsUploadOpen(false);
            setSelectedFile(null); // Reset file on close
        }} 
        title="Upload Medical Document"
        >
        <form onSubmit={handleUpload} className="space-y-5">
            {/* ── PHOTO UPLOAD ZONE ── */}
            <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Document Photo / Scan</label>
            <div className="relative">
                <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                id="file-upload"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <label 
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-[1.5rem] cursor-pointer transition-all ${
                    selectedFile 
                    ? "border-teal-500 bg-teal-50/30" 
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-teal-300"
                }`}
                >
                {selectedFile ? (
                    <div className="flex flex-col items-center text-center px-4">
                    <ShieldCheck className="text-teal-500 mb-1" size={24} />
                    <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{selectedFile.name}</p>
                    <p className="text-[9px] text-teal-600 font-bold uppercase mt-1">Click to change photo</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                        <Plus className="text-slate-400" size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-500">Click to upload or drag photo</p>
                    <p className="text-[9px] text-slate-400 uppercase mt-1">PNG, JPG up to 10MB</p>
                    </div>
                )}
                </label>
            </div>
            </div>

            {/* ── DOCUMENT DETAILS ── */}
            <div className="grid grid-cols-1 gap-4">
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Document Title</label>
                <input name="title" required placeholder="e.g. Annual Physical Exam" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Issuing Clinic</label>
                <input name="clinic" required placeholder="Clinic Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-teal-500 transition-all" />
                </div>
                <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                <select name="category" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-teal-500 transition-all appearance-none">
                    <option>Laboratory</option>
                    <option>Pharmacy</option>
                    <option>Radiology</option>
                    <option>Documents</option>
                </select>
                </div>
            </div>
            </div>

            <button 
            type="submit" 
            disabled={!selectedFile}
            className="w-full bg-teal-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest mt-4 shadow-lg shadow-teal-900/20 active:scale-95 transition-all"
            >
            Confirm & Save Record
            </button>
        </form>
        </Modal>

      {/* ── MODAL: VIEW DETAILS ── */}
      <Modal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        title="Record Details"
      >
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <h3 className="text-xl font-black text-slate-900">{selectedRecord?.title}</h3>
            <p className="text-xs font-bold text-teal-600 uppercase mt-1">{selectedRecord?.clinic}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-100 rounded-2xl">
              <p className="text-[9px] font-black text-slate-400 uppercase">Date Issued</p>
              <p className="text-sm font-bold text-slate-700">{selectedRecord?.date}</p>
            </div>
            <div className="p-4 bg-white border border-slate-100 rounded-2xl">
              <p className="text-[9px] font-black text-slate-400 uppercase">Status</p>
              <p className="text-sm font-bold text-slate-700">{selectedRecord?.status}</p>
            </div>
          </div>
          <button className="w-full bg-[#1a365d] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </Modal>

    </main>
  );
}