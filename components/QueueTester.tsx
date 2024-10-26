"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle, Play, StopCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTest } from "@/context/TestContext";
import { QueueResult } from "@/lib/types";

export default function QueueTester() {
  const { updateQueueResults } = useTest();
  const [queueUrl, setQueueUrl] = useState("");
  const [messageRate, setMessageRate] = useState(100);
  const [queueType, setQueueType] = useState("rabbitmq");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<QueueResult[]>([]);

  const handleTest = async () => {
    if (!queueUrl) return;
    
    setIsRunning(true);
    // Simulated test data - in production, this would interact with actual message queues
    const testData = Array.from({ length: 10 }, (_, i) => ({
      minute: `Minute ${i + 1}`,
      processed: Math.floor(Math.random() * 1000 + 500),
      failed: Math.floor(Math.random() * 50),
    }));
    
    setResults(testData);
    updateQueueResults(testData);
    setIsRunning(false);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const processed = payload[0].payload.processed;
      const failed = payload[0].payload.failed;
      const total = processed + failed;
      const successRate = ((processed / total) * 100).toFixed(1);

      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium mb-1">{label}</p>
          <p className="text-sm text-muted-foreground">
            Processed: <span className="font-medium">{processed}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Failed: <span className="font-medium">{failed}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Success Rate: <span className="font-medium">{successRate}%</span>
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
            <Label htmlFor="queue-url">Queue URL</Label>
            <Input
              id="queue-url"
              placeholder="amqp://localhost:5672"
              value={queueUrl}
              onChange={(e) => setQueueUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Queue Type</Label>
            <Select value={queueType} onValueChange={setQueueType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rabbitmq">RabbitMQ</SelectItem>
                <SelectItem value="redis">Redis</SelectItem>
                <SelectItem value="kafka">Kafka</SelectItem>
                <SelectItem value="sqs">AWS SQS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Messages per Second: {messageRate}</Label>
            <Slider
              value={[messageRate]}
              onValueChange={(value) => setMessageRate(value[0])}
              max={1000}
              step={10}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleTest}
            disabled={isRunning || !queueUrl}
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
                <BarChart data={results}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="minute" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="processed" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="failed" 
                    fill="hsl(var(--destructive))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No test results yet</AlertTitle>
              <AlertDescription>
                Configure your queue parameters and click Start Test to begin benchmarking.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}