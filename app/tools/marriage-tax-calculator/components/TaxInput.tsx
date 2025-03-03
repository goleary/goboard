import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ItemizedDeductions,
  SALT_DEDUCTION_CAP,
  STANDARD_DEDUCTION,
  TaxYear,
  MORTGAGE_LOAN_LIMIT,
} from "../taxCalculations";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaxInputProps {
  label: string;
  personNumber: number;
  income: number;
  itemizedDeductions: ItemizedDeductions;
  onIncomeChange: (value: number) => void;
  onItemizedDeductionsChange: (deductions: ItemizedDeductions) => void;
  taxYear: TaxYear;
}

const TaxInput = ({
  label,
  personNumber,
  income,
  itemizedDeductions,
  onIncomeChange,
  onItemizedDeductionsChange,
  taxYear,
}: TaxInputProps) => {
  const [useItemized, setUseItemized] = useState(false);
  const saltCap = SALT_DEDUCTION_CAP[taxYear].single;
  const standardDeduction = STANDARD_DEDUCTION[taxYear].single;

  // Format number for display in input
  const formatNumberForInput = (value: number): string => {
    if (value === 0) return "";
    return value.toString();
  };

  // Format incoming string to number (remove commas)
  const parseInputToNumber = (value: string): number => {
    return parseFloat(value.replace(/,/g, "")) || 0;
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInputToNumber(e.target.value);
    onIncomeChange(value);
  };

  const handleDeductionChange = (
    type: keyof ItemizedDeductions,
    value: string
  ) => {
    onItemizedDeductionsChange({
      ...itemizedDeductions,
      [type]: parseInputToNumber(value),
    });
  };

  const handleToggleChange = (checked: boolean) => {
    setUseItemized(checked);
    if (!checked) {
      // Reset deductions when toggling off
      onItemizedDeductionsChange({
        salt: 0,
        mortgageInterest: 0,
        mortgageLoanAmount: 0,
        other: 0,
      });
    }
  };

  // Calculate deductible mortgage interest based on loan amount
  const getDeductibleMortgageInterest = () => {
    if (itemizedDeductions.mortgageLoanAmount <= MORTGAGE_LOAN_LIMIT) {
      return itemizedDeductions.mortgageInterest;
    }

    const deductibleRatio =
      MORTGAGE_LOAN_LIMIT / itemizedDeductions.mortgageLoanAmount;
    return Math.round(itemizedDeductions.mortgageInterest * deductibleRatio);
  };

  const deductibleMortgageInterest = getDeductibleMortgageInterest();
  const isLoanAboveLimit =
    itemizedDeductions.mortgageLoanAmount > MORTGAGE_LOAN_LIMIT;

  const totalItemizedDeductions =
    Math.min(itemizedDeductions.salt, saltCap) +
    deductibleMortgageInterest +
    itemizedDeductions.other;

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4">
      <h3 className="text-lg font-medium mb-3">{label}</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor={`income-${personNumber}`}
            className="text-sm font-medium"
          >
            Annual Income
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <Input
              id={`income-${personNumber}`}
              type="text"
              placeholder="0"
              value={income ? income.toLocaleString() : ""}
              onChange={handleIncomeChange}
              className="pl-7 focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor={`itemized-toggle-${personNumber}`}
              className="text-sm font-medium"
            >
              Use Itemized Deductions
            </Label>
            <Switch
              id={`itemized-toggle-${personNumber}`}
              checked={useItemized}
              onCheckedChange={handleToggleChange}
            />
          </div>

          {useItemized ? (
            <div className="mt-2 border rounded-md p-4 bg-gray-50 space-y-4">
              <div className="flex justify-between w-full mb-2">
                <span className="text-sm font-medium">Itemized Deductions</span>
                <span className="text-sm font-medium">
                  ${totalItemizedDeductions.toLocaleString()}
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`salt-${personNumber}`} className="text-sm">
                      SALT (State and Local Taxes)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">
                            State and local tax deductions are capped at $
                            {saltCap.toLocaleString()}
                            for both single filers and married couples filing
                            jointly.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      id={`salt-${personNumber}`}
                      type="text"
                      placeholder="0"
                      value={
                        itemizedDeductions.salt
                          ? itemizedDeductions.salt.toLocaleString()
                          : ""
                      }
                      onChange={(e) =>
                        handleDeductionChange("salt", e.target.value)
                      }
                      className="pl-7 focus:ring-1 focus:ring-gray-400"
                    />
                    {itemizedDeductions.salt > saltCap && (
                      <p className="text-xs text-amber-600 mt-1">
                        SALT deduction will be capped at $
                        {saltCap.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`mortgage-${personNumber}`}
                    className="text-sm"
                  >
                    Mortgage Interest
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      id={`mortgage-${personNumber}`}
                      type="text"
                      placeholder="0"
                      value={
                        itemizedDeductions.mortgageInterest
                          ? itemizedDeductions.mortgageInterest.toLocaleString()
                          : ""
                      }
                      onChange={(e) =>
                        handleDeductionChange(
                          "mortgageInterest",
                          e.target.value
                        )
                      }
                      className="pl-7 focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={`mortgage-loan-${personNumber}`}
                      className="text-sm"
                    >
                      Mortgage Loan Amount
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">
                            Mortgage interest is only fully deductible on loans
                            up to ${MORTGAGE_LOAN_LIMIT.toLocaleString()}.
                            Interest on loan amounts above this limit will be
                            proportionally reduced.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      id={`mortgage-loan-${personNumber}`}
                      type="text"
                      placeholder="0"
                      value={
                        itemizedDeductions.mortgageLoanAmount
                          ? itemizedDeductions.mortgageLoanAmount.toLocaleString()
                          : ""
                      }
                      onChange={(e) =>
                        handleDeductionChange(
                          "mortgageLoanAmount",
                          e.target.value
                        )
                      }
                      className="pl-7 focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                  {isLoanAboveLimit && (
                    <div className="text-xs text-amber-600 mt-1">
                      <p>Loan amount exceeds the $750,000 limit.</p>
                      <p>
                        Deductible interest: $
                        {deductibleMortgageInterest.toLocaleString()}
                        (${itemizedDeductions.mortgageInterest.toLocaleString()}{" "}
                        ×{" "}
                        {Math.round(
                          (MORTGAGE_LOAN_LIMIT /
                            itemizedDeductions.mortgageLoanAmount) *
                            100
                        )}
                        %)
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`other-${personNumber}`} className="text-sm">
                    Other Deductions
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      id={`other-${personNumber}`}
                      type="text"
                      placeholder="0"
                      value={
                        itemizedDeductions.other
                          ? itemizedDeductions.other.toLocaleString()
                          : ""
                      }
                      onChange={(e) =>
                        handleDeductionChange("other", e.target.value)
                      }
                      className="pl-7 focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Charitable contributions, medical expenses over threshold,
                    etc.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded border text-sm">
              <p>
                Using standard deduction: ${standardDeduction.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {taxYear} standard: ${standardDeduction.toLocaleString()}{" "}
                (single)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxInput;
