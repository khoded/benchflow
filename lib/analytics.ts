export type Metrics = {
  responseTime: {
    value: number;
    trend: number;
  };
  cpuUsage: {
    value: number;
    average: number;
  };
  errorRate: {
    value: number;
    total: number;
  };
  queueThroughput: {
    value: number;
    trend: number;
  };
};

export function calculateMetrics(apiResults: any[], queueResults: any[]): Metrics {
  // Calculate response time metrics
  const responseTime = apiResults.length > 0
    ? {
        value: Math.round(apiResults.reduce((acc, curr) => acc + curr.responseTime, 0) / apiResults.length),
        trend: Math.round(((apiResults[apiResults.length - 1]?.responseTime || 0) - 
                          (apiResults[0]?.responseTime || 0)) / (apiResults[0]?.responseTime || 1) * 100)
      }
    : { value: 0, trend: 0 };

  // Calculate CPU usage
  const cpuUsage = {
    value: Math.round(Math.random() * 30 + 40), // Simulated for demo
    average: 68
  };

  // Calculate error rate
  const errorRate = {
    value: apiResults.length > 0
      ? Number((apiResults.filter(r => r.responseTime > 500).length / apiResults.length * 100).toFixed(2))
      : 0,
    total: apiResults.length
  };

  // Calculate queue throughput
  const queueThroughput = queueResults.length > 0
    ? {
        value: Math.round(queueResults.reduce((acc, curr) => acc + curr.processed, 0) / queueResults.length),
        trend: 12
      }
    : { value: 0, trend: 0 };

  return {
    responseTime,
    cpuUsage,
    errorRate,
    queueThroughput
  };
}