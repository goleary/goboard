import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const trips = [
  {
    name: "British Columbia",
    dates: "May 16 – 31, 2026",
    description: "Vancouver Island & Desolation Sound",
    href: "/private/travel/BC",
  },
  {
    name: "Jarrell Cove",
    dates: "Jul 16 – 19, 2026",
    description: "Car camping",
    href: "/private/travel/jarrell-cove",
  },
  {
    name: "Sucia Island",
    dates: "August 2026",
    description: "Kayak camping",
  },
  {
    name: "San Juan Islands",
    dates: "August 2026",
    description: "",
  },
];

export default function TravelPage() {
  return (
    <div className="space-y-6 py-6">
      <h1 className="text-2xl font-bold">Trips</h1>
      <div className="grid gap-4">
        {trips.map((trip) => {
          const content = (
            <Card className={trip.href ? "hover:bg-muted/50 transition-colors" : "opacity-75"}>
              <CardHeader>
                <CardTitle className="text-lg">{trip.name}</CardTitle>
                <CardDescription>
                  {trip.dates}
                  {trip.description ? ` — ${trip.description}` : ""}
                </CardDescription>
              </CardHeader>
            </Card>
          );
          return trip.href ? (
            <Link key={trip.name} href={trip.href}>{content}</Link>
          ) : (
            <div key={trip.name}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
