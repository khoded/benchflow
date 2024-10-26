"use client";

import { createContext, useContext, useState } from "react";
import { TestState, TestResult, QueueResult } from "@/lib/types";

const TestContext = createContext<TestState | undefined>(undefined);

export function TestProvider({ children }: { children: React.ReactNode }) {
  const [apiResults, setApiResults] = useState<TestResult[]>([]);
  const [queueResults, setQueueResults] = useState<QueueResult[]>([]);

  const updateApiResults = (results: TestResult[]) => {
    setApiResults(results);
  };

  const updateQueueResults = (results: QueueResult[]) => {
    setQueueResults(results);
  };

  return (
    <TestContext.Provider
      value={{
        apiResults,
        queueResults,
        updateApiResults,
        updateQueueResults,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
}