import { saunas } from "@/data/saunas/saunas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sauna Booking Providers Debug",
  robots: "noindex",
};

export default function DebugSaunasPage() {
  const withPlatform = saunas.filter((s) => s.bookingPlatform);
  const withProvider = saunas.filter((s) => s.bookingProvider);
  const withBookingUrl = saunas.filter((s) => s.bookingUrl);
  const missingPlatform = withBookingUrl.filter((s) => !s.bookingPlatform);

  const platformCounts = new Map<string, typeof saunas>();
  for (const s of withPlatform) {
    const platform = s.bookingPlatform!;
    if (!platformCounts.has(platform)) platformCounts.set(platform, []);
    platformCounts.get(platform)!.push(s);
  }
  const sortedPlatforms = [...platformCounts.entries()].sort(
    (a, b) => b[1].length - a[1].length
  );

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Sauna Booking Providers</h1>
        <p className="text-sm text-gray-500 mt-1">
          {saunas.length} total saunas &middot;{" "}
          {withBookingUrl.length} with booking URL &middot;{" "}
          {withPlatform.length} with platform identified &middot;{" "}
          {withProvider.length} with live availability
        </p>
      </div>

      {/* Platforms by usage */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Platforms by Usage</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4">Platform</th>
              <th className="py-2 pr-4 text-right">Total</th>
              <th className="py-2 pr-4 text-right">Configured</th>
              <th className="py-2">Saunas</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlatforms.map(([platform, list]) => {
              const configured = list.filter((s) => s.bookingProvider).length;
              return (
                <tr key={platform} className="border-b">
                  <td className="py-2 pr-4 font-mono">{platform}</td>
                  <td className="py-2 pr-4 text-right">{list.length}</td>
                  <td className="py-2 pr-4 text-right">
                    {configured > 0 ? (
                      <span className="text-green-700">
                        {configured}/{list.length}
                      </span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                  <td className="py-2 text-gray-500 text-xs">
                    {list.map((s) => s.name).join(", ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Configured saunas (with live availability) */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          Live Availability Configured ({withProvider.length})
        </h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4">Sauna</th>
              <th className="py-2 pr-4">Provider</th>
              <th className="py-2 text-right">Appointment Types</th>
            </tr>
          </thead>
          <tbody>
            {withProvider.map((s) => (
              <tr key={s.slug} className="border-b">
                <td className="py-2 pr-4">{s.name}</td>
                <td className="py-2 pr-4 font-mono">
                  {s.bookingProvider!.type}
                </td>
                <td className="py-2 text-right">
                  {s.bookingProvider!.type === "acuity"
                    ? s.bookingProvider!.appointmentTypes.length
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Missing platform identification */}
      {missingPlatform.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">
            Missing Platform ({missingPlatform.length})
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            Saunas with a booking URL but no <code>bookingPlatform</code> set.
          </p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4">Sauna</th>
                <th className="py-2">Booking URL</th>
              </tr>
            </thead>
            <tbody>
              {missingPlatform.map((s) => (
                <tr key={s.slug} className="border-b">
                  <td className="py-2 pr-4">{s.name}</td>
                  <td className="py-2 font-mono text-xs text-gray-500 truncate max-w-md">
                    <a
                      href={s.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600"
                    >
                      {s.bookingUrl}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* No booking URL at all */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          No Booking URL ({saunas.length - withBookingUrl.length})
        </h2>
        <div className="text-sm text-gray-500 flex flex-wrap gap-2">
          {saunas
            .filter((s) => !s.bookingUrl)
            .map((s) => (
              <span
                key={s.slug}
                className="bg-gray-100 px-2 py-1 rounded text-xs"
              >
                {s.name}
              </span>
            ))}
        </div>
      </section>
    </div>
  );
}
