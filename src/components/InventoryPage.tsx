import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Plus,
  AlertTriangle,
  Package,
  DollarSign,
  XCircle,
  Grid3X3,
  List,
  Barcode,
  Pencil,
  Download,
  Trash2,
  X,
  ArrowLeft,
} from "lucide-react";
import { CustomSelect } from "./ui/CustomSelect";

type InventoryStatus = "in-stock" | "low-stock" | "out-of-stock";
type InventoryViewMode = "table" | "grid";
type ProductTab = "overview" | "variants" | "pricing" | "links";

type Variant = {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  price: number;
};

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  status: InventoryStatus;
  variants?: Variant[];
  suppliers?: string[];
};

const mockInventory: InventoryItem[] = [
  {
    id: "PRD-001",
    name: "Laptop HP ProBook",
    sku: "LT-HP-450",
    category: "Electronics",
    stock: 45,
    minStock: 20,
    price: 899,
    status: "in-stock",
    variants: [
      {
        id: "PRD-001-A",
        size: '13"',
        color: "Silver",
        sku: "LT-HP-450-13-SL",
        stock: 20,
        price: 899,
      },
      {
        id: "PRD-001-B",
        size: '15"',
        color: "Black",
        sku: "LT-HP-450-15-BK",
        stock: 25,
        price: 949,
      },
    ],
    suppliers: ["Tech Supplies Co."],
  },
  {
    id: "PRD-002",
    name: "Office Chair Executive",
    sku: "CH-EX-101",
    category: "Furniture",
    stock: 12,
    minStock: 15,
    price: 245,
    status: "low-stock",
    variants: [
      {
        id: "PRD-002-A",
        size: "Standard",
        color: "Black",
        sku: "CH-EX-101-BK",
        stock: 7,
        price: 245,
      },
      {
        id: "PRD-002-B",
        size: "Standard",
        color: "Brown",
        sku: "CH-EX-101-BR",
        stock: 5,
        price: 255,
      },
    ],
    suppliers: ["Office Furniture Ltd."],
  },
  {
    id: "PRD-003",
    name: "Wireless Mouse Logitech",
    sku: "MS-LG-203",
    category: "Accessories",
    stock: 156,
    minStock: 50,
    price: 29,
    status: "in-stock",
    variants: [
      {
        id: "PRD-003-A",
        size: "Standard",
        color: "Black",
        sku: "MS-LG-203-BK",
        stock: 100,
        price: 29,
      },
      {
        id: "PRD-003-B",
        size: "Standard",
        color: "White",
        sku: "MS-LG-203-WH",
        stock: 56,
        price: 29,
      },
    ],
    suppliers: ["Global Electronics"],
  },
  {
    id: "PRD-004",
    name: 'Monitor Dell 27"',
    sku: "MN-DL-270",
    category: "Electronics",
    stock: 8,
    minStock: 10,
    price: 320,
    status: "low-stock",
    variants: [],
    suppliers: ["Tech Supplies Co."],
  },
  {
    id: "PRD-005",
    name: "Desk Lamp LED",
    sku: "LM-LED-80",
    category: "Office Supplies",
    stock: 0,
    minStock: 25,
    price: 45,
    status: "out-of-stock",
    variants: [],
    suppliers: ["Office Essentials"],
  },
  {
    id: "PRD-006",
    name: "Keyboard Mechanical",
    sku: "KB-MC-500",
    category: "Accessories",
    stock: 78,
    minStock: 30,
    price: 129,
    status: "in-stock",
    variants: [],
    suppliers: ["Global Electronics"],
  },
  {
    id: "PRD-007",
    name: "Filing Cabinet Metal",
    sku: "FC-MT-400",
    category: "Furniture",
    stock: 23,
    minStock: 10,
    price: 189,
    status: "in-stock",
    variants: [],
    suppliers: ["Office Furniture Ltd."],
  },
  {
    id: "PRD-008",
    name: "Printer Canon",
    sku: "PR-CN-250",
    category: "Electronics",
    stock: 5,
    minStock: 8,
    price: 450,
    status: "low-stock",
    variants: [],
    suppliers: ["Global Electronics"],
  },
];

function getStatusColor(status: InventoryStatus): string {
  switch (status) {
    case "in-stock":
      return "bg-green-500/20 text-green-200 border-green-400/30";
    case "low-stock":
      return "bg-yellow-500/20 text-yellow-200 border-yellow-400/30";
    case "out-of-stock":
      return "bg-red-500/20 text-red-200 border-red-400/30";
    default:
      return "bg-white/15 text-white/80 border-white/20";
  }
}

export function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | InventoryStatus>(
    "all",
  );
  const [viewMode, setViewMode] = useState<InventoryViewMode>("table");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [activeProductTab, setActiveProductTab] =
    useState<ProductTab>("overview");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<"create" | "edit">(
    "create",
  );
  const [productToEdit, setProductToEdit] = useState<InventoryItem | null>(
    null,
  );
  const [createViewTarget, setCreateViewTarget] =
    useState<InventoryViewMode | null>(null);
  const [createStep, setCreateStep] = useState<"choose-view" | "form">(
    "choose-view",
  );
  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    category: "",
    stock: "",
    minStock: "",
    price: "",
    suppliers: "",
    status: "in-stock" as InventoryStatus,
  });
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [editingInventory, setEditingInventory] = useState<InventoryItem[]>(
    () => mockInventory.map((p) => ({ ...p })),
  );

  const filteredInventory = editingInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalValue = editingInventory.reduce(
    (sum, item) => sum + item.price * item.stock,
    0,
  );

  const lowStockItems = editingInventory.filter(
    (item) => item.status === "low-stock" || item.status === "out-of-stock",
  ).length;

  const outOfStockItems = editingInventory.filter(
    (item) => item.status === "out-of-stock",
  ).length;

  const selectedProduct =
    selectedProductId &&
    editingInventory.find((p) => p.id === selectedProductId);

  const formatPrice = (value: number) =>
    `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getNextProductId = () => {
    const maxId = editingInventory.reduce((max, item) => {
      const numeric = Number(item.id.replace(/[^0-9]/g, ""));
      return Number.isNaN(numeric) ? max : Math.max(max, numeric);
    }, 0);
    return `PRD-${String(maxId + 1).padStart(3, "0")}`;
  };

  const handleOpenNewProductModal = () => {
    setProductModalMode("create");
    setProductToEdit(null);
    setCreateViewTarget(null);
    setCreateStep("choose-view");
    setProductForm({
      name: "",
      sku: "",
      category: "",
      stock: "",
      minStock: "",
      price: "",
      suppliers: "",
      status: "in-stock" as InventoryStatus,
    });
    setShowFormErrors(false);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProductModal = (id: string) => {
    const product = editingInventory.find((item) => item.id === id);
    if (!product) return;
    setProductModalMode("edit");
    setProductToEdit(product);
    setCreateStep("form");
    setProductForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      stock: String(product.stock),
      minStock: String(product.minStock),
      price: String(product.price),
      suppliers: product.suppliers ? product.suppliers.join(", ") : "",
      status: product.status,
    });
    setShowFormErrors(false);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setProductToEdit(null);
    setShowFormErrors(false);
  };

  const handleProductFormChange = (
    field: keyof typeof productForm,
    value: string | InventoryStatus,
  ) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  };

  const getProductFormErrors = () => {
    const stock = Number(productForm.stock.replace(/[^0-9]/g, ""));
    const minStockRaw = Number(productForm.minStock.replace(/[^0-9]/g, ""));
    const price = Number(productForm.price.replace(/[^0-9.]/g, ""));
    const isGridCreate =
      productModalMode === "create" && createViewTarget === "grid";

    const errors: Partial<Record<keyof typeof productForm, string>> = {};

    if (!productForm.name.trim()) {
      errors.name = "Product name is required.";
    }
    if (!productForm.sku.trim()) {
      errors.sku = "SKU is required.";
    }
    if (!productForm.category.trim()) {
      errors.category = "Category is required.";
    }
    if (Number.isNaN(stock)) {
      errors.stock = "Enter a valid stock number.";
    }
    if (!isGridCreate && Number.isNaN(minStockRaw)) {
      errors.minStock = "Enter a valid minimum stock number.";
    }
    if (Number.isNaN(price)) {
      errors.price = "Enter a valid price.";
    }

    return { errors, stock, minStockRaw, price, isGridCreate };
  };

  const getInputClassName = (hasError?: boolean) =>
    [
      "mt-2 w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm focus:outline-none focus:ring-2",
      hasError ? "border border-red-400/60 focus:ring-red-400/50" : "border border-white/20 focus:ring-blue-400/50",
    ].join(" ");

  const handleSubmitProductForm = () => {
    const { errors, stock, minStockRaw, price, isGridCreate } =
      getProductFormErrors();
    const minStock = isGridCreate ? 0 : minStockRaw;
    if (Object.keys(errors).length > 0) {
      setShowFormErrors(true);
      return;
    }

    const suppliers = productForm.suppliers
      .split(",")
      .map((supplier) => supplier.trim())
      .filter(Boolean);

    if (productModalMode === "create") {
      const newProduct: InventoryItem = {
        id: getNextProductId(),
        name: productForm.name.trim(),
        sku: productForm.sku.trim(),
        category: productForm.category.trim(),
        stock,
        minStock,
        price,
        status: productForm.status,
        suppliers: suppliers.length ? suppliers : undefined,
      };
      setEditingInventory((prev) => [...prev, newProduct]);
    } else if (productToEdit) {
      setEditingInventory((prev) =>
        prev.map((item) =>
          item.id === productToEdit.id
            ? {
                ...item,
                name: productForm.name.trim(),
                sku: productForm.sku.trim(),
                category: productForm.category.trim(),
                stock,
                minStock,
                price,
                status: productForm.status,
                suppliers: suppliers.length ? suppliers : undefined,
              }
            : item,
        ),
      );
    }

    handleCloseProductModal();
  };

  const handleEditProduct = (id: string) => {
    handleOpenEditProductModal(id);
  };

  const handleDownloadProduct = (id: string) => {
    setSelectedProductId(id);
  };

  const handleDeleteProduct = (id: string) => {
    setEditingInventory((prev) => prev.filter((item) => item.id !== id));
    setSelectedProductId((prev) => (prev === id ? null : prev));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex items-center gap-3">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Products & Inventory
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                    Manage product catalog, stock levels, and reorder alerts
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
              <Package className="w-6 h-6 text-blue-300" />
            </div>
            <span className="text-sm text-blue-300 font-medium">Catalog</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Total Products</p>
          <p className="text-white text-2xl">{mockInventory.length}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-400/30">
              <DollarSign className="w-6 h-6 text-green-300" />
            </div>
            <span className="text-sm text-green-300 font-medium">Available</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Inventory Value</p>
          <p className="text-white text-2xl">
            ${totalValue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-400/30">
              <AlertTriangle className="w-6 h-6 text-yellow-300" />
            </div>
            <span className="text-sm text-yellow-300 font-medium">Reorder</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Low Stock Items</p>
          <p className="text-white text-2xl">{lowStockItems}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-400/30">
              <XCircle className="w-6 h-6 text-red-300" />
            </div>
            <span className="text-sm text-red-300 font-medium">Urgent</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Out of Stock</p>
          <p className="text-white text-2xl">{outOfStockItems}</p>
        </div>
      </div>

      {/* Inventory Table + Product Drawer */}
      <div className="flex gap-6">
        {/* Main container */}
        <div className="glass-container-outer rounded-xl flex-1 min-w-0">
          {/* Table / Grid Header Actions */}
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
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
                  onChange={(value) => setFilterStatus(value as "all" | InventoryStatus)}
                  options={[
                    { value: 'all', label: 'All Items' },
                    { value: 'in-stock', label: 'In Stock' },
                    { value: 'low-stock', label: 'Low Stock' },
                    { value: 'out-of-stock', label: 'Out of Stock' },
                  ]}
                  placeholder="All Items"
                  className="w-[200px]"
                />

                {/* View toggle */}
                <div className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-all ${
                      viewMode === "table"
                        ? "glass-content-inner text-white"
                        : "text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <List className="w-3 h-3" />
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "glass-content-inner text-white"
                        : "text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <Grid3X3 className="w-3 h-3" />
                    Grid
                  </button>
                </div>

                <button
                  onClick={handleOpenNewProductModal}
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
                  Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Table / Grid content */}
          <div className="overflow-x-auto">
            {viewMode === "table" ? (
              <table className="w-full">
                <thead className="glass-table-header">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                      Min. Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">
                      Price
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
                  {filteredInventory.map((item) => (
                    <tr
                      key={item.id}
                      className="glass-table-row hover:bg-white/5 transition cursor-pointer"
                      onClick={() => setSelectedProductId(item.id)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white">{item.name}</p>
                          <p className="text-sm text-white/60">{item.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white/80">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-white/15 text-white/90 rounded-full text-sm border border-white/20 backdrop-blur-sm">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-white text-sm ${
                            item.stock <= item.minStock ? "text-red-300" : ""
                          }`}
                        >
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white/80">
                        {item.minStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-400 font-semibold">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${getStatusColor(
                            item.status,
                          )} capitalize backdrop-blur-sm`}
                        >
                          {(item.status === "low-stock" ||
                            item.status === "out-of-stock") && (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {item.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleEditProduct(item.id);
                            }}
                            className="p-2 text-white/70 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/30 group"
                            title="Edit product"
                            style={{
                              background: "rgba(255, 255, 255, 0.05)",
                              backdropFilter: "blur(8px)",
                            }}
                            onMouseEnter={(event) => {
                              event.currentTarget.style.background =
                                "rgba(59, 130, 246, 0.2)";
                              event.currentTarget.style.borderColor =
                                "rgba(59, 130, 246, 0.3)";
                              event.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(59, 130, 246, 0.2)";
                            }}
                            onMouseLeave={(event) => {
                              event.currentTarget.style.background =
                                "rgba(255, 255, 255, 0.05)";
                              event.currentTarget.style.borderColor =
                                "transparent";
                              event.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDownloadProduct(item.id);
                            }}
                            className="p-2 text-white/70 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/30 group"
                            title="Download product"
                            style={{
                              background: "rgba(255, 255, 255, 0.05)",
                              backdropFilter: "blur(8px)",
                            }}
                            onMouseEnter={(event) => {
                              event.currentTarget.style.background =
                                "rgba(59, 130, 246, 0.2)";
                              event.currentTarget.style.borderColor =
                                "rgba(59, 130, 246, 0.3)";
                              event.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(59, 130, 246, 0.2)";
                            }}
                            onMouseLeave={(event) => {
                              event.currentTarget.style.background =
                                "rgba(255, 255, 255, 0.05)";
                              event.currentTarget.style.borderColor =
                                "transparent";
                              event.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteProduct(item.id);
                            }}
                            className="p-2 text-white/70 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-red-400/30 group"
                            title="Delete product"
                            style={{
                              background: "rgba(255, 255, 255, 0.05)",
                              backdropFilter: "blur(8px)",
                            }}
                            onMouseEnter={(event) => {
                              event.currentTarget.style.background =
                                "rgba(239, 68, 68, 0.2)";
                              event.currentTarget.style.borderColor =
                                "rgba(239, 68, 68, 0.3)";
                              event.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(239, 68, 68, 0.2)";
                            }}
                            onMouseLeave={(event) => {
                              event.currentTarget.style.background =
                                "rgba(255, 255, 255, 0.05)";
                              event.currentTarget.style.borderColor =
                                "transparent";
                              event.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredInventory.map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedProductId(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedProductId(item.id);
                      }
                    }}
                    className="glass-content-inner rounded-xl p-4 text-left hover:bg-white/20 transition flex flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-lg flex items-center justify-center border border-white/20">
                        <Package className="w-6 h-6 text-blue-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-white/60 truncate">
                          {item.sku}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-white/60">Stock</span>
                        <span className="text-white">{item.stock}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-300" />
                        <span className="text-green-400 font-semibold">
                          {formatPrice(item.price)}
                        </span>
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${getStatusColor(
                          item.status,
                        )} capitalize`}
                      >
                        {item.status.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditProduct(item.id);
                        }}
                        className="p-1.5 text-white/70 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/30 group"
                        title="Edit product"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(8px)",
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.background =
                            "rgba(59, 130, 246, 0.2)";
                          event.currentTarget.style.borderColor =
                            "rgba(59, 130, 246, 0.3)";
                          event.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(59, 130, 246, 0.2)";
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.05)";
                          event.currentTarget.style.borderColor = "transparent";
                          event.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Pencil className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDownloadProduct(item.id);
                        }}
                        className="p-1.5 text-white/70 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/30 group"
                        title="Download product"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(8px)",
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.background =
                            "rgba(59, 130, 246, 0.2)";
                          event.currentTarget.style.borderColor =
                            "rgba(59, 130, 246, 0.3)";
                          event.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(59, 130, 246, 0.2)";
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.05)";
                          event.currentTarget.style.borderColor = "transparent";
                          event.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Download className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteProduct(item.id);
                        }}
                        className="p-1.5 text-white/70 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-red-400/30 group"
                        title="Delete product"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(8px)",
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.background =
                            "rgba(239, 68, 68, 0.2)";
                          event.currentTarget.style.borderColor =
                            "rgba(239, 68, 68, 0.3)";
                          event.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(239, 68, 68, 0.2)";
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.05)";
                          event.currentTarget.style.borderColor = "transparent";
                          event.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredInventory.length === 0 && (
                  <div className="col-span-full px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Package className="w-12 h-12 text-white/30" />
                      <p className="text-white/60">No products found</p>
                      <p className="text-sm text-white/40">Try adjusting your search or filter</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-white/70">
              Showing{" "}
              <span className="text-white">
                {filteredInventory.length}
              </span>{" "}
              of{" "}
              <span className="text-white">
                {editingInventory.length}
              </span>{" "}
              products
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 glass-content-inner text-white/80 rounded-lg hover:bg-white/15 transition">
                Previous
              </button>
              <button className="px-4 py-2 glass-button text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 glass-content-inner text-white/80 rounded-lg hover:bg-white/15 transition">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Product details drawer (desktop) */}
        <div
          className={`hidden md:block transition-all duration-300 w-full lg:w-[360px] xl:w-[400px] ${
            selectedProduct
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-4 pointer-events-none"
          }`}
        >
          {selectedProduct && (
            <div className="glass-card rounded-2xl h-full flex flex-col">
              <div className="p-5 border-b border-white/10 flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-lg flex items-center justify-center border border-white/20">
                  <Package className="w-6 h-6 text-blue-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">
                    {selectedProduct.name}
                  </p>
                  <p className="text-xs text-white/70 truncate">
                    {selectedProduct.sku}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/80">
                      {selectedProduct.category}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full border ${getStatusColor(
                        selectedProduct.status,
                      )}`}
                    >
                      {selectedProduct.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-4 pt-3 border-b border-white/10">
                <div className="flex gap-2 text-xs">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "variants", label: "Variants" },
                    { id: "pricing", label: "Pricing" },
                    { id: "links", label: "Links" },
                  ].map((tab) => {
                    const isActive = activeProductTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveProductTab(tab.id as ProductTab)}
                        className={`flex-1 px-2 py-2 rounded-lg ${
                          isActive
                            ? "glass-content-inner text-white"
                            : "text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab contents */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-sm">
                {activeProductTab === "overview" && (
                  <div className="space-y-4">
                    <div className="glass-content-inner rounded-xl p-4">
                      <p className="text-xs font-medium text-white/70 mb-2">
                        Stock & Availability
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs text-white/80">
                        <div>
                          <p className="text-white/60">On Hand</p>
                          <p className="text-white text-base">
                            {selectedProduct.stock}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">Minimum Stock</p>
                          <p className="text-white text-base">
                            {selectedProduct.minStock}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">Status</p>
                          <p className="text-emerald-200 text-base capitalize">
                            {selectedProduct.status.replace("-", " ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">Suppliers</p>
                          <p className="text-white text-xs">
                            {selectedProduct.suppliers?.join(", ") || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-content-inner rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-white/70">
                          Barcode / SKU
                        </p>
                        <button className="inline-flex items-center gap-1 text-[11px] text-blue-200 hover:text-white">
                          <Barcode className="w-3 h-3" />
                          Scan
                        </button>
                      </div>
                      <p className="text-xs text-white/80">
                        {selectedProduct.sku}
                      </p>
                    </div>
                  </div>
                )}

                {activeProductTab === "variants" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-white/70">
                        Variants (sample data)
                      </p>
                      <button className="text-[11px] text-blue-200 hover:text-white">
                        Manage variants
                      </button>
                    </div>
                    {selectedProduct.variants &&
                    selectedProduct.variants.length > 0 ? (
                      <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
                        <div className="grid grid-cols-[1.2fr,1fr,1.2fr,0.8fr,0.8fr] px-3 py-2 border-b border-white/10 text-[11px] font-medium text-white/70">
                          <span>SKU</span>
                          <span>Size</span>
                          <span>Color</span>
                          <span className="text-right">Stock</span>
                          <span className="text-right">Price</span>
                        </div>
                        <div className="divide-y divide-white/10 text-[11px] text-white/80">
                          {selectedProduct.variants.map((v) => (
                            <div
                              key={v.id}
                              className="grid grid-cols-[1.2fr,1fr,1.2fr,0.8fr,0.8fr] px-3 py-2 items-center"
                            >
                              <span className="truncate">{v.sku}</span>
                              <span>{v.size}</span>
                              <span>{v.color}</span>
                              <span className="text-right">{v.stock}</span>
                              <span className="text-right">
                                {formatPrice(v.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-white/60">
                        No variants defined. Variants can be added later through
                        the product maintenance screens.
                      </p>
                    )}
                  </div>
                )}

                {activeProductTab === "pricing" && (
                  <div className="space-y-4">
                    <div className="glass-content-inner rounded-xl p-4">
                      <p className="text-xs font-medium text-white/70 mb-2">
                        Pricing Snapshot
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs text-white/80">
                        <div>
                          <p className="text-white/60">Selling Price</p>
                          <p className="text-white text-base">
                            {formatPrice(selectedProduct.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">
                            Estimated Cost (mock)
                          </p>
                          <p className="text-white text-base">
                            {formatPrice(Math.round(selectedProduct.price * 0.7))}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">
                            Gross Margin (approx.)
                          </p>
                          <p className="text-emerald-200 text-base">30%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeProductTab === "links" && (
                  <div className="space-y-4 text-xs text-white/80">
                    <div className="glass-content-inner rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-white/70">
                          Linked Suppliers
                        </p>
                        <button className="text-[11px] text-blue-200 hover:text-white">
                          View all
                        </button>
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedProduct.suppliers?.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass-content-inner rounded-xl p-4">
                      <p className="text-xs font-medium text-white/70 mb-1">
                        Related documents (mock shell)
                      </p>
                      <p className="text-[11px] text-white/60">
                        Purchase orders, sales orders, and stock movements will
                        be shown here when the back-end is connected.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 px-4 py-3 flex items-center justify-end">
                <button
                  onClick={() => setSelectedProductId(null)}
                  className="px-4 py-2 glass-content-inner text-xs text-white/80 rounded-lg hover:bg-white/15 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isProductModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
            style={{ zIndex: 2000000 }}
            onClick={handleCloseProductModal}
          >
            <div
              className="rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-fadeIn max-h-[calc(100vh-160px)] min-h-0"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow:
                  "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                zIndex: 2000001,
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {productModalMode === "create" && createStep === "form" && (
                    <button
                      onClick={() => setCreateStep("choose-view")}
                      className="h-8 w-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white transition border border-white/20 hover:border-white/30"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(8px)",
                      }}
                      title="Back"
                      aria-label="Back"
                      onMouseEnter={(event) => {
                        event.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.1)";
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.05)";
                      }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-blue-300"
                    style={{
                      background: "rgba(59, 130, 246, 0.15)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      boxShadow:
                        "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {productModalMode === "create"
                        ? "Add Product"
                        : "Edit Product"}
                    </h2>
                    <p className="text-sm text-white/60">
                      Enter all product details
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseProductModal}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {productModalMode === "create" &&
                createStep === "choose-view" ? (
                  <div className="space-y-4">
                    <p className="text-sm text-white/70">
                      Choose where to add the product
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setCreateViewTarget("table");
                        }}
                        className={`px-4 py-4 rounded-xl text-left border transition-all ${
                          createViewTarget === "table"
                            ? "glass-content-inner text-white border-white/30"
                            : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <List className="w-4 h-4" />
                          <span className="text-sm font-semibold">Table</span>
                        </div>
                        <p className="text-xs text-white/60">
                          Add product to the table view.
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          setCreateViewTarget("grid");
                        }}
                        className={`px-4 py-4 rounded-xl text-left border transition-all ${
                          createViewTarget === "grid"
                            ? "glass-content-inner text-white border-white/30"
                            : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Grid3X3 className="w-4 h-4" />
                          <span className="text-sm font-semibold">Grid</span>
                        </div>
                        <p className="text-xs text-white/60">
                          Add product to the grid view.
                        </p>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {productModalMode === "create" && (
                      <div className="mb-6 flex items-center justify-end text-xs text-white/60">
                        <span className="h-8 inline-flex items-center gap-2 px-3 rounded-lg border border-white/20 text-white/70 bg-white/5 backdrop-blur-sm">
                          Target view
                          <span className="text-white">
                            {createViewTarget === "table" ? "Table" : "Grid"}
                          </span>
                        </span>
                      </div>
                    )}
                {(() => {
                  const { errors } = getProductFormErrors();
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/70">
                      Product Name
                    </label>
                    <input
                      value={productForm.name}
                      onChange={(event) =>
                        handleProductFormChange("name", event.target.value)
                      }
                      className={getInputClassName(
                        showFormErrors && Boolean(errors.name),
                      )}
                      placeholder="Product name (customer-facing title)"
                    />
                    {showFormErrors && errors.name && (
                      <p className="mt-1 text-xs text-red-200">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-white/70">SKU</label>
                    <input
                      value={productForm.sku}
                      onChange={(event) =>
                        handleProductFormChange("sku", event.target.value)
                      }
                      className={getInputClassName(
                        showFormErrors && Boolean(errors.sku),
                      )}
                      placeholder="SKU / unique tracking code"
                    />
                    {showFormErrors && errors.sku && (
                      <p className="mt-1 text-xs text-red-200">{errors.sku}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-white/70">Category</label>
                    <input
                      value={productForm.category}
                      onChange={(event) =>
                        handleProductFormChange("category", event.target.value)
                      }
                      className={getInputClassName(
                        showFormErrors && Boolean(errors.category),
                      )}
                      placeholder="Category for filtering & reports"
                    />
                    {showFormErrors && errors.category && (
                      <p className="mt-1 text-xs text-red-200">
                        {errors.category}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-white/70">Suppliers</label>
                    <input
                      value={productForm.suppliers}
                      onChange={(event) =>
                        handleProductFormChange("suppliers", event.target.value)
                      }
                      className={getInputClassName(false)}
                      placeholder="Suppliers (comma-separated)"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/70">Stock</label>
                    <input
                      value={productForm.stock}
                      onChange={(event) =>
                        handleProductFormChange("stock", event.target.value)
                      }
                      className={getInputClassName(
                        showFormErrors && Boolean(errors.stock),
                      )}
                      placeholder="Stock on hand (current quantity)"
                    />
                    {showFormErrors && errors.stock && (
                      <p className="mt-1 text-xs text-red-200">
                        {errors.stock}
                      </p>
                    )}
                  </div>
                  {(productModalMode !== "create" ||
                    createViewTarget !== "grid") && (
                    <div>
                      <label className="text-xs text-white/70">Min Stock</label>
                      <input
                        value={productForm.minStock}
                        onChange={(event) =>
                          handleProductFormChange("minStock", event.target.value)
                        }
                        className={getInputClassName(
                          showFormErrors && Boolean(errors.minStock),
                        )}
                        placeholder="Minimum stock threshold"
                      />
                      {showFormErrors && errors.minStock && (
                        <p className="mt-1 text-xs text-red-200">
                          {errors.minStock}
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-white/70">Price</label>
                    <input
                      value={productForm.price}
                      onChange={(event) =>
                        handleProductFormChange("price", event.target.value)
                      }
                      className={getInputClassName(
                        showFormErrors && Boolean(errors.price),
                      )}
                      placeholder="Unit selling price (before tax)"
                    />
                    {showFormErrors && errors.price && (
                      <p className="mt-1 text-xs text-red-200">
                        {errors.price}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-white/70">Status</label>
                    <CustomSelect
                      value={productForm.status}
                      onChange={(value) =>
                        handleProductFormChange("status", value as InventoryStatus)
                      }
                      options={[
                        { value: "in-stock", label: "In Stock" },
                        { value: "low-stock", label: "Low Stock" },
                        { value: "out-of-stock", label: "Out of Stock" },
                      ]}
                      placeholder="Select status"
                      className="mt-2 w-full"
                    />
                  </div>
                </div>
                  );
                })()}
                  </>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 px-6 py-4 border-t border-white/10">
                <button
                  onClick={handleCloseProductModal}
                  className="px-4 py-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
                {productModalMode === "create" && createStep === "choose-view" ? (
                  <button
                    onClick={() => {
                      if (createViewTarget) {
                        setCreateStep("form");
                      }
                    }}
                    disabled={!createViewTarget}
                    className={`px-6 py-3 text-white rounded-lg text-sm font-semibold transition-all ${
                      createViewTarget
                        ? ""
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    style={
                      createViewTarget
                        ? {
                            background: "rgba(59, 130, 246, 0.2)",
                            border: "1px solid rgba(59, 130, 246, 0.35)",
                            boxShadow:
                              "0 6px 16px rgba(59, 130, 246, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
                          }
                        : {
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                          }
                    }
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitProductForm}
                    className="px-6 py-3 text-white rounded-lg text-sm font-semibold transition-all"
                    style={{
                      background: "rgba(59, 130, 246, 0.2)",
                      border: "1px solid rgba(59, 130, 246, 0.35)",
                      boxShadow:
                        "0 6px 16px rgba(59, 130, 246, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    {productModalMode === "create" ? "Create Product" : "Save"}
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}


