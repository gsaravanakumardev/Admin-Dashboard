"use client";

import { useState } from "react";
import { Layout, Breadcrumbs } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw, FileText, AlertCircle, CheckCircle, Clock, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { mockReports, type Report } from "@/data/mockData";

const ROWS_OPTIONS = [5, 10, 20, 50];
const TYPE_LABELS: Record<string, string> = {
  "user-activity": "User Activity",
  "revenue": "Revenue",
  "traffic": "Traffic",
  "conversion": "Conversion",
  "custom": "Custom",
};

function StatusIcon({ status }: { status: Report["status"] }) {
  if (status === "ready") return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === "generating") return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
  return <AlertCircle className="w-4 h-4 text-red-500" />;
}

function Pagination({ page, total, rpp, onPage, onRpp }: {
  page: number; total: number; rpp: number; onPage: (p: number) => void; onRpp: (r: number) => void;
}) {
  const pages = Math.ceil(total / rpp) || 1;
  const getPages = (): (number | string)[] => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "…", pages];
    if (page >= pages - 3) return [1, "…", pages - 4, pages - 3, pages - 2, pages - 1, pages];
    return [1, "…", page - 1, page, page + 1, "…", pages];
  };
  return (
    <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>Rows</span>
        <Select value={String(rpp)} onValueChange={v => { onRpp(Number(v)); onPage(1); }}>
          <SelectTrigger className="h-6 w-16 text-xs rounded border-border/60"><SelectValue /></SelectTrigger>
          <SelectContent>{ROWS_OPTIONS.map(r => <SelectItem key={r} value={String(r)}>{r}</SelectItem>)}</SelectContent>
        </Select>
        <span>of {total}</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
          className="px-1.5 py-0.5 rounded border border-border/60 disabled:opacity-40 hover:bg-accent/60">‹</button>
        {getPages().map((p, i) =>
          p === "…" ? <span key={`e${i}`} className="px-1">…</span> : (
            <button key={p} onClick={() => onPage(Number(p))}
              className={cn("w-6 h-6 rounded border border-border/60 hover:bg-accent/60 transition-colors", page === p && "bg-primary text-primary-foreground border-primary")}>
              {p}
            </button>
          )
        )}
        <button onClick={() => onPage(Math.min(pages, page + 1))} disabled={page === pages}
          className="px-1.5 py-0.5 rounded border border-border/60 disabled:opacity-40 hover:bg-accent/60">›</button>
      </div>
    </div>
  );
}

function GenerateModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("user-activity");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-sm bg-card border border-border/60 rounded p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Generate Report</h2>
          <button onClick={onClose} className="w-7 h-7 rounded hover:bg-accent/60 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Report Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Q2 Revenue Summary"
              className="w-full h-8 px-3 text-sm rounded border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-8 text-sm rounded border-border/60 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 h-8 rounded border border-border/60 text-sm hover:bg-accent/60 transition-colors">Cancel</button>
          <button onClick={onClose} className="flex-1 h-8 rounded bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors font-medium">Generate</button>
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const [page, setPage] = useState(1);
  const [rpp, setRpp] = useState(5);
  const [typeFilter, setTypeFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const filtered = mockReports.filter(r => typeFilter === "all" || r.type === typeFilter);
  const paged = filtered.slice((page - 1) * rpp, page * rpp);
  const ready = mockReports.filter(r => r.status === "ready");
  const generating = mockReports.filter(r => r.status === "generating");
  const failed = mockReports.filter(r => r.status === "failed");

  return (
    <Layout>
      {showModal && <GenerateModal onClose={() => setShowModal(false)} />}
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Reports" }]} />

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <TabsList className="rounded h-8">
            <TabsTrigger value="all" className="text-xs rounded">All ({mockReports.length})</TabsTrigger>
            <TabsTrigger value="ready" className="text-xs rounded">Ready ({ready.length})</TabsTrigger>
            <TabsTrigger value="generating" className="text-xs rounded">In Progress ({generating.length})</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="h-8 text-xs rounded w-36 border-border/60"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Generate
            </button>
          </div>
        </div>

        {/* All Reports Tab */}
        <TabsContent value="all">
          <ReportTable reports={paged} />
          <Pagination page={page} total={filtered.length} rpp={rpp} onPage={setPage} onRpp={setRpp} />
        </TabsContent>

        {/* Ready Tab — unique summary cards */}
        <TabsContent value="ready">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              { label: "Total Reports", value: ready.length, icon: FileText, color: "hsl(243 75% 59%)" },
              { label: "Total Size", value: "6.0 MB", icon: Download, color: "hsl(160 84% 39%)" },
              { label: "This Month", value: ready.filter(r => r.createdAt > "2026-04-01").length, icon: CheckCircle, color: "hsl(38 92% 50%)" },
            ].map(s => (
              <div key={s.label} className="rounded border border-border/60 bg-card px-4 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: `${s.color}18` }}>
                    <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <div className="text-xl font-bold">{s.value}</div>
              </div>
            ))}
          </div>
          <ReportTable reports={ready} />
        </TabsContent>

        {/* In Progress Tab */}
        <TabsContent value="generating">
          {generating.length === 0 ? (
            <div className="rounded border border-border/60 bg-card px-4 py-12 text-center text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No reports currently generating.</p>
            </div>
          ) : (
            <>
              <div className="rounded border border-border/60 bg-blue-500/5 px-4 py-3 mb-4 text-sm text-blue-600 dark:text-blue-400">
                {generating.length} report{generating.length !== 1 ? "s" : ""} currently being generated.
              </div>
              <ReportTable reports={generating} />
            </>
          )}
          {failed.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Failed Reports</p>
              <ReportTable reports={failed} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

function ReportTable({ reports }: { reports: Report[] }) {
  return (
    <div className="rounded border border-border/60 bg-card overflow-hidden mb-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 text-xs text-muted-foreground">
            <th className="px-4 py-2.5 text-left font-medium">Report</th>
            <th className="px-4 py-2.5 text-left font-medium">Type</th>
            <th className="px-4 py-2.5 text-left font-medium">Status</th>
            <th className="px-4 py-2.5 text-left font-medium">Size</th>
            <th className="px-4 py-2.5 text-left font-medium">Created</th>
            <th className="px-4 py-2.5 text-left font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0
            ? <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No reports found</td></tr>
            : reports.map((r, i) => (
              <tr key={r.id} className={cn("border-t border-border/40 transition-colors hover:bg-muted/20", i % 2 !== 0 && "bg-muted/10")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="font-medium truncate max-w-[200px]">{r.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{TYPE_LABELS[r.type] || r.type}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <StatusIcon status={r.status} />
                    <span className={cn("text-xs capitalize",
                      r.status === "ready" ? "text-green-600 dark:text-green-400" :
                      r.status === "generating" ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
                    )}>{r.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{r.size ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{format(new Date(r.createdAt), "MMM d, yyyy")}</td>
                <td className="px-4 py-3">
                  {r.status === "ready" && r.downloadUrl ? (
                    <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  ) : <span className="text-xs text-muted-foreground">—</span>}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
