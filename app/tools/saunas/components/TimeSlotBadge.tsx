import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { type ReactNode } from "react";

export function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    ...(d.getMinutes() !== 0 && { minute: "2-digit" }),
    hour12: true,
  });
}

interface TimeSlotBadgeProps {
  time: string;
  slotsAvailable: number | null;
  className?: string;
  children?: ReactNode;
}

export function TimeSlotBadge({
  time,
  slotsAvailable,
  className,
  children,
}: TimeSlotBadgeProps) {
  return (
    <Badge variant="outline" className={className}>
      {formatTime(time)}
      {slotsAvailable !== null && (
        <span className="inline-flex items-center gap-px text-muted-foreground">
          <User className="h-2.5 w-2.5" />
          {slotsAvailable}
        </span>
      )}
      {children}
    </Badge>
  );
}
