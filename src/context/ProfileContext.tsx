"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface Profile {
  name: string;
  email: string;
  company: string;
  avatar: string | null;
}

interface ProfileContextValue {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
}

const defaults: Profile = {
  name: "Admin User",
  email: "admin@nexus.ai",
  company: "Nexus Inc.",
  avatar: null,
};

function load(): Profile {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem("nexus-profile");
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {}
  return defaults;
}

const ProfileCtx = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(load);

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      try { localStorage.setItem("nexus-profile", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return <ProfileCtx.Provider value={{ profile, updateProfile }}>{children}</ProfileCtx.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileCtx);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
