import Settings from "@/views/Settings";
import { Suspense } from "react";

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <Settings />
    </Suspense>
  );
}
