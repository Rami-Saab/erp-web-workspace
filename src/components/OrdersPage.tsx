import { useState } from "react";
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
  X,
  Trash2,
  Pencil,
} from "lucide-react";
import { CustomSelect } from "./ui/CustomSelect";
import { exportTableToPDF } from '../utils/pdfExport';
import { toast } from 'sonner';

type OrderStatus = "completed" | "processing" | "pending" | "cancelled";
type OrderViewMode = "list" | "kanban";

type Order = {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: OrderStatus;
  date: string;
  lineItems?: { name: string; qty: number; price: string }[];
};

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Ahmed Hassan",
    items: 5,
    total: "$1,250",
    status: "completed",
    date: "2024-12-01",
    lineItems: [
      { name: "Product A", qty: 2, price: "$250" },
      { name: "Product B", qty: 3, price: "$250" },
    ],
  },
  {
    id: "ORD-002",
    customer: "Fatima Ali",
    items: 3,
    total: "$890",
    status: "pending",
    date: "2024-12-02",
    lineItems: [
      { name: "Product C", qty: 1, price: "$400" },
      { name: "Product D", qty: 2, price: "$245" },
    ],
  },
  {
    id: "ORD-003",
    customer: "Mohamed Saeed",
    items: 8,
    total: "$2,100",
    status: "processing",
    date: "2024-12-02",
    lineItems: [
      { name: "Product E", qty: 4, price: "$300" },
      { name: "Product F", qty: 4, price: "$225" },
    ],
  },
  {
    id: "ORD-004",
    customer: "Sara Ibrahim",
    items: 2,
    total: "$450",
    status: "completed",
    date: "2024-12-01",
    lineItems: [
      { name: "Product G", qty: 2, price: "$225" },
    ],
  },
  {
    id: "ORD-005",
    customer: "Omar Khalil",
    items: 6,
    total: "$1,670",
    status: "pending",
    date: "2024-12-02",
    lineItems: [
      { name: "Product H", qty: 3, price: "$350" },
      { name: "Product I", qty: 3, price: "$207" },
    ],
  },
  {
    id: "ORD-006",
    customer: "Layla Ahmed",
    items: 4,
    total: "$980",
    status: "cancelled",
    date: "2024-11-30",
    lineItems: [
      { name: "Product J", qty: 4, price: "$245" },
    ],
  },
  {
    id: "ORD-007",
    customer: "Khaled Yousef",
    items: 7,
    total: "$1,890",
    status: "processing",
    date: "2024-12-01",
    lineItems: [
      { name: "Product K", qty: 4, price: "$300" },
      { name: "Product L", qty: 3, price: "$230" },
    ],
  },
  {
    id: "ORD-008",
    customer: "Nour Hassan",
    items: 3,
    total: "$720",
    status: "completed",
    date: "2024-11-29",
    lineItems: [
      { name: "Product M", qty: 3, price: "$240" },
    ],
  },
];


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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [newOrderLineItems, setNewOrderLineItems] = useState<{ name: string; qty: number; price: string }[]>([{ name: '', qty: 1, price: '' }]);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [editOrderLineItems, setEditOrderLineItems] = useState<{ name: string; qty: number; price: string }[]>([]);
  const [editOrderData, setEditOrderData] = useState<{ customer: string; date: string; status: OrderStatus }>({ customer: '', date: '', status: 'pending' });
  const [newOrderData, setNewOrderData] = useState<{ customer: string; date: string }>({ customer: '', date: '' });

  const filteredOrders = orders.filter((order) => {
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

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const handlePrintInvoice = (order: Order) => {
    const headers = ['Item', 'Quantity', 'Price', 'Total'];
    const rows = (order.lineItems || []).map(item => [
      item.name,
      String(item.qty),
      item.price,
      `$${(parseFloat(item.price.replace('$', '')) * item.qty).toFixed(2)}`
    ]);
    exportTableToPDF(`Invoice ${order.id}`, headers, rows, `Invoice_${order.id}.pdf`);
    toast.success(`Invoice ${order.id} downloaded`);
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedOrders.size === 0) {
      toast.error('No orders selected');
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSelectedOrders(new Set());
      toast.success(`${action} completed for ${selectedOrders.size} orders`);
    }, 800);
  };

  const handleAddLineItem = () => {
    setNewOrderLineItems([...newOrderLineItems, { name: '', qty: 1, price: '' }]);
  };

  const handleRemoveLineItem = (index: number) => {
    setNewOrderLineItems(newOrderLineItems.filter((_, i) => i !== index));
  };

  const handleLineItemChange = (index: number, field: 'name' | 'qty' | 'price', value: string | number) => {
    const updated = [...newOrderLineItems];
    updated[index] = { ...updated[index], [field]: value };
    setNewOrderLineItems(updated);
  };

  const calculateTotal = () => {
    return newOrderLineItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', '')) || 0;
      return sum + (price * item.qty);
    }, 0);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customer: newOrderData.customer,
      items: newOrderLineItems.reduce((sum, item) => sum + item.qty, 0),
      total: `$${calculateTotal().toFixed(2)}`,
      status: 'pending',
      date: newOrderData.date,
      lineItems: newOrderLineItems.map(item => ({ name: item.name, qty: item.qty, price: item.price })),
    };
    setTimeout(() => {
      setOrders([...orders, newOrder]);
      setProcessing(false);
      setCreateModalOpen(false);
      setNewOrderLineItems([{ name: '', qty: 1, price: '' }]);
      setNewOrderData({ customer: '', date: '' });
      toast.success('Order created successfully');
    }, 800);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditOrderData({
      customer: order.customer,
      date: order.date,
      status: order.status,
    });
    setEditOrderLineItems(order.lineItems || [{ name: '', qty: 1, price: '' }]);
    setEditModalOpen(true);
  };

  const handleUpdateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setProcessing(true);
    const updatedOrder: Order = {
      ...selectedOrder,
      customer: editOrderData.customer,
      date: editOrderData.date,
      status: editOrderData.status,
      items: editOrderLineItems.reduce((sum, item) => sum + item.qty, 0),
      total: `$${editOrderLineItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', '')) || 0;
        return sum + (price * item.qty);
      }, 0).toFixed(2)}`,
      lineItems: editOrderLineItems,
    };
    setTimeout(() => {
      setOrders(orders.map(o => o.id === selectedOrder.id ? updatedOrder : o));
      setProcessing(false);
      setEditModalOpen(false);
      setSelectedOrder(null);
      toast.success('Order updated successfully');
    }, 800);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      setProcessing(true);
      setTimeout(() => {
        setOrders(orders.filter(o => o.id !== orderId));
        setProcessing(false);
        toast.success('Order deleted successfully');
      }, 500);
    }
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

                {/* Bulk Actions */}
                {selectedOrders.size > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction('Mark as Completed')}
                      className="px-3 py-2 text-xs bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-white transition"
                    >
                      Complete ({selectedOrders.size})
                    </button>
                    <button
                      onClick={() => handleBulkAction('Cancel Orders')}
                      className="px-3 py-2 text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-white transition"
                    >
                      Cancel ({selectedOrders.size})
                    </button>
                  </div>
                )}

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
                  onClick={() => setCreateModalOpen(true)}
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
                    <th className="px-4 py-3 text-left text-xs text-white/70 uppercase tracking-wider w-10">
                      <input
                        type="checkbox"
                        checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
                          } else {
                            setSelectedOrders(new Set());
                          }
                        }}
                        className="w-4 h-4 rounded border-white/30 bg-white/10"
                      />
                    </th>
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
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.has(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="w-4 h-4 rounded border-white/30 bg-white/10"
                        />
                      </td>
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
                            onClick={() => handleViewOrder(order)}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="p-2 text-blue-400 hover:bg-white/10 rounded-lg transition"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePrintInvoice(order)}
                            className="p-2 text-green-400 hover:bg-white/10 rounded-lg transition"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 text-red-400 hover:bg-white/10 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-8 text-center text-white/60"
                      >
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                  <div key={status} className="glass-content-inner rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                      {getStatusIcon(status as OrderStatus)}
                      <h4 className="text-white font-medium capitalize">{status}</h4>
                      <span className="ml-auto text-white/60 text-sm">
                        {filteredOrders.filter(o => o.status === status).length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {filteredOrders
                        .filter(order => order.status === status)
                        .map((order) => (
                          <button
                            key={order.id}
                            onClick={() => handleViewOrder(order)}
                            className="w-full text-left glass-content-inner rounded-lg p-3 hover:bg-white/20 transition"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded flex items-center justify-center border border-white/20">
                                <ShoppingCart className="w-4 h-4 text-blue-300" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs text-white truncate">{order.id}</p>
                                <p className="text-[10px] text-white/60 truncate">{order.customer}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-green-300 font-medium">{order.total}</span>
                              <span className="text-white/60">{order.date}</span>
                            </div>
                          </button>
                        ))}
                      {filteredOrders.filter(o => o.status === status).length === 0 && (
                        <p className="text-center text-white/40 text-xs py-4">No orders</p>
                      )}
                    </div>
                  </div>
                ))}
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

      {/* Create Order Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)} />
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-semibold">Create New Order</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-sm mb-1 block">Customer Name</label>
                  <input 
                    type="text" 
                    required 
                    value={newOrderData.customer}
                    onChange={(e) => setNewOrderData({...newOrderData, customer: e.target.value})}
                    className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg" 
                    placeholder="Enter customer name" 
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm mb-1 block">Order Date</label>
                  <input 
                    type="date" 
                    required 
                    value={newOrderData.date}
                    onChange={(e) => setNewOrderData({...newOrderData, date: e.target.value})}
                    className="w-full px-4 py-2 glass-input text-white rounded-lg" 
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/70 text-sm">Line Items</label>
                  <button type="button" onClick={handleAddLineItem} className="text-blue-300 text-sm hover:text-blue-200">+ Add Item</button>
                </div>
                {newOrderLineItems.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleLineItemChange(index, 'name', e.target.value)}
                      placeholder="Product name"
                      required
                      className="flex-1 px-3 py-2 glass-input text-white placeholder-white/60 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleLineItemChange(index, 'qty', parseInt(e.target.value) || 1)}
                      min="1"
                      required
                      className="w-20 px-3 py-2 glass-input text-white rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => handleLineItemChange(index, 'price', e.target.value)}
                      placeholder="$0"
                      required
                      className="w-24 px-3 py-2 glass-input text-white placeholder-white/60 rounded-lg text-sm"
                    />
                    {newOrderLineItems.length > 1 && (
                      <button type="button" onClick={() => handleRemoveLineItem(index)} className="p-2 text-red-300 hover:text-red-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/70 text-sm">Total</span>
                <span className="text-white text-lg font-semibold">${calculateTotal().toFixed(2)}</span>
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-white font-semibold transition disabled:opacity-50"
              >
                {processing ? 'Creating...' : 'Create Order'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {detailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailModalOpen(false)} />
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-semibold">Order Details</h3>
              <button onClick={() => setDetailModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white/60 text-sm">Order ID</span>
                <span className="text-white font-medium">{selectedOrder.id}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white/60 text-sm">Customer</span>
                <span className="text-white font-medium">{selectedOrder.customer}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white/60 text-sm">Date</span>
                <span className="text-white font-medium">{selectedOrder.date}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white/60 text-sm">Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${getStatusColor(selectedOrder.status)} capitalize`}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white/60 text-sm">Total</span>
                <span className="text-green-400 font-semibold text-lg">{selectedOrder.total}</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-white text-sm font-semibold mb-3">Line Items</h4>
                <div className="space-y-2">
                  {(selectedOrder.lineItems || []).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm p-2 bg-white/5 rounded-lg">
                      <span className="text-white">{item.name} x{item.qty}</span>
                      <span className="text-white/80">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => handlePrintInvoice(selectedOrder)}
                  className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-white font-medium transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Invoice
                </button>
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditModalOpen(false)} />
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-semibold">Edit Order {selectedOrder.id}</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-sm mb-1 block">Customer Name</label>
                  <input 
                    type="text" 
                    required 
                    value={editOrderData.customer}
                    onChange={(e) => setEditOrderData({...editOrderData, customer: e.target.value})}
                    className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg" 
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm mb-1 block">Order Date</label>
                  <input 
                    type="date" 
                    required 
                    value={editOrderData.date}
                    onChange={(e) => setEditOrderData({...editOrderData, date: e.target.value})}
                    className="w-full px-4 py-2 glass-input text-white rounded-lg" 
                  />
                </div>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Status</label>
                <CustomSelect
                  value={editOrderData.status}
                  onChange={(value) => setEditOrderData({...editOrderData, status: value as OrderStatus})}
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'processing', label: 'Processing' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                  placeholder="Select status"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/70 text-sm">Line Items</label>
                  <button type="button" onClick={() => setEditOrderLineItems([...editOrderLineItems, { name: '', qty: 1, price: '' }])} className="text-blue-300 text-sm hover:text-blue-200">+ Add Item</button>
                </div>
                {editOrderLineItems.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const updated = [...editOrderLineItems];
                        updated[index] = { ...updated[index], name: e.target.value };
                        setEditOrderLineItems(updated);
                      }}
                      placeholder="Product name"
                      required
                      className="flex-1 px-3 py-2 glass-input text-white placeholder-white/60 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => {
                        const updated = [...editOrderLineItems];
                        updated[index] = { ...updated[index], qty: parseInt(e.target.value) || 1 };
                        setEditOrderLineItems(updated);
                      }}
                      min="1"
                      required
                      className="w-20 px-3 py-2 glass-input text-white rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => {
                        const updated = [...editOrderLineItems];
                        updated[index] = { ...updated[index], price: e.target.value };
                        setEditOrderLineItems(updated);
                      }}
                      placeholder="$0"
                      required
                      className="w-24 px-3 py-2 glass-input text-white placeholder-white/60 rounded-lg text-sm"
                    />
                    {editOrderLineItems.length > 1 && (
                      <button type="button" onClick={() => setEditOrderLineItems(editOrderLineItems.filter((_, i) => i !== index))} className="p-2 text-red-300 hover:text-red-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/70 text-sm">Total</span>
                <span className="text-white text-lg font-semibold">${editOrderLineItems.reduce((sum, item) => {
                  const price = parseFloat(item.price.replace('$', '')) || 0;
                  return sum + (price * item.qty);
                }, 0).toFixed(2)}</span>
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-white font-semibold transition disabled:opacity-50"
              >
                {processing ? 'Updating...' : 'Update Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


