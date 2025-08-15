// 2023 Tax brackets
export const SINGLE_TAX_BRACKETS_2023 = [
  { min: 0, max: 11000, rate: 0.1 },
  { min: 11001, max: 44725, rate: 0.12 },
  { min: 44726, max: 95375, rate: 0.22 },
  { min: 95376, max: 182100, rate: 0.24 },
  { min: 182101, max: 231250, rate: 0.32 },
  { min: 231251, max: 578125, rate: 0.35 },
  { min: 578126, max: Infinity, rate: 0.37 },
];

export const MARRIED_TAX_BRACKETS_2023 = [
  { min: 0, max: 22000, rate: 0.1 },
  { min: 22001, max: 89450, rate: 0.12 },
  { min: 89451, max: 190750, rate: 0.22 },
  { min: 190751, max: 364200, rate: 0.24 },
  { min: 364201, max: 462500, rate: 0.32 },
  { min: 462501, max: 693750, rate: 0.35 },
  { min: 693751, max: Infinity, rate: 0.37 },
];

// 2024 Tax brackets (estimated based on inflation adjustments)
export const SINGLE_TAX_BRACKETS_2024 = [
  { min: 0, max: 11600, rate: 0.1 },
  { min: 11601, max: 47150, rate: 0.12 },
  { min: 47151, max: 100525, rate: 0.22 },
  { min: 100526, max: 191950, rate: 0.24 },
  { min: 191951, max: 243725, rate: 0.32 },
  { min: 243726, max: 609350, rate: 0.35 },
  { min: 609351, max: Infinity, rate: 0.37 },
];

export const MARRIED_TAX_BRACKETS_2024 = [
  { min: 0, max: 23200, rate: 0.1 },
  { min: 23201, max: 94300, rate: 0.12 },
  { min: 94301, max: 201050, rate: 0.22 },
  { min: 201051, max: 383900, rate: 0.24 },
  { min: 383901, max: 487450, rate: 0.32 },
  { min: 487451, max: 731200, rate: 0.35 },
  { min: 731201, max: Infinity, rate: 0.37 },
];

// 2025 Tax brackets (estimated with slight inflation adjustment from 2024)
export const SINGLE_TAX_BRACKETS_2025 = [
  { min: 0, max: 12000, rate: 0.1 },
  { min: 12001, max: 48550, rate: 0.12 },
  { min: 48551, max: 103550, rate: 0.22 },
  { min: 103551, max: 197700, rate: 0.24 },
  { min: 197701, max: 251050, rate: 0.32 },
  { min: 251051, max: 627650, rate: 0.35 },
  { min: 627651, max: Infinity, rate: 0.37 },
];

export const MARRIED_TAX_BRACKETS_2025 = [
  { min: 0, max: 24000, rate: 0.1 },
  { min: 24001, max: 97100, rate: 0.12 },
  { min: 97101, max: 207100, rate: 0.22 },
  { min: 207101, max: 395400, rate: 0.24 },
  { min: 395401, max: 502100, rate: 0.32 },
  { min: 502101, max: 753100, rate: 0.35 },
  { min: 753101, max: Infinity, rate: 0.37 },
];

// Standard deductions by year
export const STANDARD_DEDUCTION = {
  2023: {
    single: 13850,
    married: 27700,
  },
  2024: {
    single: 14600,
    married: 29200,
  },
  2025: {
    single: 15050,
    married: 30100,
  },
};

// SALT deduction caps by year
export const SALT_DEDUCTION_CAP = {
  2023: {
    single: 10000,
    married: 10000,
  },
  2024: {
    single: 10000,
    married: 10000,
  },
  2025: {
    single: 40000,
    married: 80000,
  },
};

// Mortgage interest deduction cap - loan amount limit
export const MORTGAGE_LOAN_LIMIT = 750000;

export interface ItemizedDeductions {
  salt: number; // State and Local Tax
  mortgageInterest: number;
  mortgageLoanAmount: number; // New field for loan amount
  other: number; // Charitable contributions, medical expenses, etc.
}

export interface TaxPerson {
  income: number;
  deductions: number; // Used for backward compatibility
  itemizedDeductions: ItemizedDeductions;
}

export interface TaxCalculationResult {
  singleTax1: number;
  singleTax2: number;
  combinedSingleTax: number;
  marriedTax: number;
  difference: number;
  percentageDifference: number;
  isBeneficial: boolean;
  optimalFilingMethod: "standard" | "itemized";
}

export type TaxYear = "2023" | "2024" | "2025";

// Get the appropriate tax brackets based on the selected year
export const getSingleTaxBrackets = (year: TaxYear) => {
  switch (year) {
    case "2023":
      return SINGLE_TAX_BRACKETS_2023;
    case "2024":
      return SINGLE_TAX_BRACKETS_2024;
    case "2025":
      return SINGLE_TAX_BRACKETS_2025;
    default:
      return SINGLE_TAX_BRACKETS_2023;
  }
};

export const getMarriedTaxBrackets = (year: TaxYear) => {
  switch (year) {
    case "2023":
      return MARRIED_TAX_BRACKETS_2023;
    case "2024":
      return MARRIED_TAX_BRACKETS_2024;
    case "2025":
      return MARRIED_TAX_BRACKETS_2025;
    default:
      return MARRIED_TAX_BRACKETS_2023;
  }
};

// Calculate tax based on taxable income and brackets
export const calculateTaxFromBrackets = (
  taxableIncome: number,
  brackets: typeof SINGLE_TAX_BRACKETS_2023
): number => {
  let tax = 0;

  for (let i = 0; i < brackets.length; i++) {
    const { min, max, rate } = brackets[i];

    if (taxableIncome > min) {
      const taxableAmountInBracket = Math.min(taxableIncome, max) - min;
      tax += taxableAmountInBracket * rate;
    }

    if (taxableIncome <= max) break;
  }

  return tax;
};

// Get total itemized deductions with caps applied
export const getTotalItemizedDeductions = (
  deductions: ItemizedDeductions,
  year: TaxYear,
  filingStatus: "single" | "married"
): number => {
  // Apply SALT cap
  const saltCap = SALT_DEDUCTION_CAP[year][filingStatus];
  const cappedSalt = Math.min(deductions.salt, saltCap);

  // Apply mortgage interest cap based on loan amount
  let cappedMortgageInterest = deductions.mortgageInterest;
  if (deductions.mortgageLoanAmount > MORTGAGE_LOAN_LIMIT) {
    // Proportion of interest that is deductible based on loan limit
    const deductibleRatio = MORTGAGE_LOAN_LIMIT / deductions.mortgageLoanAmount;
    cappedMortgageInterest = deductions.mortgageInterest * deductibleRatio;
  }

  // Combine all deductions
  return cappedSalt + cappedMortgageInterest + deductions.other;
};

// Calculate tax for a single person
export const calculateSingleTax = (
  person: TaxPerson,
  year: TaxYear
): number => {
  const standardDeduction = STANDARD_DEDUCTION[year].single;

  // Calculate total itemized deductions
  const totalItemizedDeductions = getTotalItemizedDeductions(
    person.itemizedDeductions || {
      salt: 0,
      mortgageInterest: 0,
      mortgageLoanAmount: 0,
      other: 0,
    },
    year,
    "single"
  );

  // Use the larger of standard deduction or itemized deductions
  const deductionAmount = Math.max(standardDeduction, totalItemizedDeductions);

  const taxableIncome = Math.max(0, person.income - deductionAmount);
  const brackets = getSingleTaxBrackets(year);
  return calculateTaxFromBrackets(taxableIncome, brackets);
};

// Calculate tax for a married couple
export const calculateMarriedTax = (
  person1: TaxPerson,
  person2: TaxPerson,
  year: TaxYear
): { tax: number; optimalFilingMethod: "standard" | "itemized" } => {
  const standardDeduction = STANDARD_DEDUCTION[year].married;
  const combinedIncome = person1.income + person2.income;

  // Calculate combined itemized deductions
  const combinedItemizedDeductions: ItemizedDeductions = {
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

  // Get total itemized deductions with caps applied
  const totalItemizedDeductions = getTotalItemizedDeductions(
    combinedItemizedDeductions,
    year,
    "married"
  );

  // Calculate tax using standard deduction
  const taxableIncomeWithStandard = Math.max(
    0,
    combinedIncome - standardDeduction
  );
  const taxWithStandard = calculateTaxFromBrackets(
    taxableIncomeWithStandard,
    getMarriedTaxBrackets(year)
  );

  // Calculate tax using itemized deductions
  const taxableIncomeWithItemized = Math.max(
    0,
    combinedIncome - totalItemizedDeductions
  );
  const taxWithItemized = calculateTaxFromBrackets(
    taxableIncomeWithItemized,
    getMarriedTaxBrackets(year)
  );

  // Return the lower tax amount and the method used
  if (taxWithStandard <= taxWithItemized) {
    return { tax: taxWithStandard, optimalFilingMethod: "standard" };
  } else {
    return { tax: taxWithItemized, optimalFilingMethod: "itemized" };
  }
};

// Calculate complete tax comparison
export const calculateTaxComparison = (
  person1: TaxPerson,
  person2: TaxPerson,
  year: TaxYear
): TaxCalculationResult => {
  const singleTax1 = calculateSingleTax(person1, year);
  const singleTax2 = calculateSingleTax(person2, year);
  const combinedSingleTax = singleTax1 + singleTax2;

  const { tax: marriedTax, optimalFilingMethod } = calculateMarriedTax(
    person1,
    person2,
    year
  );

  const difference = combinedSingleTax - marriedTax;
  const percentageDifference =
    combinedSingleTax > 0 ? (difference / combinedSingleTax) * 100 : 0;

  return {
    singleTax1,
    singleTax2,
    combinedSingleTax,
    marriedTax,
    difference,
    percentageDifference,
    isBeneficial: difference > 0,
    optimalFilingMethod,
  };
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
