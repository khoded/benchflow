"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import APITester from "@/components/APITester";
import QueueTester from "@/components/QueueTester";
import DashboardMetrics from "@/components/DashboardMetrics";
import { Activity, Gauge, MessageSquare } from "lucide-react";
import { TestProvider } from "@/context/TestContext";

export default function Home() {
  return (
    <TestProvider>
      <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">BenchFlow</h1>
            </div>
            <Button variant="outline">Documentation</Button>
          </div>

          <DashboardMetrics />

          <Tabs defaultValue="api" className="mt-8">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                API Testing
              </TabsTrigger>
              <TabsTrigger value="queue" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Queue Testing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="api">
              <Card className="p-6">
                <APITester />
              </Card>
            </TabsContent>

            <TabsContent value="queue">
              <Card className="p-6">
                <QueueTester />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </TestProvider>
  );
}