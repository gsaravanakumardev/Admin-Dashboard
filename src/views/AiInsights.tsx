"use client";

import { useState, useRef, useEffect } from "react";
import { Layout, Breadcrumbs } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Info, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { mockInsights, type AiInsight, type ChatMessage } from "@/data/mockData";

const SEVERITY_CONFIG: Record<AiInsight["severity"], { color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  positive: { color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10", icon: TrendingUp },
  warning: { color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/10", icon: AlertTriangle },
  critical: { color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10", icon: TrendingDown },
  info: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", icon: Info },
};

function InsightCard({ insight }: { insight: AiInsight }) {
  const cfg = SEVERITY_CONFIG[insight.severity];
  const Icon = cfg.icon;
  return (
    <div className="rounded border border-border/60 bg-card px-4 py-4">
      <div className="flex items-start gap-3">
        <div className={cn("w-8 h-8 rounded flex items-center justify-center shrink-0", cfg.bg)}>
          <Icon className={cn("w-4 h-4", cfg.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm">{insight.title}</h3>
            {insight.change !== null && (
              <span className={cn("text-xs font-semibold shrink-0", cfg.color)}>
                {insight.change > 0 ? "+" : ""}{insight.change}%
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">{insight.description}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="capitalize">{insight.category}</span>
            {insight.metric && <><span>·</span><span>{insight.metric}</span></>}
            <span>·</span>
            <span>{formatDistanceToNow(new Date(insight.timestamp), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "Why did user engagement drop this week?",
  "Which region has the best growth?",
  "What's causing the API latency spike?",
  "How is the conversion rate trending?",
];

const CANNED: Record<string, string> = {
  "engagement": "User engagement dropped 18% last week, primarily on Tuesday–Wednesday, correlated with the v2.4 deployment. Consider rolling back or hotfixing the affected routes.",
  "region": "India is your top-performing region with 31.2% of new signups this month — up from 18.4% last month. Consider localizing the onboarding experience for Hindi and regional languages.",
  "latency": "P95 API latency rose from 182ms to 340ms over the past 6 hours. The /api/reports endpoint is most affected. This may be due to a missing index on the `created_at` column in the reports table.",
  "conversion": "Your free-to-paid conversion rate has risen steadily from 2.1% to 3.4% over 30 days. The new onboarding checklist introduced on April 1 appears to be the primary driver.",
};

function getFallback(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("engagement") || lower.includes("drop")) return CANNED.engagement;
  if (lower.includes("region") || lower.includes("india") || lower.includes("growth")) return CANNED.region;
  if (lower.includes("latency") || lower.includes("api") || lower.includes("slow")) return CANNED.latency;
  if (lower.includes("conversion") || lower.includes("rate")) return CANNED.conversion;
  return `Based on your current data, here's what I found regarding "${q}": Your platform shows strong growth trends with 23.1% MoM revenue increase and improving user retention. The main areas to watch are the recent API latency spike and the engagement dip after the v2.4 deployment. I'd recommend reviewing the recent deployment logs and monitoring user sessions over the next 24–48 hours.`;
}

export default function AiInsights() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "0", role: "assistant", content: "Hi! I'm your AI data analyst. Ask me anything about your platform metrics, user trends, or performance issues.", timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: q, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 500));
    const reply: ChatMessage = { id: (Date.now() + 1).toString(), role: "assistant", content: getFallback(q), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, reply]);
    setLoading(false);
  };

  const critical = mockInsights.filter(i => i.severity === "critical");
  const positive = mockInsights.filter(i => i.severity === "positive");
  const warnings = mockInsights.filter(i => i.severity === "warning");

  return (
    <Layout>
      <Breadcrumbs items={[{ label: "Home", href: "/home" }, { label: "Dashboard", href: "/" }, { label: "AI Insights" }]} />

      <Tabs defaultValue="insights">
        <TabsList className="rounded h-8 mb-4">
          <TabsTrigger value="insights" className="text-xs rounded">Insights ({mockInsights.length})</TabsTrigger>
          <TabsTrigger value="chat" className="text-xs rounded">AI Chat</TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs rounded">Alerts ({critical.length + warnings.length})</TabsTrigger>
        </TabsList>

        {/* Insights Tab */}
        <TabsContent value="insights">
          <div className="flex flex-col gap-3">
            {mockInsights.map(insight => <InsightCard key={insight.id} insight={insight} />)}
          </div>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat">
          <div className="rounded border border-border/60 bg-card overflow-hidden flex flex-col" style={{ height: "calc(100vh - 220px)", minHeight: 400 }}>
            {/* Messages */}
            <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center text-primary shrink-0 mr-2 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className={cn("max-w-[75%] rounded px-3 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground border border-border/40"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-muted rounded px-3 py-2.5 flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Thinking…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)}
                    className="text-xs px-2.5 py-1 rounded border border-border/60 hover:bg-accent/60 text-muted-foreground transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}
            {/* Input */}
            <div className="px-4 py-3 border-t border-border/60">
              <div className="flex items-center gap-2">
                <input
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
                  placeholder="Ask about your data..."
                  className="flex-1 h-9 px-3 text-sm rounded border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <button onClick={() => send(input)} disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Alerts Tab — unique data */}
        <TabsContent value="alerts">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              { label: "Critical", count: critical.length, color: "text-red-500", bg: "bg-red-500/10" },
              { label: "Warnings", count: warnings.length, color: "text-yellow-500", bg: "bg-yellow-500/10" },
              { label: "Positive", count: positive.length, color: "text-green-500", bg: "bg-green-500/10" },
            ].map(s => (
              <div key={s.label} className="rounded border border-border/60 bg-card px-4 py-4">
                <div className={cn("text-2xl font-bold", s.color)}>{s.count}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label} Alerts</div>
              </div>
            ))}
          </div>
          {critical.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Critical</p>
              <div className="flex flex-col gap-2">{critical.map(i => <InsightCard key={i.id} insight={i} />)}</div>
            </div>
          )}
          {warnings.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider mb-2">Warnings</p>
              <div className="flex flex-col gap-2">{warnings.map(i => <InsightCard key={i.id} insight={i} />)}</div>
            </div>
          )}
          {positive.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Positive Signals</p>
              <div className="flex flex-col gap-2">{positive.map(i => <InsightCard key={i.id} insight={i} />)}</div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
