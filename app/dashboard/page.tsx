import type { Metadata } from "next";
import RootLayout from "@/components/root-layout";
import CollectionSchedule from "./CollectionSchedule";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Home dashboard with collection schedule and more.",
};

export default function DashboardPage() {
  return (
    <RootLayout>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Waste Collection Schedule</h2>
        <CollectionSchedule />
      </section>
    </RootLayout>
  );
}
