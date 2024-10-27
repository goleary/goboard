import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create any shared layout or styles here
  return (
    <div className="max-w-2xl m-auto text-md py-6 flex flex-col gap-4 items-center">
      <Link className="text-3xl" href="/">
        {`Gabe O'Leary`}
      </Link>

      <ul className="text-blue-600 flex flex-row gap-3 m-auto items-center justify-center">
        <li>
          <Link className="hover:text-blue-500" href="/about">
            About
          </Link>
        </li>
        <li>
          <Link className="hover:text-blue-500" href="/posts">
            Posts
          </Link>
        </li>
        <li>
          <Link className="hover:text-blue-500" href="/current-map">
            PNW Current Map
          </Link>
        </li>
        <li>
          <Link className="hover:text-blue-500" href="/lake-stats">
            Seattle Lake Stats
          </Link>
        </li>
      </ul>
      <div className="w-full px-4 md:px-0">{children}</div>
    </div>
  );
}
