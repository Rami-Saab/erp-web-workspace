// ==================== REPORTS MODULE - CUSTOM SELECT COMPONENT ====================
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search } from 'lucide-react';
import { List } from 'react-window';

interface SelectOption {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  value: string | number;
  options: SelectOption[];
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  error?: boolean;
  variant?: 'default' | 'plain';
  size?: 'default' | 'compact';
  dropdownDirection?: 'ltr' | 'rtl';
  renderOption?: (option: SelectOption, isSelected: boolean) => React.ReactNode;
  renderValue?: (option: SelectOption) => React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  disableInternalFilter?: boolean;
  minSearchLength?: number;
  emptyMessage?: string;
  minSearchLengthMessage?: string;
  virtualized?: boolean;
  itemSize?: number;
  listPadding?: string | number;
  optionPadding?: string;
  optionInset?: string | number;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = 'Select...',
  className = '',
  searchable = false,
  searchPlaceholder = 'Search...',
  error = false,
  variant = 'default',
  size = 'default',
  dropdownDirection = 'ltr',
  renderOption,
  renderValue,
  searchValue,
  onSearchChange,
  disableInternalFilter = false,
  minSearchLength = 0,
  emptyMessage = 'No options found',
  minSearchLengthMessage,
  virtualized = false,
  itemSize = 32,
  listPadding,
  optionPadding,
  optionInset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  // Calculate minimum width based on longest option label (moved before useEffect)
  const minWidth = useMemo(() => {
    const allLabels = [
      ...options.map(opt => opt.label),
      placeholder || 'Select...'
    ];
    // Find the longest label
    const longestLabel = allLabels.reduce((longest, label) => 
      label.length > longest.length ? label : longest, 
      ''
    );
    
    // Different calculation for w-auto (compact) vs w-full (full width)
    if (className.includes('w-auto')) {
      // Estimate width for compact select in ShareDialog:
      // - Average character width: ~6-7px for text-xs
      // - Padding: 16px (8px left + 8px right for px-2)
      // - Icon space: 12px (icon) + 6px (gap) = 18px
      // - Safety margin: 4px
      const charWidth = 6.5; // Average character width for text-xs
      const estimatedWidth = longestLabel.length * charWidth + 38; // 16px padding + 18px icon space + 4px margin
      // Use a reasonable min-width: at least 60px, or calculated width, max 120px for compact
      const finalWidth = Math.max(60, Math.min(estimatedWidth, 120));
      return `${finalWidth}px`;
    } else {
      // For w-full selects, calculate based on typical input width
      // - Average character width: ~7-8px for text-sm
      // - Padding: 32px (16px left + 16px right for px-4)
      // - Icon space: 16px (icon) + 8px (gap) = 24px
      // - Safety margin: 16px
      const charWidth = 7.5; // Average character width for text-sm
      const estimatedWidth = longestLabel.length * charWidth + 72; // 32px padding + 24px icon space + 16px margin
      // Use a reasonable min-width: at least 200px, or calculated width, max 500px for full width
      const finalWidth = Math.max(200, Math.min(estimatedWidth, 500));
      return `${finalWidth}px`;
    }
  }, [options, placeholder, className]);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) {
      return null;
    }
    const rect = buttonRef.current.getBoundingClientRect();

    // Parse minWidth to get numeric value
    const widthValue = parseFloat(minWidth);

    // Always position below the button
    // For w-full, use button width; otherwise use calculated minWidth
    const dropdownWidth = className.includes('w-full')
      ? rect.width
      : (widthValue || rect.width);

    return {
      top: rect.bottom + 8, // Always 8px below the button
      left: rect.left,
      width: dropdownWidth, // Use button width for w-full, or calculated minWidth
    };
  }, [className, minWidth]);

  // Calculate position when dropdown opens - always opens downward
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const nextPosition = updatePosition();
      if (nextPosition) {
        setPosition(nextPosition);
      }
      
      // Update position on scroll or resize (but keep it fixed relative to viewport)
      const handleScroll = () => {
        // Don't update position on scroll - keep it fixed
        // Just close if button goes out of view
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) {
            setIsOpen(false);
            setSearchQuery('');
          }
        }
      };
      
      const handleResize = () => {
        const next = updatePosition();
        if (next) {
          setPosition(next);
        }
      };
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen, minWidth, className]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current && 
        !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = 'hidden';
      
      // Focus search input when dropdown opens
      if (searchable && searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, searchable]);

  const effectiveSearchQuery = searchValue !== undefined ? searchValue : searchQuery;
  const isBelowMinSearchLength =
    searchable && minSearchLength > 0 && effectiveSearchQuery.trim().length < minSearchLength;

  // Memoize filtered options
  const filteredOptions = useMemo(() => {
    if (!searchable) {
      return options;
    }
    if (isBelowMinSearchLength) {
      return [];
    }
    if (disableInternalFilter) {
      return options;
    }
    const query = effectiveSearchQuery.toLowerCase();
    if (!query.trim()) {
      return options;
    }
    return options.filter(opt => 
      opt.label.toLowerCase().includes(query)
    );
  }, [searchable, effectiveSearchQuery, options, disableInternalFilter, isBelowMinSearchLength]);

  const selectedOption = useMemo(() => 
    options.find(opt => opt.value === value),
    [options, value]
  );

  const handleToggle = useCallback(() => {
    if (!isOpen) {
      const nextPosition = updatePosition();
      if (nextPosition) {
        setPosition(nextPosition);
      }
      setIsOpen(true);
      return;
    }
    setIsOpen(false);
  }, [isOpen, updatePosition]);

  const handleSelect = useCallback((optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
    if (searchValue === undefined) {
    setSearchQuery('');
    } else if (onSearchChange) {
      onSearchChange('');
    }
  }, [onChange]);

  const dropdownMaxHeight = useMemo(() => {
    const preferred = searchable ? 400 : 180;
    if (typeof window === 'undefined') return preferred;
    const bottomPadding = 24;
    const available = window.innerHeight - (position?.top ?? 0) - bottomPadding;
    return Math.max(120, Math.min(preferred, available));
  }, [position?.top, searchable]);

  const listMaxHeight = useMemo(() => {
    const offset = searchable ? 48 : 12;
    return Math.max(96, dropdownMaxHeight - offset);
  }, [dropdownMaxHeight, searchable]);

  const isCompact = size === 'compact' || className.includes('w-auto');
  const listPaddingValue = listPadding ?? "0.375rem";
  const optionPaddingValue = optionPadding ?? "0.5rem 0.75rem";
  const optionInsetValue =
    optionInset === undefined
      ? null
      : typeof optionInset === "number"
        ? `${optionInset}px`
        : optionInset;

  return (
    <div ref={selectRef} className={`relative ${className.includes('w-full') ? 'w-full' : className.includes('w-auto') ? 'inline-flex' : 'w-full inline-flex'} ${className}`} style={className.includes('w-auto') ? {} : className.includes('w-full') ? {} : { minWidth }}>
      {/* Select Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`${className.includes('w-full') ? 'w-full' : className.includes('w-auto') ? 'w-auto' : 'w-full'} ${isCompact ? 'px-2.5 py-1.5' : 'px-3 py-2'} focus:outline-none ${variant === 'plain' ? '' : 'focus:ring-2'} flex items-center justify-between gap-1.5 transition-all duration-300 whitespace-nowrap rounded-lg ${
          variant === 'plain' ? '' : isOpen ? 'ring-2 ring-blue-400/30' : error ? 'border' : ''
        } ${
          variant === 'plain'
            ? ''
            : error 
            ? 'border-red-400/50 focus:ring-red-400/30' 
            : 'focus:ring-white/30 glass-input'
        }`}
        style={{
          background: variant === 'plain'
            ? "transparent"
            : isOpen 
            ? "rgba(255, 255, 255, 0.18)" 
            : error 
            ? "rgba(255, 255, 255, 0.12)" 
            : "rgba(255, 255, 255, 0.1)",
          backdropFilter: variant === 'plain'
            ? "none"
            : isOpen ? "blur(16px)" : "blur(16px)",
          WebkitBackdropFilter: variant === 'plain'
            ? "none"
            : isOpen ? "blur(16px)" : "blur(16px)",
          border: variant === 'plain'
            ? "none"
            : error 
            ? "1px solid rgba(239, 68, 68, 0.5)" 
            : isOpen 
            ? "1px solid rgba(255, 255, 255, 0.3)" 
            : "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: variant === 'plain'
            ? "none"
            : isOpen 
            ? "inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(59, 130, 246, 0.2), 0 1px 2px 0 rgba(255, 255, 255, 0.05)" 
            : "inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.05)",
          zIndex: isOpen ? 10000 : 'auto',
          position: 'relative',
          minWidth: className.includes('w-auto') ? 'fit-content' : className.includes('w-full') ? 'unset' : minWidth,
          width: className.includes('w-auto') ? 'fit-content' : className.includes('w-full') ? '100%' : '100%',
          maxWidth: className.includes('w-auto') ? 'fit-content' : className.includes('w-full') ? '100%' : undefined,
          minHeight: isCompact ? 'auto' : 'unset',
          height: isCompact ? 'auto' : 'auto',
          margin: 0,
          display: 'inline-flex',
          alignItems: 'center',
        }}
        onMouseEnter={(e) => {
          if (!isOpen && !error && variant !== 'plain') {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.25)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen && !error && variant !== 'plain') {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.05)';
          }
        }}
      >
        <span className={`text-left flex-1 min-w-0 ${isCompact ? 'text-xs' : 'text-sm'} leading-tight whitespace-nowrap ${selectedOption ? 'text-white font-medium' : 'text-white/60'}`}>
          {selectedOption
            ? (renderValue ? renderValue(selectedOption) : selectedOption.label)
            : placeholder}
        </span>
        <ChevronDown 
          className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'} text-white/70 transition-all duration-200 flex-shrink-0 ml-auto ${isOpen ? 'rotate-180 text-white' : ''}`} 
        />
      </button>

      {/* Backdrop Overlay with Blur */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 transition-opacity duration-200"
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 3000050,
          }}
          onClick={() => {
            setIsOpen(false);
            setSearchQuery('');
          }}
        />,
        document.body
      )}

      {/* Dropdown Menu */}
      {isOpen && position && createPortal(
        <div
          ref={dropdownRef}
          className="fixed rounded-xl overflow-hidden flex flex-col"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: className.includes('w-auto') ? 'fit-content' : `${position.width}px`,
            minWidth: className.includes('w-auto') ? 'fit-content' : `${position.width}px`,
            maxWidth: className.includes('w-full') ? `${position.width}px` : undefined,
            maxHeight: `${dropdownMaxHeight}px`,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
            animation: "fadeIn 0.2s ease-out",
            transform: "translateY(0)",
            position: "fixed",
            direction: dropdownDirection,
            zIndex: 3000100,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          {searchable && (
            <div className="px-3 py-2.5 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 flex-shrink-0 pointer-events-none z-10" />
              <input
                ref={searchInputRef}
                type="text"
                value={effectiveSearchQuery}
                onChange={(e) => {
                  if (onSearchChange) {
                    onSearchChange(e.target.value);
                  } else {
                    setSearchQuery(e.target.value);
                  }
                }}
                placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-3 py-2 text-white placeholder-white/50 rounded-lg focus:outline-none text-xs transition-all duration-200"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.2s ease",
                  }}
                onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsOpen(false);
                    setSearchQuery('');
                  }
                }}
              />
              </div>
            </div>
          )}

          {/* Options List */}
          <div 
            className={
              virtualized
                ? "overflow-hidden p-0"
                : "overflow-y-auto p-1.5 custom-select-scrollbar"
            }
            style={{ 
              maxHeight: `${listMaxHeight}px`,
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
              direction: dropdownDirection,
            }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-white/40 text-sm">
                <p>
                  {isBelowMinSearchLength
                    ? (minSearchLengthMessage || `Type at least ${minSearchLength} characters`)
                    : emptyMessage}
                </p>
              </div>
            ) : virtualized ? (
              <List
                className="custom-select-scrollbar"
                rowCount={filteredOptions.length}
                rowHeight={itemSize}
                defaultHeight={listMaxHeight}
                style={{
                  height: listMaxHeight,
                  width: "100%",
                  direction: dropdownDirection,
                  padding: listPaddingValue,
                  boxSizing: "border-box",
                }}
                rowProps={{}}
                rowComponent={({ index, style, ariaAttributes }) => {
                  const option = filteredOptions[index];
                  const isSelected = option.value === value;
                  return (
                    <div
                      style={
                        optionInsetValue
                          ? {
                              ...style,
                              paddingLeft: optionInsetValue,
                              paddingRight: optionInsetValue,
                              boxSizing: "border-box",
                            }
                          : style
                      }
                      {...ariaAttributes}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-left group"
                        style={{
                          boxSizing: "border-box",
                          ...(optionInsetValue
                            ? { width: "100%" }
                            : { width: "calc(100% - 0.5rem)", marginRight: "0.5rem" }),
                          ...(optionPadding ? { padding: optionPaddingValue } : {}),
                          background: isSelected 
                            ? "rgba(59, 130, 246, 0.25)" 
                            : "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(12px)",
                          WebkitBackdropFilter: "blur(12px)",
                          border: isSelected 
                            ? "1px solid rgba(59, 130, 246, 0.4)" 
                            : "1px solid rgba(255, 255, 255, 0.1)",
                          boxShadow: isSelected
                            ? "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)"
                            : "none",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {renderOption ? (
                          renderOption(option, isSelected)
                        ) : (
                          <span className={`flex-1 min-w-0 text-xs transition-colors pr-4 ${
                            isSelected 
                              ? 'text-white font-semibold' 
                              : 'text-white/90 group-hover:text-white'
                          }`} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            {option.label}
                          </span>
                        )}
                        {isSelected && (
                          <div 
                            className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ml-3"
                            style={{
                              background: "rgba(59, 130, 246, 0.3)",
                              backdropFilter: "blur(8px)",
                              border: "1px solid rgba(59, 130, 246, 0.4)",
                              boxShadow: "0 1px 2px 0 rgba(59, 130, 246, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)",
                            }}
                          >
                            <Check className="w-2.5 h-2.5 text-blue-200" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    </div>
                  );
                }}
              />
            ) : (
              <div
                className="space-y-1"
                style={listPadding !== undefined ? { padding: listPaddingValue } : undefined}
              >
                {filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <div
                      key={option.value}
                      style={
                        optionInsetValue
                          ? { paddingLeft: optionInsetValue, paddingRight: optionInsetValue }
                          : undefined
                      }
                    >
                      <button
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-left group"
                        style={{
                          ...(optionInsetValue ? { width: "100%" } : {}),
                          ...(optionPadding ? { padding: optionPaddingValue } : {}),
                          background: isSelected 
                            ? "rgba(59, 130, 246, 0.25)" 
                            : "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(12px)",
                          WebkitBackdropFilter: "blur(12px)",
                          border: isSelected 
                            ? "1px solid rgba(59, 130, 246, 0.4)" 
                            : "1px solid rgba(255, 255, 255, 0.1)",
                          boxShadow: isSelected
                            ? "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)"
                            : "none",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {renderOption ? (
                          renderOption(option, isSelected)
                        ) : (
                        <span className={`flex-1 min-w-0 text-xs transition-colors pr-4 ${
                          isSelected 
                            ? 'text-white font-semibold' 
                            : 'text-white/90 group-hover:text-white'
                        }`} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                          {option.label}
                        </span>
                        )}
                        {isSelected && (
                          <div 
                            className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ml-3"
                            style={{
                              background: "rgba(59, 130, 246, 0.3)",
                              backdropFilter: "blur(8px)",
                              border: "1px solid rgba(59, 130, 246, 0.4)",
                              boxShadow: "0 1px 2px 0 rgba(59, 130, 246, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)",
                            }}
                          >
                            <Check className="w-2.5 h-2.5 text-blue-200" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomSelect;
