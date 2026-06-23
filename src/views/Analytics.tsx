"use client";

import { useState } from "react";
import { Layout, Breadcrumbs } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar
} from "recharts";
import { mockTrafficSources, mockRetentionData, mockDeviceUsage } from "@/data/mockData";
import { TrendingUp, Users, Monitor } from "lucide-react";

function KpiCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className="rounded border border-border/60 bg-card/80 backdrop-blur-md px-4 py-4 hover:glow-border transition-all">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}

const RCOLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function Analytics() {
  const [dateRange, setDateRange] = useState("30d");

  const retentionLines = mockRetentionData.labels.map((label, i) => ({
    label, current: mockRetentionData.current[i], previous: mockRetentionData.previous[i],
  }));

  const totalSessions = 9220;
  const avgRetention = Math.round(mockRetentionData.current.slice(1).reduce((a, b) => a + b, 0) / (mockRetentionData.current.length - 1));
  const topDevice = mockDeviceUsage[0];

  return (
    <Layout>
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Analytics" }]} />

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <KpiCard icon={TrendingUp} label="Total Sessions" value={totalSessions.toLocaleString()} sub="Last 30 days" color="hsl(var(--primary))" />
        <KpiCard icon={Users} label="Avg. Retention" value={`${avgRetention}%`} sub="Week 2–8 average" color="hsl(var(--chart-2))" />
        <KpiCard icon={Monitor} label="Top Device" value={topDevice.device} sub={`${topDevice.percentage}% of sessions`} color="hsl(var(--chart-3))" />
      </div>

      {/* Date filter */}
      <div className="flex justify-end mb-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="h-8 text-xs rounded w-28 border-border/60"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="traffic">
        <TabsList className="rounded h-8 mb-4">
          <TabsTrigger value="traffic" className="text-xs rounded">Traffic Sources</TabsTrigger>
          <TabsTrigger value="retention" className="text-xs rounded">User Retention</TabsTrigger>
          <TabsTrigger value="devices" className="text-xs rounded">Devices</TabsTrigger>
        </TabsList>

        {/* Traffic Tab */}
        <TabsContent value="traffic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded border border-border/60 bg-card/80 backdrop-blur-md px-4 py-4 hover:glow-border transition-all">
              <h2 className="text-sm font-semibold mb-4">Traffic Breakdown</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={mockTrafficSources} dataKey="value" nameKey="source" cx="50%" cy="50%" outerRadius={110} innerRadius={60} paddingAngle={3} label={({ source, value }) => `${source}: ${value}%`} labelLine={false}>
                    {mockTrafficSources.map((_, i) => <Cell key={i} fill={RCOLORS[i % RCOLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", fontSize: 12 }} formatter={(v: number) => [`${v}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded border border-border/60 bg-card/80 backdrop-blur-md px-4 py-4 hover:glow-border transition-all">
              <h2 className="text-sm font-semibold mb-4">Source Breakdown</h2>
              <div className="space-y-3">
                {mockTrafficSources.map((s, i) => (
                  <div key={s.source}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{s.source}</span>
                      <span className="font-medium">{s.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded overflow-hidden">
                      <div className="h-full rounded transition-all duration-500" style={{ width: `${s.value}%`, background: RCOLORS[i % RCOLORS.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Retention Tab */}
        <TabsContent value="retention">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded border border-border/60 bg-card/80 backdrop-blur-md px-4 py-4 hover:glow-border transition-all">
              <h2 className="text-sm font-semibold mb-4">Weekly Retention Curve</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={retentionLines}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                  <RechartsTooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", fontSize: 12 }} formatter={(v: number) => [`${v}%`]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="current" name="Current Period" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="previous" name="Previous Period" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded border border-border/60 bg-card/80 backdrop-blur-md px-4 py-4 hover:glow-border transition-all">
              <h2 className="text-sm font-semibold mb-4">Cohort Summary</h2>
              <div className="space-y-3">
                {mockRetentionData.labels.map((week, i) => {
                  const diff = mockRetentionData.current[i] - mockRetentionData.previous[i];
                  return (
                    <div key={week} className="flex items-center justify-between text-sm border-b border-border/40 pb-2 last:border-0">
                      <span className="text-muted-foreground">{week}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{mockRetentionData.current[i]}%</span>
                        <span className={`text-xs ${diff >= 0 ? "text-primary" : "text-red-500"}`}>
                          {diff >= 0 ? "+" : ""}{diff}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded border border-border/60 bg-card/80 backdrop-blur-md px-4 py-4 hover:glow-border transition-all">
              <h2 className="text-sm font-semibold mb-4">Device Distribution</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={mockDeviceUsage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}`} />
                  <YAxis type="category" dataKey="device" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={60} />
                  <RechartsTooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", fontSize: 12 }} />
                  <Bar dataKey="users" radius={4} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded border border-border/60 bg-card/80 backdrop-blur-md px-4 py-4 hover:glow-border transition-all">
              <h2 className="text-sm font-semibold mb-4">Device Stats</h2>
              <div className="space-y-4">
                {mockDeviceUsage.map((d, i) => (
                  <div key={d.device}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium">{d.device}</span>
                      <div className="flex items-center gap-3 text-muted-foreground text-xs">
                        <span>{d.users.toLocaleString()} users</span>
                        <span className="font-semibold text-foreground">{d.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-muted rounded overflow-hidden">
                      <div className="h-full rounded transition-all" style={{ width: `${d.percentage}%`, background: RCOLORS[i % RCOLORS.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
