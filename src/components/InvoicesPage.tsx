import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Plus,
  Download,
  Pencil,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Zap,
  CreditCard,
  X,
  FileText,
  FileSpreadsheet,
  DollarSign,
  Trash2,
} from 'lucide-react';
import { CustomSelect } from './ui/CustomSelect';
import { DatePicker } from './ui/DatePicker';

type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

// 100 mock invoices for testing pagination
const mockInvoices = [
  { id: 'INV-2024-001', customer: 'Ahmed Hassan', amount: '$1,250.00', dueDate: '2024-12-15', issueDate: '2024-11-15', status: 'paid', items: 5 },
  { id: 'INV-2024-002', customer: 'Fatima Ali', amount: '$890.00', dueDate: '2024-12-20', issueDate: '2024-11-20', status: 'pending', items: 3 },
  { id: 'INV-2024-003', customer: 'Mohamed Saeed', amount: '$2,100.00', dueDate: '2024-12-10', issueDate: '2024-11-10', status: 'overdue', items: 8 },
  { id: 'INV-2024-004', customer: 'Sara Ibrahim', amount: '$450.00', dueDate: '2024-12-25', issueDate: '2024-11-25', status: 'paid', items: 2 },
  { id: 'INV-2024-005', customer: 'Omar Khalil', amount: '$1,670.00', dueDate: '2024-12-18', issueDate: '2024-11-18', status: 'pending', items: 6 },
  { id: 'INV-2024-006', customer: 'Layla Ahmed', amount: '$980.00', dueDate: '2024-12-05', issueDate: '2024-11-05', status: 'cancelled', items: 4 },
  { id: 'INV-2024-007', customer: 'Khalid Mansour', amount: '$1,320.00', dueDate: '2024-12-22', issueDate: '2024-11-22', status: 'paid', items: 7 },
  { id: 'INV-2024-008', customer: 'Noura Al-Zahra', amount: '$760.00', dueDate: '2024-12-19', issueDate: '2024-11-19', status: 'pending', items: 3 },
  { id: 'INV-2024-009', customer: 'Youssef Hamdi', amount: '$1,980.00', dueDate: '2024-12-08', issueDate: '2024-11-08', status: 'overdue', items: 9 },
  { id: 'INV-2024-010', customer: 'Mariam Fadel', amount: '$540.00', dueDate: '2024-12-27', issueDate: '2024-11-27', status: 'paid', items: 2 },
  { id: 'INV-2024-011', customer: 'Tariq Nasser', amount: '$2,450.00', dueDate: '2024-12-13', issueDate: '2024-11-13', status: 'paid', items: 10 },
  { id: 'INV-2024-012', customer: 'Hala Samir', amount: '$1,120.00', dueDate: '2024-12-21', issueDate: '2024-11-21', status: 'pending', items: 4 },
  { id: 'INV-2024-013', customer: 'Bassem Farid', amount: '$3,050.00', dueDate: '2024-12-06', issueDate: '2024-11-06', status: 'overdue', items: 12 },
  { id: 'INV-2024-014', customer: 'Dina Magdy', amount: '$670.00', dueDate: '2024-12-26', issueDate: '2024-11-26', status: 'paid', items: 3 },
  { id: 'INV-2024-015', customer: 'Rami Tawfik', amount: '$1,490.00', dueDate: '2024-12-17', issueDate: '2024-11-17', status: 'pending', items: 5 },
  { id: 'INV-2024-016', customer: 'Salma Karim', amount: '$860.00', dueDate: '2024-12-09', issueDate: '2024-11-09', status: 'cancelled', items: 4 },
  { id: 'INV-2024-017', customer: 'Waleed Osman', amount: '$2,780.00', dueDate: '2024-12-12', issueDate: '2024-11-12', status: 'paid', items: 11 },
  { id: 'INV-2024-018', customer: 'Lina Haddad', amount: '$990.00', dueDate: '2024-12-23', issueDate: '2024-11-23', status: 'pending', items: 3 },
  { id: 'INV-2024-019', customer: 'Ziad Malek', amount: '$1,730.00', dueDate: '2024-12-07', issueDate: '2024-11-07', status: 'overdue', items: 7 },
  { id: 'INV-2024-020', customer: 'Rania Fawzy', amount: '$610.00', dueDate: '2024-12-28', issueDate: '2024-11-28', status: 'paid', items: 2 },
  { id: 'INV-2024-021', customer: 'Amr Shoukry', amount: '$1,980.00', dueDate: '2024-12-16', issueDate: '2024-11-16', status: 'paid', items: 9 },
  { id: 'INV-2024-022', customer: 'Nada El-Sayed', amount: '$1,140.00', dueDate: '2024-12-14', issueDate: '2024-11-14', status: 'pending', items: 4 },
  { id: 'INV-2024-023', customer: 'Hassan Reda', amount: '$2,320.00', dueDate: '2024-12-11', issueDate: '2024-11-11', status: 'overdue', items: 10 },
  { id: 'INV-2024-024', customer: 'Yasmin Lotfy', amount: '$730.00', dueDate: '2024-12-24', issueDate: '2024-11-24', status: 'paid', items: 3 },
  { id: 'INV-2024-025', customer: 'Karim Adel', amount: '$1,560.00', dueDate: '2024-12-19', issueDate: '2024-11-19', status: 'pending', items: 6 },
  { id: 'INV-2024-026', customer: 'Mona Saber', amount: '$940.00', dueDate: '2024-12-04', issueDate: '2024-11-04', status: 'cancelled', items: 4 },
  { id: 'INV-2024-027', customer: 'Omar Youssef', amount: '$2,110.00', dueDate: '2024-12-13', issueDate: '2024-11-13', status: 'paid', items: 8 },
  { id: 'INV-2024-028', customer: 'Soha Badr', amount: '$870.00', dueDate: '2024-12-22', issueDate: '2024-11-22', status: 'pending', items: 3 },
  { id: 'INV-2024-029', customer: 'Mahmoud Ashraf', amount: '$1,990.00', dueDate: '2024-12-09', issueDate: '2024-11-09', status: 'overdue', items: 9 },
  { id: 'INV-2024-030', customer: 'Reem Gamal', amount: '$650.00', dueDate: '2024-12-29', issueDate: '2024-11-29', status: 'paid', items: 2 },
  { id: 'INV-2024-031', customer: 'Ahmed Hassan', amount: '$1,250.00', dueDate: '2024-12-15', issueDate: '2024-11-15', status: 'paid', items: 5 },
  { id: 'INV-2024-032', customer: 'Fatima Ali', amount: '$890.00', dueDate: '2024-12-20', issueDate: '2024-11-20', status: 'pending', items: 3 },
  { id: 'INV-2024-033', customer: 'Mohamed Saeed', amount: '$2,100.00', dueDate: '2024-12-10', issueDate: '2024-11-10', status: 'overdue', items: 8 },
  { id: 'INV-2024-034', customer: 'Sara Ibrahim', amount: '$450.00', dueDate: '2024-12-25', issueDate: '2024-11-25', status: 'paid', items: 2 },
  { id: 'INV-2024-035', customer: 'Omar Khalil', amount: '$1,670.00', dueDate: '2024-12-18', issueDate: '2024-11-18', status: 'pending', items: 6 },
  { id: 'INV-2024-036', customer: 'Layla Ahmed', amount: '$980.00', dueDate: '2024-12-05', issueDate: '2024-11-05', status: 'cancelled', items: 4 },
  { id: 'INV-2024-037', customer: 'Khalid Mansour', amount: '$1,320.00', dueDate: '2024-12-22', issueDate: '2024-11-22', status: 'paid', items: 7 },
  { id: 'INV-2024-038', customer: 'Noura Al-Zahra', amount: '$760.00', dueDate: '2024-12-19', issueDate: '2024-11-19', status: 'pending', items: 3 },
  { id: 'INV-2024-039', customer: 'Youssef Hamdi', amount: '$1,980.00', dueDate: '2024-12-08', issueDate: '2024-11-08', status: 'overdue', items: 9 },
  { id: 'INV-2024-040', customer: 'Mariam Fadel', amount: '$540.00', dueDate: '2024-12-27', issueDate: '2024-11-27', status: 'paid', items: 2 },
  { id: 'INV-2024-041', customer: 'Tariq Nasser', amount: '$2,450.00', dueDate: '2024-12-13', issueDate: '2024-11-13', status: 'paid', items: 10 },
  { id: 'INV-2024-042', customer: 'Hala Samir', amount: '$1,120.00', dueDate: '2024-12-21', issueDate: '2024-11-21', status: 'pending', items: 4 },
  { id: 'INV-2024-043', customer: 'Bassem Farid', amount: '$3,050.00', dueDate: '2024-12-06', issueDate: '2024-11-06', status: 'overdue', items: 12 },
  { id: 'INV-2024-044', customer: 'Dina Magdy', amount: '$670.00', dueDate: '2024-12-26', issueDate: '2024-11-26', status: 'paid', items: 3 },
  { id: 'INV-2024-045', customer: 'Rami Tawfik', amount: '$1,490.00', dueDate: '2024-12-17', issueDate: '2024-11-17', status: 'pending', items: 5 },
  { id: 'INV-2024-046', customer: 'Salma Karim', amount: '$860.00', dueDate: '2024-12-09', issueDate: '2024-11-09', status: 'cancelled', items: 4 },
  { id: 'INV-2024-047', customer: 'Waleed Osman', amount: '$2,780.00', dueDate: '2024-12-12', issueDate: '2024-11-12', status: 'paid', items: 11 },
  { id: 'INV-2024-048', customer: 'Lina Haddad', amount: '$990.00', dueDate: '2024-12-23', issueDate: '2024-11-23', status: 'pending', items: 3 },
  { id: 'INV-2024-049', customer: 'Ziad Malek', amount: '$1,730.00', dueDate: '2024-12-07', issueDate: '2024-11-07', status: 'overdue', items: 7 },
  { id: 'INV-2024-050', customer: 'Rania Fawzy', amount: '$610.00', dueDate: '2024-12-28', issueDate: '2024-11-28', status: 'paid', items: 2 },
  { id: 'INV-2024-051', customer: 'Amr Shoukry', amount: '$1,980.00', dueDate: '2024-12-16', issueDate: '2024-11-16', status: 'paid', items: 9 },
  { id: 'INV-2024-052', customer: 'Nada El-Sayed', amount: '$1,140.00', dueDate: '2024-12-14', issueDate: '2024-11-14', status: 'pending', items: 4 },
  { id: 'INV-2024-053', customer: 'Hassan Reda', amount: '$2,320.00', dueDate: '2024-12-11', issueDate: '2024-11-11', status: 'overdue', items: 10 },
  { id: 'INV-2024-054', customer: 'Yasmin Lotfy', amount: '$730.00', dueDate: '2024-12-24', issueDate: '2024-11-24', status: 'paid', items: 3 },
  { id: 'INV-2024-055', customer: 'Karim Adel', amount: '$1,560.00', dueDate: '2024-12-19', issueDate: '2024-11-19', status: 'pending', items: 6 },
  { id: 'INV-2024-056', customer: 'Mona Saber', amount: '$940.00', dueDate: '2024-12-04', issueDate: '2024-11-04', status: 'cancelled', items: 4 },
  { id: 'INV-2024-057', customer: 'Omar Youssef', amount: '$2,110.00', dueDate: '2024-12-13', issueDate: '2024-11-13', status: 'paid', items: 8 },
  { id: 'INV-2024-058', customer: 'Soha Badr', amount: '$870.00', dueDate: '2024-12-22', issueDate: '2024-11-22', status: 'pending', items: 3 },
  { id: 'INV-2024-059', customer: 'Mahmoud Ashraf', amount: '$1,990.00', dueDate: '2024-12-09', issueDate: '2024-11-09', status: 'overdue', items: 9 },
  { id: 'INV-2024-060', customer: 'Reem Gamal', amount: '$650.00', dueDate: '2024-12-29', issueDate: '2024-11-29', status: 'paid', items: 2 },
  { id: 'INV-2024-061', customer: 'Ahmed Hassan', amount: '$1,250.00', dueDate: '2024-12-15', issueDate: '2024-11-15', status: 'paid', items: 5 },
  { id: 'INV-2024-062', customer: 'Fatima Ali', amount: '$890.00', dueDate: '2024-12-20', issueDate: '2024-11-20', status: 'pending', items: 3 },
  { id: 'INV-2024-063', customer: 'Mohamed Saeed', amount: '$2,100.00', dueDate: '2024-12-10', issueDate: '2024-11-10', status: 'overdue', items: 8 },
  { id: 'INV-2024-064', customer: 'Sara Ibrahim', amount: '$450.00', dueDate: '2024-12-25', issueDate: '2024-11-25', status: 'paid', items: 2 },
  { id: 'INV-2024-065', customer: 'Omar Khalil', amount: '$1,670.00', dueDate: '2024-12-18', issueDate: '2024-11-18', status: 'pending', items: 6 },
  { id: 'INV-2024-066', customer: 'Layla Ahmed', amount: '$980.00', dueDate: '2024-12-05', issueDate: '2024-11-05', status: 'cancelled', items: 4 },
  { id: 'INV-2024-067', customer: 'Khalid Mansour', amount: '$1,320.00', dueDate: '2024-12-22', issueDate: '2024-11-22', status: 'paid', items: 7 },
  { id: 'INV-2024-068', customer: 'Noura Al-Zahra', amount: '$760.00', dueDate: '2024-12-19', issueDate: '2024-11-19', status: 'pending', items: 3 },
  { id: 'INV-2024-069', customer: 'Youssef Hamdi', amount: '$1,980.00', dueDate: '2024-12-08', issueDate: '2024-11-08', status: 'overdue', items: 9 },
  { id: 'INV-2024-070', customer: 'Mariam Fadel', amount: '$540.00', dueDate: '2024-12-27', issueDate: '2024-11-27', status: 'paid', items: 2 },
  { id: 'INV-2024-071', customer: 'Tariq Nasser', amount: '$2,450.00', dueDate: '2024-12-13', issueDate: '2024-11-13', status: 'paid', items: 10 },
  { id: 'INV-2024-072', customer: 'Hala Samir', amount: '$1,120.00', dueDate: '2024-12-21', issueDate: '2024-11-21', status: 'pending', items: 4 },
  { id: 'INV-2024-073', customer: 'Bassem Farid', amount: '$3,050.00', dueDate: '2024-12-06', issueDate: '2024-11-06', status: 'overdue', items: 12 },
  { id: 'INV-2024-074', customer: 'Dina Magdy', amount: '$670.00', dueDate: '2024-12-26', issueDate: '2024-11-26', status: 'paid', items: 3 },
  { id: 'INV-2024-075', customer: 'Rami Tawfik', amount: '$1,490.00', dueDate: '2024-12-17', issueDate: '2024-11-17', status: 'pending', items: 5 },
  { id: 'INV-2024-076', customer: 'Salma Karim', amount: '$860.00', dueDate: '2024-12-09', issueDate: '2024-11-09', status: 'cancelled', items: 4 },
  { id: 'INV-2024-077', customer: 'Waleed Osman', amount: '$2,780.00', dueDate: '2024-12-12', issueDate: '2024-11-12', status: 'paid', items: 11 },
  { id: 'INV-2024-078', customer: 'Lina Haddad', amount: '$990.00', dueDate: '2024-12-23', issueDate: '2024-11-23', status: 'pending', items: 3 },
  { id: 'INV-2024-079', customer: 'Ziad Malek', amount: '$1,730.00', dueDate: '2024-12-07', issueDate: '2024-11-07', status: 'overdue', items: 7 },
  { id: 'INV-2024-080', customer: 'Rania Fawzy', amount: '$610.00', dueDate: '2024-12-28', issueDate: '2024-11-28', status: 'paid', items: 2 },
  { id: 'INV-2024-081', customer: 'Amr Shoukry', amount: '$1,980.00', dueDate: '2024-12-16', issueDate: '2024-11-16', status: 'paid', items: 9 },
  { id: 'INV-2024-082', customer: 'Nada El-Sayed', amount: '$1,140.00', dueDate: '2024-12-14', issueDate: '2024-11-14', status: 'pending', items: 4 },
  { id: 'INV-2024-083', customer: 'Hassan Reda', amount: '$2,320.00', dueDate: '2024-12-11', issueDate: '2024-11-11', status: 'overdue', items: 10 },
  { id: 'INV-2024-084', customer: 'Yasmin Lotfy', amount: '$730.00', dueDate: '2024-12-24', issueDate: '2024-11-24', status: 'paid', items: 3 },
  { id: 'INV-2024-085', customer: 'Karim Adel', amount: '$1,560.00', dueDate: '2024-12-19', issueDate: '2024-11-19', status: 'pending', items: 6 },
  { id: 'INV-2024-086', customer: 'Mona Saber', amount: '$940.00', dueDate: '2024-12-04', issueDate: '2024-11-04', status: 'cancelled', items: 4 },
  { id: 'INV-2024-087', customer: 'Omar Youssef', amount: '$2,110.00', dueDate: '2024-12-13', issueDate: '2024-11-13', status: 'paid', items: 8 },
  { id: 'INV-2024-088', customer: 'Soha Badr', amount: '$870.00', dueDate: '2024-12-22', issueDate: '2024-11-22', status: 'pending', items: 3 },
  { id: 'INV-2024-089', customer: 'Mahmoud Ashraf', amount: '$1,990.00', dueDate: '2024-12-09', issueDate: '2024-11-09', status: 'overdue', items: 9 },
  { id: 'INV-2024-090', customer: 'Reem Gamal', amount: '$650.00', dueDate: '2024-12-29', issueDate: '2024-11-29', status: 'paid', items: 2 },
  { id: 'INV-2024-091', customer: 'Ahmed Hassan', amount: '$1,250.00', dueDate: '2024-12-15', issueDate: '2024-11-15', status: 'paid', items: 5 },
  { id: 'INV-2024-092', customer: 'Fatima Ali', amount: '$890.00', dueDate: '2024-12-20', issueDate: '2024-11-20', status: 'pending', items: 3 },
  { id: 'INV-2024-093', customer: 'Mohamed Saeed', amount: '$2,100.00', dueDate: '2024-12-10', issueDate: '2024-11-10', status: 'overdue', items: 8 },
  { id: 'INV-2024-094', customer: 'Sara Ibrahim', amount: '$450.00', dueDate: '2024-12-25', issueDate: '2024-11-25', status: 'paid', items: 2 },
  { id: 'INV-2024-095', customer: 'Omar Khalil', amount: '$1,670.00', dueDate: '2024-12-18', issueDate: '2024-11-18', status: 'pending', items: 6 },
  { id: 'INV-2024-096', customer: 'Layla Ahmed', amount: '$980.00', dueDate: '2024-12-05', issueDate: '2024-11-05', status: 'cancelled', items: 4 },
  { id: 'INV-2024-097', customer: 'Khalid Mansour', amount: '$1,320.00', dueDate: '2024-12-22', issueDate: '2024-11-22', status: 'paid', items: 7 },
  { id: 'INV-2024-098', customer: 'Noura Al-Zahra', amount: '$760.00', dueDate: '2024-12-19', issueDate: '2024-11-19', status: 'pending', items: 3 },
  { id: 'INV-2024-099', customer: 'Youssef Hamdi', amount: '$1,980.00', dueDate: '2024-12-08', issueDate: '2024-11-08', status: 'overdue', items: 9 },
  { id: 'INV-2024-100', customer: 'Mariam Fadel', amount: '$540.00', dueDate: '2024-12-27', issueDate: '2024-11-27', status: 'paid', items: 2 },
];

// Custom Tailwind classes for dark glassmorphism effect (simulated)
// Note: global classes like glass-table-header / glass-table-row are defined in CSS and reused here
const glassStatCard = "bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg";
const glassContainerOuter = "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl";
const glassInput = "bg-white/10 border border-white/30 text-white placeholder-white/60 focus:ring-white/30";

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

export function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 10;
  const { toasts, push } = useToasts();
  const [invoiceType, setInvoiceType] = useState<'customer' | 'supplier'>('customer');
  const [selectedInvoice, setSelectedInvoice] = useState<typeof mockInvoices[0] | null>(null);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<typeof mockInvoices[0] | null>(null);
  const [isEditInvoiceModalOpen, setIsEditInvoiceModalOpen] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState<typeof mockInvoices[0] | null>(null);
  const [isDownloadInvoiceModalOpen, setIsDownloadInvoiceModalOpen] = useState(false);
  const [invoiceToDownload, setInvoiceToDownload] = useState<typeof mockInvoices[0] | null>(null);
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    customer: '',
    amount: '',
    issueDate: '',
    dueDate: '',
    status: 'pending' as InvoiceStatus,
    items: '',
  });
  const [editInvoiceForm, setEditInvoiceForm] = useState({
    customer: '',
    amount: '',
    issueDate: '',
    dueDate: '',
    status: 'pending' as InvoiceStatus,
    items: '',
  });
  const statusFilterOptions = [
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
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
    setNewInvoiceForm({ ...newInvoiceForm, amount: formatted });
  };

  const handleAmountBlur = () => {
    const num = parseAmount(newInvoiceForm.amount);
    if (num > 0) {
      setNewInvoiceForm({ 
        ...newInvoiceForm, 
        amount: num.toFixed(2) 
      });
    } else {
      setNewInvoiceForm({ ...newInvoiceForm, amount: '' });
    }
  };

  const formatInteger = (value: string): string => {
    // Remove all non-digit characters
    return value.replace(/\D/g, '');
  };

  const handleItemsChange = (value: string) => {
    const formatted = formatInteger(value);
    setNewInvoiceForm({ ...newInvoiceForm, items: formatted });
  };

  const handleItemsBlur = () => {
    const num = parseInt(newInvoiceForm.items) || 0;
    if (num < 1) {
      setNewInvoiceForm({ ...newInvoiceForm, items: '' });
    } else {
      setNewInvoiceForm({ ...newInvoiceForm, items: String(num) });
    }
  };

  const handleEditAmountChange = (value: string) => {
    const formatted = formatAmount(value);
    setEditInvoiceForm({ ...editInvoiceForm, amount: formatted });
  };

  const handleEditAmountBlur = () => {
    const num = parseAmount(editInvoiceForm.amount);
    if (num > 0) {
      setEditInvoiceForm({
        ...editInvoiceForm,
        amount: num.toFixed(2),
      });
    } else {
      setEditInvoiceForm({ ...editInvoiceForm, amount: '' });
    }
  };

  const handleEditItemsChange = (value: string) => {
    const formatted = formatInteger(value);
    setEditInvoiceForm({ ...editInvoiceForm, items: formatted });
  };

  const handleEditItemsBlur = () => {
    const num = parseInt(editInvoiceForm.items) || 0;
    if (num < 1) {
      setEditInvoiceForm({ ...editInvoiceForm, items: '' });
    } else {
      setEditInvoiceForm({ ...editInvoiceForm, items: String(num) });
    }
  };

  // تحديث دالة الألوان لاستخدام نمط Glassmorphism الداكن
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'overdue': return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'cancelled': return 'bg-white/10 text-white/70 border-white/20';
      default: return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination calculation (10 invoices per page)
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
  const startIndex = (currentPage - 1) * invoicesPerPage;
  const endIndex = startIndex + invoicesPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  // Smart pagination: Calculate which page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);

    if (currentPage <= 3) {
      // Near the beginning: show 1, 2, 3, 4, ..., last
      for (let i = 2; i <= 4; i++) {
        if (i <= totalPages) pages.push(i);
      }
      if (totalPages > 5) {
        pages.push('...');
        pages.push(totalPages);
      }
    } else if (currentPage >= totalPages - 2) {
      // Near the end: show 1, ..., last-3, last-2, last-1, last
      if (totalPages > 5) {
        pages.push('...');
      }
      for (let i = totalPages - 3; i <= totalPages; i++) {
        if (i > 1) pages.push(i);
      }
    } else {
      // In the middle: show 1, ..., current-1, current, current+1, ..., last
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

  // Helper function to parse amount string to number
  const parseAmountValue = (amountStr: string): number => {
    return parseFloat(amountStr.replace(/[$,]/g, '')) || 0;
  };

  // حساب الإحصائيات المحدثة بناءً على البيانات الفعلية
  const totalActiveInvoices = invoices.filter(inv => inv.status !== 'cancelled').length;
  const paidRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + parseAmountValue(inv.amount), 0);
  const pendingRevenue = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + parseAmountValue(inv.amount), 0);
  const overdueRevenue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + parseAmountValue(inv.amount), 0);
  
  const paidRevenueFormatted = `$${paidRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const pendingRevenueFormatted = pendingRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const overdueRevenueFormatted = overdueRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  
  const handleViewInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
    }
  };

  const handleEditInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;
    setInvoiceToEdit(invoice);
    setEditInvoiceForm({
      customer: invoice.customer,
      amount: parseAmount(invoice.amount).toFixed(2),
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status as InvoiceStatus,
      items: String(invoice.items),
    });
    setIsEditInvoiceModalOpen(true);
  };

  const handleCloseInvoiceModal = () => {
    setSelectedInvoice(null);
  };

  const handleOpenNewInvoiceModal = () => {
    setIsNewInvoiceModalOpen(true);
    // Set default values
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 30);
    
    setNewInvoiceForm({
      customer: '',
      amount: '',
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'pending',
      items: '',
    });
  };

  const handleCloseNewInvoiceModal = () => {
    setIsNewInvoiceModalOpen(false);
    setNewInvoiceForm({
      customer: '',
      amount: '',
      issueDate: '',
      dueDate: '',
      status: 'pending',
      items: '',
    });
  };

  const handleCloseEditInvoiceModal = () => {
    setIsEditInvoiceModalOpen(false);
    setInvoiceToEdit(null);
    setEditInvoiceForm({
      customer: '',
      amount: '',
      issueDate: '',
      dueDate: '',
      status: 'pending',
      items: '',
    });
  };

  const handleSubmitNewInvoice = () => {
    // Validation
    if (!newInvoiceForm.customer || !newInvoiceForm.amount || !newInvoiceForm.issueDate || !newInvoiceForm.dueDate || !newInvoiceForm.items) {
      push({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    // Generate new invoice ID
    const lastInvoice = invoices[invoices.length - 1];
    const lastNumber = parseInt(lastInvoice.id.split('-')[2]);
    const newId = `INV-2024-${String(lastNumber + 1).padStart(3, '0')}`;

    // Format amount using helper function
    const amountValue = parseAmount(newInvoiceForm.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      push({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }
    const formattedAmount = `$${amountValue.toFixed(2)}`;

    // Parse items using helper
    const itemsValue = parseInt(newInvoiceForm.items) || 1;
    if (itemsValue < 1) {
      push({ type: 'error', text: 'Please enter a valid number of items' });
      return;
    }

    // Create new invoice
    const newInvoice = {
      id: newId,
      customer: newInvoiceForm.customer,
      amount: formattedAmount,
      issueDate: newInvoiceForm.issueDate,
      dueDate: newInvoiceForm.dueDate,
      status: newInvoiceForm.status,
      items: itemsValue,
    };

    // Add to invoices list (at the end)
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    
    // Calculate new total pages after adding the invoice
    const filteredAfterAdd = updatedInvoices.filter(invoice => {
      const matchesSearch = invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
    
    const newTotalPages = Math.ceil(filteredAfterAdd.length / invoicesPerPage);
    
    // If new invoice requires a new page, navigate to the last page
    if (newTotalPages > totalPages) {
      setCurrentPage(newTotalPages);
    }
    
    push({ type: 'success', text: `Invoice ${newId} created successfully` });
    handleCloseNewInvoiceModal();
  };

  const handleSubmitEditInvoice = () => {
    if (!invoiceToEdit) return;
    if (
      !editInvoiceForm.customer ||
      !editInvoiceForm.amount ||
      !editInvoiceForm.issueDate ||
      !editInvoiceForm.dueDate ||
      !editInvoiceForm.items
    ) {
      push({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    const amountValue = parseAmount(editInvoiceForm.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      push({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    const itemsValue = parseInt(editInvoiceForm.items) || 1;
    if (itemsValue < 1) {
      push({ type: 'error', text: 'Please enter a valid number of items' });
      return;
    }

    const updatedInvoice = {
      ...invoiceToEdit,
      customer: editInvoiceForm.customer,
      amount: `$${amountValue.toFixed(2)}`,
      issueDate: editInvoiceForm.issueDate,
      dueDate: editInvoiceForm.dueDate,
      status: editInvoiceForm.status,
      items: itemsValue,
    };

    const updatedInvoices = invoices.map((inv) =>
      inv.id === invoiceToEdit.id ? updatedInvoice : inv,
    );
    setInvoices(updatedInvoices);
    push({ type: 'success', text: `Invoice ${invoiceToEdit.id} updated successfully` });
    handleCloseEditInvoiceModal();
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setInvoiceToDelete(invoice);
    }
  };

  const handleConfirmDelete = () => {
    if (!invoiceToDelete) return;
    
    const invoiceId = invoiceToDelete.id;
    
    // Remove invoice from list
    const updatedInvoices = invoices.filter(inv => inv.id !== invoiceId);
    setInvoices(updatedInvoices);
    
    // Recalculate pagination
    const filteredAfterDelete = updatedInvoices.filter(invoice => {
      const matchesSearch = invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
    
    const newTotalPages = Math.ceil(filteredAfterDelete.length / invoicesPerPage);
    
    // If current page is empty after deletion, go to previous page
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
    }
    
    push({ type: 'success', text: `Invoice ${invoiceId} deleted successfully` });
    setInvoiceToDelete(null);
  };

  const handleCancelDelete = () => {
    setInvoiceToDelete(null);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return;
    setInvoiceToDownload(invoice);
    setIsDownloadInvoiceModalOpen(true);
  };

  const handleCloseDownloadInvoiceModal = () => {
    setIsDownloadInvoiceModalOpen(false);
    setInvoiceToDownload(null);
  };

  const downloadInvoiceExcel = (invoice: typeof mockInvoices[0]) => {
    const rows = [
      ["Invoice ID", "Customer", "Amount", "Issue Date", "Due Date", "Status", "Items"],
      [invoice.id, invoice.customer, invoice.amount, invoice.issueDate, invoice.dueDate, invoice.status, String(invoice.items)],
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    push({ type: "success", text: `Invoice ${invoice.id} downloaded successfully` });
  };

  const downloadInvoiceWord = (invoice: typeof mockInvoices[0]) => {
    const content = [
      `Invoice ID: ${invoice.id}`,
      `Customer: ${invoice.customer}`,
      `Amount: ${invoice.amount}`,
      `Issue Date: ${invoice.issueDate}`,
      `Due Date: ${invoice.dueDate}`,
      `Status: ${invoice.status}`,
      `Items: ${invoice.items}`,
    ].join("\n");
    const blob = new Blob([content], { type: "application/msword;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.id}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    push({ type: "success", text: `Invoice ${invoice.id} downloaded successfully` });
  };

  const downloadInvoicePdf = async (invoice: typeof mockInvoices[0]) => {
    push({ type: 'info', text: `Preparing PDF for invoice ${invoice.id}...` });
    try {
      // Dynamically import jsPDF
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const subtotal = parseFloat(invoice.amount.replace('$', '').replace(',', ''));
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
      doc.text('INVOICE', 20, 27);

      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(invoice.id, 20, 45);
      doc.setDrawColor(...lightGray);
      doc.setLineWidth(0.5);
      doc.line(20, 50, 190, 50);

      const details = [
        ['Customer', invoice.customer],
        ['Amount', invoice.amount],
        ['Issue Date', formatDate(invoice.issueDate)],
        ['Due Date', formatDate(invoice.dueDate)],
        ['Status', invoice.status],
        ['Items', String(invoice.items)],
        ['Subtotal', invoice.amount],
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
      doc.save(`${invoice.id}.pdf`);
      push({ type: 'success', text: `Invoice ${invoice.id} downloaded successfully` });
    } catch (error) {
      console.error('Error generating PDF:', error);
      push({ type: 'error', text: `Failed to generate PDF for invoice ${invoice.id}` });
    }
  };

  const handleConfirmDownloadInvoice = async (format: 'excel' | 'pdf' | 'word') => {
    if (!invoiceToDownload) return;
    if (format === 'excel') {
      downloadInvoiceExcel(invoiceToDownload);
    } else if (format === 'word') {
      downloadInvoiceWord(invoiceToDownload);
    } else {
      await downloadInvoicePdf(invoiceToDownload);
    }
    handleCloseDownloadInvoiceModal();
  };

  return (
    <div>
      {/* Invoice Details Modal */}
      {selectedInvoice && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99998] p-4"
          onClick={handleCloseInvoiceModal}
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
                  <h2 className="text-lg font-semibold text-white">Invoice Details</h2>
                  <p className="text-sm text-white/50 truncate max-w-[250px]">{selectedInvoice.id}</p>
                </div>
              </div>
              <button
                onClick={handleCloseInvoiceModal}
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
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm leading-relaxed">
                    <span className="font-semibold">Customer:</span> {selectedInvoice.customer}<br />
                    <span className="font-semibold">Amount:</span> <span className="text-green-400">{selectedInvoice.amount}</span><br />
                    <span className="font-semibold">Status:</span> <span className={`${getStatusColor(selectedInvoice.status).split(' ')[1]}`}>{selectedInvoice.status}</span><br />
                    <span className="font-semibold">Issue Date:</span> {selectedInvoice.issueDate}<br />
                    <span className="font-semibold">Due Date:</span> {selectedInvoice.dueDate}<br />
                    <span className="font-semibold">Items:</span> {selectedInvoice.items} items
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-white/10">
              <button
                onClick={handleCloseInvoiceModal}
                className="px-4 py-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* New Invoice Modal */}
      {isNewInvoiceModalOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          style={{ zIndex: 2000000 }}
          onClick={handleCloseNewInvoiceModal}
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
                  <CreditCard className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Create New Invoice</h2>
                  <p className="text-sm text-white/50">Fill in the invoice details</p>
                </div>
              </div>
              <button
                onClick={handleCloseNewInvoiceModal}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-4">
                {/* Customer Name and Status Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={newInvoiceForm.customer}
                      onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, customer: e.target.value })}
                      placeholder="Enter customer name"
                      className="w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Status
                    </label>
                    <CustomSelect
                      value={newInvoiceForm.status}
                      onChange={(value) => setNewInvoiceForm({ ...newInvoiceForm, status: value as typeof newInvoiceForm.status })}
                      options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'paid', label: 'Paid' },
                        { value: 'overdue', label: 'Overdue' },
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
                        value={newInvoiceForm.amount}
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
                    {newInvoiceForm.amount && parseAmount(newInvoiceForm.amount) > 0 && (
                      <p className="text-xs text-white/50 mt-2 pl-4">
                        {formatAmountDisplay(newInvoiceForm.amount)} USD
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Number of Items
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={newInvoiceForm.items}
                      onChange={(e) => handleItemsChange(e.target.value)}
                      onBlur={handleItemsBlur}
                      placeholder="Enter quantity"
                      className="w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                    />
                    {newInvoiceForm.items && parseInt(newInvoiceForm.items) > 0 && (
                      <p className="text-xs text-white/50 mt-2 pl-4">
                        {parseInt(newInvoiceForm.items).toLocaleString()} item{parseInt(newInvoiceForm.items) !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Issue Date and Due Date Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Issue Date
                    </label>
                    <DatePicker
                      value={newInvoiceForm.issueDate}
                      onChange={(value) => setNewInvoiceForm({ ...newInvoiceForm, issueDate: value })}
                      placeholder="Select issue date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Due Date
                    </label>
                    <DatePicker
                      value={newInvoiceForm.dueDate}
                      onChange={(value) => setNewInvoiceForm({ ...newInvoiceForm, dueDate: value })}
                      placeholder="Select due date"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <button
                onClick={handleCloseNewInvoiceModal}
                className="px-4 py-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNewInvoice}
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
                Create Invoice
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Invoice Modal */}
      {isEditInvoiceModalOpen && invoiceToEdit && createPortal(
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          style={{ zIndex: 2000000 }}
          onClick={handleCloseEditInvoiceModal}
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
                  <h2 className="text-lg font-semibold text-white">Edit Invoice</h2>
                  <p className="text-sm text-white/50">{invoiceToEdit.id}</p>
                </div>
              </div>
              <button
                onClick={handleCloseEditInvoiceModal}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={editInvoiceForm.customer}
                      onChange={(e) =>
                        setEditInvoiceForm({ ...editInvoiceForm, customer: e.target.value })
                      }
                      placeholder="Enter customer name"
                      className="w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Status
                    </label>
                    <CustomSelect
                      value={editInvoiceForm.status}
                      onChange={(value) =>
                        setEditInvoiceForm({
                          ...editInvoiceForm,
                          status: value as typeof editInvoiceForm.status,
                        })
                      }
                      options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'paid', label: 'Paid' },
                        { value: 'overdue', label: 'Overdue' },
                        { value: 'cancelled', label: 'Cancelled' },
                      ]}
                      placeholder="Select status"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={editInvoiceForm.amount}
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
                    {editInvoiceForm.amount &&
                      parseAmount(editInvoiceForm.amount) > 0 && (
                        <p className="text-xs text-white/50 mt-2 pl-4">
                          {formatAmountDisplay(editInvoiceForm.amount)} USD
                        </p>
                      )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Number of Items
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editInvoiceForm.items}
                      onChange={(e) => handleEditItemsChange(e.target.value)}
                      onBlur={handleEditItemsBlur}
                      placeholder="Enter quantity"
                      className="w-full px-4 py-2.5 rounded-lg text-white placeholder-white/50 focus:outline-none text-sm transition-all duration-200 glass-input"
                    />
                    {editInvoiceForm.items && parseInt(editInvoiceForm.items) > 0 && (
                      <p className="text-xs text-white/50 mt-2 pl-4">
                        {parseInt(editInvoiceForm.items).toLocaleString()} item
                        {parseInt(editInvoiceForm.items) !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Issue Date
                    </label>
                    <DatePicker
                      value={editInvoiceForm.issueDate}
                      onChange={(value) =>
                        setEditInvoiceForm({ ...editInvoiceForm, issueDate: value })
                      }
                      placeholder="Select issue date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Due Date
                    </label>
                    <DatePicker
                      value={editInvoiceForm.dueDate}
                      onChange={(value) =>
                        setEditInvoiceForm({ ...editInvoiceForm, dueDate: value })
                      }
                      placeholder="Select due date"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <button
                onClick={handleCloseEditInvoiceModal}
                className="px-4 py-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEditInvoice}
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

      {/* Download Invoice Modal */}
      {isDownloadInvoiceModalOpen && invoiceToDownload && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99998] p-4"
          onClick={handleCloseDownloadInvoiceModal}
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
                    boxShadow:
                      "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <Download className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Download Invoice</h2>
                  <p className="text-sm text-white/50">{invoiceToDownload.id}</p>
                </div>
              </div>
              <button
                onClick={handleCloseDownloadInvoiceModal}
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
                    onClick={() => handleConfirmDownloadInvoice("excel")}
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
                    onClick={() => handleConfirmDownloadInvoice("pdf")}
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
      {invoiceToDelete && createPortal(
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
            {/* Header - same layout as other modals (icon + title on left, X on right) */}
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
                  <h2 className="text-lg font-semibold text-white">Delete Invoice</h2>
                  <p className="text-sm text-white/50 truncate max-w-[250px]">
                    {invoiceToDelete.id}
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
                  Are you sure you want to delete this invoice? This action cannot be undone.
                </p>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60 text-sm">Invoice ID:</span>
                      <span className="text-white font-medium">{invoiceToDelete.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60 text-sm">Customer:</span>
                      <span className="text-white font-medium">{invoiceToDelete.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60 text-sm">Amount:</span>
                      <span className="text-green-400 font-semibold">{invoiceToDelete.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60 text-sm">Status:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(invoiceToDelete.status)}`}>
                        {getStatusIcon(invoiceToDelete.status)}
                        {invoiceToDelete.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Cancel on far left, Delete Invoice on far right */}
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
                Delete Invoice
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
          <div 
            key={t.id} 
            role="alert" 
            className={`w-full sm:w-80 p-4 rounded-lg shadow-2xl flex items-center gap-3 border transition-all duration-300 glass-stat-card ${
              t.type === "success" 
                ? "bg-green-500/20 border-green-400/30 text-green-300" 
                : t.type === "error" 
                ? "bg-red-500/20 border-red-400/30 text-red-300" 
                : "bg-blue-500/20 border-blue-400/30 text-blue-300"
            }`}
            style={{ zIndex: 100001 }}
          >
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
                <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Invoices & Billing
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                    Generate invoices, track payments, and manage receivables
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1 px-1 py-1 rounded-xl bg-white/5 border border-white/15">
                  <button
                    onClick={() => setInvoiceType('customer')}
                    className={`px-3 py-1.5 text-xs rounded-lg ${
                      invoiceType === 'customer'
                        ? 'glass-content-inner text-white'
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    onClick={() => setInvoiceType('supplier')}
                    className={`px-3 py-1.5 text-xs rounded-lg ${
                      invoiceType === 'supplier'
                        ? 'glass-content-inner text-white'
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Supplier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`${glassStatCard} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-400/30">
              <CreditCard className="w-6 h-6 text-blue-300" />
            </div>
            <span className="text-sm text-blue-300 font-medium">Active</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Total Invoices</p>
          <p className="text-white text-2xl">{totalActiveInvoices}</p>
        </div>

        <div className={`${glassStatCard} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-400/30">
              <CheckCircle className="w-6 h-6 text-green-300" />
            </div>
            <span className="text-sm text-green-300 font-medium">Collected</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Paid Revenue</p>
          <p className="text-white text-2xl">{paidRevenueFormatted}</p>
        </div>

        <div className={`${glassStatCard} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-400/30">
              <Clock className="w-6 h-6 text-yellow-300" />
            </div>
            <span className="text-sm text-yellow-300 font-medium">Awaiting</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Pending Amount</p>
          <p className="text-white text-2xl">${pendingRevenueFormatted}</p>
        </div>

        <div className={`${glassStatCard} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-400/30">
              <AlertCircle className="w-6 h-6 text-red-300" />
            </div>
            <span className="text-sm text-red-300 font-medium">Follow Up</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Overdue Amount</p>
          <p className="text-white text-2xl">${overdueRevenueFormatted}</p>
        </div>
      </div>

      {/* Invoices Table - Glassmorphism Applied */}
      <div className={`${glassContainerOuter} rounded-xl`}>
        {/* Table Header Actions */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search invoices by customer or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${glassInput}`}
                />
              </div>
            </div>
            
            {/* Status filter + New Invoice actions - styled like Employees controls */}
            <div
              className="flex gap-3 items-center justify-between p-4 rounded-xl"
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
                onClick={handleOpenNewInvoiceModal}
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
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span>New Invoice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {paginatedInvoices.map((invoice) => (
                <tr key={invoice.id} className="glass-table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleViewInvoice(invoice.id)}
                      className="text-blue-400 font-medium hover:text-blue-200 transition-colors"
                      title="View invoice details"
                    >
                      {invoice.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500/50 to-indigo-600/50 rounded-full flex items-center justify-center text-white text-sm border border-white/20">
                        {invoice.customer.charAt(0)}
                      </div>
                      <span className="text-white">{invoice.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-400 font-semibold">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/80">
                    {invoice.issueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/80">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${getStatusColor(invoice.status)} capitalize backdrop-blur-sm font-medium`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditInvoice(invoice.id)}
                        className="p-2 text-white/70 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/30 group"
                        title="Edit invoice"
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
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="p-2 text-white/70 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/30 group"
                        title="Download invoice PDF"
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
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="p-2 text-white/70 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-red-400/30 group"
                        title="Delete invoice"
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

        {/* Pagination - styled & interactive like Employees section */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-sm text-white/70">
            Showing{" "}
            <span className="text-white">
              {filteredInvoices.length === 0 ? 0 : startIndex + 1}
            </span>
            -
            <span className="text-white">
              {Math.min(endIndex, filteredInvoices.length)}
            </span>{" "}
            of <span className="text-white">{filteredInvoices.length}</span> invoices
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