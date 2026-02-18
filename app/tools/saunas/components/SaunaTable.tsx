"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, Waves, Leaf, Snowflake, Mail } from "lucide-react";
import { type Sauna, formatPrice } from "@/data/saunas/saunas";

interface SaunaTableProps {
  saunas: Sauna[];
  compact?: boolean;
  onSaunaClick?: (sauna: Sauna) => void;
  selectedSlug?: string;
  isMobile?: boolean;
}

function BooleanCell({ value }: { value: boolean }) {
  return value ? (
    <Check className="h-4 w-4 text-green-600" />
  ) : (
    <X className="h-4 w-4 text-muted-foreground/50" />
  );
}

function CompactSaunaList({ 
  saunas, 
  onSaunaClick,
  selectedSlug,
  isMobile = false
}: { 
  saunas: Sauna[]; 
  onSaunaClick?: (sauna: Sauna) => void;
  selectedSlug?: string;
  isMobile?: boolean;
}) {
  return (
    <div className="divide-y">
      {saunas.map((sauna) => (
        <button
          key={sauna.slug}
          type="button"
          onClick={() => onSaunaClick?.(sauna)}
          data-umami-event="list-sauna-click"
          data-umami-event-sauna={sauna.slug}
          className={`block w-full text-left p-3 hover:bg-muted/50 transition-colors ${
            selectedSlug === sauna.slug ? "bg-muted" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{sauna.name}</p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                {sauna.sessionLengthMinutes != null && sauna.sessionLengthMinutes > 0 && (
                  <span>{sauna.sessionLengthMinutes} min</span>
                )}
                {sauna.coldPlunge && (
                  <span title="Cold Plunge" className="flex items-center">
                    <Snowflake className="h-3 w-3 text-sky-500" />
                  </span>
                )}
                {sauna.waterfront && (
                  <span title="Waterfront" className="flex items-center">
                    <Waves className="h-3 w-3 text-blue-500" />
                  </span>
                )}
                {sauna.naturalPlunge && (
                  <span title="Natural Plunge" className="flex items-center">
                    <Leaf className="h-3 w-3 text-green-600" />
                  </span>
                )}
                {sauna.soakingTub && (
                  <span title="Soaking Tub">♨️</span>
                )}
              </div>
            </div>
            {sauna.sessionPrice > 0 && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                {formatPrice(sauna)}
              </Badge>
            )}
          </div>
        </button>
      ))}
      {/* Only show link on desktop - mobile has it in sticky footer */}
      {!isMobile && (
        <a
          href="mailto:oleary.gabe@gmail.com?subject=Sauna%20Map%20-%20Missing%20or%20Incorrect%20Info"
          className="flex items-center gap-2 p-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <Mail className="h-3 w-3" />
          <span>Missing something? Let me know</span>
        </a>
      )}
    </div>
  );
}

export function SaunaTable({ saunas, compact = false, onSaunaClick, selectedSlug, isMobile = false }: SaunaTableProps) {
  if (saunas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No saunas match your filters. Try adjusting your search criteria.
      </div>
    );
  }

  if (compact) {
    return <CompactSaunaList saunas={saunas} onSaunaClick={onSaunaClick} selectedSlug={selectedSlug} isMobile={isMobile} />;
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="sticky left-0 bg-muted/50 min-w-[150px]">
              Name
            </TableHead>
            <TableHead className="text-center">Price</TableHead>
            <TableHead className="text-center">Session</TableHead>
            <TableHead className="text-center">Cold Plunge</TableHead>
            <TableHead className="text-center">Soaking Tub</TableHead>
            <TableHead className="text-center">Waterfront</TableHead>
            <TableHead className="text-center">Natural Plunge</TableHead>
            <TableHead className="text-center">Steam</TableHead>
            <TableHead className="text-center">Showers</TableHead>
            <TableHead className="text-center">Towels</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {saunas.map((sauna) => (
            <TableRow key={sauna.slug}>
              <TableCell className="sticky left-0 bg-background font-medium">
                <Link
                  href={`/tools/saunas?sauna=${sauna.slug}`}
                  className="text-primary hover:underline"
                >
                  {sauna.name}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">
                  {sauna.sessionPrice ? formatPrice(sauna) : "N/A"}
                </Badge>
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {sauna.sessionLengthMinutes ? `${sauna.sessionLengthMinutes} min` : "—"}
              </TableCell>
              <TableCell className="text-center">
                <BooleanCell value={sauna.coldPlunge} />
              </TableCell>
              <TableCell className="text-center">
                <BooleanCell value={sauna.soakingTub} />
              </TableCell>
              <TableCell className="text-center">
                <BooleanCell value={sauna.waterfront} />
              </TableCell>
              <TableCell className="text-center">
                <BooleanCell value={sauna.naturalPlunge} />
              </TableCell>
              <TableCell className="text-center">
                <BooleanCell value={sauna.steamRoom} />
              </TableCell>
              <TableCell className="text-center">
                <BooleanCell value={sauna.showers} />
              </TableCell>
              <TableCell className="text-center">
                <BooleanCell value={sauna.towelsIncluded} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

