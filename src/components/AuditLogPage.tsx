import { useState, useEffect } from "react";
import {
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Search,
  Download,
  RefreshCw,
  Shield,
  User,
  Settings,
  Database,
  AlertTriangle,
  Info,
} from "lucide-react";
import { CustomSelect } from "./ui/CustomSelect";
import { exportToCSV } from '../utils/csvExport';
import { toast } from 'sonner';

type AuditStatus = "success" | "error" | "warning" | "info";
type AuditCategory = "security" | "user" | "system" | "data";

interface AuditEvent {
  id: number;
  action: string;
  actor: string;
  at: string;
  ip: string;
  status: AuditStatus;
  category: AuditCategory;
  details?: string;
}

const generateMockEvents = (): AuditEvent[] => {
  const actions = [
    { action: "User login successful", category: "security" as AuditCategory, status: "success" as AuditStatus },
    { action: "User role updated", category: "user" as AuditCategory, status: "success" as AuditStatus },
    { action: "Failed login attempt", category: "security" as AuditCategory, status: "error" as AuditStatus },
    { action: "Purchase order approved", category: "system" as AuditCategory, status: "success" as AuditStatus },
    { action: "Invoice created", category: "data" as AuditCategory, status: "success" as AuditStatus },
    { action: "Employee added", category: "user" as AuditCategory, status: "success" as AuditStatus },
    { action: "Password changed", category: "security" as AuditCategory, status: "success" as AuditStatus },
    { action: "API rate limit exceeded", category: "security" as AuditCategory, status: "warning" as AuditStatus },
    { action: "Database backup completed", category: "system" as AuditCategory, status: "success" as AuditStatus },
    { action: "Settings updated", category: "system" as AuditCategory, status: "info" as AuditStatus },
    { action: "Customer data exported", category: "data" as AuditCategory, status: "success" as AuditStatus },
    { action: "Unauthorized access attempt", category: "security" as AuditCategory, status: "error" as AuditStatus },
  ];

  const actors = [
    "System Administrator",
    "Ahmed Hassan",
    "Fatima Ali",
    "Mohamed Saeed",
    "API Service",
    "Background Worker",
    "Finance Controller",
    "Head of Procurement",
  ];

  const ips = [
    "192.168.1.10",
    "10.0.0.12",
    "172.16.0.5",
    "192.168.1.25",
    "203.0.113.45",
    "198.51.100.23",
  ];

  const events: AuditEvent[] = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const template = actions[Math.floor(Math.random() * actions.length)];
    const timeOffset = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Up to 7 days ago
    const eventTime = new Date(now.getTime() - timeOffset);
    
    events.push({
      id: i + 1,
      action: template.action,
      actor: actors[Math.floor(Math.random() * actors.length)],
      at: eventTime.toISOString().slice(0, 16).replace('T', ' '),
      ip: ips[Math.floor(Math.random() * ips.length)],
      status: template.status,
      category: template.category,
      details: `Additional context for event ${i + 1}`,
    });
  }

  return events.sort((a, b) => b.id - a.id);
};

const MOCK_AUDIT_EVENTS = generateMockEvents();

export function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<AuditStatus | "all">("all");
  const [filterCategory, setFilterCategory] = useState<AuditCategory | "all">("all");
  const [events, setEvents] = useState<AuditEvent[]>(MOCK_AUDIT_EVENTS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 15;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(() => {
        const newEvent: AuditEvent = {
          id: events.length + 1,
          action: "Real-time simulated event",
          actor: "System",
          at: new Date().toISOString().slice(0, 16).replace('T', ' '),
          ip: "127.0.0.1",
          status: Math.random() > 0.3 ? "success" : "warning",
          category: "system",
          details: "Auto-generated event from simulation",
        };
        setEvents(prev => [newEvent, ...prev]);
        toast.info('New audit event logged');
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, events.length]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.ip.includes(searchQuery);
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    const matchesCategory = filterCategory === "all" || event.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

  const handleExportCSV = () => {
    const headers = ['ID', 'Action', 'Actor', 'Time', 'IP', 'Status', 'Category', 'Details'];
    const rows = filteredEvents.map(event => [
      String(event.id),
      event.action,
      event.actor,
      event.at,
      event.ip,
      event.status,
      event.category,
      event.details || '',
    ]);
    exportToCSV('audit_log_export', headers, rows);
    toast.success('Audit log exported to CSV');
  };

  const getCategoryIcon = (category: AuditCategory) => {
    switch (category) {
      case 'security': return <Shield className="w-4 h-4" />;
      case 'user': return <User className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'data': return <Database className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: AuditStatus) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'error': return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'info': return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
    }
  };

  const getStatusIcon = (status: AuditStatus) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-3 h-3" />;
      case 'error': return <AlertCircle className="w-3 h-3" />;
      case 'warning': return <AlertTriangle className="w-3 h-3" />;
      case 'info': return <Info className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Audit Log
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                Real-time monitoring of system events and security changes
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              isSimulating 
                ? 'bg-green-500/20 border-green-400/30 text-green-300' 
                : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Simulating...' : 'Start Simulation'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-400/30">
              <ClipboardList className="w-6 h-6 text-blue-300" />
            </div>
            <span className="text-sm text-blue-300 font-medium">Total</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Total Events</p>
          <p className="text-white text-2xl">{events.length}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-400/30">
              <CheckCircle2 className="w-6 h-6 text-green-300" />
            </div>
            <span className="text-sm text-green-300 font-medium">Success</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Successful Events</p>
          <p className="text-white text-2xl">{events.filter(e => e.status === 'success').length}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-400/30">
              <AlertCircle className="w-6 h-6 text-red-300" />
            </div>
            <span className="text-sm text-red-300 font-medium">Errors</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Error Events</p>
          <p className="text-white text-2xl">{events.filter(e => e.status === 'error').length}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-400/30">
              <AlertTriangle className="w-6 h-6 text-yellow-300" />
            </div>
            <span className="text-sm text-yellow-300 font-medium">Warnings</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Warning Events</p>
          <p className="text-white text-2xl">{events.filter(e => e.status === 'warning').length}</p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-container-outer rounded-xl">
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search events, actors, IPs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <CustomSelect
                value={filterStatus}
                onChange={(value) => setFilterStatus(value as AuditStatus | "all")}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'success', label: 'Success' },
                  { value: 'error', label: 'Error' },
                  { value: 'warning', label: 'Warning' },
                  { value: 'info', label: 'Info' },
                ]}
                placeholder="All Status"
                className="w-[140px]"
              />

              <CustomSelect
                value={filterCategory}
                onChange={(value) => setFilterCategory(value as AuditCategory | "all")}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'security', label: 'Security' },
                  { value: 'user', label: 'User' },
                  { value: 'system', label: 'System' },
                  { value: 'data', label: 'Data' },
                ]}
                placeholder="All Categories"
                className="w-[140px]"
              />

              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-white text-sm font-medium transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-table-header">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                  Actor
                </th>
                <th className="px-4 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-4 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {paginatedEvents.map((event) => (
                <tr key={event.id} className="glass-table-row">
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-white/80">
                    {event.at}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {event.action}
                  </td>
                  <td className="px-4 py-3 text-xs text-white/80">
                    {event.actor}
                  </td>
                  <td className="px-4 py-3 text-xs text-white/80 font-mono">
                    {event.ip}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border bg-white/10 text-white/80 border-white/20`}>
                      {getCategoryIcon(event.category)}
                      <span className="capitalize">{event.category}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] border ${getStatusColor(event.status)}`}
                    >
                      {getStatusIcon(event.status)}
                      <span className="capitalize">{event.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-white/60 max-w-xs truncate">
                    {event.details || '-'}
                  </td>
                </tr>
              ))}
              {paginatedEvents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-white/60">
                    No audit events found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-sm text-white/70">
            Showing <span className="text-white">{startIndex + 1}</span>-<span className="text-white">{Math.min(endIndex, filteredEvents.length)}</span> of <span className="text-white">{filteredEvents.length}</span> events
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 glass-content-inner text-white/80 rounded-lg hover:bg-white/15 transition disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === pageNum
                    ? 'glass-button text-white'
                    : 'glass-content-inner text-white/80 hover:bg-white/15'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 glass-content-inner text-white/80 rounded-lg hover:bg-white/15 transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


