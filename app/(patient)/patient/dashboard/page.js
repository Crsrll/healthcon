import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }) {
  const user = { name: "Melissa", email: "melissa@email.com" };

  return (
    <div className="flex min-h-screen bg-[#F4FAFA]">

      <Sidebar user={user} />

      {/* Main — takes up all remaining space on desktop */}
      <div className="flex-1 flex flex-col min-w-0">

        <header className="h-12 bg-white border-b border-[#b2d8d8]
          sticky top-0 z-20 flex items-center justify-between
          px-5 pl-14 lg:pl-5">
          <span className="text-[14px] font-medium text-[#1A1A2E]">
            Dashboard
          </span>
        </header>

        <main className="flex-1 p-5 pl-14 lg:pl-5">
          {children}
        </main>

      </div>
    </div>
  );
}