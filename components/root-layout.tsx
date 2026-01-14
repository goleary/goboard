import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

      <ul className="text-blue-600 flex  gap-5 m-auto items-center justify-center md:flex-row">
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
          <Link className="hover:text-blue-500" href="/travel">
            Travel
          </Link>
        </li>
        <DropdownMenu>
          <DropdownMenuTrigger>Tools</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="https://discoverevs.com">
                Discover EVs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/tools/current-map">
                PNW Current Map
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/tools/lake-stats">
                Seattle Lake Stats
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/tools/marriage-tax-calculator">
                Marriage Tax Calculator
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/tools/saunas">
                Sauna Map
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ul>
      <div className="w-full px-4 md:px-0">{children}</div>
    </div>
  );
}
