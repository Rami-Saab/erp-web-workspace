import { ClipboardList, AlertCircle, CheckCircle2 } from "lucide-react";

type AuditStatus = "success" | "error";

interface AuditEvent {
  id: number;
  action: string;
  actor: string;
  at: string;
  ip: string;
  status: AuditStatus;
}

const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 1,
    action: "User role updated – Sales Manager → Sales Director",
    actor: "System Administrator",
    at: "2025-01-10 09:30",
    ip: "192.168.1.10",
    status: "success",
  },
  {
    id: 2,
    action: "Purchase Order PO-2024-014 approved",
    actor: "Head of Procurement",
    at: "2025-01-09 15:22",
    ip: "10.0.0.12",
    status: "success",
  },
  {
    id: 3,
    action: "Failed login attempt – wrong password",
    actor: "Unknown",
    at: "2025-01-09 07:11",
    ip: "172.16.0.5",
    status: "error",
  },
  {
    id: 4,
    action: "Invoice INV-2024-031 written off",
    actor: "Finance Controller",
    at: "2025-01-08 18:05",
    ip: "192.168.1.25",
    status: "success",
  },
];

export function AuditLogPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Audit Log
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                Read-only history of important configuration and security changes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-container-outer rounded-xl">
        <div className="p-4 sm:p-6 border-b border-white/10">
          <p className="text-sm text-white/70">
            This is a **shell** view for cross-module auditing. When a backend is
            connected, events from Orders, Inventory, Finance, and Settings can be
            written into this stream.
          </p>
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {MOCK_AUDIT_EVENTS.map((event) => (
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
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] border ${
                        event.status === "success"
                          ? "bg-green-500/20 text-green-300 border-green-400/30"
                          : "bg-red-500/20 text-red-300 border-red-400/30"
                      }`}
                    >
                      {event.status === "success" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {event.status === "success" ? "Success" : "Error"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


