"use client";

import { useState } from "react";
import { Layout, Breadcrumbs } from "@/components/layout/Layout";
import { Users, Activity, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, UserPlus, CreditCard, LogIn, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import {
  mockDashboardMetrics, mockChartData30d, mockChartData7d, mockChartData90d,
  mockActivity, type ActivityItem
} from "@/data/mockData";
import { SparkLine } from "@/components/ui/SparkLine";

const activityIcon: Record<ActivityItem["type"], React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  signup: UserPlus, payment: CreditCard, login: LogIn, error: AlertCircle, warning: AlertCircle, info: Info,
};
const activityColor: Record<ActivityItem["type"], string> = {
  signup: "text-blue-500", payment: "text-green-500", login: "text-purple-500",
  error: "text-red-500", warning: "text-yellow-500", info: "text-muted-foreground",
};

function KpiCard({ title, value, trend, icon: Icon, color, sparkData }: {
  title: string; value: string; trend: number; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string; sparkData: number[];
}) {
  const positive = trend >= 0;
  return (
    <div className="rounded border border-border/60 bg-card px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: `${color}15` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <span className="text-sm text-muted-foreground font-medium">{title}</span>
        </div>
        <span className={cn("flex items-center gap-0.5 text-xs font-medium", positive ? "text-green-500" : "text-red-500")}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend)}%
        </span>
      </div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="h-10">
        <SparkLine data={sparkData} color={color} />
      </div>
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = activityIcon[item.type];
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/40 last:border-0">
      <div className="w-7 h-7 rounded bg-muted/60 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className={cn("w-3.5 h-3.5", activityColor[item.type])} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{item.message}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
      </div>
    </div>
  );
}

const ROWS_OPTIONS = [5, 10, 20];

export default function Dashboard() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [actPage, setActPage] = useState(1);
  const [actRpp, setActRpp] = useState(5);

  const m = mockDashboardMetrics;
  const chartData = period === "7d" ? mockChartData7d : period === "90d" ? mockChartData90d : mockChartData30d;

  const revenuePoints = chartData.labels.map((label, i) => ({
    label, value: Math.round(chartData.revenue[i]),
  }));
  const userPoints = chartData.labels.map((label, i) => ({
    label, value: Math.round(chartData.userGrowth[i]),
  }));

  const totalActPages = Math.ceil(mockActivity.length / actRpp);
  const pagedActivity = mockActivity.slice((actPage - 1) * actRpp, actPage * actRpp);

  return (
    <Layout>
      <Breadcrumbs items={[{ label: "Home", href: "/home" }, { label: "Dashboard" }]} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <KpiCard title="Total Users" value={m.totalUsers.toLocaleString()} trend={m.totalUsersTrend}
          icon={Users} color="hsl(243 75% 59%)" sparkData={m.sparklines.users} />
        <KpiCard title="Active Sessions" value={m.activeSessions.toLocaleString()} trend={m.activeSessionsTrend}
          icon={Activity} color="hsl(199 89% 48%)" sparkData={m.sparklines.sessions} />
        <KpiCard title="Revenue" value={`$${(m.revenue / 1000).toFixed(0)}K`} trend={m.revenueTrend}
          icon={DollarSign} color="hsl(160 84% 39%)" sparkData={m.sparklines.revenue} />
        <KpiCard title="Conversion" value={`${m.conversionRate}%`} trend={m.conversionRateTrend}
          icon={TrendingUp} color="hsl(38 92% 50%)" sparkData={m.sparklines.conversion} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        {/* Chart Tabs */}
        <div className="xl:col-span-2 rounded border border-border/60 bg-card px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">Performance</h2>
            <Select value={period} onValueChange={(v: "7d" | "30d" | "90d") => setPeriod(v)}>
              <SelectTrigger className="h-7 text-xs w-24 rounded border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Tabs defaultValue="revenue">
            <TabsList className="mb-4 h-8 rounded">
              <TabsTrigger value="revenue" className="text-xs rounded">Revenue</TabsTrigger>
              <TabsTrigger value="users" className="text-xs rounded">Users</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenuePoints}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160 84% 39%)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={Math.floor(revenuePoints.length / 6)} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <RechartsTooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                  <Area type="monotone" dataKey="value" stroke="hsl(160 84% 39%)" strokeWidth={1.5} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="users">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={userPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={Math.floor(userPoints.length / 6)} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", fontSize: 12 }} formatter={(v: number) => [v, "Users"]} />
                  <Line type="monotone" dataKey="value" stroke="hsl(243 75% 59%)" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </div>

        {/* Activity Feed */}
        <div className="rounded border border-border/60 bg-card px-4 py-4 flex flex-col">
          <h2 className="font-semibold text-sm mb-3">Recent Activity</h2>
          <div className="flex-1">
            {pagedActivity.map(item => <ActivityRow key={item.id} item={item} />)}
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/40 text-xs text-muted-foreground">
            <Select value={String(actRpp)} onValueChange={v => { setActRpp(Number(v)); setActPage(1); }}>
              <SelectTrigger className="h-6 w-16 text-xs rounded border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROWS_OPTIONS.map(r => <SelectItem key={r} value={String(r)}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <button onClick={() => setActPage(p => Math.max(1, p - 1))} disabled={actPage === 1}
                className="px-1.5 py-0.5 rounded border border-border/60 disabled:opacity-40 hover:bg-accent/60 transition-colors">‹</button>
              <span>{actPage}/{totalActPages}</span>
              <button onClick={() => setActPage(p => Math.min(totalActPages, p + 1))} disabled={actPage === totalActPages}
                className="px-1.5 py-0.5 rounded border border-border/60 disabled:opacity-40 hover:bg-accent/60 transition-colors">›</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
