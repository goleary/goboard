import Navbar from "@/components/navbar";

export default function LifespanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f8f5ee]">
      <header className="border-b border-[#e5e0d6]">
        <div className="max-w-2xl mx-auto py-4 px-4 flex flex-col gap-4 items-center">
          <Navbar />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
