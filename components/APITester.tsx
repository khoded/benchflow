"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle, Play, StopCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTest } from "@/context/TestContext";
import { TestResult } from "@/lib/types";
import { format } from "date-fns";

export default function APITester() {
  const { updateApiResults } = useTest();
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [concurrentUsers, setConcurrentUsers] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const handleTest = async () => {
    if (!url) return;
    
    setIsRunning(true);
    // Simulated test data - in production, this would make real API calls
    const testData = Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (19 - i) * 1000).toISOString(),
      responseTime: Math.random() * 500 + 100,
      successRate: Math.random() * 20 + 80,
    }));
    
    setResults(testData);
    updateApiResults(testData);
    setIsRunning(false);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium mb-1">
            {format(new Date(data.timestamp), 'HH:mm:ss')}
          </p>
          <p className="text-sm text-muted-foreground">
            Response Time: <span className="font-medium">{Math.round(data.responseTime)}ms</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Success Rate: <span className="font-medium">{Math.round(data.successRate)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint">API Endpoint</Label>
            <Input
              id="endpoint"
              placeholder="https://api.example.com/endpoint"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>HTTP Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Concurrent Users: {concurrentUsers}</Label>
            <Slider
              value={[concurrentUsers]}
              onValueChange={(value) => setConcurrentUsers(value[0])}
              max={100}
              step={1}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleTest}
            disabled={isRunning || !url}
          >
            {isRunning ? (
              <>
                <StopCircle className="mr-2 h-4 w-4" /> Stop Test
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Start Test
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {results.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(value) => format(new Date(value), 'HH:mm:ss')}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="responseTime"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No test results yet</AlertTitle>
              <AlertDescription>
                Configure your test parameters and click Start Test to begin benchmarking.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}