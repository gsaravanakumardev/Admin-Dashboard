"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DISCOVERY_INTERVAL = 10 * 1000;
const TOAST_DURATION = 3000;
const TOAST_VISIBLE_KEY = "nexus-toast-visible-until";

export function useThemeDiscoveryToast() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    showDiscoveryToast();

    timerRef.current = setInterval(() => {
      showDiscoveryToast();
    }, DISCOVERY_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const showDiscoveryToast = () => {
    const visibleUntil = localStorage.getItem(TOAST_VISIBLE_KEY);
    const now = Date.now();
    
    if (visibleUntil && now < parseInt(visibleUntil, 10)) {
      return;
    }

    toast.dismiss();
    
    const t = toast.custom(
      (id) => (
        <div className="w-80 bg-background border border-border/60 rounded-lg p-4 shadow-lg">
          <p className="text-sm text-foreground mb-3">
            🎨 Explore multiple themes and fonts to personalize your experience.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/settings?tab=appearance")}
              className="flex-1 h-8 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Explore Themes
            </button>
            <button
              onClick={() => router.push("/settings?tab=appearance")}
              className="flex-1 h-8 rounded-md bg-muted text-foreground text-sm font-medium hover:bg-accent/60 transition-colors"
            >
              Customize UI
            </button>
          </div>
        </div>
      ),
      { 
        duration: TOAST_DURATION,
        onDismiss: () => {
          localStorage.removeItem(TOAST_VISIBLE_KEY);
        }
      }
    );

    localStorage.setItem(TOAST_VISIBLE_KEY, String(now + TOAST_DURATION));
  };
}