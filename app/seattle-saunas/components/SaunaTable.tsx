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
import { Check, X } from "lucide-react";
import { type Sauna } from "@/data/saunas/seattle-saunas";

interface SaunaTableProps {
  saunas: Sauna[];
}

function BooleanCell({ value }: { value: boolean }) {
  return value ? (
    <Check className="h-4 w-4 text-green-600" />
  ) : (
    <X className="h-4 w-4 text-muted-foreground/50" />
  );
}

export function SaunaTable({ saunas }: SaunaTableProps) {
  if (saunas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No saunas match your filters. Try adjusting your search criteria.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="sticky left-0 bg-muted/50 min-w-[150px]">
              Name
            </TableHead>
            <TableHead className="min-w-[120px]">Neighborhood</TableHead>
            <TableHead className="text-center">Price</TableHead>
            <TableHead className="text-center">Day Pass</TableHead>
            <TableHead className="text-center">Private</TableHead>
            <TableHead className="text-center">Cold Plunge</TableHead>
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
                  href={`/seattle-saunas/${sauna.slug}`}
                  className="text-primary hover:underline"
                >
                  {sauna.name}
                </Link>
              </TableCell>
              <TableCell>{sauna.neighborhood}</TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">{sauna.priceRange}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <BooleanCell value={sauna.dayPassAvailable} />
              </TableCell>
              <TableCell className="text-center">
                <BooleanCell value={sauna.privateRoomAvailable} />
              </TableCell>
              <TableCell className="text-center">
                <BooleanCell value={sauna.coldPlunge} />
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

