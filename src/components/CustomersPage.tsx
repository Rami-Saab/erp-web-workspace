import React, { useState, useCallback } from 'react';
import {
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Star,
  Users,
  UserCheck,
  UserPlus,
  Crown,
  Building2,
  User,
  CreditCard,
  Clock,
  FileText,
  Activity,
  Upload,
  Download,
  X,
  Tag,
  Check,
  Trash2,
} from 'lucide-react';
import { CustomSelect } from './ui/CustomSelect';
import { exportToCSV } from '../utils/csvExport';
import { toast } from 'sonner';

type CustomerType = 'company' | 'individual';
type CustomerStatus = 'active' | 'vip' | 'new';
type CustomerSegment = 'Retail' | 'VIP' | 'Wholesale';

interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  segment: CustomerSegment;
  email: string;
  phone: string;
  location: string;
  orders: number;
  totalSpent: string;
  rating: number;
  status: CustomerStatus;
  creditLimit: string;
  paymentTerms: string;
  tags?: string[];
}
const mockCustomers: Customer[] = [
  {
    id: 'CUS-001',
    name: 'Ahmed Hassan',
    type: 'company',
    segment: 'Retail',
    email: 'ahmed.hassan@email.com',
    phone: '+966 50 123 4567',
    location: 'Riyadh, SA',
    orders: 24,
    totalSpent: '$5,670',
    rating: 4.8,
    status: 'active',
    creditLimit: '$10,000',
    paymentTerms: 'Net 30',
    tags: ['High Value', 'Regular'],
  },
  {
    id: 'CUS-002',
    name: 'Fatima Ali',
    type: 'individual',
    segment: 'Retail',
    email: 'fatima.ali@email.com',
    phone: '+966 55 234 5678',
    location: 'Jeddah, SA',
    orders: 18,
    totalSpent: '$3,240',
    rating: 4.5,
    status: 'active',
    creditLimit: '$5,000',
    paymentTerms: 'Cash',
    tags: ['New Customer'],
  },
  {
    id: 'CUS-003',
    name: 'Mohamed Saeed',
    type: 'company',
    segment: 'VIP',
    email: 'mohamed.s@email.com',
    phone: '+966 50 345 6789',
    location: 'Dammam, SA',
    orders: 42,
    totalSpent: '$9,890',
    rating: 5.0,
    status: 'vip',
    creditLimit: '$25,000',
    paymentTerms: 'Net 45',
    tags: ['VIP', 'Strategic', 'High Volume'],
  },
  {
    id: 'CUS-004',
    name: 'Sara Ibrahim',
    type: 'individual',
    segment: 'Retail',
    email: 'sara.ibrahim@email.com',
    phone: '+966 54 456 7890',
    location: 'Riyadh, SA',
    orders: 12,
    totalSpent: '$2,150',
    rating: 4.2,
    status: 'active',
    creditLimit: '$4,000',
    paymentTerms: 'Net 15',
    tags: ['Regular'],
  },
  {
    id: 'CUS-005',
    name: 'Omar Khalil',
    type: 'company',
    segment: 'Wholesale',
    email: 'omar.khalil@email.com',
    phone: '+966 56 567 8901',
    location: 'Jeddah, SA',
    orders: 8,
    totalSpent: '$1,890',
    rating: 4.6,
    status: 'active',
    creditLimit: '$12,000',
    paymentTerms: 'Net 30',
    tags: ['Wholesale', 'Bulk Buyer'],
  },
  {
    id: 'CUS-006',
    name: 'Layla Ahmed',
    type: 'individual',
    segment: 'Retail',
    email: 'layla.ahmed@email.com',
    phone: '+966 50 678 9012',
    location: 'Khobar, SA',
    orders: 3,
    totalSpent: '$670',
    rating: 3.8,
    status: 'new',
    creditLimit: '$2,000',
    paymentTerms: 'Cash',
    tags: ['New Customer'],
  },
  {
    id: 'CUS-007',
    name: 'Khaled Yousef',
    type: 'company',
    segment: 'VIP',
    email: 'khaled.y@email.com',
    phone: '+966 55 789 0123',
    location: 'Riyadh, SA',
    orders: 31,
    totalSpent: '$7,120',
    rating: 4.9,
    status: 'vip',
    creditLimit: '$30,000',
    paymentTerms: 'Net 60',
    tags: ['VIP', 'Strategic'],
  },
  {
    id: 'CUS-008',
    name: 'Nour Hassan',
    type: 'individual',
    segment: 'Retail',
    email: 'nour.hassan@email.com',
    phone: '+966 54 890 1234',
    location: 'Jeddah, SA',
    orders: 15,
    totalSpent: '$3,580',
    rating: 4.4,
    status: 'active',
    creditLimit: '$6,000',
    paymentTerms: 'Net 30',
    tags: ['Regular'],
  },
];

const mockActivityTimeline = [
  {
    id: 'ACT-001',
    type: 'order',
    title: 'Sales order SO-1024 created',
    detail: '5 items · Total SAR 4,250',
    timeAgo: '2 hours ago',
  },
  {
    id: 'ACT-002',
    type: 'invoice',
    title: 'Invoice INV-2024-014 issued',
    detail: 'Due in 30 days · Net 30 terms',
    timeAgo: 'Yesterday',
  },
  {
    id: 'ACT-003',
    type: 'call',
    title: 'Account review call completed',
    detail: 'Discussed credit limit increase and new pricing',
    timeAgo: '3 days ago',
  },
  {
    id: 'ACT-004',
    type: 'note',
    title: 'Internal note added',
    detail: 'Customer prefers email communication in the morning',
    timeAgo: 'Last week',
  },
];

const mockLinkedOrders = [
  { id: 'ORD-1024', date: '2024-12-01', amount: 'SAR 4,250', status: 'Completed' },
  { id: 'ORD-1018', date: '2024-11-22', amount: 'SAR 2,980', status: 'Shipped' },
  { id: 'ORD-1009', date: '2024-11-10', amount: 'SAR 1,540', status: 'Draft' },
];

const mockLinkedInvoices = [
  { id: 'INV-2024-014', date: '2024-11-25', amount: 'SAR 4,250', status: 'Paid' },
  { id: 'INV-2024-008', date: '2024-11-12', amount: 'SAR 2,980', status: 'Open' },
  { id: 'INV-2024-004', date: '2024-10-30', amount: 'SAR 1,540', status: 'Overdue' },
];

export function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<CustomerStatus | 'all'>('all');
  const [filterSegment, setFilterSegment] = useState<CustomerSegment | 'all'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'details' | 'finance' | 'activity' | 'tags'>(
    'overview',
  );
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip':
        return 'bg-purple-500/20 text-purple-200 border-purple-400/30';
      case 'active':
        return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 'new':
        return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
      default:
        return 'bg-white/15 text-white/80 border-white/20';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'VIP':
        return 'bg-purple-500/20 text-purple-200 border-purple-400/40';
      case 'Wholesale':
        return 'bg-amber-500/20 text-amber-200 border-amber-400/40';
      default:
        return 'bg-sky-500/20 text-sky-200 border-sky-400/40';
    }
  };

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    const matchesSegment = filterSegment === 'all' || customer.segment === filterSegment;
    return matchesSearch && matchesStatus && matchesSegment;
  });

  const totalCustomers = mockCustomers.length;
  const vipCustomers = mockCustomers.filter((c) => c.status === 'vip').length;
  const activeCustomers = mockCustomers.filter((c) => c.status === 'active').length;
  const newCustomers = mockCustomers.filter((c) => c.status === 'new').length;

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setActiveProfileTab('overview');
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) {
        newSet.delete(customerId);
      } else {
        newSet.add(customerId);
      }
      return newSet;
    });
  };

  const handleBulkExport = useCallback(() => {
    if (selectedCustomers.size === 0) {
      toast.error('No customers selected');
      return;
    }
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Location', 'Segment', 'Status', 'Orders', 'Total Spent', 'Rating', 'Credit Limit', 'Payment Terms', 'Tags'];
    const rows = mockCustomers
      .filter(c => selectedCustomers.has(c.id))
      .map(c => [
        c.id,
        c.name,
        c.email,
        c.phone,
        c.location,
        c.segment,
        c.status,
        String(c.orders),
        c.totalSpent,
        String(c.rating),
        c.creditLimit,
        c.paymentTerms,
        (c.tags || []).join(', '),
      ]);
    exportToCSV('customers_export', headers, rows);
    toast.success(`Exported ${selectedCustomers.size} customers`);
  }, [selectedCustomers]);

  const handleBulkDelete = useCallback(() => {
    if (selectedCustomers.size === 0) {
      toast.error('No customers selected');
      return;
    }
    toast.success(`Deleted ${selectedCustomers.size} customers (mock)`);
    setSelectedCustomers(new Set());
  }, [selectedCustomers]);

  const handleImportCSV = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    toast.success('Importing customers from CSV...');
    setImportModalOpen(false);
    // Mock import - in real implementation would parse CSV
    setTimeout(() => {
      toast.success('Successfully imported 5 customers');
    }, 1500);
  }, []);

  const handleAddTag = useCallback(() => {
    if (!newTag.trim() || !selectedCustomer) return;
    setSelectedCustomer({
      ...selectedCustomer,
      tags: [...(selectedCustomer.tags || []), newTag.trim()],
    });
    setNewTag('');
    toast.success('Tag added');
  }, [newTag, selectedCustomer]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    if (!selectedCustomer) return;
    setSelectedCustomer({
      ...selectedCustomer,
      tags: (selectedCustomer.tags || []).filter(t => t !== tagToRemove),
    });
    toast.success('Tag removed');
  }, [selectedCustomer]);

  const isDrawerOpen = !!selectedCustomer;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex items-center gap-3">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Customers
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                    Manage customer accounts, contacts, and purchase history
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
              <Users className="w-6 h-6 text-blue-300" />
            </div>
            <span className="text-sm text-blue-300 font-medium">All Time</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Total Customers</p>
          <p className="text-white text-2xl">{totalCustomers}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-400/30">
              <UserCheck className="w-6 h-6 text-green-300" />
            </div>
            <span className="text-sm text-green-300 font-medium">Engaged</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Active Customers</p>
          <p className="text-white text-2xl">{activeCustomers}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-400/30">
              <UserPlus className="w-6 h-6 text-yellow-300" />
            </div>
            <span className="text-sm text-yellow-300 font-medium">Recent</span>
          </div>
          <p className="text-white/70 text-sm mb-1">New This Month</p>
          <p className="text-white text-2xl">{newCustomers}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-400/30">
              <Crown className="w-6 h-6 text-purple-300" />
            </div>
            <span className="text-sm text-purple-300 font-medium">Premium</span>
          </div>
          <p className="text-white/70 text-sm mb-1">VIP Customers</p>
          <p className="text-white text-2xl">{vipCustomers}</p>
        </div>
      </div>

      {/* Customers Table + Profile Drawer Layout */}
      <div className="flex gap-6">
      {/* Customers Table */}
        <div className="glass-container-outer rounded-xl flex-1 min-w-0">
        {/* Table Header Actions */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 glass-input text-white placeholder-white/60 rounded-lg"
                />
              </div>
            </div>
            
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
                onChange={(value) => setFilterStatus(value as CustomerStatus | 'all')}
                options={[
                  { value: 'all', label: 'All Customers' },
                  { value: 'vip', label: 'VIP' },
                  { value: 'active', label: 'Active' },
                  { value: 'new', label: 'New' },
                ]}
                placeholder="All Customers"
                className="w-[140px]"
              />

              <CustomSelect
                value={filterSegment}
                onChange={(value) => setFilterSegment(value as CustomerSegment | 'all')}
                options={[
                  { value: 'all', label: 'All Segments' },
                  { value: 'Retail', label: 'Retail' },
                  { value: 'VIP', label: 'VIP' },
                  { value: 'Wholesale', label: 'Wholesale' },
                ]}
                placeholder="All Segments"
                className="w-[140px]"
              />

              {selectedCustomers.size > 0 && (
                <>
                  <button
                    onClick={handleBulkExport}
                    className="px-4 py-2.5 glass-stat-card rounded-lg text-sm font-semibold flex items-center gap-2 border border-green-400/40 bg-green-500/30 hover:bg-green-500/40 text-green-300"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2.5 glass-stat-card rounded-lg text-sm font-semibold flex items-center gap-2 border border-red-400/40 bg-red-500/30 hover:bg-red-500/40 text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}

              <button
                onClick={() => setImportModalOpen(true)}
                className="px-4 py-2.5 glass-stat-card rounded-lg text-sm font-semibold flex items-center gap-2 border border-blue-400/40 bg-blue-500/30 hover:bg-blue-500/40 text-blue-300"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
              
              <button 
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
                Add Customer
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-table-header">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-white/70 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.size === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCustomers(new Set(filteredCustomers.map(c => c.id)));
                      } else {
                        setSelectedCustomers(new Set());
                      }
                    }}
                    className="w-4 h-4 rounded border-white/30 bg-white/10"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="glass-table-row cursor-pointer hover:bg-white/10 transition"
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName !== 'INPUT') {
                        handleRowClick(customer);
                      }
                    }}
                  >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.has(customer.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectCustomer(customer.id);
                      }}
                      className="w-4 h-4 rounded border-white/30 bg-white/10"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white border border-white/20">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                          <p className="text-white flex items-center gap-2">
                            {customer.name}
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getSegmentColor(
                                customer.segment,
                              )}`}
                            >
                              {customer.segment}
                            </span>
                          </p>
                        <p className="text-sm text-white/60">{customer.id}</p>
                        {customer.tags && customer.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {customer.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] bg-white/10 border border-white/20 text-white/70">
                                <Tag className="w-2 h-2" />
                                {tag}
                              </span>
                            ))}
                            {customer.tags.length > 2 && (
                              <span className="text-[9px] text-white/50">+{customer.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <Mail className="w-4 h-4 text-white/60" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <Phone className="w-4 h-4 text-white/60" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="w-4 h-4 text-white/60" />
                      {customer.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {customer.totalSpent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                      <span className="text-white">{customer.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getStatusColor(customer.status)} uppercase backdrop-blur-sm`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Users className="w-12 h-12 text-white/30" />
                      <p className="text-white/60">No customers found</p>
                      <p className="text-sm text-white/40">Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-sm text-white/70">
            Showing <span className="text-white">{filteredCustomers.length}</span> of <span className="text-white">{mockCustomers.length}</span> customers
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

        {/* Profile Drawer (desktop side panel) */}
        <div
          className={`transition-all duration-300 w-full lg:w-[360px] xl:w-[400px] ${
            isDrawerOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
          } hidden md:block`}
        >
          {isDrawerOpen && selectedCustomer && (
            <div className="glass-card rounded-2xl h-full flex flex-col">
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white border border-white/30">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">
                        {selectedCustomer.name}
                      </p>
                      <p className="text-xs text-white/70">{selectedCustomer.id}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getSegmentColor(
                        selectedCustomer.segment,
                      )}`}
                    >
                      {selectedCustomer.segment}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/80">
                      {selectedCustomer.type === 'company' ? (
                        <Building2 className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      {selectedCustomer.type === 'company' ? 'Company' : 'Individual'}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${getStatusColor(
                        selectedCustomer.status,
                      )}`}
                    >
                      {selectedCustomer.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-4 pt-3 border-b border-white/10">
                <div className="flex gap-2 text-xs">
                  {[
                    { id: 'overview', label: 'Overview', icon: Users },
                    { id: 'details', label: 'Profile & Addresses', icon: Building2 },
                    { id: 'finance', label: 'Finance', icon: CreditCard },
                    { id: 'activity', label: 'Activity', icon: Activity },
                    { id: 'tags', label: 'Tags', icon: Tag },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeProfileTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveProfileTab(tab.id as any)}
                        className={`flex-1 px-2 py-2 rounded-lg flex items-center justify-center gap-1 ${
                          isActive
                            ? 'glass-content-inner text-white'
                            : 'text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {activeProfileTab === 'overview' && (
                  <div className="space-y-4 text-sm">
                    <div className="glass-content-inner rounded-xl p-4">
                      <p className="text-xs font-medium text-white/70 mb-2">
                        Account Snapshot
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[11px] text-white/60">Total Spent</p>
                          <p className="text-white text-base">
                            {selectedCustomer.totalSpent}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-white/60">Orders</p>
                          <p className="text-white text-base">
                            {selectedCustomer.orders}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-white/60">Credit Limit</p>
                          <p className="text-white text-base">
                            {selectedCustomer.creditLimit}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-white/60">Payment Terms</p>
                          <p className="text-white text-base">
                            {selectedCustomer.paymentTerms}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-content-inner rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-white/70">Linked Orders</p>
                        <button className="text-[11px] text-blue-200 hover:text-white">
                          View all in Orders
                        </button>
                      </div>
                      <div className="space-y-2 text-xs">
                        {mockLinkedOrders.map((ord) => (
                          <div
                            key={ord.id}
                            className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2"
                          >
                            <div>
                              <p className="text-white">{ord.id}</p>
                              <p className="text-[11px] text-white/60">{ord.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white text-sm">{ord.amount}</p>
                              <p className="text-[11px] text-emerald-200">{ord.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-content-inner rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-white/70">Linked Invoices</p>
                        <button className="text-[11px] text-blue-200 hover:text-white">
                          View all in Invoices
                        </button>
                      </div>
                      <div className="space-y-2 text-xs">
                        {mockLinkedInvoices.map((inv) => (
                          <div
                            key={inv.id}
                            className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2"
                          >
                            <div>
                              <p className="text-white">{inv.id}</p>
                              <p className="text-[11px] text-white/60">{inv.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white text-sm">{inv.amount}</p>
                              <p
                                className={`text-[11px] ${
                                  inv.status === 'Paid'
                                    ? 'text-emerald-200'
                                    : inv.status === 'Overdue'
                                    ? 'text-red-200'
                                    : 'text-yellow-200'
                                }`}
                              >
                                {inv.status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'details' && (
                  <div className="space-y-4 text-sm">
                    <div className="glass-content-inner rounded-xl p-4">
                      <p className="text-xs font-medium text-white/70 mb-3">
                        Primary Contact
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-white/80">
                          <Mail className="w-3 h-3 text-white/60" />
                          {selectedCustomer.email}
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                          <Phone className="w-3 h-3 text-white/60" />
                          {selectedCustomer.phone}
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                          <MapPin className="w-3 h-3 text-white/60" />
                          {selectedCustomer.location}
                        </div>
                      </div>
                    </div>

                    <div className="glass-content-inner rounded-xl p-4 space-y-3">
                      <p className="text-xs font-medium text-white/70">
                        Addresses (mock – editable in future)
                      </p>
                      <div className="grid gap-3">
                        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                          <p className="text-[11px] text-white/60 mb-1">
                            Billing Address
                          </p>
                          <p className="text-xs text-white/80">
                            King Fahd Road, Business District
                            <br />
                            {selectedCustomer.location}
                          </p>
                        </div>
                        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                          <p className="text-[11px] text-white/60 mb-1">
                            Shipping Address
                          </p>
                          <p className="text-xs text-white/80">
                            Warehouse Area 3, Industrial Zone
                            <br />
                            {selectedCustomer.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'finance' && (
                  <div className="space-y-4 text-sm">
                    <div className="glass-content-inner rounded-xl p-4 space-y-3">
                      <p className="text-xs font-medium text-white/70">Credit Profile</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[11px] text-white/60">Credit Limit</p>
                          <p className="text-white text-base">
                            {selectedCustomer.creditLimit}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-white/60">Payment Terms</p>
                          <p className="text-white text-base">
                            {selectedCustomer.paymentTerms}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-white/60">
                            Approx. Utilization
                          </p>
                          <p className="text-emerald-200 text-base">65%</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-white/60">Risk Rating</p>
                          <p className="text-amber-200 text-base">Medium</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-[11px] text-white/60 mb-1">
                          Utilization (mock)
                        </p>
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full w-2/3 bg-gradient-to-r from-emerald-400 to-amber-300" />
                        </div>
                      </div>
                    </div>

                    <div className="glass-content-inner rounded-xl p-4 space-y-3">
                      <p className="text-xs font-medium text-white/70">
                        Recent Financial Documents (sample)
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3 h-3 text-blue-200" />
                            <span className="text-white">Statement – Nov 2024</span>
                          </div>
                          <span className="text-[11px] text-white/60">Balanced</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-yellow-200" />
                            <span className="text-white">Open invoices</span>
                          </div>
                          <span className="text-[11px] text-yellow-200">
                            SAR 2,980 outstanding
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'activity' && (
                  <div className="space-y-4 text-sm">
                    <div className="glass-content-inner rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-white/70">
                          Activity Timeline (sample data)
                        </p>
                        <button className="text-[11px] text-blue-200 hover:text-white">
                          Add interaction
                        </button>
                      </div>
                      <div className="space-y-3">
                        {mockActivityTimeline.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 items-start text-xs text-white/80"
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center border border-white/25">
                                {item.type === 'order' && (
                                  <FileText className="w-3 h-3 text-sky-200" />
                                )}
                                {item.type === 'invoice' && (
                                  <CreditCard className="w-3 h-3 text-emerald-200" />
                                )}
                                {item.type === 'call' && (
                                  <Users className="w-3 h-3 text-amber-200" />
                                )}
                                {item.type === 'note' && (
                                  <Activity className="w-3 h-3 text-purple-200" />
                                )}
                              </div>
                              <div className="flex-1 w-px bg-white/15 grow mt-1" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-white">{item.title}</p>
                              <p className="text-[11px] text-white/70">{item.detail}</p>
                              <p className="text-[11px] text-white/50">{item.timeAgo}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'tags' && (
                  <div className="space-y-4 text-sm">
                    <div className="glass-content-inner rounded-xl p-4">
                      <p className="text-xs font-medium text-white/70 mb-3">
                        Add New Tag
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter tag name..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          className="flex-1 px-3 py-2 glass-input text-white placeholder-white/60 rounded-lg text-xs"
                        />
                        <button
                          onClick={() => handleAddTag()}
                          className="px-3 py-2 glass-button rounded-lg text-white text-xs font-medium"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="glass-content-inner rounded-xl p-4">
                      <p className="text-xs font-medium text-white/70 mb-3">
                        Current Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedCustomer.tags || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-white/10 border border-white/20 text-white/80"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-red-300 transition"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {(!selectedCustomer.tags || selectedCustomer.tags.length === 0) && (
                          <p className="text-xs text-white/50">No tags assigned</p>
                        )}
                      </div>
                    </div>

                    <div className="glass-content-inner rounded-xl p-4">
                      <p className="text-xs font-medium text-white/70 mb-2">
                        Popular Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['High Value', 'Regular', 'VIP', 'Strategic', 'New Customer', 'Wholesale', 'Bulk Buyer'].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setNewTag(tag);
                              handleAddTag();
                            }}
                            className="px-2.5 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 px-4 py-3 flex items-center justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 glass-content-inner text-xs text-white/80 rounded-lg hover:bg-white/15 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Import Customers</h3>
              <button
                onClick={() => setImportModalOpen(false)}
                className="text-white/60 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-white/70 mb-4">
              Upload a CSV file to import customers. The file should contain columns: Name, Email, Phone, Location, Segment, Type.
            </p>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-white/60 mx-auto mb-2" />
                <p className="text-sm text-white/80">Click to upload CSV</p>
                <p className="text-xs text-white/50 mt-1">or drag and drop</p>
              </label>
            </div>
            <button
              onClick={() => setImportModalOpen(false)}
              className="w-full mt-4 py-2 glass-content-inner rounded-lg text-white/80 hover:bg-white/15 transition text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
