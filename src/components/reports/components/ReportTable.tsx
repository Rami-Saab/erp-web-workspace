// ==================== REPORTS MODULE - REPORT TABLE COMPONENT ====================
import React, { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { ReportDataRow, SortConfig, Pagination } from '../types/reports.types';
import { formatCurrency, formatPercent } from '../data/mockData';
import { GLASS_STYLES } from '../utils/styles';

interface Column {
  id: string;
  label: string;
  dataType?: 'string' | 'number' | 'date' | 'boolean' | 'currency' | 'percent';
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface ReportTableProps {
  data: ReportDataRow[];
  columns: Column[];
  title?: string;
  pageSize?: number;
  onExport?: (format: 'csv' | 'excel') => void;
  showPagination?: boolean;
  showRowNumbers?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string;
  actionButtons?: React.ReactNode;
}

export const ReportTable: React.FC<ReportTableProps> = ({
  data,
  columns,
  title,
  pageSize = 10,
  onExport,
  showPagination = true,
  showRowNumbers = false,
  stickyHeader = false,
  maxHeight = '600px',
  actionButtons,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize,
    totalItems: data.length,
    totalPages: Math.ceil(data.length / pageSize),
  });

  // Format cell value based on data type
  const formatCellValue = (value: string | number | boolean | null, dataType?: string): string => {
    if (value === null || value === undefined) return '-';
    
    switch (dataType) {
      case 'currency':
        return formatCurrency(Number(value));
      case 'percent':
        return formatPercent(Number(value));
      case 'number':
        return Number(value).toLocaleString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'date':
        return new Date(String(value)).toLocaleDateString();
      default:
        return String(value);
    }
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (sortConfig.direction === 'asc') {
        return aStr.localeCompare(bStr);
      }
      return bStr.localeCompare(aStr);
    });
  }, [data, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    return sortedData.slice(startIndex, startIndex + pagination.pageSize);
  }, [sortedData, pagination, showPagination]);

  // Handle sort
  const handleSort = (columnId: string) => {
    const column = columns.find(c => c.id === columnId);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (current?.field === columnId) {
        if (current.direction === 'asc') return { field: columnId, direction: 'desc' };
        if (current.direction === 'desc') return null;
      }
      return { field: columnId, direction: 'asc' };
    });
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Get sort icon
  const getSortIcon = (columnId: string) => {
    if (sortConfig?.field !== columnId) {
      return <ChevronsUpDown className="w-4 h-4 opacity-40" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-400" />
      : <ChevronDown className="w-4 h-4 text-blue-400" />;
  };

  // Get alignment class
  const getAlignClass = (align?: string) => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  // Get flex justify class for header
  const getFlexJustifyClass = (align?: string) => {
    switch (align) {
      case 'right': return 'justify-end';
      case 'center': return 'justify-center';
      default: return 'justify-start';
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg overflow-hidden h-full flex flex-col`}>
      {/* Header */}
      {(title || actionButtons) && (
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          {title && (
            <h3 className="text-white font-semibold text-base">{title}</h3>
          )}
          {actionButtons && (
            <div className="flex items-center gap-2 flex-shrink-0 ml-4 flex-wrap">
              {actionButtons}
            </div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div 
        className="overflow-x-auto flex-1"
        style={{ maxHeight: stickyHeader ? maxHeight : undefined }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className={`border-b border-white/10 bg-white/5 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
              {showRowNumbers && (
                <th className="w-12 px-4 py-3.5 text-white/70 text-sm font-semibold text-center border-r border-white/10">
                  #
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`
                    px-4 py-3.5 text-white/70 text-sm font-semibold
                    ${column.sortable ? 'cursor-pointer hover:text-white hover:bg-white/5 select-none transition-colors duration-200' : ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className={getAlignClass(column.align)}>
                    <div className={`inline-flex items-center gap-1.5 ${getFlexJustifyClass(column.align)}`}>
                      <span className="whitespace-nowrap">{column.label}</span>
                      {column.sortable && getSortIcon(column.id)}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (showRowNumbers ? 1 : 0)} 
                  className="px-4 py-12 text-center text-white/50"
                >
                  No data available
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr 
                  key={row.id as string || rowIndex} 
                  className={`
                    border-b border-white/5 transition-all duration-200
                    ${rowIndex % 2 === 1 ? 'bg-white/[0.02]' : 'bg-transparent'}
                    hover:bg-white/8 hover:border-white/10
                  `}
                >
                  {showRowNumbers && (
                    <td className="px-4 py-3.5 text-white/50 text-sm font-mono text-center border-r border-white/5">
                      {(pagination.page - 1) * pagination.pageSize + rowIndex + 1}
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={`
                        px-4 py-3.5 text-white text-sm transition-colors duration-200
                        ${column.dataType === 'currency' || column.dataType === 'number' ? 'font-mono font-medium' : 'font-normal'}
                      `}
                    >
                      <div className={getAlignClass(column.align)}>
                        {formatCellValue(row[column.id], column.dataType)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && pagination.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between flex-shrink-0">
          <div className="text-white/50 text-sm">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of{' '}
            {pagination.totalItems} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              
              const isActive = pagination.page === pageNum;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                  style={
                    isActive
                      ? GLASS_STYLES.paginationButton
                      : GLASS_STYLES.paginationButtonInactive
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTable;


