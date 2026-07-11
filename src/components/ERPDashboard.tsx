// src/components/ERPDashboard.tsx - الكود بعد التعديل (الأصلي مع الحفاظ على الشكل)
import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  LogOut,
  LayoutDashboard,
  LayoutGrid,
  Activity,
  Users,
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  UserCheck,
  Truck,
  CreditCard,
  User,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { OrdersPage } from "./OrdersPage";
import { InventoryPage } from "./InventoryPage";
import { CustomersPage } from "./CustomersPage";
import { ReportsPage } from "./ReportsPage";
import { EmployeesPage } from "./EmployeesPage";
import { InvoicesPage } from "./InvoicesPage";
import { SuppliersPage } from "./SuppliersPage";
import { PurchaseOrdersPage } from "./PurchaseOrdersPage";
import { SettingsPage } from "./SettingsPage";
import { AnalyticsPage } from "./AnalyticsPage";
import { AuditLogPage } from "./AuditLogPage";
import { SystemSettingsPage } from "./SystemSettingsPage";
import { RequireRole } from "./RequireRole";

interface ERPDashboardProps {
  user: { email: string; name: string; avatarUrl?: string | null };
  onLogout: () => void;
}

interface RevenueExpensePoint {
  month: string;
  revenue: number;
  expenses: number;
}

interface SalesRegionPoint {
  region: string;
  value: number;
}

interface ExpenseSlice {
  category: string;
  value: number;
}

interface Transaction {
  id: string;
  date: string;
  entity: string;
  type: string;
  amount: string;
  status: "Posted" | "Pending" | "Draft";
}

interface ApprovalItem {
  id: string;
  description: string;
  owner: string;
  dueIn: string;
}

interface AlertItem {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timeAgo: string;
}

export function ERPDashboard({ user, onLogout }: ERPDashboardProps) {
  const [activePage, setActivePage] = useState("dashboard");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<"admin" | "sales" | "warehouse" | "finance">("admin");
  const [selectedWarehouse, setSelectedWarehouse] = useState("Riyadh DC");
  const [selectedCurrency, setSelectedCurrency] = useState<"SAR" | "USD" | "EUR">("SAR");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('erp_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [profileAvatar, setProfileAvatar] = useState<string | null>(() => {
    try {
      const raw = localStorage.getItem("erp_settings_v3");
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.avatarUrl || user.avatarUrl || null;
    } catch {
      return user.avatarUrl || null;
    }
  });

  const [profileName, setProfileName] = useState<string>(() => {
    try {
      const raw = localStorage.getItem("erp_settings_v3");
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.fullName || user.name;
    } catch {
      return user.name;
    }
  });

  const [profileEmail, setProfileEmail] = useState<string>(() => {
    try {
      const raw = localStorage.getItem("erp_settings_v3");
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.emailAddress || user.email;
    } catch {
      return user.email;
    }
  });

  useEffect(() => {
    localStorage.setItem('erp_sidebar_collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  React.useEffect(() => {
    const handleAvatarUpdate = (event: Event) => {
      const custom = event as CustomEvent<string | null>;
      setProfileAvatar(custom.detail ?? null);
    };

    const handleProfileUpdate = (
      event: Event,
    ) => {
      const custom = event as CustomEvent<{
        fullName?: string;
        emailAddress?: string;
        avatarUrl?: string | null;
      }>;
      if (custom.detail?.fullName) setProfileName(custom.detail.fullName);
      if (custom.detail?.emailAddress) setProfileEmail(custom.detail.emailAddress);
      if ("avatarUrl" in custom.detail)
        setProfileAvatar(custom.detail.avatarUrl ?? null);
    };

    const syncFromStorage = () => {
      try {
        const raw = localStorage.getItem("erp_settings_v3");
        const parsed = raw ? JSON.parse(raw) : null;
        if (parsed?.avatarUrl !== undefined) {
          setProfileAvatar(parsed.avatarUrl || null);
        }
        if (parsed?.fullName) setProfileName(parsed.fullName);
        if (parsed?.emailAddress) setProfileEmail(parsed.emailAddress);
      } catch {
        /* ignore */
      }
    };

    window.addEventListener("erp-avatar-updated", handleAvatarUpdate);
    window.addEventListener("erp-profile-updated", handleProfileUpdate);
    window.addEventListener("storage", syncFromStorage);

    return () => {
      window.removeEventListener("erp-avatar-updated", handleAvatarUpdate);
      window.removeEventListener("erp-profile-updated", handleProfileUpdate);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  const stats = [
    {
      title: "Total Revenue",
      value: "$124,580",
      change: "+12.5%",
      isPositive: true,
      icon: <DollarSign className="w-6 h-6" />,
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-400/30",
      iconColor: "text-blue-300",
    },
    {
      title: "Orders",
      value: "1,247",
      change: "+8.2%",
      isPositive: true,
      icon: <ShoppingCart className="w-6 h-6" />,
      bgColor: "bg-green-500/20",
      borderColor: "border-green-400/30",
      iconColor: "text-green-300",
    },
    {
      title: "Products",
      value: "328",
      change: "-2.4%",
      isPositive: false,
      icon: <Package className="w-6 h-6" />,
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-400/30",
      iconColor: "text-purple-300",
    },
    {
      title: "Customers",
      value: "5,432",
      change: "+15.3%",
      isPositive: true,
      icon: <Users className="w-6 h-6" />,
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-400/30",
      iconColor: "text-orange-300",
    },
  ];

  const recentActivities: ActivityItem[] = [
    { id: "1", user: "System", action: "New order received", timeAgo: "2 minutes ago" },
    {
      id: "2",
      user: "System",
      action: "Product stock updated",
      timeAgo: "15 minutes ago",
    },
    { id: "3", user: "System", action: "Invoice generated", timeAgo: "1 hour ago" },
    {
      id: "4",
      user: "System",
      action: "New customer registered",
      timeAgo: "2 hours ago",
    },
  ];

  const revenueExpensesData: RevenueExpensePoint[] = [
    { month: "Jan", revenue: 920000, expenses: 640000 },
    { month: "Feb", revenue: 1010000, expenses: 690000 },
    { month: "Mar", revenue: 1125000, expenses: 735000 },
    { month: "Apr", revenue: 1180000, expenses: 760000 },
    { month: "May", revenue: 1240000, expenses: 784000 },
    { month: "Jun", revenue: 1315000, expenses: 821000 },
  ];

  const salesByRegion: SalesRegionPoint[] = [
    { region: "North America", value: 420000 },
    { region: "EMEA", value: 365000 },
    { region: "APAC", value: 298000 },
    { region: "LATAM", value: 142000 },
  ];

  const expenseDistribution: ExpenseSlice[] = [
    { category: "Payroll", value: 38 },
    { category: "Operations", value: 26 },
    { category: "Procurement", value: 18 },
    { category: "Technology", value: 11 },
    { category: "Other", value: 7 },
  ];

  const recentTransactions: Transaction[] = [
    {
      id: "TRX-98214",
      date: "2025-06-12",
      entity: "Global Supplies Ltd.",
      type: "Purchase Invoice",
      amount: "$48,320",
      status: "Posted",
    },
    {
      id: "TRX-98207",
      date: "2025-06-12",
      entity: "Acme Distribution",
      type: "Sales Order",
      amount: "$112,940",
      status: "Pending",
    },
    {
      id: "TRX-98188",
      date: "2025-06-11",
      entity: "Blue Ocean Logistics",
      type: "Vendor Payment",
      amount: "$23,600",
      status: "Posted",
    },
    {
      id: "TRX-98174",
      date: "2025-06-11",
      entity: "Contoso Healthcare",
      type: "Customer Invoice",
      amount: "$76,210",
      status: "Draft",
    },
  ];

  const pendingApprovals: ApprovalItem[] = [
    {
      id: "AP-2041",
      description: "Approve Q3 OPEX budget revision",
      owner: "Finance Controller",
      dueIn: "Today",
    },
    {
      id: "PO-8872",
      description: "PO #8872 – IT hardware refresh (EMEA)",
      owner: "Head of Procurement",
      dueIn: "In 2 days",
    },
    {
      id: "HR-1198",
      description: "New hire package – Senior Project Manager",
      owner: "HR Manager",
      dueIn: "In 4 days",
    },
  ];

  const systemAlerts: AlertItem[] = [
    {
      id: "AL-9001",
      severity: "critical",
      title: "Inventory threshold reached",
      detail: "12 SKUs below minimum stock levels in EMEA DC-03.",
    },
    {
      id: "AL-9002",
      severity: "warning",
      title: "Delayed approval backlog",
      detail: "7 finance approvals are overdue by more than 3 days.",
    },
    {
      id: "AL-9003",
      severity: "info",
      title: "Scheduled maintenance",
      detail: "Planned system maintenance on Saturday, 02:00–04:00 UTC.",
    },
  ];

  return (
    <div className="min-h-screen erp-background">
      {/* Navigation Bar */}
      <nav className="glass-navbar sticky top-0 z-50 erp-navbar">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-white/80 hover:bg-white/10 rounded-lg transition"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white">ERP System</h1>
                <p className="text-sm text-white/80">
                  Enterprise Resource Planning
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full pl-10 pr-4 py-2 glass-input text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                {searchOpen && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-4 z-50">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-white/60">Quick Navigation</p>
                      <button onClick={() => setSearchOpen(false)} className="text-white/60 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {[
                        { page: 'dashboard', label: 'Dashboard', icon: Activity },
                        { page: 'orders', label: 'Orders', icon: ShoppingCart },
                        { page: 'customers', label: 'Customers', icon: Users },
                        { page: 'inventory', label: 'Products', icon: Package },
                        { page: 'invoices', label: 'Invoices', icon: CreditCard },
                        { page: 'employees', label: 'Employees', icon: UserCheck },
                        { page: 'reports', label: 'Reports', icon: FileText },
                        { page: 'settings', label: 'Settings', icon: Settings },
                        { page: 'system-settings', label: 'System Settings', icon: Settings },
                      ]
                        .filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(item => (
                          <button
                            key={item.page}
                            onClick={() => {
                              setActivePage(item.page);
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-left transition"
                          >
                            <item.icon className="w-4 h-4 text-white/60" />
                            <span className="text-white text-sm">{item.label}</span>
                          </button>
                        ))}
                      {[
                        { page: 'dashboard', label: 'Dashboard', icon: Activity },
                        { page: 'orders', label: 'Orders', icon: ShoppingCart },
                        { page: 'customers', label: 'Customers', icon: Users },
                        { page: 'inventory', label: 'Products', icon: Package },
                        { page: 'invoices', label: 'Invoices', icon: CreditCard },
                        { page: 'employees', label: 'Employees', icon: UserCheck },
                        { page: 'reports', label: 'Reports', icon: FileText },
                        { page: 'settings', label: 'Settings', icon: Settings },
                        { page: 'system-settings', label: 'System Settings', icon: Settings },
                      ]
                        .filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <p className="text-xs text-white/60">No results found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 mr-2 text-xs">
                <select
                  value={currentRole}
                  onChange={(e) =>
                    setCurrentRole(e.target.value as typeof currentRole)
                  }
                  className="px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white/80 focus:outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="sales">Sales</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="finance">Finance</option>
                </select>
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white/80 focus:outline-none"
                >
                  <option value="Riyadh DC">Riyadh DC</option>
                  <option value="Jeddah DC">Jeddah DC</option>
                  <option value="Dubai DC">Dubai DC</option>
                </select>
                <select
                  value={selectedCurrency}
                  onChange={(e) =>
                    setSelectedCurrency(e.target.value as "SAR" | "USD" | "EUR")
                  }
                  className="px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white/80 focus:outline-none"
                >
                  <option value="SAR">SAR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <button
                className="relative p-2 text-white/80 hover:bg-white/10 rounded-lg transition"
                onClick={() => setNotificationsOpen(true)}
              >
                <Bell className="w-5 h-5" />
                {systemAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                    {systemAlerts.length + pendingApprovals.length}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                <div className="text-right hidden sm:block">
                  <p className="text-white">{profileName}</p>
                  <p className="text-sm text-white/70">{profileEmail}</p>
                </div>
                {profileAvatar ? (
                  <div className="w-10 h-10 rounded-full ring-2 ring-white/30 border-2 border-white/20">
                    <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-full overflow-hidden flex items-center justify-center">
                      <img
                        src={profileAvatar}
                        alt="User avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full ring-2 ring-white/30 border-2 border-white/20">
                    <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-white/80 hover:bg-white/10 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        {mobileSidebarOpen && (
          <aside className="fixed inset-y-0 left-0 w-64 glass-sidebar z-50 lg:hidden p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-6 h-6 text-white" />
                <span className="text-white font-semibold">ERP System</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 text-white/80 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => { setActivePage("dashboard"); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activePage === "dashboard"
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Activity className="w-5 h-5 flex-shrink-0" />
                <span>Dashboard</span>
              </button>

              {/* Sales Section */}
              <div className="pt-4">
                <p className="px-4 text-xs text-white/60 uppercase tracking-wider mb-2">
                  Sales
                </p>
                <button
                  onClick={() => { setActivePage("orders"); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activePage === "orders"
                      ? "glass-sidebar-btn-active text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => { setActivePage("customers"); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activePage === "customers"
                      ? "glass-sidebar-btn-active text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Users className="w-5 h-5 flex-shrink-0" />
                  <span>Customers</span>
                </button>
              </div>

              {/* Inventory Section */}
              <div className="pt-4">
                <p className="px-4 text-xs text-white/60 uppercase tracking-wider mb-2">
                  Inventory
                </p>
                <button
                  onClick={() => { setActivePage("inventory"); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activePage === "inventory"
                      ? "glass-sidebar-btn-active text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Package className="w-5 h-5 flex-shrink-0" />
                  <span>Products</span>
                </button>
                <button
                  onClick={() => { setActivePage("suppliers"); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activePage === "suppliers"
                      ? "glass-sidebar-btn-active text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Truck className="w-5 h-5 flex-shrink-0" />
                  <span>Suppliers</span>
                </button>
                <button
                  onClick={() => { setActivePage("purchase-orders"); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activePage === "purchase-orders"
                      ? "glass-sidebar-btn-active text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                  <span>Purchase Orders</span>
                </button>
              </div>

              {/* Finance Section */}
              <div className="pt-4">
                <p className="px-4 text-xs text-white/60 uppercase tracking-wider mb-2">
                  Finance
                </p>
                <button
                  onClick={() => { setActivePage("invoices"); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activePage === "invoices"
                      ? "glass-sidebar-btn-active text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <CreditCard className="w-5 h-5 flex-shrink-0" />
                  <span>Invoices</span>
                </button>
                <button
                  onClick={() => { setActivePage("reports"); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activePage === "reports"
                      ? "glass-sidebar-btn-active text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <FileText className="w-5 h-5 flex-shrink-0" />
                  <span>Reports</span>
                </button>
              </div>

              {/* HR Section */}
              <div className="pt-4">
                <p className="px-4 text-xs text-white/60 uppercase tracking-wider mb-2">
                  HR
                </p>
                <button
                  onClick={() => { setActivePage("employees"); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activePage === "employees"
                      ? "glass-sidebar-btn-active text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <UserCheck className="w-5 h-5 flex-shrink-0" />
                  <span>Employees</span>
                </button>
              </div>

              {/* Other */}
              <div className="pt-4">
                <p className="px-4 text-xs text-white/60 uppercase tracking-wider mb-2">
                  Other
                </p>
                <button
                  onClick={() => { setActivePage("analytics"); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activePage === "analytics"
                      ? "glass-sidebar-btn-active text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <BarChart3 className="w-5 h-5 flex-shrink-0" />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={() => { setActivePage("settings"); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activePage === "settings"
                      ? "glass-sidebar-btn-active text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Settings className="w-5 h-5 flex-shrink-0" />
                  <span>Settings</span>
                </button>
                <RequireRole allowedRoles={['admin']}>
                  <button
                    onClick={() => { setActivePage("system-settings"); setMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activePage === "system-settings"
                        ? "glass-sidebar-btn-active text-white"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    <span>System Settings</span>
                  </button>
                </RequireRole>
                <button
                  onClick={() => { setActivePage("audit-log"); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activePage === "audit-log"
                      ? "glass-sidebar-btn-active text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <ClipboardList className="w-5 h-5 flex-shrink-0" />
                  <span>Audit Log</span>
                </button>
              </div>
            </nav>
          </aside>
        )}

        {/* Desktop Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} glass-sidebar min-h-[calc(100vh-89px)] p-4 transition-all duration-300 relative hidden lg:block`}>
          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-6 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition z-10"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-3 h-3 text-white" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-white" />
            )}
          </button>

          <nav className="space-y-1">
            <button
              onClick={() => { setActivePage("dashboard"); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-${sidebarCollapsed ? '2' : '4'} py-3 rounded-lg transition ${
                activePage === "dashboard"
                  ? "glass-sidebar-btn-active text-white"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              <Activity className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </button>

            {/* Sales Section */}
            <div className="pt-4">
              {!sidebarCollapsed && (
                <p className="px-4 text-xs text-white/60 uppercase tracking-wider mb-2">
                  Sales
                </p>
              )}
              <button
                onClick={() => setActivePage("orders")}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-${sidebarCollapsed ? '2' : '4'} py-3 rounded-lg transition ${
                  activePage === "orders"
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Orders</span>}
              </button>
              <button
                onClick={() => setActivePage("customers")}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-${sidebarCollapsed ? '2' : '4'} py-3 rounded-lg transition ${
                  activePage === "customers"
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Users className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Customers</span>}
              </button>
            </div>

            {/* Inventory Section */}
            <div className="pt-4">
              {!sidebarCollapsed && (
                <p className="px-4 text-xs text-white/60 uppercase tracking-wider mb-2">
                  Inventory
                </p>
              )}
              <button
                onClick={() => setActivePage("inventory")}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-${sidebarCollapsed ? '2' : '4'} py-3 rounded-lg transition ${
                  activePage === "inventory"
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Package className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Products</span>}
              </button>
              <button
                onClick={() => setActivePage("suppliers")}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-${sidebarCollapsed ? '2' : '4'} py-3 rounded-lg transition ${
                  activePage === "suppliers"
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Truck className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Suppliers</span>}
              </button>
              <button
                onClick={() => setActivePage("purchase-orders")}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-${sidebarCollapsed ? '2' : '4'} py-3 rounded-lg transition ${
                  activePage === "purchase-orders"
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Purchase Orders</span>}
              </button>
            </div>

            {/* Finance Section */}
            <div className="pt-4">
              {!sidebarCollapsed && (
                <p className="px-4 text-xs text-white/60 uppercase tracking-wider mb-2">
                  Finance
                </p>
              )}
              <button
                onClick={() => setActivePage("invoices")}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-${sidebarCollapsed ? '2' : '4'} py-3 rounded-lg transition ${
                  activePage === "invoices"
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <CreditCard className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Invoices</span>}
              </button>
              <button
                onClick={() => setActivePage("reports")}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-${sidebarCollapsed ? '2' : '4'} py-3 rounded-lg transition ${
                  activePage === "reports"
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <FileText className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Reports</span>}
              </button>
            </div>

            {/* HR Section */}
            <div className="pt-4">
              {!sidebarCollapsed && (
                <p className="px-4 text-xs text-white/60 uppercase tracking-wider mb-2">
                  Human Resources
                </p>
              )}
              <button
                onClick={() => setActivePage("employees")}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-${sidebarCollapsed ? '2' : '4'} py-3 rounded-lg transition ${
                  activePage === "employees"
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <UserCheck className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Employees</span>}
              </button>
            </div>

            {/* Other */}
            <div className="pt-4">
              {!sidebarCollapsed && (
                <p className="px-4 text-xs text-white/60 uppercase tracking-wider mb-2">
                  Other
                </p>
              )}
              <button
                onClick={() => setActivePage("analytics")}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-${sidebarCollapsed ? '2' : '4'} py-3 rounded-lg transition ${
                  activePage === "analytics"
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <BarChart3 className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Analytics</span>}
              </button>
              <button
                onClick={() => setActivePage("settings")}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-${sidebarCollapsed ? '2' : '4'} py-3 rounded-lg transition ${
                  activePage === "settings"
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Settings</span>}
              </button>
              <RequireRole allowedRoles={['admin']}>
                <button
                  onClick={() => setActivePage("system-settings")}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-${sidebarCollapsed ? '2' : '4'} py-3 rounded-lg transition ${
                    activePage === "system-settings"
                      ? "glass-sidebar-btn-active text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Settings className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>System Settings</span>}
                </button>
              </RequireRole>
              <button
                onClick={() => setActivePage("audit-log")}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-${sidebarCollapsed ? '2' : '4'} py-3 rounded-lg transition ${
                  activePage === "audit-log"
                    ? "glass-sidebar-btn-active text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <ClipboardList className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Audit Log</span>}
              </button>
            </div>
          </nav>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb Bar */}
            {activePage !== "dashboard" && (
              <div className="mb-6 flex items-center gap-2 text-sm text-white/60">
                <button
                  onClick={() => setActivePage("dashboard")}
                  className="hover:text-white transition"
                >
                  Dashboard
                </button>
                <span>/</span>
                <span className="text-white capitalize">{activePage.replace('-', ' ')}</span>
              </div>
            )}
            {activePage === "dashboard" && (
              <div className="space-y-6 lg:space-y-8">
                {/* Dashboard Header */}
                <div className="mb-6 lg:mb-8">
                  <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
                    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="min-w-0 flex items-center gap-3">
                          <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                          <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                              Dashboard Overview
                            </h2>
                            <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                              Welcome back, {user.name}! Here's what's happening with your business today.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-6 lg:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-4 sm:p-6"
                    >
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center ${stat.iconColor} border ${stat.borderColor}`}
                        >
                          {stat.icon}
                        </div>
                        <div
                          className={`flex items-center gap-1 font-medium ${
                            stat.isPositive ? "text-green-300" : "text-red-300"
                          }`}
                        >
                          {stat.isPositive ? (
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                          <span className="text-xs sm:text-sm">{stat.change}</span>
                        </div>
                      </div>
                      <p className="text-white/70 text-xs sm:text-sm mb-1">
                        {stat.title}
                      </p>
                      <p className="text-white text-xl sm:text-2xl">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                  <div className="glass-card p-4 sm:p-6 rounded-xl">
                    <h3 className="text-white mb-4 text-sm sm:text-base">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 pb-4 border-b border-white/10 last:border-0 last:pb-0"
                        >
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 border border-white/30">
                            <ShoppingBag className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white">{activity.action}</p>
                            <p className="text-sm text-white/60">
                              {activity.timeAgo}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setActivePage("orders")} className="p-4 glass-content-inner hover:bg-white/20 rounded-lg text-left transition">
                        <ShoppingCart className="w-6 h-6 text-white mb-2" />
                        <p className="text-white text-sm">New Order</p>
                      </button>
                      <button onClick={() => setActivePage("inventory")} className="p-4 glass-content-inner hover:bg-white/20 rounded-lg text-left transition">
                        <Package className="w-6 h-6 text-white mb-2" />
                        <p className="text-white text-sm">Add Product</p>
                      </button>
                      <button onClick={() => setActivePage("customers")} className="p-4 glass-content-inner hover:bg-white/20 rounded-lg text-left transition">
                        <Users className="w-6 h-6 text-white mb-2" />
                        <p className="text-white text-sm">New Customer</p>
                      </button>
                      <button onClick={() => setActivePage("reports")} className="p-4 glass-content-inner hover:bg-white/20 rounded-lg text-left transition">
                        <FileText className="w-6 h-6 text-white mb-2" />
                        <p className="text-white text-sm">Generate Report</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Analytics & Operations Sections */}
                <section className="mt-6 lg:mt-8 pt-6 lg:pt-8 space-y-6 lg:space-y-8">
                  {/* Analytics Section Title */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-sm">Analytics Overview</h3>
                      <p className="text-xs text-white/60">
                        Revenue trends, regional performance, and cost structure
                      </p>
                    </div>
                  </div>

                  {/* Analytics Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-10">
                  {/* Revenue vs Expenses */}
                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                          <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white mb-1 text-sm">
                            Revenue vs Expenses
                          </h3>
                          <p className="text-xs text-white/60">
                            Last 6 closed accounting periods
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-white/60">
                        Line chart
                      </span>
                    </div>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueExpensesData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(148,163,184,0.3)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "rgba(226,232,240,0.9)", fontSize: 11 }}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                            tick={{ fill: "rgba(226,232,240,0.9)", fontSize: 11 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#020617",
                              borderRadius: 8,
                              border: "1px solid rgba(148,163,184,0.6)",
                              fontSize: 11,
                            }}
                            labelStyle={{ color: "#e5e7eb" }}
                            formatter={(value, name) => [
                              `$${(value as number).toLocaleString()}`,
                              name === "revenue" ? "Revenue" : "Expenses",
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#38bdf8"
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="expenses"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Sales by Region */}
                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                          <Truck className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white mb-1 text-sm">
                            Sales by Region
                          </h3>
                          <p className="text-xs text-white/60">
                            Current quarter performance
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-white/60">
                        Bar chart
                      </span>
                    </div>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesByRegion}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(148,163,184,0.3)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="region"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "rgba(226,232,240,0.9)", fontSize: 11 }}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                            tick={{ fill: "rgba(226,232,240,0.9)", fontSize: 11 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#020617",
                              borderRadius: 8,
                              border: "1px solid rgba(148,163,184,0.6)",
                              fontSize: 11,
                            }}
                            labelStyle={{ color: "#e5e7eb" }}
                            formatter={(value) => [
                              `$${(value as number).toLocaleString()}`,
                              "Sales",
                            ]}
                          />
                          <Bar
                            dataKey="value"
                            radius={[6, 6, 0, 0]}
                            fill="#38bdf8"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Expense Distribution */}
                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white mb-1 text-sm">
                            Expense Distribution
                          </h3>
                          <p className="text-xs text-white/60">
                            Share of total operating expenses
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-white/60">
                        Pie chart
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[0.7fr,1.3fr] gap-4 items-center">
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={expenseDistribution}
                              dataKey="value"
                              nameKey="category"
                              innerRadius={40}
                              outerRadius={60}
                              paddingAngle={3}
                            >
                              {expenseDistribution.map((slice, index) => (
                                <Cell
                                  key={slice.category}
                                  fill={
                                    ["#38bdf8", "#22c55e", "#f97316", "#a855f7", "#e5e7eb"][
                                      index
                                    ]
                                  }
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 text-xs text-white/80">
                        {expenseDistribution.map((slice) => (
                          <div
                            key={slice.category}
                            className="flex items-center justify-between"
                          >
                            <span>{slice.category}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-white/70">
                                {slice.value}%
                              </span>
                              {slice.category === "Payroll" ? (
                                <ArrowUpRight className="w-3 h-3 text-green-300" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3 text-slate-300" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Close analytics grid wrapper */}
                  </div>
                  {/* End Analytics Section */}

                  {/* Operations Section Title */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                      <LayoutGrid className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-sm">Operations & Workflow</h3>
                      <p className="text-xs text-white/60">
                        Financial activity, approvals, alerts, and user actions
                      </p>
                    </div>
                  </div>

                  {/* Operations Section */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                  {/* Recent Transactions */}
                  <div className="glass-card p-6 rounded-xl xl:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                          <LayoutGrid className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white mb-1 text-sm">
                            Recent Transactions
                          </h3>
                          <p className="text-xs text-white/60">
                            Latest financial documents across entities
                          </p>
                        </div>
                      </div>
                    </div>
                    {recentTransactions.length === 0 ? (
                      <p className="text-xs text-white/60">
                        No transactions available. New activity will appear here
                        as it is posted.
                      </p>
                    ) : (
                      <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
                        <div className="grid grid-cols-[1.4fr,1fr,1fr,0.8fr,0.7fr] px-3 py-2 border-b border-white/10 text-xs font-medium text-white/70">
                          <span>Entity</span>
                          <span>Document</span>
                          <span>Date</span>
                          <span className="text-right">Amount</span>
                          <span className="text-right">Status</span>
                        </div>
                        <div className="divide-y divide-white/10 text-xs text-white/80">
                          {recentTransactions.map((trx) => (
                            <div
                              key={trx.id}
                              className="grid grid-cols-[1.4fr,1fr,1fr,0.8fr,0.7fr] px-3 py-2 items-center"
                            >
                              <span className="truncate">{trx.entity}</span>
                              <span className="truncate text-white/80">
                                {trx.type}
                              </span>
                              <span className="text-white/70">{trx.date}</span>
                              <span className="text-right font-medium">
                                {trx.amount}
                              </span>
                              <span className="text-right">
                                {trx.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Approvals & Alerts */}
                  <div className="space-y-4">
                    {/* Pending approvals */}
                    <div className="glass-card p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                            <UserCheck className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white mb-1 text-sm">
                              Pending Approvals
                            </h3>
                            <p className="text-xs text-white/60">
                              Items requiring managerial sign-off
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-white/70">
                          {pendingApprovals.length} open
                        </span>
                      </div>
                      {pendingApprovals.length === 0 ? (
                        <p className="text-xs text-white/60">
                          You have no items pending approval.
                        </p>
                      ) : (
                        <div className="space-y-3 text-xs text-white/80">
                          {pendingApprovals.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 flex flex-col gap-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[11px] bg-white/10 px-1.5 py-0.5 rounded-full">
                                  {item.id}
                                </span>
                                <span className="text-[11px] text-white/70">
                                  Due {item.dueIn}
                                </span>
                              </div>
                              <p className="text-[11px]">{item.description}</p>
                              <p className="text-[11px] text-white/70">
                                Owner: {item.owner}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* System Alerts */}
                    <div className="glass-card p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                            <Bell className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white mb-1 text-sm">
                              System Alerts
                            </h3>
                            <p className="text-xs text-white/60">
                              Exceptions and platform notifications
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-white/70">
                          {systemAlerts.length} open
                        </span>
                      </div>
                      {systemAlerts.length === 0 ? (
                        <p className="text-xs text-white/60">
                          No active alerts. Platform is operating normally.
                        </p>
                      ) : (
                        <div className="space-y-3 text-xs text-white/80">
                          {systemAlerts.map((alert) => (
                            <div
                              key={alert.id}
                              className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                            >
                              <div className="mt-0.5">
                                {alert.severity === "critical" ? (
                                  <AlertCircle className="w-4 h-4 text-red-300" />
                                ) : alert.severity === "warning" ? (
                                  <AlertTriangle className="w-4 h-4 text-yellow-300" />
                                ) : (
                                  <Bell className="w-4 h-4 text-blue-300" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-[11px] text-white">
                                  {alert.title}
                                </p>
                                <p className="text-[11px] text-white/70">
                                  {alert.detail}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent user activity (enterprise-friendly) */}
                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white mb-1 text-sm">
                            Recent User Activity
                          </h3>
                          <p className="text-xs text-white/60">
                            Key actions performed by business users
                          </p>
                        </div>
                      </div>
                    </div>
                    {recentActivities.length === 0 ? (
                      <p className="text-xs text-white/60">
                        No user activity recorded yet.
                      </p>
                    ) : (
                      <div className="space-y-3 text-xs text-white/80">
                        {recentActivities.map((activity) => (
                          <div
                            key={activity.action}
                            className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                          >
                            <div className="mt-0.5 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center border border-white/20">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[11px] text-white">
                                {activity.action}
                              </p>
                              <p className="text-[11px] text-white/70">
                                {activity.timeAgo}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Close operations grid wrapper */}
                  </div>
                  {/* Close operations grid wrapper */}
                  {/* End Operations Section */}
                </section>
              </div>
            )}

            {activePage === "orders" && <OrdersPage />}
            {activePage === "inventory" && <InventoryPage />}
            {activePage === "customers" && <CustomersPage />}
            {activePage === "reports" && <ReportsPage />}
            {activePage === "employees" && <EmployeesPage />}
            {activePage === "invoices" && <InvoicesPage />}
            {activePage === "suppliers" && <SuppliersPage />}
            {activePage === "purchase-orders" && <PurchaseOrdersPage />}
            {activePage === "settings" && <SettingsPage />}
            {activePage === "system-settings" && (
              <RequireRole allowedRoles={['admin']}>
                <SystemSettingsPage />
              </RequireRole>
            )}
            {activePage === "analytics" && <AnalyticsPage />}
            {activePage === "audit-log" && <AuditLogPage />}
          </div>
        </main>
      </div>

      {/* Notifications Center Shell */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setNotificationsOpen(false)}
          />
          <div className="w-full max-w-md glass-card border-l border-white/15 p-4 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-white/60">Notifications Center</p>
                <h3 className="text-white font-semibold text-sm">
                  Cross‑module events
                </h3>
              </div>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="px-3 py-1.5 glass-content-inner rounded-lg text-xs text-white/80 hover:bg-white/15 transition"
              >
                Close
              </button>
            </div>
            <div className="space-y-4 text-xs text-white/80 overflow-y-auto custom-scrollbar">
              <div>
                <p className="text-[11px] text-white/60 mb-1">
                  System alerts
                </p>
                <div className="space-y-2">
                  {systemAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 flex gap-2"
                    >
                      <div className="mt-0.5">
                        {alert.severity === "critical" ? (
                          <AlertCircle className="w-3 h-3 text-red-300" />
                        ) : alert.severity === "warning" ? (
                          <AlertTriangle className="w-3 h-3 text-yellow-300" />
                        ) : (
                          <Bell className="w-3 h-3 text-blue-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-white text-[11px] font-semibold">
                          {alert.title}
                        </p>
                        <p className="text-[11px] text-white/70">
                          {alert.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-white/60 mb-1">
                  Pending approvals
                </p>
                <div className="space-y-2">
                  {pendingApprovals.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <p className="text-[11px] text-white font-semibold">
                        {item.description}
                      </p>
                      <p className="text-[11px] text-white/70">
                        Owner: {item.owner} · Due {item.dueIn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-white/50">
                This panel is a shell for cross‑module automation (stock alerts,
                payment reminders, approvals) and can be wired to real events
                later.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


