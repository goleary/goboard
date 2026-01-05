"use client";
import TaxCalculator from "./components/TaxCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            US Marriage Tax Calculator
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            This tool was built entirely by{" "}
            <a
              className="text-blue-600 hover:text-blue-500"
              href="https://lovable.dev"
            >
              lovable
            </a>
            , an AI &quot;superhuman full stack engineer&quot;. You can read a
            bit about my experience using it{" "}
            <a
              className="text-blue-600 hover:text-blue-500"
              href="https://www.threads.net/@gabeoleary/post/DGmpGpDxjVX"
            >
              here
            </a>
            .
          </p>
        </header>

        <TaxCalculator />
      </div>
    </div>
  );
};

export default Index;
