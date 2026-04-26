"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, BarChart3, Users, FileText, Zap, Shield, Globe, ChevronLeft, ChevronRight, TrendingUp, Activity } from "lucide-react";

const cards = [
  {
    icon: BarChart3,
    color: "hsl(243 75% 59%)",
    bg: "hsl(243 75% 59% / 0.1)",
    title: "Real-time Analytics",
    description: "Live dashboards with traffic sources, user retention, and device breakdown. Drill into trends with date range filters.",
    stat: "2.4M", statLabel: "events tracked",
  },
  {
    icon: Users,
    color: "hsl(199 89% 48%)",
    bg: "hsl(199 89% 48% / 0.1)",
    title: "User Management",
    description: "Full CRUD for 25+ users across roles and regions. Filter, search, sort, and view detailed profiles in a side panel.",
    stat: "25", statLabel: "active users",
  },
  {
    icon: Sparkles,
    color: "hsl(280 65% 60%)",
    bg: "hsl(280 65% 60% / 0.1)",
    title: "AI Insights",
    description: "Automated anomaly detection, trend analysis, and an AI chat assistant powered by GPT. Ask anything about your data.",
    stat: "5", statLabel: "insights today",
  },
  {
    icon: FileText,
    color: "hsl(160 84% 39%)",
    bg: "hsl(160 84% 39% / 0.1)",
    title: "Reports",
    description: "Generate and download detailed reports — user activity, revenue summaries, traffic analysis, and custom dashboards.",
    stat: "8", statLabel: "reports ready",
  },
  {
    icon: Zap,
    color: "hsl(38 92% 50%)",
    bg: "hsl(38 92% 50% / 0.1)",
    title: "Performance",
    description: "Sub-100ms dashboard loads, optimized queries, and a lean static-first data layer. No unnecessary API round-trips.",
    stat: "<80ms", statLabel: "load time",
  },
  {
    icon: Shield,
    color: "hsl(0 84% 60%)",
    bg: "hsl(0 84% 60% / 0.1)",
    title: "Role-based Access",
    description: "Admin, Editor, and Viewer roles with full permission scoping. Built-in audit trail and session tracking.",
    stat: "3", statLabel: "role tiers",
  },
];

const features = [
  { icon: Globe, label: "25+ Countries" },
  { icon: TrendingUp, label: "23% MoM Growth" },
  { icon: Activity, label: "99.9% Uptime" },
  { icon: Shield, label: "SOC-2 Ready" },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = cards.length;

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % count);
    }, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, count]);

  const go = (dir: "prev" | "next") => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActive(prev => dir === "next" ? (prev + 1) % count : (prev - 1 + count) % count);
    setPaused(false);
  };

  const card = cards[active];

  return (
    <div
      className="h-screen w-full flex flex-col overflow-hidden bg-background"
      style={{ minHeight: "100vh" }}
    >
      {/* Top nav strip */}
      <header className="flex items-center justify-between px-8 h-14 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight">Nexus</span>
        </div>
        <Link href="/">
          <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
            Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </header>

      {/* Main — full remaining height */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Hero text */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-8 md:w-1/2 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-border/60 bg-muted/40 text-xs text-muted-foreground mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            All systems operational
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            The AI-powered<br />
            <span className="text-primary">admin platform</span><br />
            for modern teams.
          </h1>
          <p className="text-muted-foreground text-base mb-8 max-w-md leading-relaxed">
            Nexus gives you real-time analytics, intelligent insights, and seamless user management — all in one beautifully crafted dashboard.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/analytics">
              <button className="px-5 py-2.5 rounded border border-border/60 bg-muted/40 text-sm font-medium hover:bg-muted/70 transition-colors">
                View Analytics
              </button>
            </Link>
          </div>
          {/* Feature badges */}
          <div className="flex flex-wrap gap-4 mt-10">
            {features.map(f => (
              <div key={f.label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <f.icon className="w-3.5 h-3.5 text-primary" />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Carousel */}
        <div
          className="flex-1 flex flex-col items-center justify-center px-8 py-8 relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Card */}
          <div className="w-full max-w-sm">
            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mb-5 justify-center">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActive(i); }}
                  className={`h-1 rounded transition-all duration-300 ${i === active ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground"}`}
                />
              ))}
            </div>

            {/* Feature card */}
            <div
              key={active}
              className="rounded border border-border/60 bg-card p-6 transition-all duration-300"
              style={{ animation: "fadeIn 0.3s ease" }}
            >
              <div className="w-10 h-10 rounded flex items-center justify-center mb-4" style={{ background: card.bg }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{card.description}</p>
              <div className="flex items-baseline gap-1.5 pt-4 border-t border-border/60">
                <span className="text-2xl font-bold text-foreground">{card.stat}</span>
                <span className="text-xs text-muted-foreground">{card.statLabel}</span>
              </div>
            </div>

            {/* Prev / Next */}
            <div className="flex items-center justify-between mt-4 px-1">
              <button
                onClick={() => go("prev")}
                className="w-8 h-8 rounded border border-border/60 flex items-center justify-center hover:bg-accent/60 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-muted-foreground">{active + 1} / {count}</span>
              <button
                onClick={() => go("next")}
                className="w-8 h-8 rounded border border-border/60 flex items-center justify-center hover:bg-accent/60 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
