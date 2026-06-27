import { useState, useCallback } from "react";
import {
  Search,
  Plus,
  Download,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingCart,
  List,
  KanbanSquare,
  DollarSign,
} from "lucide-react";
import { CustomSelect } from "./ui/CustomSelect";

type OrderStatus = "completed" | "processing" | "pending" | "cancelled";
type OrderViewMode = "list" | "kanban";

type Order = {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: OrderStatus;
  date: string;
};

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Ahmed Hassan",
    items: 5,
    total: "$1,250",
    status: "completed",
    date: "2024-12-01",
  },
  {
    id: "ORD-002",
    customer: "Fatima Ali",
    items: 3,
    total: "$890",
    status: "pending",
    date: "2024-12-02",
  },
  {
    id: "ORD-003",
    customer: "Mohamed Saeed",
    items: 8,
    total: "$2,100",
    status: "processing",
    date: "2024-12-02",
  },
  {
    id: "ORD-004",
    customer: "Sara Ibrahim",
    items: 2,
    total: "$450",
    status: "completed",
    date: "2024-12-01",
  },
  {
    id: "ORD-005",
    customer: "Omar Khalil",
    items: 6,
    total: "$1,670",
    status: "pending",
    date: "2024-12-02",
  },
  {
    id: "ORD-006",
    customer: "Layla Ahmed",
    items: 4,
    total: "$980",
    status: "cancelled",
    date: "2024-11-30",
  },
  {
    id: "ORD-007",
    customer: "Khaled Yousef",
    items: 7,
    total: "$1,890",
    status: "processing",
    date: "2024-12-01",
  },
  {
    id: "ORD-008",
    customer: "Nour Hassan",
    items: 3,
    total: "$720",
    status: "completed",
    date: "2024-11-29",
  },
];

function useToasts() {
  const [toasts, setToasts] = useState<
    { id: string; type: "success" | "error" | "info"; text: string }[]
  >([]);

  const push = useCallback(
    (t: { type: "success" | "error" | "info"; text: string }) => {
      const id = String(Date.now()) + Math.random();
      setToasts((s) => [...s, { id, ...t }]);
      setTimeout(
        () => setToasts((s) => s.filter((x) => x.id !== id)),
        3000,
      );
    },
    [],
  );

  return { toasts, push };
}

function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case "completed":
      return "bg-green-500/20 text-green-300 border-green-400/30";
    case "processing":
      return "bg-blue-500/20 text-blue-300 border-blue-400/30";
    case "pending":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
    case "cancelled":
      return "bg-red-500/20 text-red-300 border-red-400/30";
    default:
      return "bg-white/15 text-white/80 border-white/20";
  }
}

function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4" />;
    case "processing":
      return <Clock className="w-4 h-4" />;
    case "pending":
      return <Package className="w-4 h-4" />;
    case "cancelled":
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
}

export function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] =
    useState<"all" | OrderStatus>("all");
  const [viewMode, setViewMode] = useState<OrderViewMode>("list");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    null,
  );
  const { toasts, push: pushToast } = useToasts();

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalOrders = 1247;
  const completedOrders = 892;
  const pendingOrders = 234;
  const cancelledOrders = 121;
  const completionRate = ((completedOrders / totalOrders) * 100).toFixed(1);

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleDownloadOrder = (orderId: string) => {
    pushToast({
      type: "info",
      text: `Downloading invoice for order ${orderId} (mock).`,
    });
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-8">
        <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Sales Orders
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                    Track and process customer orders and shipments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-400/30">
              <ShoppingCart className="w-6 h-6 text-blue-300" />
            </div>
            <span className="text-sm text-blue-300 font-medium">
              All Time
            </span>
          </div>
          <p className="text-white/70 text-sm mb-1">Total Orders</p>
          <p className="text-white text-2xl">
            {totalOrders.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-400/30">
              <CheckCircle className="w-6 h-6 text-green-300" />
            </div>
            <span className="text-sm text-green-300 font-medium">
              +{completionRate}%
            </span>
          </div>
          <p className="text-white/70 text-sm mb-1">Completed Orders</p>
          <p className="text-white text-2xl">
            {completedOrders.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-400/30">
              <Clock className="w-6 h-6 text-yellow-300" />
            </div>
            <span className="text-sm text-yellow-300 font-medium">
              Awaiting
            </span>
          </div>
          <p className="text-white/70 text-sm mb-1">Pending Orders</p>
          <p className="text-white text-2xl">
            {pendingOrders.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-400/30">
              <XCircle className="w-6 h-6 text-red-300" />
            </div>
            <span className="text-sm text-red-300 font-medium">
              Refunded
            </span>
          </div>
          <p className="text-white/70 text-sm mb-1">Cancelled Orders</p>
          <p className="text-white text-2xl">
            {cancelledOrders.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Orders Table / Kanban */}
      <div className="flex gap-6">
        <div className="glass-container-outer rounded-xl flex-1 min-w-0">
          {/* Header actions */}
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search orders or customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 glass-input text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
              </div>

              <div
                className="flex gap-3 items-center p-4 rounded-xl"
                style={{
                  background: "rgba(59, 130, 246, 0.08)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  boxShadow:
                    "0 2px 8px 0 rgba(59, 130, 246, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
                }}
              >
                <CustomSelect
                  value={filterStatus}
                  onChange={(value) => setFilterStatus(value as "all" | OrderStatus)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'processing', label: 'Processing' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                  placeholder="All Status"
                  className="w-[200px]"
                />

                {/* View toggle */}
                <div
                  className="hidden md:flex items-center gap-0.5 p-1 rounded-xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow:
                      "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                      viewMode === "list"
                        ? "text-white shadow-sm"
                        : "text-white/60 hover:text-white/80"
                    }`}
                    style={
                      viewMode === "list"
                        ? {
                            background:
                              "rgba(59, 130, 246, 0.25)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            boxShadow:
                              "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                          }
                        : {
                            background: "transparent",
                          }
                    }
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>List</span>
                  </button>
                  <button
                    onClick={() => setViewMode("kanban")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                      viewMode === "kanban"
                        ? "text-white shadow-sm"
                        : "text-white/60 hover:text-white/80"
                    }`}
                    style={
                      viewMode === "kanban"
                        ? {
                            background:
                              "rgba(59, 130, 246, 0.25)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            boxShadow:
                              "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                          }
                        : {
                            background: "transparent",
                          }
                    }
                  >
                    <KanbanSquare className="w-3.5 h-3.5" />
                    <span>Kanban</span>
                  </button>
                </div>

                <button
                  className="w-[200px] px-6 py-2.5 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all h-auto min-h-[42px]"
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    boxShadow:
                      "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  New Order
                </button>
              </div>
            </div>
          </div>

          {/* Table / Kanban */}
          <div className="overflow-x-auto">
            {viewMode === "list" ? (
              <table className="w-full">
                <thead className="glass-table-header">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="glass-table-row hover:bg-white/5 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-blue-300 font-medium">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm border border-white/20">
                            {order.customer.charAt(0)}
                          </div>
                          <span className="text-white">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white/80">
                        {order.items} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-400 font-semibold">
                        {order.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white/70">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${getStatusColor(
                            order.status,
                          )} capitalize backdrop-blur-sm font-medium`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewOrder(order.id)}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadOrder(order.id)}
                            className="p-2 text-green-400 hover:bg-white/10 rounded-lg transition"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-white/60"
                      >
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => handleViewOrder(order.id)}
                    className="glass-content-inner rounded-xl p-4 text-left hover:bg-white/20 transition flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-lg flex items-center justify-center border border-white/20">
                        <ShoppingCart className="w-6 h-6 text-blue-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">
                          {order.id}
                        </p>
                        <p className="text-[11px] text-white/60 truncate">
                          {order.customer}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                        {order.items} items
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-white/60">Date</span>
                        <span className="text-white">{order.date}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-300" />
                        <span className="text-white">{order.total}</span>
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${getStatusColor(
                          order.status,
                        )} capitalize`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                  </button>
                ))}
                {filteredOrders.length === 0 && (
                  <div className="col-span-full text-center py-8 text-white/60">
                    No orders found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/70">
              Showing{" "}
              <span className="text-white font-medium">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="text-white font-medium">
                {mockOrders.length}
              </span>{" "}
              orders
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 glass-content-inner text-white/80 rounded-lg hover:bg-white/15 transition">
                Previous
              </button>
              <button className="px-4 py-2 glass-button text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 glass-content-inner text-white/80 rounded-lg hover:bg-white/15 transition">
                2
              </button>
              <button className="px-4 py-2 glass-content-inner text-white/80 rounded-lg hover:bg-white/15 transition">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Order detail drawer (desktop shell) */}
        {selectedOrderId && (
          <div className="hidden md:block fixed right-4 top-28 bottom-4 w-[360px] xl:w-[400px] z-40">
            <div className="glass-card rounded-2xl h-full flex flex-col">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60 mb-1">Order</p>
                  <p className="text-white font-semibold">{selectedOrderId}</p>
                </div>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="px-3 py-1.5 glass-content-inner text-xs text-white/80 rounded-lg hover:bg-white/15 transition"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 p-4 text-xs text-white/80 space-y-3">
                <p className="text-white/60">
                  This panel will show detailed order information (customer,
                  lines, fulfillment, and linked invoices) when the back-end is
                  connected.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toasts (simple inline implementation) */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="px-4 py-2 rounded-lg bg-slate-900/80 border border-white/20 text-xs text-white shadow-lg"
            >
              {t.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


