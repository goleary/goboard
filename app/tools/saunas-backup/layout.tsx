import Navbar from "@/components/navbar";

export default function SaunasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh flex flex-col overflow-hidden overscroll-none touch-manipulation fixed inset-0">
      {/* Header - constrained width - hidden on mobile */}
      <header className="hidden lg:block border-b shrink-0">
        <div className="max-w-2xl mx-auto py-4 px-4 flex flex-col gap-4 items-center">
          <Navbar />
        </div>
      </header>

      {/* Content - full width available, fills remaining height */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
