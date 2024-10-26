"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Timer, AlertTriangle, ArrowUpRight, ArrowDownRight, MessageSquare } from "lucide-react";
import { useMetrics } from "@/hooks/useMetrics";
import { useTest } from "@/context/TestContext";

export default function DashboardMetrics() {
  const { apiResults, queueResults } = useTest();
  const metrics = useMetrics(apiResults, queueResults);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          <Timer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.responseTime.value}ms</div>
          <p className="text-xs text-muted-foreground">
            <span className={`flex items-center gap-1 ${metrics.responseTime.trend <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.responseTime.trend <= 0 ? (
                <ArrowDownRight className="h-3 w-3" />
              ) : (
                <ArrowUpRight className="h-3 w-3" />
              )}
              {Math.abs(metrics.responseTime.trend)}% compared to first test
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.cpuUsage.value}%</div>
          <p className="text-xs text-muted-foreground">
            {metrics.cpuUsage.average}% average across all tests
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.errorRate.value}%</div>
          <p className="text-xs text-muted-foreground">
            Last {metrics.errorRate.total} requests
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Queue Throughput</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.queueThroughput.value}/s</div>
          <p className="text-xs text-muted-foreground">
            Messages processed per second
          </p>
        </CardContent>
      </Card>
    </div>
  );
}