"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, BarChart3, FileText, Sparkles, Settings as SettingsIcon,
  Menu, Bell, Search, ChevronLeft, ChevronRight, Settings2, Check, Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme, themes, fonts, type ThemeId, type FontId } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { mockNotifications } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";

const navigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "AI Insights", href: "/ai", icon: Sparkles },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile } = useProfile();

  const initials = profile.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="h-screen bg-background flex overflow-hidden w-full">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300 md:hidden",
        "bg-background/95 backdrop-blur-md border-r border-border/60",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-14 flex items-center px-4 gap-2 border-b border-border/60 shrink-0">
          <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight">Nexus</span>
        </div>
        <div className="flex-1 overflow-auto py-3 px-2">
          <div className="flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && item.href !== "/home" && location.startsWith(item.href));
              return (
                <Link key={item.name} href={item.href}>
                  <div onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors cursor-pointer",
                      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                    )}>
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex flex-col z-10 transition-all duration-300 ease-in-out relative h-full shrink-0",
        "bg-background border-r border-border/60",
        collapsed ? "w-14" : "w-56"
      )}>
        {/* Sidebar Header */}
        <div className="h-14 flex items-center border-b border-border/60 shrink-0 overflow-hidden">
          {collapsed ? (
            <div className="w-full flex justify-center">
              <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center text-primary">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4">
              <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight whitespace-nowrap">Nexus</span>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[80px] z-20 w-6 h-6 rounded-full border border-border/60 bg-background flex items-center justify-center hover:bg-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Nav Items */}
        <div className="flex-1 overflow-auto py-3 px-2">
          <div className="flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && item.href !== "/home" && location.startsWith(item.href));
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center rounded text-sm font-medium transition-colors cursor-pointer",
                      collapsed ? "justify-center w-10 h-10 mx-auto" : "px-3 py-2 gap-3 w-full",
                      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="whitespace-nowrap truncate">{item.name}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className={cn("border-t border-border/60 p-2 shrink-0", collapsed ? "flex justify-center py-3" : "")}>
          {!collapsed ? (
            <Link href="/settings">
              <div className="flex items-center gap-2 px-2 py-2 rounded border border-border/60 bg-muted/30 hover:bg-accent/50 transition-colors cursor-pointer">
                <Avatar className="w-7 h-7 rounded shrink-0">
                  {profile.avatar
                    ? <AvatarImage src={profile.avatar} className="object-cover rounded" />
                    : <AvatarFallback className="rounded bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
                  }
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-medium truncate">{profile.name}</span>
                  <span className="text-[11px] text-muted-foreground truncate">{profile.email}</span>
                </div>
              </div>
            </Link>
          ) : (
            <Link href="/settings">
              <Avatar className="w-8 h-8 rounded cursor-pointer">
                {profile.avatar
                  ? <AvatarImage src={profile.avatar} className="object-cover rounded" />
                  : <AvatarFallback className="rounded bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
                }
              </Avatar>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header setMobileOpen={setMobileOpen} profile={profile} initials={initials} />
        <main className="flex-1 overflow-auto bg-background">
          <div className="px-4 py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function Header({ setMobileOpen, profile, initials }: {
  setMobileOpen: (v: boolean) => void;
  profile: { name: string; email: string; avatar: string | null };
  initials: string;
}) {
  const [gearOpen, setGearOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const gearRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { theme, font, setTheme, setFont } = useTheme();

  const notifications = mockNotifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (gearRef.current && !gearRef.current.contains(e.target as Node)) setGearOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border/60 bg-background z-20 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button className="md:hidden" onClick={() => setMobileOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:flex items-center">
          <Search className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 h-8 text-sm bg-muted/40 border-border/60 rounded w-56 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Gear — Appearance */}
        <div ref={gearRef} className="relative">
          <button
            onClick={() => { setGearOpen(!gearOpen); setNotifOpen(false); }}
            className={cn("w-8 h-8 flex items-center justify-center rounded hover:bg-accent/60 transition-colors", gearOpen && "bg-accent/60")}
          >
            <Settings2 className="w-4 h-4 text-muted-foreground" />
          </button>
          {gearOpen && (
            <div className="absolute right-0 top-10 w-64 bg-popover border border-border/60 rounded p-3 z-50">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Theme</p>
              <div className="flex flex-col gap-0.5 mb-3">
                {themes.map(t => (
                  <button key={t.id} onClick={() => setTheme(t.id as ThemeId)}
                    className={cn("flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors w-full text-left",
                      theme === t.id ? "bg-primary/10 text-primary" : "hover:bg-accent/60 text-foreground")}>
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: t.dot }} />
                    <span className="flex-1">{t.label}</span>
                    {theme === t.id && <Check className="w-3 h-3 shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="h-px bg-border/60 mb-2" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Font</p>
              <div className="flex flex-col gap-0.5">
                {fonts.map(f => (
                  <button key={f.id} onClick={() => setFont(f.id as FontId)}
                    className={cn("flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors w-full text-left",
                      font === f.id ? "bg-primary/10 text-primary" : "hover:bg-accent/60 text-foreground")}>
                    <span className="flex-1">{f.label}</span>
                    {font === f.id && <Check className="w-3 h-3 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setGearOpen(false); }}
            className={cn("w-8 h-8 flex items-center justify-center rounded hover:bg-accent/60 transition-colors relative", notifOpen && "bg-accent/60")}
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 w-80 bg-popover border border-border/60 rounded z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
                <span className="text-sm font-semibold">Notifications</span>
                {unreadCount > 0 && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{unreadCount} new</span>}
              </div>
              <div className="overflow-auto max-h-72">
                {notifications.map((n) => (
                  <div key={n.id} className={cn("px-4 py-3 border-b border-border/40 hover:bg-accent/30 transition-colors", !n.read && "bg-primary/5")}>
                    {!n.read && <div className="w-1.5 h-1.5 bg-primary rounded-full float-left mt-1.5 mr-2" />}
                    <div className="flex justify-between gap-2 mb-0.5">
                      <span className="text-sm font-medium">{n.title}</span>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 clear-both">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile avatar in header */}
        <div className="flex items-center gap-2 ml-1 pl-2 border-l border-border/60">
          <Avatar className="w-7 h-7 rounded">
            {profile.avatar
              ? <AvatarImage src={profile.avatar} className="object-cover rounded" />
              : <AvatarFallback className="rounded bg-primary/10 text-primary text-xs font-medium">{initials}</AvatarFallback>
            }
          </Avatar>
          <span className="text-sm font-medium hidden sm:block truncate max-w-24">{profile.name.split(" ")[0]}</span>
        </div>
      </div>
    </header>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm mb-4 text-muted-foreground flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-border/80">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">{item.label}</Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
