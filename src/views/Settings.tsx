"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Layout, Breadcrumbs } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, themes, fonts, type ThemeId, type FontId } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Settings() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "profile";
  const { theme, font, setTheme, setFont } = useTheme();
  const { profile, updateProfile } = useProfile();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [company, setCompany] = useState(profile.company);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const handleSave = () => {
    updateProfile({ name, email, company });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      updateProfile({ avatar: base64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Layout>
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Settings" }]} />

      <Tabs defaultValue={defaultTab}>
        <TabsList className="rounded h-8 mb-6">
          <TabsTrigger value="profile" className="text-xs rounded">Profile</TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs rounded">Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs rounded">Notifications</TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ── */}
        <TabsContent value="profile">
          <div className="max-w-lg">
            {/* Avatar upload */}
            <div className="rounded border border-border/60 bg-card px-4 py-4 mb-4">
              <p className="text-sm font-semibold mb-4">Profile Photo</p>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-16 h-16 rounded">
                    {profile.avatar
                      ? <AvatarImage src={profile.avatar} className="object-cover rounded" />
                      : <AvatarFallback className="rounded bg-primary/20 text-primary text-xl font-bold">{initials}</AvatarFallback>
                    }
                  </Avatar>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                </div>
                <div>
                  <p className="text-sm font-medium">{profile.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">{profile.email}</p>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="text-xs px-3 py-1 rounded border border-border/60 hover:bg-accent/60 transition-colors"
                  >
                    Upload photo
                  </button>
                  {profile.avatar && (
                    <button
                      onClick={() => updateProfile({ avatar: null })}
                      className="text-xs px-3 py-1 rounded border border-border/60 hover:bg-accent/60 transition-colors ml-2 text-muted-foreground"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile form */}
            <div className="rounded border border-border/60 bg-card px-4 py-4">
              <p className="text-sm font-semibold mb-4">Profile Information</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Full Name</label>
                  <input
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="Admin User"
                    className="w-full h-9 px-3 text-sm rounded border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Email Address</label>
                  <input
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@nexus.ai"
                    className="w-full h-9 px-3 text-sm rounded border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Company</label>
                  <input
                    value={company} onChange={e => setCompany(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full h-9 px-3 text-sm rounded border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Role</label>
                  <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400">Admin</span>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className="h-8 px-4 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  {saved ? "Saved!" : "Save Changes"}
                </button>
                {saved && (
                  <span className="flex items-center gap-1 text-xs text-green-500">
                    <Check className="w-3 h-3" /> Profile updated
                  </span>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Appearance Tab ── */}
        <TabsContent value="appearance">
          <div className="max-w-lg flex flex-col gap-4">
            {/* Color Theme */}
            <div className="rounded border border-border/60 bg-card px-4 py-4">
              <p className="text-sm font-semibold mb-1">Color Theme</p>
              <p className="text-xs text-muted-foreground mb-4">Choose a color palette for the interface.</p>
              <div className="flex flex-col gap-1.5">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as ThemeId)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded border transition-colors text-sm w-full text-left",
                      theme === t.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/60 hover:bg-accent/60 text-foreground"
                    )}
                  >
                    <span className="w-4 h-4 rounded-full shrink-0 border border-border/40" style={{ background: t.dot }} />
                    <span className="flex-1">{t.label}</span>
                    {theme === t.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="rounded border border-border/60 bg-card px-4 py-4">
              <p className="text-sm font-semibold mb-1">Font Family</p>
              <p className="text-xs text-muted-foreground mb-4">Controls all text across the dashboard.</p>
              <div className="flex flex-col gap-1.5">
                {fonts.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFont(f.id as FontId)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded border transition-colors text-sm w-full text-left",
                      font === f.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/60 hover:bg-accent/60 text-foreground"
                    )}
                  >
                    <div>
                      <span className="font-medium">{f.label}</span>
                      <span className="text-xs text-muted-foreground ml-2 font-normal">Aa Bb Cc</span>
                    </div>
                    {font === f.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Notifications Tab ── */}
        <TabsContent value="notifications">
          <div className="max-w-lg">
            <div className="rounded border border-border/60 bg-card px-4 py-4">
              <p className="text-sm font-semibold mb-4">Notification Preferences</p>
              <div className="flex flex-col">
                {[
                  { label: "New User Signups", hint: "When a new user joins the platform", on: true },
                  { label: "Payment Events", hint: "Successful and failed payment alerts", on: true },
                  { label: "System Alerts", hint: "Performance warnings and server issues", on: true },
                  { label: "Weekly Digest", hint: "A weekly summary email every Monday", on: false },
                  { label: "AI Insight Alerts", hint: "When AI detects anomalies or trends", on: true },
                  { label: "Marketing Emails", hint: "Product updates and announcements", on: false },
                ].map((item, i, arr) => (
                  <div key={item.label} className={cn("flex items-center justify-between py-3", i < arr.length - 1 && "border-b border-border/40")}>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.hint}</p>
                    </div>
                    <Toggle initial={item.on} />
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

function Toggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <button
      onClick={() => setOn(!on)}
      className={cn("w-10 h-5 rounded-full transition-colors relative shrink-0 ml-4", on ? "bg-primary" : "bg-muted border border-border/60")}
    >
      <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200", on ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}
