"use client";

import { useState, useMemo } from "react";
import { Layout, Breadcrumbs } from "@/components/layout/Layout";
import { Search, Filter, ChevronUp, ChevronDown, X, MapPin, Mail, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers, type User } from "@/data/mockData";
import { formatDistanceToNow, format } from "date-fns";

const ROLE_COLORS: Record<User["role"], string> = {
  admin: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  editor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  viewer: "bg-muted text-muted-foreground",
};
const STATUS_COLORS: Record<User["status"], string> = {
  active: "bg-green-500/10 text-green-600 dark:text-green-400",
  inactive: "bg-muted text-muted-foreground",
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
};

const ROWS_OPTIONS = [5, 10, 20, 50];

type SortKey = "name" | "role" | "status" | "sessions" | "revenue";
type SortDir = "asc" | "desc";

function Badge({ label, className }: { label: string; className?: string }) {
  return <span className={cn("px-2 py-0.5 rounded text-xs font-medium capitalize", className)}>{label}</span>;
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

function UserDetail({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-sm bg-card border-l border-border/60 h-full overflow-auto p-6"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-base">User Profile</h2>
          <button onClick={onClose} className="w-7 h-7 rounded hover:bg-accent/60 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded bg-primary/20 flex items-center justify-center text-primary text-xl font-bold mb-3">
            {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <h3 className="font-semibold text-base">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex gap-2 mt-3">
            <Badge label={user.role} className={ROLE_COLORS[user.role]} />
            <Badge label={user.status} className={STATUS_COLORS[user.status]} />
          </div>
        </div>
        <div className="space-y-3 mb-6">
          {[{ icon: MapPin, label: "Location", value: user.location },
            { icon: Mail, label: "Email", value: user.email },
            { icon: Calendar, label: "Joined", value: format(new Date(user.createdAt), "MMM d, yyyy") }
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <div className="w-7 h-7 rounded bg-muted/60 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div><p className="text-muted-foreground text-xs">{label}</p><p>{value}</p></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{ label: "Sessions", value: user.sessions },
            { label: "Page Views", value: user.pageViews.toLocaleString() },
            { label: "Revenue", value: `$${user.revenue.toLocaleString()}` }
          ].map(s => (
            <div key={s.label} className="rounded border border-border/60 bg-muted/30 p-3 text-center">
              <div className="font-semibold text-sm">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        {user.lastActive && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Last active {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
          </p>
        )}
      </div>
    </div>
  );
}

function SortTh({ label, col, sort, sortDir, toggle }: {
  label: string; col: SortKey; sort: SortKey; sortDir: SortDir; toggle: (k: SortKey) => void;
}) {
  return (
    <th className="px-4 py-2.5 text-left font-medium">
      <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggle(col)}>
        {label}
        {sort === col
          ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
          : <ChevronUp className="w-3 h-3 opacity-25" />}
      </button>
    </th>
  );
}

export default function Users() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [rpp, setRpp] = useState(10);
  const [selected, setSelected] = useState<User | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sort === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSort(key); setSortDir("asc"); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let data = [...mockUsers];
    if (search) data = data.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase())
    );
    if (roleFilter !== "all") data = data.filter(u => u.role === roleFilter);
    if (statusFilter !== "all") data = data.filter(u => u.status === statusFilter);
    data.sort((a, b) => {
      const m = sortDir === "asc" ? 1 : -1;
      if (sort === "name") return m * a.name.localeCompare(b.name);
      if (sort === "role") return m * a.role.localeCompare(b.role);
      if (sort === "status") return m * a.status.localeCompare(b.status);
      if (sort === "sessions") return m * (a.sessions - b.sessions);
      if (sort === "revenue") return m * (a.revenue - b.revenue);
      return 0;
    });
    return data;
  }, [search, roleFilter, statusFilter, sort, sortDir]);

  const paged = filtered.slice((page - 1) * rpp, page * rpp);
  const activeUsers = mockUsers.filter(u => u.status === "active");
  const pendingUsers = mockUsers.filter(u => u.status === "pending");

  return (
    <Layout>
      {selected && <UserDetail user={selected} onClose={() => setSelected(null)} />}
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Users" }]} />

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <TabsList className="rounded h-8">
            <TabsTrigger value="all" className="text-xs rounded">All ({mockUsers.length})</TabsTrigger>
            <TabsTrigger value="active" className="text-xs rounded">Active ({activeUsers.length})</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs rounded">Pending ({pendingUsers.length})</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search users..." className="pl-8 h-8 text-xs rounded w-44 border-border/60" />
            </div>
            <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setPage(1); }}>
              <SelectTrigger className="h-8 text-xs rounded w-28 border-border/60 gap-1">
                <Filter className="w-3 h-3" /><SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["all", "admin", "editor", "viewer"].map(v => (
                  <SelectItem key={v} value={v}>{v === "all" ? "All Roles" : v.charAt(0).toUpperCase() + v.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="h-8 text-xs rounded w-28 border-border/60"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["all", "active", "inactive", "pending"].map(v => (
                  <SelectItem key={v} value={v}>{v === "all" ? "All Status" : v.charAt(0).toUpperCase() + v.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* All Users Tab */}
        <TabsContent value="all">
          <div className="rounded border border-border/60 bg-card overflow-hidden mb-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground text-xs">
                  <SortTh label="Name" col="name" sort={sort} sortDir={sortDir} toggle={toggleSort} />
                  <SortTh label="Role" col="role" sort={sort} sortDir={sortDir} toggle={toggleSort} />
                  <SortTh label="Status" col="status" sort={sort} sortDir={sortDir} toggle={toggleSort} />
                  <SortTh label="Sessions" col="sessions" sort={sort} sortDir={sortDir} toggle={toggleSort} />
                  <SortTh label="Revenue" col="revenue" sort={sort} sortDir={sortDir} toggle={toggleSort} />
                  <th className="px-4 py-2.5 text-left font-medium">Location</th>
                  <th className="px-4 py-2.5 text-left font-medium">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0
                  ? <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No users found</td></tr>
                  : paged.map((u, i) => (
                    <tr key={u.id} onClick={() => setSelected(u)}
                      className={cn("border-t border-border/40 hover:bg-muted/30 cursor-pointer transition-colors", i % 2 !== 0 && "bg-muted/10")}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                            {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge label={u.role} className={ROLE_COLORS[u.role]} /></td>
                      <td className="px-4 py-3"><Badge label={u.status} className={STATUS_COLORS[u.status]} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{u.sessions}</td>
                      <td className="px-4 py-3 font-medium">${u.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{u.location}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {u.lastActive ? formatDistanceToNow(new Date(u.lastActive), { addSuffix: true }) : "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={filtered.length} rpp={rpp} onPage={setPage} onRpp={setRpp} />
        </TabsContent>

        {/* Active Tab — unique stat cards */}
        <TabsContent value="active">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: "Admins", count: mockUsers.filter(u => u.role === "admin" && u.status === "active").length, color: "text-violet-500" },
              { label: "Editors", count: mockUsers.filter(u => u.role === "editor" && u.status === "active").length, color: "text-blue-500" },
              { label: "Viewers", count: mockUsers.filter(u => u.role === "viewer" && u.status === "active").length, color: "text-muted-foreground" },
            ].map(r => (
              <div key={r.label} className="rounded border border-border/60 bg-card px-4 py-4">
                <div className={cn("text-2xl font-bold", r.color)}>{r.count}</div>
                <div className="text-sm text-muted-foreground mt-1">{r.label} Active</div>
              </div>
            ))}
          </div>
          <ActiveTab users={activeUsers} onSelect={setSelected} />
        </TabsContent>

        {/* Pending Tab */}
        <TabsContent value="pending">
          <div className="rounded border border-border/60 bg-muted/30 px-4 py-3 mb-4 text-sm text-muted-foreground">
            {pendingUsers.length} user{pendingUsers.length !== 1 ? "s" : ""} awaiting activation.
          </div>
          <div className="rounded border border-border/60 bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 text-left font-medium">Name</th>
                  <th className="px-4 py-2.5 text-left font-medium">Email</th>
                  <th className="px-4 py-2.5 text-left font-medium">Role</th>
                  <th className="px-4 py-2.5 text-left font-medium">Location</th>
                  <th className="px-4 py-2.5 text-left font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.length === 0
                  ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No pending users</td></tr>
                  : pendingUsers.map((u, i) => (
                    <tr key={u.id} onClick={() => setSelected(u)}
                      className={cn("border-t border-border/40 hover:bg-muted/30 cursor-pointer transition-colors", i % 2 !== 0 && "bg-muted/10")}>
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{u.email}</td>
                      <td className="px-4 py-3"><Badge label={u.role} className={ROLE_COLORS[u.role]} /></td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{u.location}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{format(new Date(u.createdAt), "MMM d, yyyy")}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

function ActiveTab({ users, onSelect }: { users: User[]; onSelect: (u: User) => void }) {
  const [page, setPage] = useState(1);
  const [rpp, setRpp] = useState(10);
  const paged = users.slice((page - 1) * rpp, page * rpp);
  return (
    <>
      <div className="rounded border border-border/60 bg-card overflow-hidden mb-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-xs text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-medium">Name</th>
              <th className="px-4 py-2.5 text-left font-medium">Role</th>
              <th className="px-4 py-2.5 text-left font-medium">Sessions</th>
              <th className="px-4 py-2.5 text-left font-medium">Page Views</th>
              <th className="px-4 py-2.5 text-left font-medium">Revenue</th>
              <th className="px-4 py-2.5 text-left font-medium">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((u, i) => (
              <tr key={u.id} onClick={() => onSelect(u)}
                className={cn("border-t border-border/40 hover:bg-muted/30 cursor-pointer transition-colors", i % 2 !== 0 && "bg-muted/10")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">{u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                    <div><div className="font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge label={u.role} className={ROLE_COLORS[u.role]} /></td>
                <td className="px-4 py-3 text-muted-foreground">{u.sessions}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.pageViews.toLocaleString()}</td>
                <td className="px-4 py-3 font-medium">${u.revenue.toLocaleString()}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {u.lastActive ? formatDistanceToNow(new Date(u.lastActive), { addSuffix: true }) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={users.length} rpp={rpp} onPage={setPage} onRpp={setRpp} />
    </>
  );
}
