export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Break out of the root layout's max-w-2xl constraint
  // by using a wider container for private/admin pages
  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 px-4">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
