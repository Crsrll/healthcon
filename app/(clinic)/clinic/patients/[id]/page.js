"use client";
import { useParams } from "next/navigation";
import { useState, useRef } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { 
  ChevronLeft, Pill, Beaker, FileText, Calendar, 
  Droplets, AlertCircle, Phone, Send, Upload, Trash2, CheckCircle 
} from "lucide-react";

export default function PatientProfileView() {
  const params = useParams();
  const patientId = params.id;
  
  // --- STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [history, setHistory] = useState([]); // This holds the added records
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Form States
  const [medName, setMedName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [testName, setTestName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const DUMMY_PATIENTS = [
    { id: "1", name: "John Wick", age: 45, blood: "O+", allergies: "None", phone: "+63 912 345 6789", email: "john@wick.com" },
    { id: "2", name: "Sarah Connor", age: 32, blood: "A-", allergies: "Penicillin", phone: "+63 917 555 0000", email: "sarah@sky.net" },
  ];

  const patient = DUMMY_PATIENTS.find(p => p.id === patientId);

  if (!patient) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Patient Not Found</h2>
        <Link href="/clinic/bookings" className="text-teal-600 underline mt-4 block">Back to Bookings</Link>
      </div>
    );
  }

  // --- HANDLERS ---
  const openActionModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    
    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: modalType === "prescribe" ? "Prescription" : "Lab Result",
      title: modalType === "prescribe" ? medName : testName,
      detail: modalType === "prescribe" ? instructions : (selectedFile ? selectedFile.name : "No file attached"),
      icon: modalType === "prescribe" ? <Pill size={16}/> : <Beaker size={16}/>,
      color: modalType === "prescribe" ? "text-teal-600 bg-teal-50" : "text-blue-600 bg-blue-50"
    };

    setHistory([newRecord, ...history]);
    
    // Reset form and close
    setMedName("");
    setInstructions("");
    setTestName("");
    setSelectedFile(null);
    setIsModalOpen(false);
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    setHistory(history.filter(h => h.id !== itemToDelete.id));
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-12">
      
      {/* ── SLIM HEADER ── */}
      <div className="bg-white text-black py-6 px-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/clinic/bookings" className="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">{patient.name}</h1>
              <p className="text-[10px] text-teal-500 font-bold uppercase tracking-widest">Patient ID: #HC-00{patient.id}</p>
            </div>
          </div>    
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── LEFT COLUMN: VITALS ── */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl font-black border-4 border-white shadow-md">
                {patient.name[0]}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Droplets className="text-red-500" size={18} />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Blood Type</p>
                  <p className="text-sm font-bold text-slate-800">{patient.blood}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <AlertCircle className="text-amber-600" size={18} />
                <div>
                  <p className="text-[9px] font-black text-amber-600 uppercase">Allergies</p>
                  <p className="text-sm font-bold text-amber-800">{patient.allergies}</p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
               <p className="text-xs text-slate-500 flex items-center gap-2"><Phone size={14}/> {patient.phone}</p>
               <p className="text-xs text-slate-500 flex items-center gap-2"><Calendar size={14}/> {patient.age} years old</p>
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN: ACTIONS & HISTORY ── */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Clinical Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => openActionModal("prescribe")} className="flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-teal-600/20">
                <Pill size={20} /> Prescribe Medication
              </button>
              <button onClick={() => openActionModal("upload")} className="flex items-center justify-center gap-3 bg-[#1a365d] hover:bg-blue-800 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-blue-900/20">
                <Beaker size={20} /> Upload Lab Result
              </button>
            </div>
          </section>

          {/* MEDICAL HISTORY TABLE (Now Dynamic) */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical History</h3>
            </div>
            
            {history.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {history.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.type} • {item.date}</p>
                        <p className="text-xs text-slate-500 mt-0.5 italic">{item.detail}</p>
                      </div>
                    </div>
                    <button onClick={() => confirmDelete(item)}  className="text-slate-300 hover:text-red-500 p-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileText className="mx-auto text-slate-200 mb-3" size={48} />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">No previous records found</p>
                <p className="text-xs text-slate-300 mt-1">Records will appear here once clinical actions are performed.</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── DYNAMIC MODAL ── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalType === "prescribe" ? "New Prescription" : "Upload Laboratory Result"}
      >
        <form onSubmit={handleAddRecord} className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
            <h4 className="text-base font-black text-slate-800 uppercase">{patient.name}</h4>
          </div>

          {modalType === "prescribe" ? (
            <div className="space-y-4">
              <input 
                required
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                placeholder="Medication Name (e.g. Amoxicillin)" 
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" 
              />
              <textarea 
                required
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Dosage Instructions..." 
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 h-24 resize-none" 
              />
            </div>
          ) : (
            <div className="space-y-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,application/pdf"
              />
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors"
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center text-teal-600">
                    <CheckCircle size={32} className="mb-2" />
                    <p className="text-xs font-bold uppercase">{selectedFile.name}</p>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="text-xs font-bold text-slate-500 uppercase">Click to upload PDF or Image</p>
                  </>
                )}
              </div>
              <input 
                required
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Test Name (e.g. Blood Test)" 
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500" 
              />
            </div>
          )}

          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20">
            <Send size={14} /> {modalType === "prescribe" ? "Issue Prescription" : "Upload & Save"}
          </button>
        </form>
      </Modal>

      {/* ── DELETE CONFIRMATION MODAL ── */}
        <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Confirm Deletion"
        >
        <div className="space-y-6">
            {/* Warning Icon & Text */}
            <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Are you sure?</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                You are about to delete the record for <br />
                <span className="font-bold text-slate-800">"{itemToDelete?.title}"</span>. 
                This action cannot be undone.
            </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
            <button 
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-900/20 transition-all"
            >
                Yes, Delete
            </button>
            <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all"
            >
                Cancel
            </button>
            </div>
        </div>
        </Modal>
    </main>
  );
}