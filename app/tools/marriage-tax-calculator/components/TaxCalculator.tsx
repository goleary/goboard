import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaxInput from "./TaxInput";
import TaxComparison from "./TaxComparison";
import {
  TaxCalculationResult,
  TaxPerson,
  TaxYear,
  calculateTaxComparison,
  STANDARD_DEDUCTION,
  SALT_DEDUCTION_CAP,
  MORTGAGE_LOAN_LIMIT,
} from "../taxCalculations";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Calculator } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ItemizedDeductions } from "../taxCalculations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TaxCalculator = () => {
  const [person1, setPerson1] = useState<TaxPerson>({
    income: 75000,
    deductions: 0,
    itemizedDeductions: {
      salt: 0,
      mortgageInterest: 0,
      mortgageLoanAmount: 0,
      other: 0,
    },
  });
  const [person2, setPerson2] = useState<TaxPerson>({
    income: 280000,
    deductions: 0,
    itemizedDeductions: {
      salt: 0,
      mortgageInterest: 0,
      mortgageLoanAmount: 0,
      other: 0,
    },
  });
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [taxYear, setTaxYear] = useState<TaxYear>("2024");

  // Calculate combined itemized deductions for married filing
  const calculateCombinedItemizedDeductions = (): ItemizedDeductions => {
    return {
      salt:
        (person1.itemizedDeductions?.salt || 0) +
        (person2.itemizedDeductions?.salt || 0),
      mortgageInterest:
        (person1.itemizedDeductions?.mortgageInterest || 0) +
        (person2.itemizedDeductions?.mortgageInterest || 0),
      mortgageLoanAmount:
        (person1.itemizedDeductions?.mortgageLoanAmount || 0) +
        (person2.itemizedDeductions?.mortgageLoanAmount || 0),
      other:
        (person1.itemizedDeductions?.other || 0) +
        (person2.itemizedDeductions?.other || 0),
    };
  };

  useEffect(() => {
    if (person1.income === 0 && person2.income === 0) {
      return;
    }

    const calculationResult = calculateTaxComparison(person1, person2, taxYear);
    setResult(calculationResult);
    setIsCalculated(true);
  }, [person1, person2, taxYear]);

  const handleReset = () => {
    setPerson1({
      income: 0,
      deductions: 0,
      itemizedDeductions: {
        salt: 0,
        mortgageInterest: 0,
        mortgageLoanAmount: 0,
        other: 0,
      },
    });
    setPerson2({
      income: 0,
      deductions: 0,
      itemizedDeductions: {
        salt: 0,
        mortgageInterest: 0,
        mortgageLoanAmount: 0,
        other: 0,
      },
    });
    setResult(null);
    setIsCalculated(false);
  };

  const handleYearChange = (year: TaxYear) => {
    setTaxYear(year);
  };

  // Calculate deductible mortgage interest based on loan amount
  const getDeductibleMortgageInterest = (
    interestAmount: number,
    loanAmount: number
  ) => {
    if (loanAmount <= MORTGAGE_LOAN_LIMIT) {
      return interestAmount;
    }

    const deductibleRatio = MORTGAGE_LOAN_LIMIT / loanAmount;
    return Math.round(interestAmount * deductibleRatio);
  };

  const combinedItemizedDeductions = calculateCombinedItemizedDeductions();
  const deductibleMortgageInterest = getDeductibleMortgageInterest(
    combinedItemizedDeductions.mortgageInterest,
    combinedItemizedDeductions.mortgageLoanAmount
  );
  const isLoanAboveLimit =
    combinedItemizedDeductions.mortgageLoanAmount > MORTGAGE_LOAN_LIMIT;

  const totalMarriedItemizedDeductions =
    Math.min(
      combinedItemizedDeductions.salt,
      SALT_DEDUCTION_CAP[taxYear].married
    ) +
    deductibleMortgageInterest +
    combinedItemizedDeductions.other;

  const saltCap = SALT_DEDUCTION_CAP[taxYear].married;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-white border-none shadow-sm overflow-hidden">
        <CardContent className="p-6 space-y-8">
          <div className="flex justify-between gap-4 items-start flex-col md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <Calculator className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-medium">
                US Marriage Tax Calculator
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="tax-year" className="text-sm whitespace-nowrap">
                Tax Year
              </Label>
              <Select
                value={taxYear}
                onValueChange={(value) => handleYearChange(value as TaxYear)}
              >
                <SelectTrigger className="w-28" id="tax-year">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-muted-foreground">
            Find out if you&apos;ll pay more or less in taxes when you get
            married. This calculator uses {taxYear} tax brackets and standard
            deductions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TaxInput
              label="Person 1"
              personNumber={1}
              income={person1.income}
              itemizedDeductions={person1.itemizedDeductions}
              onIncomeChange={(value) =>
                setPerson1({ ...person1, income: value })
              }
              onItemizedDeductionsChange={(deductions) =>
                setPerson1({ ...person1, itemizedDeductions: deductions })
              }
              taxYear={taxYear}
            />

            <TaxInput
              label="Person 2"
              personNumber={2}
              income={person2.income}
              itemizedDeductions={person2.itemizedDeductions}
              onIncomeChange={(value) =>
                setPerson2({ ...person2, income: value })
              }
              onItemizedDeductionsChange={(deductions) =>
                setPerson2({ ...person2, itemizedDeductions: deductions })
              }
              taxYear={taxYear}
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Married Filing Jointly</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {result && (
                <div className="bg-white border rounded-md p-4 space-y-4">
                  <div className="flex justify-between w-full mb-2">
                    <span className="text-sm font-medium">
                      Optimal Filing Method:{" "}
                      {result.optimalFilingMethod === "standard"
                        ? "Standard Deduction"
                        : "Itemized Deductions"}
                    </span>
                    <span className="text-sm font-medium">
                      {result.optimalFilingMethod === "standard"
                        ? `$${STANDARD_DEDUCTION[
                            taxYear
                          ].married.toLocaleString()}`
                        : `$${totalMarriedItemizedDeductions.toLocaleString()}`}
                    </span>
                  </div>

                  {result.optimalFilingMethod === "itemized" && (
                    <div className="space-y-3 mt-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm">
                            SALT (State and Local Taxes)
                          </p>
                          {combinedItemizedDeductions.salt > saltCap && (
                            <p className="text-xs text-amber-600 mt-1">
                              SALT deduction will be capped at $
                              {saltCap.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <p className="text-sm">
                          ${combinedItemizedDeductions.salt.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm">Mortgage Interest</p>
                          {isLoanAboveLimit && (
                            <div className="text-xs text-amber-600 mt-1">
                              <p>Loan amount exceeds the $750,000 limit.</p>
                              <p>
                                Deductible interest: $
                                {deductibleMortgageInterest.toLocaleString()}
                                ($
                                {combinedItemizedDeductions.mortgageInterest.toLocaleString()}{" "}
                                ×{" "}
                                {Math.round(
                                  (MORTGAGE_LOAN_LIMIT /
                                    combinedItemizedDeductions.mortgageLoanAmount) *
                                    100
                                )}
                                %)
                              </p>
                            </div>
                          )}
                        </div>
                        <p className="text-sm">
                          $
                          {combinedItemizedDeductions.mortgageInterest.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm">Mortgage Loan Amount</p>
                        <p className="text-sm">
                          $
                          {combinedItemizedDeductions.mortgageLoanAmount.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm">Other Deductions</p>
                        <p className="text-sm">
                          ${combinedItemizedDeductions.other.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {result.optimalFilingMethod === "standard" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {taxYear} standard: $
                      {STANDARD_DEDUCTION[taxYear].married.toLocaleString()}{" "}
                      (married filing jointly)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            {result ? (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">
                  Tax Comparison Results
                </h3>
                <TaxComparison
                  result={result}
                  person1Income={person1.income}
                  person2Income={person2.income}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Data to Display</h3>
                <p className="text-muted-foreground">
                  Enter income details for both individuals to see the tax
                  comparison.
                </p>
              </div>
            )}

            {isCalculated && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full md:w-auto"
                >
                  Reset Calculator
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>
          This calculator uses {taxYear} tax brackets and is for illustrative
          purposes only. Consult a tax professional for advice specific to your
          situation.
        </p>
      </div>
    </div>
  );
};

export default TaxCalculator;
