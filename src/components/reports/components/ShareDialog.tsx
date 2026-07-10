// ==================== REPORTS MODULE - SHARE DIALOG COMPONENT ====================
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  X,
  Share2,
  Users,
  Link,
  Copy,
  Check,
  Mail,
  Search,
  UserPlus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { SharedUser, PermissionLevel, User } from '../types/reports.types';
import { mockUsers } from '../data/mockData';
import { CustomSelect } from './CustomSelect';
import { 
  GLASS_STYLES, 
  AVATAR_STYLE, 
  PAGINATION, 
  PERMISSIONS, 
  calculatePagination, 
  generatePageNumbers, 
  filterUsers 
} from '../utils';

// Memoized User Card Component for better performance
const UserCard = React.memo<{
  user: SharedUser;
  onRemove: (userId: string) => void;
  onChangePermission: (userId: string, permission: PermissionLevel) => void;
}>(({ user, onRemove, onChangePermission }) => {
  const handleRemove = useCallback(() => {
    onRemove(user.id);
  }, [user.id, onRemove]);

  const handlePermissionChange = useCallback((value: string | number) => {
    onChangePermission(user.id, value as PermissionLevel);
  }, [user.id, onChangePermission]);

  return (
    <div className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg border border-white/10">
      <div 
        className="w-9 h-9 min-w-9 min-h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
        style={AVATAR_STYLE}
      >
        {user.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate text-sm leading-tight">{user.name}</p>
        <p className="text-white/50 text-xs truncate mt-0.5">{user.email}</p>
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Permission selector */}
        <CustomSelect
          value={user.permission}
          options={PERMISSIONS.map(p => ({ value: p.value, label: p.label }))}
          onChange={handlePermissionChange}
          className="w-auto"
        />
        
        <button
          onClick={handleRemove}
          className="p-1.5 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-lg transition flex-shrink-0"
          title="Remove user"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

UserCard.displayName = 'UserCard';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportName: string;
  reportId: string;
  currentSharedWith: SharedUser[];
  onShare?: (users: SharedUser[]) => void;
  onCopyLink?: () => void;
  onSendEmail?: (emails: string[]) => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  reportName,
  reportId,
  currentSharedWith,
  onShare,
  onCopyLink,
  onSendEmail,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'link' | 'email'>('users');
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>(currentSharedWith);
  const [searchQuery, setSearchQuery] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailAdded, setEmailAdded] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // Update sharedUsers when currentSharedWith changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      setSharedUsers(currentSharedWith);
      setCurrentPage(1); // Reset to first page when shared users change
    }
  }, [currentSharedWith, isOpen]);

  // Update button styles when emailAdded changes
  useEffect(() => {
    if (addButtonRef.current) {
      Object.assign(
        addButtonRef.current.style,
        emailAdded ? GLASS_STYLES.buttonSuccess : GLASS_STYLES.button
      );
    }
  }, [emailAdded]);

  // Memoize shared user IDs for faster lookup
  const sharedUserIds = useMemo(() => 
    new Set(sharedUsers.map(u => u.id)), 
    [sharedUsers]
  );

  // Memoize filtered available users
  const availableUsers = useMemo(() => 
    filterUsers(mockUsers, searchQuery, sharedUserIds),
    [searchQuery, sharedUserIds]
  );

  // Memoize pagination calculations
  const paginationData = useMemo(() => 
    calculatePagination(sharedUsers, currentPage, PAGINATION.ITEMS_PER_PAGE),
    [sharedUsers, currentPage]
  );

  // Memoize page numbers for pagination
  const pageNumbers = useMemo(() => 
    generatePageNumbers(currentPage, paginationData.totalPages),
    [currentPage, paginationData.totalPages]
  );

  // Callbacks with useCallback
  const handleAddUser = useCallback((user: User, permission: PermissionLevel = 'view') => {
    setSharedUsers(prev => {
      const newSharedUsers = [...prev, { ...user, permission }];
      onShare?.(newSharedUsers);
      return newSharedUsers;
    });
    setSearchQuery('');
  }, [onShare]);

  const handleRemoveUser = useCallback((userId: string) => {
    setSharedUsers(prev => {
      const newSharedUsers = prev.filter(u => u.id !== userId);
      onShare?.(newSharedUsers);
      return newSharedUsers;
    });
  }, [onShare]);

  const handleChangePermission = useCallback((userId: string, permission: PermissionLevel) => {
    setSharedUsers(prev => {
      const newSharedUsers = prev.map(u =>
        u.id === userId ? { ...u, permission } : u
      );
      onShare?.(newSharedUsers);
      return newSharedUsers;
    });
  }, [onShare]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(paginationData.totalPages, prev + 1));
  }, [paginationData.totalPages]);

  const handlePrevPageDisabled = currentPage === 1;
  const handleNextPageDisabled = currentPage === paginationData.totalPages;

  if (!isOpen) return null;

  // Copy link
  const handleCopyLink = () => {
    const link = `${window.location.origin}/reports/view/${reportId}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    onCopyLink?.();
  };

  // Add email to list
  const handleAddEmail = () => {
    // Clear previous error
    setEmailError('');

    // Check if email input is empty
    if (!emailInput || emailInput.trim() === '') {
      setEmailError('Email address is required');
      return;
    }

    // Check if email is valid (contains @)
    if (!emailInput.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Check if email already exists
    if (selectedEmails.includes(emailInput)) {
      setEmailError('This email address is already in the list');
      return;
    }

    // Add email if valid
    setSelectedEmails([...selectedEmails, emailInput]);
    setEmailInput('');
    setEmailError('');
    setEmailAdded(true);
    setTimeout(() => {
      setEmailAdded(false);
    }, 2000);
  };

  // Clear error when user types
  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  // Remove email from list
  const handleRemoveEmail = (email: string) => {
    setSelectedEmails(selectedEmails.filter(e => e !== email));
  };

  // Send emails
  const handleSendEmails = () => {
    if (selectedEmails.length > 0) {
      onSendEmail?.(selectedEmails);
      setSelectedEmails([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10040] p-4">
      <div 
        className="rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
        }}
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
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Share Report</h2>
              <p className="text-sm text-white/50 truncate max-w-[250px]">{reportName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'users'
                ? 'text-white border-b-2 border-blue-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'link'
                ? 'text-white border-b-2 border-blue-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Link className="w-4 h-4" />
            Link
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'email'
                ? 'text-white border-b-2 border-blue-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-5">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                />
              </div>

              {/* Available Users Dropdown */}
              {searchQuery && availableUsers.length > 0 && (
                <div className="glass-card rounded-xl border border-white/20 max-h-40 overflow-y-auto">
                  {availableUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleAddUser(user)}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition"
                    >
                      <div 
                        className="w-8 h-8 min-w-8 min-h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                        style={{
                          backdropFilter: "blur(8px)",
                          width: '32px',
                          height: '32px',
                          minWidth: '32px',
                          minHeight: '32px',
                          flexShrink: 0,
                          borderRadius: '50%',
                        }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-white text-sm truncate">{user.name}</p>
                        <p className="text-white/50 text-xs truncate">{user.email}</p>
                      </div>
                      <UserPlus className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Shared Users List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white/70">Shared with {sharedUsers.length} user{sharedUsers.length !== 1 ? 's' : ''}</p>
                </div>
                
                {sharedUsers.length === 0 ? (
                  <div className="text-center py-8 text-white/40">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No users added yet</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2.5">
                      {paginationData.paginatedItems.map((user) => (
                        <UserCard
                          key={user.id}
                          user={user}
                          onRemove={handleRemoveUser}
                          onChangePermission={handleChangePermission}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {paginationData.totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <p className="text-sm text-white/60">
                          Page {currentPage} of {paginationData.totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handlePrevPage}
                            disabled={handlePrevPageDisabled}
                            className={`p-2 rounded-lg transition ${
                              handlePrevPageDisabled
                                ? 'text-white/20 cursor-not-allowed'
                                : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                            style={
                              handlePrevPageDisabled
                                ? {}
                                : GLASS_STYLES.paginationButtonInactive
                            }
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          
                          {/* Page numbers */}
                          <div className="flex items-center gap-1">
                            {pageNumbers.map((page, idx) => {
                              if (page === 'ellipsis') {
                                return (
                                  <span key={`ellipsis-${idx}`} className="px-2 text-white/40">
                                    ...
                                  </span>
                                );
                              }
                              
                              const isActive = page === currentPage;
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
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
                                  {page}
                                </button>
                              );
                            })}
                          </div>
                          
                          <button
                            onClick={handleNextPage}
                            disabled={handleNextPageDisabled}
                            className={`p-2 rounded-lg transition ${
                              handleNextPageDisabled
                                ? 'text-white/20 cursor-not-allowed'
                                : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                            style={
                              handleNextPageDisabled
                                ? {}
                                : GLASS_STYLES.paginationButtonInactive
                            }
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Link Tab */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              <p className="text-white/60 text-sm">
                Anyone with the link can view this report based on their permissions.
              </p>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/reports/view/${reportId}`}
                  readOnly
                  className="flex-1 px-4 py-2.5 glass-input text-white/60 rounded-lg text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition text-white"
                  style={linkCopied ? {
                    background: "rgba(34, 197, 94, 0.2)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(34, 197, 94, 0.35)",
                    boxShadow: "0 4px 12px 0 rgba(34, 197, 94, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                  } : {
                    background: "rgba(59, 130, 246, 0.2)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(59, 130, 246, 0.35)",
                    boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                  }}
                  onMouseEnter={(e) => {
                    if (!linkCopied) {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.45)';
                      e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(59, 130, 246, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!linkCopied) {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.35)';
                      e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="glass-card rounded-xl p-4 border border-yellow-400/20 bg-yellow-500/10">
                <p className="text-yellow-300 text-sm">
                  <strong>Note:</strong> Users must have an account to access this report.
                </p>
              </div>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <p className="text-white/60 text-sm">
                Send this report directly to email addresses.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={emailInput}
                    onChange={handleEmailInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                    placeholder="Enter email address..."
                    className={`flex-1 px-4 py-2.5 glass-input text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 transition ${
                      emailError 
                        ? 'border border-red-400/50 focus:ring-red-400/30' 
                        : 'focus:ring-white/30'
                    }`}
                  />
                <button
                  ref={addButtonRef}
                  onClick={handleAddEmail}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition text-white"
                  style={{
                    backdropFilter: "blur(16px)",
                  }}
                  onMouseEnter={(e) => {
                    if (!emailAdded) {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.45)';
                      e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(59, 130, 246, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!emailAdded) {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.35)';
                      e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    } else {
                      // Keep green style when emailAdded is true
                      e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.35)';
                      e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(34, 197, 94, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {emailAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added!
                    </>
                  ) : (
                    'Add'
                  )}
                </button>
                </div>
                {/* Error Message */}
                {emailError && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-400/30">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-red-300 text-sm">{emailError}</p>
                  </div>
                )}
              </div>

              {/* Email list */}
              {selectedEmails.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedEmails.map((email) => (
                    <span
                      key={email}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-white/80"
                    >
                      {email}
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="text-white/40 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {selectedEmails.length > 0 && (
                <button
                  onClick={handleSendEmails}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition text-white"
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
                  <Mail className="w-4 h-4" />
                  Send to {selectedEmails.length} recipient{selectedEmails.length > 1 ? 's' : ''}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
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
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;


