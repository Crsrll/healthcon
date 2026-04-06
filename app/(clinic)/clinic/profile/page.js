"use client";

export default function ClinicProfile() {
  // ── DUMMY DATA ──
  const clinic = {
    name: "Joseph Community Health",
    specialization: ["Internal Medicine", "General Practice"],
    address: "Sunrise St., Dapitan City, Zamboanga del Norte",
    location: "Dapitan City",
    contact: "(065) 123-4567",
    email: "joseph@healthcon.ph",
    hours: "Mon–Sat · 8:00 AM – 5:00 PM",
    about:
      "A community health clinic dedicated to providing affordable and accessible healthcare services to local residents.",
    services: [
      "General Consultation",
      "Laboratory Services",
      "Minor Surgery",
    ],
    amenities: ["Air-conditioned", "Walk-in Accepted", "PhilHealth"],
  };

  const doctors = [
    {
      id: 1,
      name: "Dr. Ben Villanueva",
      specialization: "Internal Medicine",
      schedule: "Mon–Fri, 8AM–12PM",
      available: true,
      queue: 3,
    },
    {
      id: 2,
      name: "Dr. Claire Mendoza",
      specialization: "Ob-Gyne",
      schedule: "Tue, Thu, 1PM–5PM",
      available: true,
      queue: 1,
    },
    {
      id: 3,
      name: "Dr. Paolo Gutierrez",
      specialization: "General Practice",
      schedule: "Mon, Wed, Fri",
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* ABOUT */}
          <section className="bg-white rounded-2xl border p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase mb-3">
              About
            </h2>
            <p className="text-sm text-slate-600">{clinic.about}</p>

            <div className="flex gap-2 mt-4 flex-wrap">
              {clinic.amenities.map((a) => (
                <span
                  key={a}
                  className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-lg"
                >
                  ✓ {a}
                </span>
              ))}
            </div>
          </section>

          {/* DOCTORS */}
          <section className="bg-white rounded-2xl border p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase mb-4">
              Doctors
            </h2>

            <div className="space-y-4">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between border rounded-xl p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {doc.name}
                    </p>
                    <p className="text-xs text-teal-600">
                      {doc.specialization}
                    </p>
                    <p className="text-xs text-slate-400">
                      {doc.schedule}
                    </p>
                  </div>

                  <div className="text-right">
                    {doc.available ? (
                      <>
                        <p className="text-xs text-green-600 font-bold">
                          Available
                        </p>
                        <p className="text-xs text-slate-400">
                          {doc.queue} in line
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-amber-500 font-bold">
                        Off-duty
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* INFO */}
          <section className="bg-white rounded-2xl border p-5 shadow-sm">
            <h2 className="text-xs font-bold text-slate-800 uppercase mb-4">
              Clinic Info
            </h2>

            <div className="space-y-3 text-sm text-slate-600">
              <p>🕒 {clinic.hours}</p>
              <p>📞 {clinic.contact}</p>
              <p>✉️ {clinic.email}</p>
              <p>📍 {clinic.location}</p>
            </div>
          </section>

          {/* SERVICES */}
          <section className="bg-white rounded-2xl border p-5 shadow-sm">
            <h2 className="text-xs font-bold text-slate-800 uppercase mb-4">
              Services
            </h2>

            <div className="space-y-2">
              {clinic.services.map((s) => (
                <div
                  key={s}
                  className="text-sm text-slate-700 border-b pb-1"
                >
                  {s}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}