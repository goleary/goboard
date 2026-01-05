import { TaxCalculationResult, formatCurrency } from "../taxCalculations";
import { ArrowDown, ArrowUp, MinusIcon } from "lucide-react";

interface TaxComparisonProps {
  result: TaxCalculationResult;
  person1Income: number;
  person2Income: number;
}

const TaxComparison = ({
  result,
  person1Income,
  person2Income,
}: TaxComparisonProps) => {
  const {
    singleTax1,
    singleTax2,
    combinedSingleTax,
    marriedTax,
    difference,
    percentageDifference,
    isBeneficial,
    optimalFilingMethod,
  } = result;

  const getBenefitText = () => {
    if (Math.abs(difference) < 100) {
      return "Tax impact of marriage is minimal";
    }

    if (isBeneficial) {
      return "Getting married could save you money on taxes";
    } else {
      return "Getting married may increase your tax burden";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Filing Separately
          </h4>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Person 1 Tax</span>
              <span className="font-medium">{formatCurrency(singleTax1)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Person 2 Tax</span>
              <span className="font-medium">{formatCurrency(singleTax2)}</span>
            </div>
            <div className="pt-2 border-t flex justify-between font-medium">
              <span>Combined Tax</span>
              <span>{formatCurrency(combinedSingleTax)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Filing Jointly
          </h4>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Combined Income</span>
              <span className="font-medium">
                {formatCurrency(person1Income + person2Income)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>
                Using{" "}
                {optimalFilingMethod === "standard" ? "Standard" : "Itemized"}{" "}
                Deduction
              </span>
              <span className="font-medium">
                {optimalFilingMethod === "standard" ? "Yes" : "Yes"}
              </span>
            </div>
            <div className="pt-2 border-t flex justify-between font-medium">
              <span>Married Tax</span>
              <span>{formatCurrency(marriedTax)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-white border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Tax Difference</h4>
            <p className="text-sm text-muted-foreground">{getBenefitText()}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-lg font-medium">
              {difference !== 0 && (
                <>
                  {isBeneficial ? (
                    <ArrowDown className="text-green-500 mr-1 h-5 w-5" />
                  ) : (
                    <ArrowUp className="text-red-500 mr-1 h-5 w-5" />
                  )}
                </>
              )}
              {difference === 0 && (
                <MinusIcon className="text-gray-500 mr-1 h-5 w-5" />
              )}
              <span
                className={
                  isBeneficial
                    ? "text-green-600"
                    : difference < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }
              >
                {formatCurrency(Math.abs(difference))}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {Math.abs(percentageDifference).toFixed(1)}%{" "}
              {isBeneficial ? "savings" : "increase"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxComparison;
