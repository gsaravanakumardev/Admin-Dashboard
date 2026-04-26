export type User = {
  id: string; name: string; email: string; role: "admin" | "editor" | "viewer";
  status: "active" | "inactive" | "pending"; lastActive: string | null; createdAt: string; avatar: string | null; location: string; sessions: number; pageViews: number; revenue: number;
};

export type ActivityItem = {
  id: string; type: "signup" | "payment" | "login" | "error" | "warning" | "info";
  message: string; user: string | null; timestamp: string;
};

export type Notification = {
  id: string; type: string; title: string; message: string; read: boolean; timestamp: string;
};

export type Report = {
  id: string; name: string; type: string; status: "ready" | "generating" | "failed";
  downloadUrl: string | null; size: string | null; createdAt: string;
};

export type AiInsight = {
  id: string; title: string; description: string; severity: "info" | "warning" | "critical" | "positive";
  category: string; timestamp: string; metric: string | null; change: number | null;
};

export type ChatMessage = {
  id: string; role: "user" | "assistant"; content: string; timestamp: string;
};

export const mockUsers: User[] = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@acme.com", role: "admin", status: "active", lastActive: "2026-04-15T11:55:00Z", createdAt: "2026-01-15T00:00:00Z", avatar: null, location: "San Francisco, CA", sessions: 148, pageViews: 1820, revenue: 4200 },
  { id: "2", name: "Marcus Johnson", email: "marcus.j@acme.com", role: "editor", status: "active", lastActive: "2026-04-15T11:30:00Z", createdAt: "2026-01-22T00:00:00Z", avatar: null, location: "New York, NY", sessions: 92, pageViews: 1140, revenue: 2800 },
  { id: "3", name: "Priya Patel", email: "priya.p@acme.com", role: "viewer", status: "active", lastActive: "2026-04-15T10:00:00Z", createdAt: "2026-02-01T00:00:00Z", avatar: null, location: "Mumbai, India", sessions: 74, pageViews: 890, revenue: 1500 },
  { id: "4", name: "Alex Rivera", email: "alex.r@acme.com", role: "editor", status: "active", lastActive: "2026-04-15T10:00:00Z", createdAt: "2026-02-10T00:00:00Z", avatar: null, location: "Austin, TX", sessions: 115, pageViews: 1390, revenue: 3100 },
  { id: "5", name: "Emma Wilson", email: "emma.w@acme.com", role: "viewer", status: "inactive", lastActive: "2026-04-13T08:00:00Z", createdAt: "2026-02-15T00:00:00Z", avatar: null, location: "London, UK", sessions: 31, pageViews: 340, revenue: 620 },
  { id: "6", name: "David Kim", email: "david.k@acme.com", role: "editor", status: "active", lastActive: "2026-04-15T11:45:00Z", createdAt: "2026-02-20T00:00:00Z", avatar: null, location: "Seoul, Korea", sessions: 88, pageViews: 1060, revenue: 2400 },
  { id: "7", name: "Fatima Al-Hassan", email: "fatima.ah@acme.com", role: "viewer", status: "pending", lastActive: null, createdAt: "2026-03-01T00:00:00Z", avatar: null, location: "Dubai, UAE", sessions: 0, pageViews: 0, revenue: 0 },
  { id: "8", name: "Tom Eriksson", email: "tom.e@acme.com", role: "admin", status: "active", lastActive: "2026-04-15T09:00:00Z", createdAt: "2026-01-05T00:00:00Z", avatar: null, location: "Stockholm, Sweden", sessions: 201, pageViews: 2450, revenue: 5800 },
  { id: "9", name: "Yuki Tanaka", email: "yuki.t@acme.com", role: "viewer", status: "active", lastActive: "2026-04-15T11:15:00Z", createdAt: "2026-03-05T00:00:00Z", avatar: null, location: "Tokyo, Japan", sessions: 56, pageViews: 670, revenue: 980 },
  { id: "10", name: "Carlos Mendez", email: "carlos.m@acme.com", role: "editor", status: "inactive", lastActive: "2026-04-12T14:00:00Z", createdAt: "2026-03-10T00:00:00Z", avatar: null, location: "Mexico City", sessions: 22, pageViews: 270, revenue: 410 },
  { id: "11", name: "Lisa Park", email: "lisa.p@acme.com", role: "viewer", status: "active", lastActive: "2026-04-15T11:00:00Z", createdAt: "2026-03-12T00:00:00Z", avatar: null, location: "Los Angeles, CA", sessions: 67, pageViews: 800, revenue: 1200 },
  { id: "12", name: "James Okafor", email: "james.o@acme.com", role: "editor", status: "active", lastActive: "2026-04-15T11:40:00Z", createdAt: "2026-03-15T00:00:00Z", avatar: null, location: "Lagos, Nigeria", sessions: 79, pageViews: 950, revenue: 1750 },
  { id: "13", name: "Amelia Foster", email: "amelia.f@acme.com", role: "viewer", status: "active", lastActive: "2026-04-15T10:30:00Z", createdAt: "2026-03-18T00:00:00Z", avatar: null, location: "Sydney, Australia", sessions: 44, pageViews: 530, revenue: 890 },
  { id: "14", name: "Rahul Sharma", email: "rahul.s@acme.com", role: "editor", status: "active", lastActive: "2026-04-15T09:50:00Z", createdAt: "2026-03-20T00:00:00Z", avatar: null, location: "Bangalore, India", sessions: 63, pageViews: 760, revenue: 1380 },
  { id: "15", name: "Nina Petrov", email: "nina.p@acme.com", role: "viewer", status: "pending", lastActive: null, createdAt: "2026-04-01T00:00:00Z", avatar: null, location: "Moscow, Russia", sessions: 0, pageViews: 0, revenue: 0 },
  { id: "16", name: "Diego Santos", email: "diego.s@acme.com", role: "viewer", status: "active", lastActive: "2026-04-15T08:20:00Z", createdAt: "2026-04-02T00:00:00Z", avatar: null, location: "São Paulo, Brazil", sessions: 28, pageViews: 340, revenue: 560 },
  { id: "17", name: "Grace Liu", email: "grace.l@acme.com", role: "admin", status: "active", lastActive: "2026-04-15T11:50:00Z", createdAt: "2026-01-28T00:00:00Z", avatar: null, location: "Shanghai, China", sessions: 172, pageViews: 2100, revenue: 4900 },
  { id: "18", name: "Omar Hassan", email: "omar.h@acme.com", role: "editor", status: "inactive", lastActive: "2026-04-10T16:00:00Z", createdAt: "2026-02-25T00:00:00Z", avatar: null, location: "Cairo, Egypt", sessions: 18, pageViews: 215, revenue: 320 },
  { id: "19", name: "Sofia Martinez", email: "sofia.m@acme.com", role: "viewer", status: "active", lastActive: "2026-04-15T11:20:00Z", createdAt: "2026-03-25T00:00:00Z", avatar: null, location: "Madrid, Spain", sessions: 39, pageViews: 470, revenue: 740 },
  { id: "20", name: "Felix Wagner", email: "felix.w@acme.com", role: "editor", status: "active", lastActive: "2026-04-15T10:45:00Z", createdAt: "2026-03-28T00:00:00Z", avatar: null, location: "Berlin, Germany", sessions: 55, pageViews: 660, revenue: 1100 },
  { id: "21", name: "Aisha Nkrumah", email: "aisha.n@acme.com", role: "viewer", status: "active", lastActive: "2026-04-15T09:30:00Z", createdAt: "2026-04-05T00:00:00Z", avatar: null, location: "Accra, Ghana", sessions: 21, pageViews: 255, revenue: 420 },
  { id: "22", name: "Luca Romano", email: "luca.r@acme.com", role: "editor", status: "pending", lastActive: null, createdAt: "2026-04-08T00:00:00Z", avatar: null, location: "Rome, Italy", sessions: 0, pageViews: 0, revenue: 0 },
  { id: "23", name: "Chen Wei", email: "chen.w@acme.com", role: "viewer", status: "active", lastActive: "2026-04-15T10:10:00Z", createdAt: "2026-04-09T00:00:00Z", avatar: null, location: "Beijing, China", sessions: 15, pageViews: 180, revenue: 290 },
  { id: "24", name: "Isabel Oliveira", email: "isabel.o@acme.com", role: "viewer", status: "active", lastActive: "2026-04-14T18:00:00Z", createdAt: "2026-04-10T00:00:00Z", avatar: null, location: "Lisbon, Portugal", sessions: 12, pageViews: 145, revenue: 220 },
  { id: "25", name: "Kwame Asante", email: "kwame.a@acme.com", role: "editor", status: "active", lastActive: "2026-04-15T11:05:00Z", createdAt: "2026-04-12T00:00:00Z", avatar: null, location: "Nairobi, Kenya", sessions: 9, pageViews: 108, revenue: 175 },
];

export const mockActivity: ActivityItem[] = [
  { id: "1", type: "signup", message: "New user Sarah Chen joined via organic search", user: "Sarah Chen", timestamp: "2026-04-15T11:55:00Z" },
  { id: "2", type: "payment", message: "Payment of $299 received from Acme Corp", user: "Acme Corp", timestamp: "2026-04-15T11:44:00Z" },
  { id: "3", type: "login", message: "Marcus Johnson logged in from New York", user: "Marcus Johnson", timestamp: "2026-04-15T11:30:00Z" },
  { id: "4", type: "payment", message: "Enterprise plan upgrade — $1,200/mo from TechFlow Inc", user: "TechFlow Inc", timestamp: "2026-04-15T11:12:00Z" },
  { id: "5", type: "signup", message: "Yuki Tanaka joined from Tokyo", user: "Yuki Tanaka", timestamp: "2026-04-15T11:00:00Z" },
  { id: "6", type: "warning", message: "High memory usage on server-02 at 87%", user: null, timestamp: "2026-04-15T10:30:00Z" },
  { id: "7", type: "error", message: "Payment failed for David Kim — card declined", user: "David Kim", timestamp: "2026-04-15T10:15:00Z" },
  { id: "8", type: "info", message: "Scheduled maintenance completed with no downtime", user: null, timestamp: "2026-04-15T09:50:00Z" },
  { id: "9", type: "signup", message: "James Okafor joined from Lagos, Nigeria", user: "James Okafor", timestamp: "2026-04-15T09:30:00Z" },
  { id: "10", type: "login", message: "Priya Patel accessed the analytics dashboard", user: "Priya Patel", timestamp: "2026-04-15T09:15:00Z" },
  { id: "11", type: "error", message: "API rate limit exceeded for partner integration", user: null, timestamp: "2026-04-15T08:58:00Z" },
  { id: "12", type: "payment", message: "Payment of $99 received from Carlos Mendez", user: "Carlos Mendez", timestamp: "2026-04-15T08:40:00Z" },
  { id: "13", type: "signup", message: "Emma Wilson joined from London, UK", user: "Emma Wilson", timestamp: "2026-04-15T08:20:00Z" },
  { id: "14", type: "info", message: "Weekly report generated successfully", user: null, timestamp: "2026-04-15T08:00:00Z" },
  { id: "15", type: "warning", message: "SSL certificate expires in 14 days", user: null, timestamp: "2026-04-15T07:45:00Z" },
];

export const mockNotifications: Notification[] = [
  { id: "1", type: "signup", title: "New User Signup", message: "Sarah Chen joined via organic search", read: false, timestamp: "2026-04-15T11:55:00Z" },
  { id: "2", type: "payment_success", title: "Payment Received", message: "Enterprise upgrade — $1,200/mo from TechFlow Inc", read: false, timestamp: "2026-04-15T11:12:00Z" },
  { id: "3", type: "payment_failed", title: "Payment Failed", message: "David Kim's payment of $99 was declined", read: false, timestamp: "2026-04-15T10:15:00Z" },
  { id: "4", type: "system_warning", title: "High Memory Usage", message: "Server-02 memory usage at 87% — consider scaling", read: true, timestamp: "2026-04-15T10:30:00Z" },
  { id: "5", type: "signup", title: "New User Signup", message: "James Okafor joined from Lagos, Nigeria", read: true, timestamp: "2026-04-15T09:30:00Z" },
  { id: "6", type: "info", title: "Maintenance Complete", message: "Scheduled maintenance window completed with no downtime", read: true, timestamp: "2026-04-15T09:50:00Z" },
];

export const mockReports: Report[] = [
  { id: "1", name: "Monthly User Activity Report", type: "user-activity", status: "ready", size: "842 KB", downloadUrl: "#", createdAt: "2026-04-14T12:04:00Z" },
  { id: "2", name: "Q1 Revenue Summary", type: "revenue", status: "ready", size: "1.2 MB", downloadUrl: "#", createdAt: "2026-04-11T12:04:00Z" },
  { id: "3", name: "Traffic Source Analysis", type: "traffic", status: "ready", size: "376 KB", downloadUrl: "#", createdAt: "2026-04-08T12:04:00Z" },
  { id: "4", name: "Conversion Funnel Report", type: "conversion", status: "generating", size: null, downloadUrl: null, createdAt: "2026-04-05T12:04:00Z" },
  { id: "5", name: "Annual Performance Dashboard", type: "custom", status: "ready", size: "2.8 MB", downloadUrl: "#", createdAt: "2026-04-02T12:04:00Z" },
  { id: "6", name: "User Cohort Analysis", type: "user-activity", status: "ready", size: "634 KB", downloadUrl: "#", createdAt: "2026-03-30T12:04:00Z" },
  { id: "7", name: "March Revenue Breakdown", type: "revenue", status: "ready", size: "988 KB", downloadUrl: "#", createdAt: "2026-03-28T12:04:00Z" },
  { id: "8", name: "Device Performance Report", type: "traffic", status: "failed", size: null, downloadUrl: null, createdAt: "2026-03-25T12:04:00Z" },
];

export const mockInsights: AiInsight[] = [
  { id: "1", title: "User engagement dropped 18% this week", description: "Daily active users declined from 2,841 to 2,326. Primary drop on Tuesday and Wednesday, correlated with the v2.4 deployment.", severity: "warning", category: "engagement", timestamp: "2026-04-15T10:00:00Z", metric: "DAU", change: -18 },
  { id: "2", title: "Top performing region: India", description: "India accounts for 31.2% of new signups this month, up from 18.4% last month. Consider localizing the onboarding experience.", severity: "positive", category: "user", timestamp: "2026-04-15T08:00:00Z", metric: "Regional Signups", change: 69.6 },
  { id: "3", title: "Revenue spike detected on March 12", description: "Revenue surged 43% above baseline on March 12, driven by enterprise plan upgrades. 12 accounts upgraded to Enterprise.", severity: "positive", category: "revenue", timestamp: "2026-04-15T06:00:00Z", metric: "Daily Revenue", change: 43 },
  { id: "4", title: "API response time degradation", description: "P95 API latency increased from 182ms to 340ms over the past 6 hours. Most affected: /api/reports endpoint.", severity: "critical", category: "performance", timestamp: "2026-04-15T11:30:00Z", metric: "P95 Latency", change: 87 },
  { id: "5", title: "Conversion rate improving steadily", description: "Free-to-paid conversion rate has risen from 2.1% to 3.4% over 30 days. The new onboarding checklist is driving this improvement.", severity: "positive", category: "revenue", timestamp: "2026-04-14T12:00:00Z", metric: "Conversion Rate", change: 62 },
];

export const mockChatHistory: ChatMessage[] = [];

export const mockDashboardMetrics = {
  totalUsers: 25,
  totalUsersTrend: 12.5,
  activeSessions: 18,
  activeSessionsTrend: 8.2,
  revenue: 142850,
  revenueTrend: 23.1,
  conversionRate: 3.4,
  conversionRateTrend: 4.7,
  sparklines: {
    users: [120, 132, 141, 155, 162, 178, 189, 201, 215, 224, 25],
    sessions: [80, 95, 88, 102, 110, 98, 115, 122, 130, 141, 18],
    revenue: [8200, 9100, 8750, 9400, 10200, 9800, 11000, 10500, 12000, 11800, 13200],
    conversion: [2.1, 2.4, 2.2, 2.5, 2.7, 2.6, 2.9, 3.0, 3.1, 3.2, 3.4],
  },
};

export const mockChartData30d = {
  labels: Array.from({ length: 30 }, (_, i) => {
    const d = new Date("2026-04-15"); d.setDate(d.getDate() - (29 - i));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }),
  userGrowth: [204,208,212,215,219,224,228,231,235,239,243,247,251,254,258,262,266,269,273,277,281,284,288,292,296,299,303,307,311,315],
  revenue: [8420,8650,8320,9100,9480,9200,10100,9750,10500,11200,10800,11500,12000,11600,12400,13100,12700,13500,14200,13800,14600,15300,14900,15700,16400,16000,16800,17500,17100,17900],
};

export const mockChartData7d = {
  labels: Array.from({ length: 7 }, (_, i) => {
    const d = new Date("2026-04-15"); d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }),
  userGrowth: [299, 303, 307, 311, 315, 319, 323],
  revenue: [16000, 16800, 17500, 17100, 17900, 18600, 19200],
};

export const mockChartData90d = {
  labels: Array.from({ length: 90 }, (_, i) => {
    const d = new Date("2026-04-15"); d.setDate(d.getDate() - (89 - i));
    return i % 7 === 0 ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
  }),
  userGrowth: Array.from({ length: 90 }, (_, i) => 120 + i * 2.2),
  revenue: Array.from({ length: 90 }, (_, i) => 5800 + i * 130 + Math.sin(i / 5) * 400),
};

export const mockTrafficSources = [
  { source: "Organic Search", value: 42.3, color: "hsl(243 75% 59%)" },
  { source: "Direct", value: 21.8, color: "hsl(280 65% 60%)" },
  { source: "Social Media", value: 18.4, color: "hsl(199 89% 48%)" },
  { source: "Email", value: 11.2, color: "hsl(160 60% 45%)" },
  { source: "Referral", value: 6.3, color: "hsl(38 92% 50%)" },
];

export const mockRetentionData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"],
  current: [100, 82, 74, 68, 62, 58, 55, 53],
  previous: [100, 78, 69, 63, 57, 52, 49, 46],
};

export const mockDeviceUsage = [
  { device: "Desktop", users: 4820, percentage: 52.3 },
  { device: "Mobile", users: 3210, percentage: 34.8 },
  { device: "Tablet", users: 1190, percentage: 12.9 },
];
