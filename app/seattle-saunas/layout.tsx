import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SeattleSaunasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header - constrained width */}
      <header className="border-b shrink-0">
        <div className="max-w-2xl mx-auto py-4 px-4 flex flex-col gap-4 items-center">
          <Link className="text-3xl" href="/">
            {`Gabe O'Leary`}
          </Link>
          <nav>
            <ul className="text-blue-600 flex gap-5 items-center justify-center">
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
                  <DropdownMenuItem>
                    <Link href="https://discoverevs.com">Discover EVs</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/tools/current-map">PNW Current Map</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/tools/lake-stats">Seattle Lake Stats</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/tools/marriage-tax-calculator">
                      Marriage Tax Calculator
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/seattle-saunas">Seattle Saunas</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ul>
          </nav>
        </div>
      </header>

      {/* Content - full width available, fills remaining height */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
