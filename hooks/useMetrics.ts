"use client";

import { useState, useEffect } from 'react';
import { Metrics, calculateMetrics } from '@/lib/analytics';

export function useMetrics(apiResults: any[], queueResults: any[]) {
  const [metrics, setMetrics] = useState<Metrics>({
    responseTime: { value: 0, trend: 0 },
    cpuUsage: { value: 0, average: 0 },
    errorRate: { value: 0, total: 0 },
    queueThroughput: { value: 0, trend: 0 }
  });

  useEffect(() => {
    const updateMetrics = () => {
      const newMetrics = calculateMetrics(apiResults, queueResults);
      setMetrics(newMetrics);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [apiResults, queueResults]);

  return metrics;
}