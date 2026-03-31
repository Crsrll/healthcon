"use client";
import { useRouter } from "next/navigation";
import Navibar from "@/components/layout/Navibar";

export default function LandingPage() {
  const router = useRouter();

  const handleLearnMoreClick = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">

      {/* NAV */}
      <Navibar style={"fixed top-0 left-0 right-0 z-50"}/>

      {/* HERO */}
      <section className="bg-navy-dark text-white pt-32.5 pb-22.5">
        <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          <div className="flex flex-col gap-6">

            <div className="animate-fadeSlideUp delay-100 inline-block bg-white/10 px-3 py-1 rounded-full font-bold text-blue-300 uppercase tracking-widest w-fit text-[11px]">
              Now available 24/7
            </div>

            <h1 className="animate-fadeSlideUp delay-250 font-bold leading-tight text-[52px]">
              Connect with Doctors<br />
              <span className="text-accent">ANYWHERE,</span><br />
              ANYTIME.
            </h1>

            <p className="animate-[fadeSlideUp_0.7s_ease_both] delay-400 text-blue-100/70 leading-relaxed text-[17px] max-w-110">
              HealthCon is your smart clinic queue platform — skip the waiting room and get real medical care from licensed doctors, wherever you are.
            </p>

            <div className="animate-[fadeSlideUp_0.7s_ease_both] delay-550 flex gap-3 flex-wrap pt-1">

              <button
                onClick={() => router.push("/auth/register")}
                className="bg-[#2f80d0] text-white px-7 py-3.5 rounded-[10px] font-bold text-[15px]
                           shadow-[0_4px_14px_rgba(47,128,208,0.35)]
                           transition-all duration-200
                           hover:-translate-y-0.75 hover:scale-[1.03]
                           hover:shadow-[0_10px_28px_rgba(47,128,208,0.5)]
                           hover:bg-[#1a6dbf]"
              >
                Book Appointments Now ↗
              </button>

              <button
                onClick={handleLearnMoreClick}
                className="border border-white/25 text-white px-7 py-3.5 rounded-[10px] font-bold text-[15px]
                           transition-all duration-200
                           hover:-translate-y-0.75 hover:bg-white/10 hover:border-white/50"
              >
                Learn more
              </button>

            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center h-85">
            <img
              src="/img1.png"
              alt="Doctor consultation"
              className="h-[154%] w-[135%] object-contain object-center"
            />
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="bg-white border-b border-slate-100 py-15">
        <div className="max-w-7xl mx-auto px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

          {[
            { value: "50K+", label: "Patients Served" },
            { value: "1,200+", label: "Licensed Doctors" },
            { value: "4.9★", label: "Average Rating" },
            { value: "< 5 min", label: "Avg. Wait Time" },
          ].map((stat) => (
            <div key={stat.label} className="transition-transform hover:scale-[1.08]">
              <div className="font-bold text-navy-dark text-[34px]">{stat.value}</div>
              <div className="text-slate-400 font-bold uppercase tracking-wide mt-1 text-[12px]">
                {stat.label}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* WHY */}
      <section id="about" className="bg-white py-22">
        <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

          <div className="flex flex-col gap-4">
            <h5 className="font-bold text-blue-600 uppercase tracking-widest text-[11px]">
              Why HealthCon
            </h5>
            <h2 className="font-bold text-navy-dark leading-tight text-[32px]">
              Healthcare that works around your life
            </h2>
            <p className="text-slate-500 leading-relaxed text-[15px]">
              We've rebuilt the clinic experience from the ground up — faster, simpler, and built for real people.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">

            {[
              { icon: "🩺", title: "Virtual Consultations", desc: "Connect with licensed doctors via video, voice, or chat — no waiting rooms, no commute." },
              { icon: "📅", title: "Easy Scheduling", desc: "Book same-day or future appointments 24/7, fitting your schedule perfectly." },
              { icon: "🔒", title: "Secure & Private", desc: "End-to-end encrypted records keep your health data safe and fully under control." },
              { icon: "💊", title: "Digital Prescriptions", desc: "Receive e-prescriptions instantly, sent directly to your preferred pharmacy." },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-slate-100 rounded-2xl bg-slate-50 p-7
                           transition-all duration-200
                           hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(18,40,68,0.12)]
                           hover:border-blue-200 hover:bg-white"
              >
                <div className="text-[24px] mb-3.5">{item.icon}</div>
                <h4 className="font-bold text-[17px] mb-2">{item.title}</h4>
                <p className="text-slate-500 text-[13px] leading-relaxed">{item.desc}</p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-navy-dark text-white py-22">
        <div className="max-w-7xl mx-auto px-12">

          <div className="mb-13">
            <h5 className="font-bold text-blue-400 uppercase tracking-widest text-[11px] mb-2">
              How It Works
            </h5>
            <h2 className="font-bold text-[34px] mb-2">Three steps to your doctor</h2>
            <p className="text-blue-200/50 text-[15px]">
              Getting care has never been this simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {[
              { num: "01", title: "Create Your Account", desc: "Sign up in under a minute. No paperwork, no insurance headaches — just your basic details." },
              { num: "02", title: "Choose a Doctor", desc: "Browse verified specialists by specialty, availability, and rating. Filter by language or concern." },
              { num: "03", title: "Get Seen Instantly", desc: "Join a secure video or chat session. Receive your diagnosis, notes, and prescription right away." },
            ].map((step) => (
              <div
                key={step.num}
                className="flex flex-col gap-3 p-6 rounded-2xl
                           transition-all duration-200
                           hover:-translate-y-1 hover:bg-white/5"
              >
                <div className="font-bold text-white/10 text-[36px]">{step.num}</div>
                <h3 className="font-bold text-[20px]">{step.title}</h3>
                <p className="text-blue-100/40 text-[14px] leading-relaxed">{step.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white text-center py-25 px-12">
        <div className="max-w-165 mx-auto flex flex-col gap-5.5">

          <h5 className="font-bold text-blue-600 uppercase tracking-widest text-[11px]">
            Get Started Today
          </h5>

          <h2 className="font-bold text-navy-dark text-[46px] leading-tight">
            Your health can't wait.
          </h2>

          <p className="text-slate-400 text-[17px] leading-relaxed">
            Join thousands of patients who've already made the switch to smarter, faster healthcare with HealthCon.
          </p>

          <div className="pt-2">
            <button
              onClick={() => router.push("/auth/register")}
              className="bg-[#2f80d0] text-white px-10 py-4 rounded-xl font-bold text-[17px]
                         shadow-[0_8px_24px_rgba(47,128,208,0.35)]
                         transition-all duration-200
                         hover:-translate-y-1 hover:scale-[1.04]
                         hover:shadow-[0_16px_36px_rgba(47,128,208,0.5)]
                         hover:bg-[#1a6dbf]"
            >
              Book Appointments Now ↗
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}