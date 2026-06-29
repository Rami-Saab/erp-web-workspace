import { useState, useEffect } from 'react';
import { Search, Plus, UserCheck, Calendar, DollarSign, Mail, Phone, Briefcase, Edit, Eye, X, FileDown, Building2, MapPin, Users } from 'lucide-react';
import { CustomSelect } from './ui/CustomSelect';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { exportToCSV } from '../utils/csvExport';
import { toast } from 'sonner';

// Custom Tailwind classes for dark glassmorphism effect (matching InvoicesPage)
const glassStatCard = "bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg";

// Custom styles for pagination buttons
const paginationButtonStyle = {
  base: {
    position: 'relative' as const,
    zIndex: 1,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
  },
  hover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3)',
  },
  active: {
    transform: 'translateY(1px)',
  }
};

const mockEmployees = [
  { id: 'EMP-001', name: 'Ahmed Hassan', email: 'ahmed.h@company.com', phone: '+966 50 123 4567', position: 'Software Engineer', department: 'IT', salary: '$5,500', joinDate: '2022-01-15', status: 'active' },
  { id: 'EMP-002', name: 'Fatima Ali', email: 'fatima.a@company.com', phone: '+966 55 234 5678', position: 'HR Manager', department: 'Human Resources', salary: '$6,200', joinDate: '2021-03-10', status: 'active' },
  { id: 'EMP-003', name: 'Mohamed Saeed', email: 'mohamed.s@company.com', phone: '+966 50 345 6789', position: 'Sales Director', department: 'Sales', salary: '$7,800', joinDate: '2020-06-20', status: 'active' },
  { id: 'EMP-004', name: 'Sara Ibrahim', email: 'sara.i@company.com', phone: '+966 54 456 7890', position: 'Accountant', department: 'Finance', salary: '$4,800', joinDate: '2022-09-05', status: 'active' },
  { id: 'EMP-005', name: 'Omar Khalil', email: 'omar.k@company.com', phone: '+966 56 567 8901', position: 'Marketing Specialist', department: 'Marketing', salary: '$4,500', joinDate: '2023-02-12', status: 'active' },
  { id: 'EMP-006', name: 'Layla Ahmed', email: 'layla.a@company.com', phone: '+966 50 678 9012', position: 'Product Manager', department: 'Operations', salary: '$6,500', joinDate: '2021-11-30', status: 'on-leave' },
  { id: 'EMP-007', name: 'Khalid Mansour', email: 'khalid.m@company.com', phone: '+966 51 789 0123', position: 'Data Analyst', department: 'IT', salary: '$5,200', joinDate: '2022-05-18', status: 'active' },
  { id: 'EMP-008', name: 'Noura Al-Zahra', email: 'noura.z@company.com', phone: '+966 52 890 1234', position: 'Financial Advisor', department: 'Finance', salary: '$5,800', joinDate: '2021-08-22', status: 'active' },
  { id: 'EMP-009', name: 'Youssef Hamdi', email: 'youssef.h@company.com', phone: '+966 53 901 2345', position: 'Sales Representative', department: 'Sales', salary: '$4,200', joinDate: '2023-01-10', status: 'active' },
  { id: 'EMP-010', name: 'Mariam Fadel', email: 'mariam.f@company.com', phone: '+966 54 012 3456', position: 'Content Writer', department: 'Marketing', salary: '$4,000', joinDate: '2022-11-05', status: 'active' },
  { id: 'EMP-011', name: 'Tariq Nasser', email: 'tariq.n@company.com', phone: '+966 55 123 4567', position: 'Senior Developer', department: 'IT', salary: '$6,800', joinDate: '2020-09-15', status: 'active' },
  { id: 'EMP-012', name: 'Hala Samir', email: 'hala.s@company.com', phone: '+966 56 234 5678', position: 'Recruitment Specialist', department: 'Human Resources', salary: '$4,600', joinDate: '2022-07-20', status: 'active' },
  { id: 'EMP-013', name: 'Bassem Farid', email: 'bassem.f@company.com', phone: '+966 57 345 6789', position: 'Account Manager', department: 'Sales', salary: '$5,500', joinDate: '2021-12-08', status: 'active' },
  { id: 'EMP-014', name: 'Dina Magdy', email: 'dina.m@company.com', phone: '+966 58 456 7890', position: 'Budget Analyst', department: 'Finance', salary: '$5,100', joinDate: '2022-03-14', status: 'active' },
  { id: 'EMP-015', name: 'Rami Tawfik', email: 'rami.t@company.com', phone: '+966 59 567 8901', position: 'Social Media Manager', department: 'Marketing', salary: '$4,300', joinDate: '2023-04-01', status: 'active' },
  { id: 'EMP-016', name: 'Salma Karim', email: 'salma.k@company.com', phone: '+966 50 678 9012', position: 'Operations Coordinator', department: 'Operations', salary: '$4,700', joinDate: '2022-08-12', status: 'on-leave' },
  { id: 'EMP-017', name: 'Waleed Osman', email: 'waleed.o@company.com', phone: '+966 51 789 0123', position: 'DevOps Engineer', department: 'IT', salary: '$6,200', joinDate: '2021-06-25', status: 'active' },
  { id: 'EMP-018', name: 'Lina Haddad', email: 'lina.h@company.com', phone: '+966 52 890 1234', position: 'Payroll Administrator', department: 'Human Resources', salary: '$4,400', joinDate: '2022-10-30', status: 'active' },
  { id: 'EMP-019', name: 'Ziad Malek', email: 'ziad.m@company.com', phone: '+966 53 901 2345', position: 'Regional Sales Manager', department: 'Sales', salary: '$7,200', joinDate: '2020-11-18', status: 'active' },
  { id: 'EMP-020', name: 'Rania Fawzy', email: 'rania.f@company.com', phone: '+966 54 012 3456', position: 'Tax Specialist', department: 'Finance', salary: '$5,600', joinDate: '2021-09-22', status: 'active' },
  { id: 'EMP-021', name: 'Amr Shoukry', email: 'amr.s@company.com', phone: '+966 55 123 4567', position: 'Brand Manager', department: 'Marketing', salary: '$5,900', joinDate: '2022-02-28', status: 'active' },
  { id: 'EMP-022', name: 'Nada El-Sayed', email: 'nada.e@company.com', phone: '+966 56 234 5678', position: 'Supply Chain Manager', department: 'Operations', salary: '$6,100', joinDate: '2021-04-15', status: 'active' },
  { id: 'EMP-023', name: 'Hassan Reda', email: 'hassan.r@company.com', phone: '+966 57 345 6789', position: 'Frontend Developer', department: 'IT', salary: '$5,400', joinDate: '2022-12-10', status: 'active' },
  { id: 'EMP-024', name: 'Yasmin Lotfy', email: 'yasmin.l@company.com', phone: '+966 58 456 7890', position: 'Training Coordinator', department: 'Human Resources', salary: '$4,500', joinDate: '2023-03-05', status: 'active' },
  { id: 'EMP-025', name: 'Karim Adel', email: 'karim.a@company.com', phone: '+966 59 567 8901', position: 'Sales Executive', department: 'Sales', salary: '$4,800', joinDate: '2022-06-18', status: 'active' },
  { id: 'EMP-026', name: 'Mona Saber', email: 'mona.s@company.com', phone: '+966 50 678 9012', position: 'Auditor', department: 'Finance', salary: '$5,300', joinDate: '2021-10-12', status: 'active' },
  { id: 'EMP-027', name: 'Omar Youssef', email: 'omar.y@company.com', phone: '+966 51 789 0123', position: 'Digital Marketing Specialist', department: 'Marketing', salary: '$4,600', joinDate: '2022-09-25', status: 'active' },
  { id: 'EMP-028', name: 'Soha Badr', email: 'soha.b@company.com', phone: '+966 52 890 1234', position: 'Quality Assurance', department: 'Operations', salary: '$4,900', joinDate: '2021-07-08', status: 'on-leave' },
  { id: 'EMP-029', name: 'Mahmoud Ashraf', email: 'mahmoud.a@company.com', phone: '+966 53 901 2345', position: 'Backend Developer', department: 'IT', salary: '$6,000', joinDate: '2022-04-20', status: 'active' },
  { id: 'EMP-030', name: 'Reem Gamal', email: 'reem.g@company.com', phone: '+966 54 012 3456', position: 'Benefits Administrator', department: 'Human Resources', salary: '$4,700', joinDate: '2023-01-15', status: 'active' },
];

export function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<typeof mockEmployees[0] | null>(null);
  const [processing, setProcessing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 'on-leave': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'inactive': return 'bg-white/15 text-white/80 border-white/20';
      default: return 'bg-white/15 text-white/80 border-white/20';
    }
  };

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterDepartment === 'all' || emp.department === filterDepartment;
    return matchesSearch && matchesFilter;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const startIndex = (currentPage - 1) * employeesPerPage;
  const endIndex = startIndex + employeesPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterDepartment]);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      toast.success(`Switched to page ${page}`);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      toast.info(`Navigated to page ${newPage}`);
    } else {
      toast.error("Already on the first page");
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      toast.info(`Navigated to page ${newPage}`);
    } else {
      toast.error("Already on the last page");
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Position', 'Department', 'Salary', 'Join Date', 'Status'];
    const rows = filteredEmployees.map(emp => [
      emp.id, emp.name, emp.email, emp.phone, emp.position, emp.department, emp.salary, emp.joinDate, emp.status
    ]);
    exportToCSV('employees_export', headers, rows);
    toast.success('Employees exported to CSV');
  };

  const handleViewEmployee = (employee: typeof mockEmployees[0]) => {
    setSelectedEmployee(employee);
    setDetailDrawerOpen(true);
  };

  const handleEditEmployee = (employee: typeof mockEmployees[0]) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  const handleTerminateEmployee = (employee: typeof mockEmployees[0]) => {
    setSelectedEmployee(employee);
    if (confirm(`Are you sure you want to terminate ${employee.name}? This action cannot be undone.`)) {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        toast.success(`${employee.name} has been terminated`);
      }, 800);
    }
  };

  return (
    <div>
      {/* Header - professional employees icon + label */}
      <div className="mb-8">
        <div className="glass-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex items-center gap-3">
                <UserCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Employees
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                    Manage staff records, departments, and payroll information
                  </p>
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
              <UserCheck className="w-6 h-6 text-blue-300" />
            </div>
            <span className="text-sm text-blue-300 font-medium">Workforce</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Total Employees</p>
          <p className="text-white text-2xl">156</p>
        </div>

        <div className={`${glassStatCard} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-400/30">
              <Briefcase className="w-6 h-6 text-green-300" />
            </div>
            <span className="text-sm text-green-300 font-medium">Teams</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Departments</p>
          <p className="text-white text-2xl">8</p>
        </div>

        <div className={`${glassStatCard} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-400/30">
              <Calendar className="w-6 h-6 text-yellow-300" />
            </div>
            <span className="text-sm text-yellow-300 font-medium">Away</span>
          </div>
          <p className="text-white/70 text-sm mb-1">On Leave Today</p>
          <p className="text-white text-2xl">3</p>
        </div>

        <div className={`${glassStatCard} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-400/30">
              <DollarSign className="w-6 h-6 text-purple-300" />
            </div>
            <span className="text-sm text-purple-300 font-medium">Monthly</span>
          </div>
          <p className="text-white/70 text-sm mb-1">Average Salary</p>
          <p className="text-white text-2xl">$5,850</p>
        </div>
      </div>

      {/* Employees Table */}
      <div className="glass-container-outer rounded-xl">
        {/* Table Header Actions */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search employees..."
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
                value={filterDepartment}
                onChange={(value) => setFilterDepartment(value as string)}
                options={[
                  { value: 'all', label: 'All Departments' },
                  { value: 'IT', label: 'IT' },
                  { value: 'Human Resources', label: 'Human Resources' },
                  { value: 'Sales', label: 'Sales' },
                  { value: 'Finance', label: 'Finance' },
                  { value: 'Marketing', label: 'Marketing' },
                  { value: 'Operations', label: 'Operations' },
                ]}
                placeholder="All Departments"
                className="w-[200px]"
              />
              
              <button 
                onClick={() => setAddModalOpen(true)}
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
                Add Employee
              </button>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all h-auto min-h-[42px]"
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  boxShadow: '0 4px 12px 0 rgba(34, 197, 94, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(34, 197, 94, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                  e.currentTarget.style.transform = '';
                }}
              >
                <FileDown className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-white/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {paginatedEmployees.map((employee) => (
                <tr key={employee.id} className="glass-table-row">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white border border-white/20">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white">{employee.name}</p>
                        <p className="text-sm text-white/60">{employee.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-white/60" />
                      <span className="text-white">{employee.position}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm border border-blue-400/30 backdrop-blur-sm whitespace-nowrap">
                      {employee.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <Mail className="w-4 h-4 text-white/60" />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <Phone className="w-4 h-4 text-white/60" />
                        {employee.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {employee.salary}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white/80">
                    {employee.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getStatusColor(employee.status)} capitalize backdrop-blur-sm`}>
                      {employee.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewEmployee(employee)}
                        className="p-2 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="p-2 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white"
                        title="Edit Employee"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleTerminateEmployee(employee)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition text-white/80 hover:text-red-300"
                        title="Terminate Employee"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedEmployees.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Users className="w-12 h-12 text-white/30" />
                      <p className="text-white/60">No employees found</p>
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
            Showing <span className="text-white">{startIndex + 1}</span>-<span className="text-white">{Math.min(endIndex, filteredEmployees.length)}</span> of <span className="text-white">{filteredEmployees.length}</span> employees
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium select-none relative ${
                currentPage === 1 
                  ? 'glass-content-inner text-white/40 cursor-not-allowed opacity-60' 
                  : 'glass-content-inner text-white/90 cursor-pointer'
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
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className="px-4 py-2 rounded-lg font-medium cursor-pointer select-none relative min-w-[40px] text-base"
                style={{
                  ...paginationButtonStyle.base,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  ...(currentPage === pageNum 
                    ? {
                        background: 'rgba(59, 130, 246, 0.25)',
                        border: '1px solid rgba(59, 130, 246, 0.5)',
                        color: 'white',
                        boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                      }
                    : {
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
                      }
                  ),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = currentPage === pageNum 
                    ? 'rgba(59, 130, 246, 0.35)' 
                    : 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.borderColor = currentPage === pageNum
                    ? 'rgba(59, 130, 246, 0.6)'
                    : 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = currentPage === pageNum
                    ? '0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3)'
                    : '0 8px 24px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = currentPage === pageNum
                    ? 'rgba(59, 130, 246, 0.25)'
                    : 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = currentPage === pageNum
                    ? 'rgba(59, 130, 246, 0.5)'
                    : 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = currentPage === pageNum
                    ? '0 6px 20px rgba(59, 130, 246, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
                    : '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.color = currentPage === pageNum ? 'white' : 'rgba(255, 255, 255, 0.9)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(1px)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
              >
                {pageNum}
              </button>
            ))}
            <button 
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-4 py-2 rounded-lg font-medium select-none relative ${
                currentPage === totalPages || totalPages === 0
                  ? 'glass-content-inner text-white/40 cursor-not-allowed opacity-60' 
                  : 'glass-content-inner text-white/90 cursor-pointer'
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

      {/* Department Analytics */}
      <div className="mt-8 glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white mb-1 text-sm">Department Analytics</h3>
              <p className="text-xs text-white/60">Employee distribution by department</p>
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { department: 'IT', count: 42 },
              { department: 'Sales', count: 35 },
              { department: 'Finance', count: 28 },
              { department: 'HR', count: 18 },
              { department: 'Marketing', count: 22 },
              { department: 'Operations', count: 11 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" vertical={false} />
              <XAxis dataKey="department" tickLine={false} axisLine={false} tick={{ fill: "rgba(226,232,240,0.9)", fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "rgba(226,232,240,0.9)", fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "#020617", borderRadius: 8, border: "1px solid rgba(148,163,184,0.6)", fontSize: 11 }} labelStyle={{ color: "#e5e7eb" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payroll Summary Card */}
      <div className="mt-6 glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white mb-1 text-sm">Payroll Summary</h3>
              <p className="text-xs text-white/60">Monthly payroll breakdown</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-white/60 text-xs mb-1">Total Payroll</p>
            <p className="text-white text-xl font-semibold">$912,450</p>
            <p className="text-green-300 text-xs mt-1">+5.2% from last month</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-white/60 text-xs mb-1">Average per Employee</p>
            <p className="text-white text-xl font-semibold">$5,850</p>
            <p className="text-green-300 text-xs mt-1">+2.1% from last month</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-white/60 text-xs mb-1">Pending Bonuses</p>
            <p className="text-white text-xl font-semibold">$45,200</p>
            <p className="text-yellow-300 text-xs mt-1">3 employees pending</p>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAddModalOpen(false)} />
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-semibold">Add New Employee</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setProcessing(true);
              setTimeout(() => {
                setProcessing(false);
                setAddModalOpen(false);
                toast.success('Employee added successfully');
              }, 800);
            }} className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-1 block">Full Name</label>
                <input type="text" required className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg" placeholder="Enter full name" />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Email</label>
                <input type="email" required className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg" placeholder="Enter email address" />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Phone</label>
                <input type="tel" required className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg" placeholder="+966 XX XXX XXXX" />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Position</label>
                <input type="text" required className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg" placeholder="Job title" />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Department</label>
                <select required className="w-full px-4 py-2 glass-input text-white rounded-lg">
                  <option value="">Select department</option>
                  <option value="IT">IT</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Salary</label>
                <input type="text" required className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg" placeholder="$0,000" />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Join Date</label>
                <input type="date" required className="w-full px-4 py-2 glass-input text-white rounded-lg" />
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-white font-semibold transition disabled:opacity-50"
              >
                {processing ? 'Adding...' : 'Add Employee'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Employee Detail Drawer */}
      {detailDrawerOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md border-l border-white/20 p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-semibold">Employee Details</h3>
              <button onClick={() => setDetailDrawerOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold border border-white/20">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white text-xl font-semibold">{selectedEmployee.name}</h4>
                  <p className="text-white/60 text-sm">{selectedEmployee.position}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedEmployee.status)} capitalize mt-2`}>
                    {selectedEmployee.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/80">
                  <Mail className="w-4 h-4" />
                  <span>{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Phone className="w-4 h-4" />
                  <span>{selectedEmployee.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <MapPin className="w-4 h-4" />
                  <span>Riyadh, Saudi Arabia</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Building2 className="w-4 h-4" />
                  <span>{selectedEmployee.department}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <DollarSign className="w-4 h-4" />
                  <span>{selectedEmployee.salary} / month</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Calendar className="w-4 h-4" />
                  <span>Joined: {selectedEmployee.joinDate}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <h5 className="text-white text-sm font-semibold mb-3">Performance Summary</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Attendance</span>
                    <span className="text-green-300">98%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Projects Completed</span>
                    <span className="text-white">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Performance Rating</span>
                    <span className="text-blue-300">4.5/5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditModalOpen(false)} />
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-semibold">Edit Employee</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setProcessing(true);
              setTimeout(() => {
                setProcessing(false);
                setEditModalOpen(false);
                toast.success('Employee updated successfully');
              }, 800);
            }} className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-1 block">Full Name</label>
                <input type="text" defaultValue={selectedEmployee.name} required className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg" />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Email</label>
                <input type="email" defaultValue={selectedEmployee.email} required className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg" />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Phone</label>
                <input type="tel" defaultValue={selectedEmployee.phone} required className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg" />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Position</label>
                <input type="text" defaultValue={selectedEmployee.position} required className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg" />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Department</label>
                <select defaultValue={selectedEmployee.department} required className="w-full px-4 py-2 glass-input text-white rounded-lg">
                  <option value="">Select department</option>
                  <option value="IT">IT</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Salary</label>
                <input type="text" defaultValue={selectedEmployee.salary} required className="w-full px-4 py-2 glass-input text-white placeholder-white/60 rounded-lg" />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Status</label>
                <select defaultValue={selectedEmployee.status} required className="w-full px-4 py-2 glass-input text-white rounded-lg">
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-white font-semibold transition disabled:opacity-50"
              >
                {processing ? 'Updating...' : 'Update Employee'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}