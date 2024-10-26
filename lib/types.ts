export interface TestResult {
  timestamp: string;
  responseTime: number;
  successRate: number;
}

export interface QueueResult {
  minute: string;
  processed: number;
  failed: number;
}

export interface TestState {
  apiResults: TestResult[];
  queueResults: QueueResult[];
  updateApiResults: (results: TestResult[]) => void;
  updateQueueResults: (results: QueueResult[]) => void;
}