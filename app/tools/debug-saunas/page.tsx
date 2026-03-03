import { saunas } from "@/data/saunas/saunas";
import type { Metadata } from "next";
import Image from "next/image";
import ProviderHealth, { type PlatformGroup } from "./ProviderHealth";

export const metadata: Metadata = {
  title: "Sauna Booking Providers Debug",
  robots: "noindex",
};

export default function DebugSaunasPage() {
  const withBookingUrl = saunas.filter((s) => s.bookingUrl);
  const withPlatform = saunas.filter((s) => s.bookingPlatform);
  const withProvider = saunas.filter((s) => s.bookingProvider);
  const missingPlatform = withBookingUrl.filter((s) => !s.bookingPlatform);
  const withImages = saunas.filter((s) => s.images && s.images.length > 0);

  // Group saunas by platform
  const platformMap = new Map<string, PlatformGroup>();
  for (const s of withPlatform) {
    const platform = s.bookingPlatform!;
    if (!platformMap.has(platform)) {
      platformMap.set(platform, { platform, saunas: [] });
    }
    platformMap.get(platform)!.saunas.push({
      slug: s.slug,
      name: s.name,
      providerType: s.bookingProvider?.type ?? null,
      bookingUrl: s.bookingUrl,
    });
  }
  const platforms = [...platformMap.values()].sort(
    (a, b) => b.saunas.length - a.saunas.length
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

      <ProviderHealth platforms={platforms} />

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

      {/* Sauna Images */}
      <section>
        <h2 className="text-lg font-semibold mb-1">
          Images
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {withImages.length} of {saunas.length} saunas have images
        </p>

        <div className="space-y-6">
          {/* Saunas with images */}
          {withImages.map((s) => (
            <div key={s.slug}>
              <h3 className="text-sm font-medium mb-2">{s.name} ({s.images!.length} image{s.images!.length !== 1 ? "s" : ""})</h3>
              <div className="flex gap-2 overflow-x-auto">
                {s.images!.map((img, i) => (
                  <div key={i} className="relative w-48 aspect-[3/2] shrink-0 rounded overflow-hidden border">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Saunas without images */}
          <div>
            <h3 className="text-sm font-medium mb-2">No Images ({saunas.length - withImages.length})</h3>
            <div className="text-sm text-gray-500 flex flex-wrap gap-2">
              {saunas
                .filter((s) => !s.images || s.images.length === 0)
                .map((s) => (
                  <span
                    key={s.slug}
                    className="bg-gray-100 px-2 py-1 rounded text-xs"
                  >
                    {s.name}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
