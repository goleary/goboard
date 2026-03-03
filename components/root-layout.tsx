import Navbar from "./navbar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl m-auto text-md py-6 flex flex-col gap-4 items-center">
      <Navbar />
      <div className="w-full px-4 md:px-0">{children}</div>
    </div>
  );
}
