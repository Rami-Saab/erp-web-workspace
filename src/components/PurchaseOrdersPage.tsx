import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, ShoppingBag, ShoppingCart, Clock, CheckCircle, XCircle, Pencil, Download, CheckCircle2, Zap, Trash2, FileText, FileSpreadsheet, X, DollarSign } from 'lucide-react';
import { CustomSelect } from './ui/CustomSelect';
import { DatePicker } from './ui/DatePicker';

// 30 base purchase orders used to generate 100 rows for pagination
const basePurchaseOrders = [
  { id: 'PO-2024-001', supplier: 'Tech Supplies Co.', items: 15, amount: '$12,500', orderDate: '2024-11-20', expectedDate: '2024-12-10', status: 'approved' },
  { id: 'PO-2024-002', supplier: 'Office Furniture Ltd.', items: 8, amount: '$8,900', orderDate: '2024-11-22', expectedDate: '2024-12-15', status: 'pending' },
  { id: 'PO-2024-003', supplier: 'Global Electronics', items: 25, amount: '$21,000', orderDate: '2024-11-18', expectedDate: '2024-12-05', status: 'received' },
  { id: 'PO-2024-004', supplier: 'Office Essentials', items: 12, amount: '$4,500', orderDate: '2024-11-25', expectedDate: '2024-12-20', status: 'approved' },
  { id: 'PO-2024-005', supplier: 'Premium Stationery', items: 30, amount: '$6,700', orderDate: '2024-11-15', expectedDate: '2024-12-01', status: 'received' },
  { id: 'PO-2024-006', supplier: 'Tech Supplies Co.', items: 10, amount: '$9,800', orderDate: '2024-11-28', expectedDate: '2024-12-18', status: 'cancelled' },
  { id: 'PO-2024-007', supplier: 'Smart Components Inc.', items: 18, amount: '$14,200', orderDate: '2024-11-26', expectedDate: '2024-12-12', status: 'approved' },
  { id: 'PO-2024-008', supplier: 'Creative Workspace', items: 6, amount: '$3,900', orderDate: '2024-11-19', expectedDate: '2024-12-08', status: 'pending' },
  { id: 'PO-2024-009', supplier: 'Global Electronics', items: 22, amount: '$18,750', orderDate: '2024-11-17', expectedDate: '2024-12-06', status: 'received' },
  { id: 'PO-2024-010', supplier: 'Office Essentials', items: 9, amount: '$5,200', orderDate: '2024-11-21', expectedDate: '2024-12-14', status: 'approved' },
  { id: 'PO-2024-011', supplier: 'Premium Stationery', items: 28, amount: '$7,450', orderDate: '2024-11-23', expectedDate: '2024-12-16', status: 'received' },
  { id: 'PO-2024-012', supplier: 'Tech Supplies Co.', items: 11, amount: '$10,300', orderDate: '2024-11-29', expectedDate: '2024-12-19', status: 'pending' },
  { id: 'PO-2024-013', supplier: 'Creative Workspace', items: 7, amount: '$4,250', orderDate: '2024-11-24', expectedDate: '2024-12-11', status: 'approved' },
  { id: 'PO-2024-014', supplier: 'Office Furniture Ltd.', items: 10, amount: '$9,100', orderDate: '2024-11-27', expectedDate: '2024-12-17', status: 'received' },
  { id: 'PO-2024-015', supplier: 'Global Electronics', items: 20, amount: '$19,600', orderDate: '2024-11-16', expectedDate: '2024-12-04', status: 'cancelled' },
  { id: 'PO-2024-016', supplier: 'Office Essentials', items: 14, amount: '$6,200', orderDate: '2024-11-18', expectedDate: '2024-12-07', status: 'approved' },
  { id: 'PO-2024-017', supplier: 'Premium Stationery', items: 26, amount: '$8,150', orderDate: '2024-11-22', expectedDate: '2024-12-13', status: 'received' },
  { id: 'PO-2024-018', supplier: 'Tech Supplies Co.', items: 13, amount: '$11,450', orderDate: '2024-11-30', expectedDate: '2024-12-21', status: 'pending' },
  { id: 'PO-2024-019', supplier: 'Smart Components Inc.', items: 19, amount: '$15,300', orderDate: '2024-11-25', expectedDate: '2024-12-15', status: 'approved' },
  { id: 'PO-2024-020', supplier: 'Creative Workspace', items: 5, amount: '$3,200', orderDate: '2024-11-14', expectedDate: '2024-12-02', status: 'received' },
  { id: 'PO-2024-021', supplier: 'Office Furniture Ltd.', items: 9, amount: '$7,850', orderDate: '2024-11-19', expectedDate: '2024-12-09', status: 'approved' },
  { id: 'PO-2024-022', supplier: 'Global Electronics', items: 24, amount: '$20,900', orderDate: '2024-11-20', expectedDate: '2024-12-10', status: 'received' },
  { id: 'PO-2024-023', supplier: 'Office Essentials', items: 11, amount: '$5,900', orderDate: '2024-11-26', expectedDate: '2024-12-18', status: 'pending' },
  { id: 'PO-2024-024', supplier: 'Premium Stationery', items: 32, amount: '$7,950', orderDate: '2024-11-12', expectedDate: '2024-11-30', status: 'received' },
  { id: 'PO-2024-025', supplier: 'Tech Supplies Co.', items: 16, amount: '$13,400', orderDate: '2024-11-13', expectedDate: '2024-12-03', status: 'approved' },
  { id: 'PO-2024-026', supplier: 'Smart Components Inc.', items: 21, amount: '$17,800', orderDate: '2024-11-17', expectedDate: '2024-12-06', status: 'received' },
  { id: 'PO-2024-027', supplier: 'Creative Workspace', items: 6, amount: '$3,650', orderDate: '2024-11-29', expectedDate: '2024-12-20', status: 'pending' },
  { id: 'PO-2024-028', supplier: 'Office Furniture Ltd.', items: 13, amount: '$9,950', orderDate: '2024-11-24', expectedDate: '2024-12-14', status: 'approved' },
  { id: 'PO-2024-029', supplier: 'Global Electronics', items: 23, amount: '$19,950', orderDate: '2024-11-28', expectedDate: '2024-12-18', status: 'received' },
  { id: 'PO-2024-030', supplier: 'Office Essentials', items: 10, amount: '$4,850', orderDate: '2024-11-30', expectedDate: '2024-12-22', status: 'approved' },
];

const mockPurchaseOrders = Array.from({ length: 100 }, (_, index) => {
  const base = basePurchaseOrders[index % basePurchaseOrders.length];
  const sequence = index + 1;
  const amountBase = parseFloat(base.amount.replace(/[$,]/g, ""));
  const amountValue = amountBase + (sequence % 9) * 350;
  const statuses = ["approved", "pending", "received", "cancelled"] as const;
  return {
    ...base,
    id: `PO-2024-${String(sequence).padStart(3, "0")}`,
    items: base.items + (sequence % 6),
    amount: `$${amountValue.toLocaleString()}`,
    status: statuses[sequence % statuses.length],
  };
});

// Toast hook for user feedback (matching EmployeesPage)
function useToasts() {
  const [toasts, setToasts] = useState<{id: string, type: "success"|"error"|"info", text: string}[]>([]);
  const push = useCallback((t: { type: "success"|"error"|"info", text: string }) => {
    const id = String(Date.now()) + Math.random();
    setToasts((s) => [...s, { id, ...t }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 3000);
  }, []);
  return { toasts, push };
}

// Pagination button style (matching EmployeesPage)
const paginationButtonStyle = {
  base: {
    position: 'relative' as const,
    zIndex: 1,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
  },
};

export function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState(mockPurchaseOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const purchaseOrdersPerPage = 10;
  const { toasts, push } = useToasts();
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<typeof mockPurchaseOrders[0] | null>(null);
  const [purchaseOrderToDelete, setPurchaseOrderToDelete] = useState<typeof mockPurchaseOrders[0] | null>(null);
  const [isEditPOModalOpen, setIsEditPOModalOpen] = useState(false);
  const [purchaseOrderToEdit, setPurchaseOrderToEdit] = useState<typeof mockPurchaseOrders[0] | null>(null);
  const [isDownloadPOModalOpen, setIsDownloadPOModalOpen] = useState(false);
  const [purchaseOrderToDownload, setPurchaseOrderToDownload] = useState<typeof mockPurchaseOrders[0] | null>(null);
  const [isNewPOModalOpen, setIsNewPOModalOpen] = useState(false);
  const [newPOForm, setNewPOForm] = useState({
    supplier: '',
    amount: '',
    orderDate: '',
    expectedDate: '',
    status: 'pending' as 'approved' | 'pending' | 'received' | 'cancelled',
    items: '',
  });
  const [editPOForm, setEditPOForm] = useState({
    supplier: '',
    amount: '',
    orderDate: '',
    expectedDate: '',
    status: 'pending' as 'approved' | 'pending' | 'received' | 'cancelled',
    items: '',
  });
  const statusFilterOptions = [
    { value: 'received', label: 'Received' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Helper functions for professional number input handling
  const formatAmount = (value: string): string => {
    // Remove all non-digit characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, '');
    
    // Allow only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    return cleaned;
  };

  const parseAmount = (value: string): number => {
    const cleaned = value.replace(/[^\d.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const formatAmountDisplay = (value: string): string => {
    if (!value || value === '') return '';
    const num = parseAmount(value);
    if (num === 0) return '';
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    });
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatAmount(value);
    setNewPOForm({ ...newPOForm, amount: formatted });
  };

  const handleAmountBlur = () => {
    const num = parseAmount(newPOForm.amount);
    if (num > 0) {
      setNewPOForm({ 
        ...newPOForm, 
        amount: num.toFixed(2) 
      });
    } else {
      setNewPOForm({ ...newPOForm, amount: '' });
    }
  };

  const formatInteger = (value: string): string => {
    // Remove all non-digit characters
    return value.replace(/\D/g, '');
  };

  const handleItemsChange = (value: string) => {
    const formatted = formatInteger(value);
    setNewPOForm({ ...newPOForm, items: formatted });
  };

  const handleItemsBlur = () => {
    const num = parseInt(newPOForm.items) || 0;
    if (num < 1) {
      setNewPOForm({ ...newPOForm, items: '' });
    } else {
      setNewPOForm({ ...newPOForm, items: String(num) });
    }
  };

  const handleEditAmountChange = (value: string) => {
    const formatted = formatAmount(value);
    setEditPOForm({ ...editPOForm, amount: formatted });
  };

  const handleEditAmountBlur = () => {
    const num = parseAmount(editPOForm.amount);
    if (num > 0) {
      setEditPOForm({
        ...editPOForm,
        amount: num.toFixed(2),
      });
    } else {
      setEditPOForm({ ...editPOForm, amount: '' });
    }
  };

  const handleEditItemsChange = (value: string) => {
    const formatted = formatInteger(value);
    setEditPOForm({ ...editPOForm, items: formatted });
  };

  const handleEditItemsBlur = () => {
    const num = parseInt(editPOForm.items) || 0;
    if (num < 1) {
      setEditPOForm({ ...editPOForm, items: '' });
    } else {
      setEditPOForm({ ...editPOForm, items: String(num) });
    }
  };

  // تحديث دالة الألوان لاستخدام نمط Glassmorphism
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'approved': return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-400/30';
      default: return 'bg-white/15 text-white/80 border-white/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received': return <CheckCircle className="w-4 h-4" />;
      case 'approved': return <ShoppingCart className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    const matchesSearch = po.supplier.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          po.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || po.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  
  // Pagination calculation (10 per page, like Employees/Invoices)
  const totalPages = Math.ceil(filteredPurchaseOrders.length / purchaseOrdersPerPage);
  const startIndex = (currentPage - 1) * purchaseOrdersPerPage;
  const endIndex = startIndex + purchaseOrdersPerPage;
  const paginatedPurchaseOrders = filteredPurchaseOrders.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1);

    if (currentPage <= 3) {
      for (let i = 2; i <= 4; i++) {
        if (i <= totalPages) pages.push(i);
      }
      if (totalPages > 5) {
        pages.push('...');
        pages.push(totalPages);
      }
    } else if (currentPage >= totalPages - 2) {
      if (totalPages > 5) {
        pages.push('...');
      }
      for (let i = totalPages - 3; i <= totalPages; i++) {
        if (i > 1) pages.push(i);
      }
    } else {
      pages.push('...');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Calculate stats for cards
  
  const totalRevenueValue = purchaseOrders.filter(p => p.status !== 'cancelled').reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '').replace(',', '')), 0);
  const totalRevenueFormatted = `$${totalRevenueValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const pendingAmount = purchaseOrders.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '').replace(',', '')), 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const cancelledAmount = purchaseOrders.filter(p => p.status === 'cancelled').reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '').replace(',', '')), 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const handleViewPurchaseOrder = (poId: string) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (po) {
      setSelectedPurchaseOrder(po);
    }
  };

  const handleEditPurchaseOrder = (poId: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;
    setPurchaseOrderToEdit(po);
    setEditPOForm({
      supplier: po.supplier,
      amount: parseAmount(po.amount).toFixed(2),
      orderDate: po.orderDate,
      expectedDate: po.expectedDate,
      status: po.status as typeof editPOForm.status,
      items: String(po.items),
    });
    setIsEditPOModalOpen(true);
  };

  const handleClosePurchaseOrderModal = () => {
    setSelectedPurchaseOrder(null);
  };

  const handleOpenNewPOModal = () => {
    setIsNewPOModalOpen(true);
    // Set default values
    const today = new Date();
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() + 30);
    
    setNewPOForm({
      supplier: '',
      amount: '',
      orderDate: today.toISOString().split('T')[0],
      expectedDate: expectedDate.toISOString().split('T')[0],
      status: 'pending',
      items: '',
    });
  };

  const handleCloseNewPOModal = () => {
    setIsNewPOModalOpen(false);
    setNewPOForm({
      supplier: '',
      amount: '',
      orderDate: '',
      expectedDate: '',
      status: 'pending',
      items: '',
    });
  };

  const handleCloseEditPOModal = () => {
    setIsEditPOModalOpen(false);
    setPurchaseOrderToEdit(null);
    setEditPOForm({
      supplier: '',
      amount: '',
      orderDate: '',
      expectedDate: '',
      status: 'pending',
      items: '',
    });
  };

  const handleSubmitNewPO = () => {
    // Validation
    if (!newPOForm.supplier || !newPOForm.amount || !newPOForm.orderDate || !newPOForm.expectedDate || !newPOForm.items) {
      push({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    // Generate new PO ID
    const lastPO = purchaseOrders[purchaseOrders.length - 1];
    const lastNumber = parseInt(lastPO.id.split('-')[2]);
    const newId = `PO-2024-${String(lastNumber + 1).padStart(3, '0')}`;

    // Format amount using helper function
    const amountValue = parseAmount(newPOForm.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      push({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }
    const formattedAmount = `$${amountValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    // Parse items using helper
    const itemsValue = parseInt(newPOForm.items) || 1;
    if (itemsValue < 1) {
      push({ type: 'error', text: 'Please enter a valid number of items' });
      return;
    }

    // Create new purchase order
    const newPO = {
      id: newId,
      supplier: newPOForm.supplier,
      amount: formattedAmount,
      orderDate: newPOForm.orderDate,
      expectedDate: newPOForm.expectedDate,
      status: newPOForm.status,
      items: itemsValue,
    };

    // Add to purchase orders list (at the end)
    const updatedPurchaseOrders = [...purchaseOrders, newPO];
    setPurchaseOrders(updatedPurchaseOrders);
    
    // Calculate new total pages after adding the PO
    const filteredAfterAdd = updatedPurchaseOrders.filter(po => {
      const matchesSearch = po.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            po.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || po.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
    
    const newTotalPages = Math.ceil(filteredAfterAdd.length / purchaseOrdersPerPage);
    
    // If new PO requires a new page, navigate to the last page
    if (newTotalPages > totalPages) {
      setCurrentPage(newTotalPages);
    }
    
    push({ type: 'success', text: `Purchase Order ${newId} created successfully` });
    handleCloseNewPOModal();
  };

  const handleSubmitEditPO = () => {
    if (!purchaseOrderToEdit) return;
    if (
      !editPOForm.supplier ||
      !editPOForm.amount ||
      !editPOForm.orderDate ||
      !editPOForm.expectedDate ||
      !editPOForm.items
    ) {
      push({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    const amountValue = parseAmount(editPOForm.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      push({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    const itemsValue = parseInt(editPOForm.items) || 1;
    if (itemsValue < 1) {
      push({ type: 'error', text: 'Please enter a valid number of items' });
      return;
    }

    const formattedAmount = `$${amountValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    const updatedPO = {
      ...purchaseOrderToEdit,
      supplier: editPOForm.supplier,
      amount: formattedAmount,
      orderDate: editPOForm.orderDate,
      expectedDate: editPOForm.expectedDate,
      status: editPOForm.status,
      items: itemsValue,
    };

    const updatedPurchaseOrders = purchaseOrders.map((po) =>
      po.id === purchaseOrderToEdit.id ? updatedPO : po,
    );
    setPurchaseOrders(updatedPurchaseOrders);
    push({ type: 'success', text: `Purchase Order ${purchaseOrderToEdit.id} updated successfully` });
    handleCloseEditPOModal();
  };

  const handleDeletePurchaseOrder = (poId: string) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (po) {
      setPurchaseOrderToDelete(po);
    }
  };

  const handleConfirmDelete = () => {
    if (!purchaseOrderToDelete) return;
    
    const poId = purchaseOrderToDelete.id;
    
    // Remove purchase order from list
    const updatedPurchaseOrders = purchaseOrders.filter(p => p.id !== poId);
    setPurchaseOrders(updatedPurchaseOrders);
    
    // Recalculate pagination
    const filteredAfterDelete = updatedPurchaseOrders.filter(po => {
      const matchesSearch = po.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            po.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || po.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
    
    const newTotalPages = Math.ceil(filteredAfterDelete.length / purchaseOrdersPerPage);
    
    // If current page is empty after deletion, go to previous page
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
    }
    
    push({ type: 'success', text: `Purchase Order ${poId} deleted successfully` });
    setPurchaseOrderToDelete(null);
  };

  const handleCancelDelete = () => {
    setPurchaseOrderToDelete(null);
  };

  const handleDownloadPurchaseOrder = (poId: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;
    setPurchaseOrderToDownload(po);
    setIsDownloadPOModalOpen(true);
  };

  const handleCloseDownloadPOModal = () => {
    setIsDownloadPOModalOpen(false);
    setPurchaseOrderToDownload(null);
  };

  const downloadPurchaseOrderExcel = (po: typeof mockPurchaseOrders[0]) => {
    const rows = [
      ["PO ID", "Supplier", "Amount", "Order Date", "Expected Date", "Status", "Items"],
      [po.id, po.supplier, po.amount, po.orderDate, po.expectedDate, po.status, String(po.items)],
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${po.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    push({ type: "success", text: `Purchase Order ${po.id} downloaded successfully` });
  };

  const downloadPurchaseOrderWord = (po: typeof mockPurchaseOrders[0]) => {
    const content = [
      `PO ID: ${po.id}`,
      `Supplier: ${po.supplier}`,
      `Amount: ${po.amount}`,
      `Order Date: ${po.orderDate}`,
      `Expected Date: ${po.expectedDate}`,
      `Status: ${po.status}`,
      `Items: ${po.items}`,
    ].join("\n");
    const blob = new Blob([content], { type: "application/msword;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${po.id}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    push({ type: "success", text: `Purchase Order ${po.id} downloaded successfully` });
  };

  const downloadPurchaseOrderPdf = async (po: typeof mockPurchaseOrders[0]) => {
    push({ type: 'info', text: `Preparing PDF for purchase order ${po.id}...` });
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const subtotal = parseFloat(po.amount.replace('$', '').replace(',', ''));
      const tax = subtotal * 0.15;
      const total = subtotal + tax;
      const primaryColor: [number, number, number] = [30, 41, 59];
      const textColor: [number, number, number] = [51, 51, 51];
      const lightGray: [number, number, number] = [200, 200, 200];

      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      };

      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 32, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('ERP System', 20, 18);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('PURCHASE ORDER', 20, 27);

      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(po.id, 20, 45);
      doc.setDrawColor(...lightGray);
      doc.setLineWidth(0.5);
      doc.line(20, 50, 190, 50);

      const details = [
        ['Supplier', po.supplier],
        ['Amount', po.amount],
        ['Order Date', formatDate(po.orderDate)],
        ['Expected Date', formatDate(po.expectedDate)],
        ['Status', po.status],
        ['Items', String(po.items)],
        ['Subtotal', po.amount],
        ['Tax (VAT 15%)', `$${tax.toFixed(2)}`],
        ['Total', `$${total.toFixed(2)}`],
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      let yPos = 62;
      details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(String(value), 70, yPos);
        yPos += 7;
        if (yPos > 275) {
          doc.addPage();
          yPos = 20;
        }
      });
      doc.save(`${po.id}.pdf`);
      push({ type: 'success', text: `Purchase Order ${po.id} downloaded successfully` });
    } catch (error) {
      console.error('Error generating PDF:', error);
      push({ type: 'error', text: `Failed to generate PDF for purchase order ${po.id}` });
    }
  };

  const handleConfirmDownloadPO = async (format: "excel" | "pdf" | "word") => {
    if (!purchaseOrderToDownload) return;
    if (format === "excel") {
      downloadPurchaseOrderExcel(purchaseOrderToDownload);
    } else if (format === "word") {
      downloadPurchaseOrderWord(purchaseOrderToDownload);
    } else {
      await downloadPurchaseOrderPdf(purchaseOrderToDownload);
    }
    handleCloseDownloadPOModal();
  };

  return (
    <div>
      {/* Purchase Order Details Modal */}
      {selectedPurchaseOrder && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99998] p-4"
          onClick={handleClosePurchaseOrderModal}
        >
          {/* Modal Content */}
          <div 
            className="rounded-2xl w-full max-w-md overflow-hidden flex flex-col animate-fadeIn"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-blue-300"
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Purchase Order Details</h2>
                  <p className="text-sm text-white/50 truncate max-w-[250px]">{selectedPurchaseOrder.id}</p>
                </div>
              </div>
              <button
                onClick={handleClosePurchaseOrderModal}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <ShoppingBag className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm leading-relaxed">
                    <span className="font-semibold">Supplier:</span> {selectedPurchaseOrder.supplier}<br />
                    <span className="font-semibold">Amount:</span> <span className="text-green-400">{selectedPurchaseOrder.amount}</span><br />
                    <span className="font-semibold">Status:</span> <span className={`${getStatusColor(selectedPurchaseOrder.status).split(' ')[1]}`}>{selectedPurchaseOrder.status}</span><br />
                    <span className="font-semibold">Order Date:</span> {selectedPurchaseOrder.orderDate}<br />
                    <span className="font-semibold">Expected Date:</span> {selectedPurchaseOrder.expectedDate}<br />
                    <span className="font-semibold">Items:</span> {selectedPurchaseOrder.items} items
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-white/10">
              <button
                onClick={handleClosePurchaseOrderModal}
                className="px-4 py-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit PO Modal */}
      {isEditPOModalOpen && purchaseOrderToEdit && createPortal(
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          style={{ zIndex: 2000000 }}
          onClick={handleCloseEditPOModal}
        >
          <div
            className="rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-fadeIn max-h-[calc(100vh-160px)] min-h-0"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
              zIndex: 2000001,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-blue-300"
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <Pencil className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Edit Purchase Order</h2>
                  <p className="text-sm text-white/50">{purchaseOrderToEdit.id}</p>
                </div>
              </div>
              <button
                onClick={handleCloseEditPOModal}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-4">
                {/* Supplier and Status Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={editPOForm.supplier}
                      onChange={(e) => setEditPOForm({ ...editPOForm, supplier: e.target.value })}
                      placeholder="Enter supplier"
                      className="w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Status
                    </label>
                    <CustomSelect
                      value={editPOForm.status}
                      onChange={(value) => setEditPOForm({ ...editPOForm, status: value as typeof editPOForm.status })}
                      options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'approved', label: 'Approved' },
                        { value: 'received', label: 'Received' },
                        { value: 'cancelled', label: 'Cancelled' },
                      ]}
                      placeholder="Select status"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Amount and Items Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={editPOForm.amount}
                        onChange={(e) => handleEditAmountChange(e.target.value)}
                        onBlur={handleEditAmountBlur}
                        placeholder="0.00"
                        className="w-full pl-4 pr-10 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                        style={{
                          textAlign: 'left',
                          direction: 'ltr',
                          paddingRight: '2.75rem',
                        }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10"
                        style={{ right: '0.75rem' }}
                      >
                        <DollarSign className="w-4 h-4 text-white/60" strokeWidth={2.5} />
                      </div>
                    </div>
                    {editPOForm.amount && parseAmount(editPOForm.amount) > 0 && (
                      <p className="text-xs text-white/50 mt-2 pl-4">
                        {formatAmountDisplay(editPOForm.amount)} USD
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Items
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editPOForm.items}
                      onChange={(e) => handleEditItemsChange(e.target.value)}
                      onBlur={handleEditItemsBlur}
                      placeholder="Enter number of items"
                      className="w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                    />
                    {editPOForm.items && parseInt(editPOForm.items) > 0 && (
                      <p className="text-xs text-white/50 mt-2 pl-4">
                        {parseInt(editPOForm.items).toLocaleString()} item{parseInt(editPOForm.items) !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Date and Expected Date Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Order Date
                    </label>
                    <DatePicker
                      value={editPOForm.orderDate}
                      onChange={(value) => setEditPOForm({ ...editPOForm, orderDate: value })}
                      placeholder="Select order date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Expected Date
                    </label>
                    <DatePicker
                      value={editPOForm.expectedDate}
                      onChange={(value) => setEditPOForm({ ...editPOForm, expectedDate: value })}
                      placeholder="Select expected date"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <button
                onClick={handleCloseEditPOModal}
                className="px-4 py-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEditPO}
                className="px-4 py-2 rounded-lg font-medium transition text-white"
                style={{
                  background: "rgba(59, 130, 246, 0.2)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(59, 130, 246, 0.35)",
                  boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.45)';
                  e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(59, 130, 246, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.35)';
                  e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Download Purchase Order Modal */}
      {isDownloadPOModalOpen && purchaseOrderToDownload && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99998] p-4"
          onClick={handleCloseDownloadPOModal}
        >
          <div
            className="rounded-2xl w-full max-w-md overflow-hidden flex flex-col animate-fadeIn"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-blue-300"
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <Download className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Download Purchase Order</h2>
                  <p className="text-sm text-white/50">{purchaseOrderToDownload.id}</p>
                </div>
              </div>
              <button
                onClick={handleCloseDownloadPOModal}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold tracking-wide text-white/60 mb-4 text-center">
                Select a file type
              </p>
              <div className="p-0">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleConfirmDownloadPO("excel")}
                    className="w-full px-3 py-3 text-white/90 hover:text-white transition flex flex-col items-center gap-2 glass-content-inner rounded-xl border border-white/10 hover:bg-white/15"
                    title="Download Excel"
                    aria-label="Download Excel"
                  >
                    <span className="relative w-7 h-7 text-white/80">
                      <FileSpreadsheet className="w-6 h-6" />
                    </span>
                    <span className="text-xs font-semibold tracking-wide">EXCEL</span>
                  </button>
                  <button
                    onClick={() => handleConfirmDownloadPO("pdf")}
                    className="w-full px-3 py-3 text-white/90 hover:text-white transition flex flex-col items-center gap-2 glass-content-inner rounded-xl border border-white/10 hover:bg-white/15"
                    title="Download PDF"
                    aria-label="Download PDF"
                  >
                    <span className="relative w-7 h-7 text-white/80">
                      <FileText className="w-6 h-6" />
                    </span>
                    <span className="text-xs font-semibold tracking-wide">PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {purchaseOrderToDelete && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99998] p-4"
          onClick={handleCancelDelete}
        >
          <div 
            className="rounded-2xl w-full max-w-md overflow-hidden flex flex-col animate-fadeIn"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-red-300"
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    boxShadow: "0 4px 12px 0 rgba(239, 68, 68, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Delete Purchase Order</h2>
                  <p className="text-sm text-white/50 truncate max-w-[250px]">
                    {purchaseOrderToDelete.id}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelDelete}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-white/90 text-base mb-4">
                  Are you sure you want to delete this purchase order? This action cannot be undone.
                </p>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60 text-sm">PO ID:</span>
                      <span className="text-white font-medium">{purchaseOrderToDelete.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60 text-sm">Supplier:</span>
                      <span className="text-white font-medium">{purchaseOrderToDelete.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60 text-sm">Amount:</span>
                      <span className="text-green-400 font-semibold">{purchaseOrderToDelete.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60 text-sm">Status:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(purchaseOrderToDelete.status)}`}>
                        {getStatusIcon(purchaseOrderToDelete.status)}
                        {purchaseOrderToDelete.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg font-medium transition text-white"
                style={{
                  background: "rgba(239, 68, 68, 0.2)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  boxShadow: "0 4px 12px 0 rgba(239, 68, 68, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.45)';
                  e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(239, 68, 68, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.35)';
                  e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(239, 68, 68, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Delete Purchase Order
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* New PO Modal */}
      {isNewPOModalOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          style={{ zIndex: 2000000 }}
          onClick={handleCloseNewPOModal}
        >
          <div 
            className="rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-fadeIn max-h-[calc(100vh-160px)] min-h-0"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
              zIndex: 2000001,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-blue-300"
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <ShoppingBag className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Create New Purchase Order</h2>
                  <p className="text-sm text-white/50">Enter purchase order information</p>
                </div>
              </div>
              <button
                onClick={handleCloseNewPOModal}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-4">
                {/* Supplier and Status Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={newPOForm.supplier}
                      onChange={(e) => setNewPOForm({ ...newPOForm, supplier: e.target.value })}
                      placeholder="Enter supplier"
                      className="w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Status
                    </label>
                    <CustomSelect
                      value={newPOForm.status}
                      onChange={(value) => setNewPOForm({ ...newPOForm, status: value as typeof newPOForm.status })}
                      options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'approved', label: 'Approved' },
                        { value: 'received', label: 'Received' },
                        { value: 'cancelled', label: 'Cancelled' },
                      ]}
                      placeholder="Select status"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Amount and Items Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={newPOForm.amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        onBlur={handleAmountBlur}
                        placeholder="0.00"
                        className="w-full pl-4 pr-10 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                        style={{
                          textAlign: 'left',
                          direction: 'ltr',
                          paddingRight: '2.75rem'
                        }}
                      />
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10"
                        style={{
                          right: '0.75rem'
                        }}
                      >
                        <DollarSign className="w-4 h-4 text-white/60" strokeWidth={2.5} />
                      </div>
                    </div>
                    {newPOForm.amount && parseAmount(newPOForm.amount) > 0 && (
                      <p className="text-xs text-white/50 mt-2 pl-4">
                        {formatAmountDisplay(newPOForm.amount)} USD
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Items
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={newPOForm.items}
                      onChange={(e) => handleItemsChange(e.target.value)}
                      onBlur={handleItemsBlur}
                      placeholder="Enter number of items"
                      className="w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                    />
                    {newPOForm.items && parseInt(newPOForm.items) > 0 && (
                      <p className="text-xs text-white/50 mt-2 pl-4">
                        {parseInt(newPOForm.items).toLocaleString()} item{parseInt(newPOForm.items) !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Date and Expected Date Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Order Date
                    </label>
                    <DatePicker
                      value={newPOForm.orderDate}
                      onChange={(value) => setNewPOForm({ ...newPOForm, orderDate: value })}
                      placeholder="Select order date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Expected Date
                    </label>
                    <DatePicker
                      value={newPOForm.expectedDate}
                      onChange={(value) => setNewPOForm({ ...newPOForm, expectedDate: value })}
                      placeholder="Select expected date"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <button
                onClick={handleCloseNewPOModal}
                className="px-4 py-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNewPO}
                className="px-4 py-2 rounded-lg font-medium transition text-white"
                style={{
                  background: "rgba(59, 130, 246, 0.2)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(59, 130, 246, 0.35)",
                  boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.45)';
                  e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(59, 130, 246, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.35)';
                  e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Create Purchase Order
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast Notifications */}
      <div 
        className="fixed right-2 sm:right-4 top-4 flex flex-col gap-3 max-w-[calc(100vw-1rem)] sm:max-w-none"
        style={{ zIndex: 3000000 }}
      >
        {toasts.map((t) => (
          <div key={t.id} role="alert" className={`w-full sm:w-80 p-4 rounded-lg shadow-2xl flex items-center gap-3 border transition-all duration-300 glass-stat-card ${
            t.type === "success" 
              ? "bg-green-500/20 border-green-400/30 text-green-300" 
              : t.type === "error" 
              ? "bg-red-500/20 border-red-400/30 text-red-300" 
              : "bg-blue-500/20 border-blue-400/30 text-blue-300"
          }`}>
             {t.type === "success" ? <CheckCircle2 className="w-4 h-4 flex-shrink-0"/> : t.type === "error" ? <XCircle className="w-4 h-4 flex-shrink-0"/> : <Zap className="w-4 h-4 flex-shrink-0"/>}
             <span className="text-sm font-medium">{t.text}</span>
          </div>
        ))}
      </div>

      {/* Header - match Employee Management glass header style */}
      <div className="mb-8">
        <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Purchase Orders
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                    Create and track procurement orders from suppliers
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
              <ShoppingBag className="w-6 h-6 text-blue-300" />
            </div>
            <span className="text-sm text-blue-300 font-medium">Active</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Total PO Orders</p>
          <p className="text-white text-2xl">{purchaseOrders.filter(po => po.status !== 'cancelled').length}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-400/30">
              <CheckCircle className="w-6 h-6 text-green-300" />
            </div>
            <span className="text-sm text-green-300 font-medium">Delivered</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Received Value</p>
          <p className="text-white text-2xl">{totalRevenueFormatted}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-400/30">
              <Clock className="w-6 h-6 text-yellow-300" />
            </div>
            <span className="text-sm text-yellow-300 font-medium">Awaiting</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Pending Value</p>
          <p className="text-white text-2xl">${pendingAmount}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-400/30">
              <XCircle className="w-6 h-6 text-red-300" />
            </div>
            <span className="text-sm text-red-300 font-medium">Voided</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Cancelled Value</p>
          <p className="text-white text-2xl">${cancelledAmount}</p>
        </div>
      </div>

      {/* Purchase Orders Table - تم تطبيق Glassmorphism */}
      <div className="glass-container-outer rounded-xl">
        {/* Table Header Actions */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search purchase orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 glass-input text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
            
            {/* Status filter + New PO actions - match Employees/Invoices pill group styling */}
            <div
              className="flex gap-3 items-center p-4 rounded-xl"
              style={{
                background: 'rgba(59, 130, 246, 0.08)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                boxShadow: '0 2px 8px 0 rgba(59, 130, 246, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <CustomSelect
                value={filterStatus}
                onChange={(value) => setFilterStatus(value as string)}
                options={[
                  { value: 'all', label: 'All Status' },
                  ...statusFilterOptions,
                ]}
                placeholder="All Status"
                className="w-[200px]"
                searchable
                searchPlaceholder="Search status..."
              />
              
              <button
                onClick={handleOpenNewPOModal}
                className="w-[200px] px-6 py-2.5 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all h-auto min-h-[42px]"
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  boxShadow: '0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                  e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(59, 130, 246, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = '';
                }}
              >
                <Plus className="w-4 h-4" />
                New PO
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">PO Number</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Expected Date</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {paginatedPurchaseOrders.map((po) => (
                <tr key={po.id} className="glass-table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleViewPurchaseOrder(po.id)}
                      className="text-blue-400 font-medium hover:text-blue-200 transition-colors"
                      title="View purchase order details"
                    >
                      {po.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {po.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/80">
                    {po.items} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-400 font-semibold">
                    {po.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/80">
                    {po.orderDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/80">
                    {po.expectedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${getStatusColor(po.status)} capitalize backdrop-blur-sm font-medium`}>
                      {getStatusIcon(po.status)}
                      {po.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditPurchaseOrder(po.id)}
                        className="p-2 text-white/70 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/30 group"
                        title="Edit purchase order"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(8px)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleDownloadPurchaseOrder(po.id)}
                        className="p-2 text-white/70 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/30 group"
                        title="Download purchase order PDF"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(8px)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleDeletePurchaseOrder(po.id)}
                        className="p-2 text-white/70 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-red-400/30 group"
                        title="Delete purchase order"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(8px)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.boxShadow = 'none';
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
        </div>

        {/* Pagination - match Employees/Invoices behavior (Previous / 1 2 3 / Next) */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-sm text-white/70">
            Showing{" "}
            <span className="text-white">
              {filteredPurchaseOrders.length === 0 ? 0 : startIndex + 1}
            </span>
            -
            <span className="text-white">
              {Math.min(endIndex, filteredPurchaseOrders.length)}
            </span>{" "}
            of <span className="text-white">{filteredPurchaseOrders.length}</span> purchase orders
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium select-none relative ${
                currentPage === 1
                  ? "glass-content-inner text-white/40 cursor-not-allowed opacity-60"
                  : "glass-content-inner text-white/90 cursor-pointer"
              }`}
              style={currentPage !== 1 ? {
                ...paginationButtonStyle.base,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              } : {}}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.background = '';
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.color = '';
                }
              }}
              onMouseDown={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.transform = 'translateY(1px)';
                }
              }}
              onMouseUp={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
            >
              Previous
            </button>
            {pageNumbers.map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-4 py-2 text-white/60 select-none"
                  >
                    ...
                  </span>
                );
              }

              const pageNumber = pageNum as number;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className="px-4 py-2 rounded-lg font-medium cursor-pointer select-none relative min-w-[40px] text-base"
                  style={{
                    ...paginationButtonStyle.base,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    ...(currentPage === pageNumber
                      ? {
                          background: "rgba(59, 130, 246, 0.25)",
                          border: "1px solid rgba(59, 130, 246, 0.5)",
                          color: "white",
                          boxShadow:
                            "0 6px 20px rgba(59, 130, 246, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
                        }
                      : {
                          background: "rgba(255, 255, 255, 0.15)",
                          border: "1px solid rgba(255, 255, 255, 0.25)",
                          color: "rgba(255, 255, 255, 0.9)",
                          boxShadow:
                            "0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.15)",
                        }),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = currentPage === pageNumber 
                      ? 'rgba(59, 130, 246, 0.35)' 
                      : 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.borderColor = currentPage === pageNumber
                      ? 'rgba(59, 130, 246, 0.6)'
                      : 'rgba(255, 255, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = currentPage === pageNumber
                      ? '0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3)'
                      : '0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = currentPage === pageNumber
                      ? 'rgba(59, 130, 246, 0.25)'
                      : 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.borderColor = currentPage === pageNumber
                      ? 'rgba(59, 130, 246, 0.5)'
                      : 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = currentPage === pageNumber
                      ? '0 6px 20px rgba(59, 130, 246, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
                      : '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = currentPage === pageNumber ? 'white' : 'rgba(255, 255, 255, 0.9)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(1px)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-4 py-2 rounded-lg font-medium select-none relative ${
                currentPage === totalPages || totalPages === 0
                  ? "glass-content-inner text-white/40 cursor-not-allowed opacity-60"
                  : "glass-content-inner text-white/90 cursor-pointer"
              }`}
              style={currentPage !== totalPages && totalPages !== 0 ? {
                ...paginationButtonStyle.base,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              } : {}}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages && totalPages !== 0) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages && totalPages !== 0) {
                  e.currentTarget.style.background = '';
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.color = '';
                }
              }}
              onMouseDown={(e) => {
                if (currentPage !== totalPages && totalPages !== 0) {
                  e.currentTarget.style.transform = 'translateY(1px)';
                }
              }}
              onMouseUp={(e) => {
                if (currentPage !== totalPages && totalPages !== 0) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}