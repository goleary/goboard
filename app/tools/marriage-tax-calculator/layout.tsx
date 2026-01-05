import { Metadata } from "next";

export const metadata: Metadata = {
  title: "US Marriage Tax Calculator (2023-2026) | Gabe O'Leary",
  description:
    "Calculate how marriage affects your taxes. Compare single vs married filing jointly tax liability for 2023-2026, including SALT deduction phase-down for high earners.",
};

export default function MarriageTaxCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

