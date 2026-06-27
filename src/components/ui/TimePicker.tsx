// ==================== TIME PICKER COMPONENT ====================
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface TimePickerProps {
  value: string; // Format: "HH:MM"
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = 'HH:MM',
  className = '',
  error = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Convert 24-hour to 12-hour format
  const convertTo12Hour = (hour24: string): { hour12: string; period: 'AM' | 'PM' } => {
    const h = parseInt(hour24, 10);
    if (h === 0) return { hour12: '12', period: 'AM' };
    if (h === 12) return { hour12: '12', period: 'PM' };
    if (h < 12) return { hour12: String(h), period: 'AM' };
    return { hour12: String(h - 12), period: 'PM' };
  };

  // Convert 12-hour to 24-hour format
  const convertTo24Hour = (hour12: string, period: 'AM' | 'PM'): string => {
    const h = parseInt(hour12, 10);
    if (period === 'AM') {
      if (h === 12) return '00';
      return String(h).padStart(2, '0');
    } else {
      if (h === 12) return '12';
      return String(h + 12).padStart(2, '0');
    }
  };

  // Initialize state from value (24-hour format)
  const initialTime = value ? (() => {
    const [h, m] = value.split(':');
    const { hour12, period } = convertTo12Hour(h || '00');
    return {
      hour12,
      minute: m || '00',
      period: period as 'AM' | 'PM',
    };
  })() : { hour12: '12', minute: '00', period: 'AM' as 'AM' | 'PM' };

  const [hour12, setHour12] = useState(initialTime.hour12);
  const [minutes, setMinutes] = useState(initialTime.minute);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialTime.period);
  const [tempHour12, setTempHour12] = useState(initialTime.hour12);
  const [tempMinutes, setTempMinutes] = useState(initialTime.minute);
  const [tempPeriod, setTempPeriod] = useState<'AM' | 'PM'>(initialTime.period);
  
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speedRef = useRef<number>(200); // Initial speed in ms
  const isHoldingRef = useRef<boolean>(false);

  // Update temp values when value changes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      const { hour12: h12, period: p } = convertTo12Hour(h || '00');
      setHour12(h12);
      setMinutes(m || '00');
      setPeriod(p);
      setTempHour12(h12);
      setTempMinutes(m || '00');
      setTempPeriod(p);
    }
  }, [value]);

  // Generate hours (1-12) and minutes arrays
  const hoursList = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const minutesList = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  // Calculate position when dropdown opens - same as CustomSelect: always opens downward
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          
          // Always position below the button (same as CustomSelect)
          setPosition({
            top: rect.bottom + 8, // 8px below the button (same as CustomSelect)
            left: rect.left,
            width: rect.width,
          });
        }
      };
      
      updatePosition();
      
      // Update position on scroll or resize (but keep it fixed relative to viewport)
      const handleScroll = () => {
        // Don't update position on scroll - keep it fixed
        // Just close if button goes out of view
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) {
            setIsOpen(false);
          }
        }
      };
      
      const handleResize = () => {
        updatePosition();
      };
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev);
    }
  }, [disabled]);

  const handleOK = useCallback(() => {
    const hour24 = convertTo24Hour(tempHour12, tempPeriod);
    const timeValue = `${hour24}:${tempMinutes}`;
    setHour12(tempHour12);
    setMinutes(tempMinutes);
    setPeriod(tempPeriod);
    onChange(timeValue);
    setIsOpen(false);
  }, [tempHour12, tempMinutes, tempPeriod, onChange]);

  const handleCancel = useCallback(() => {
    setTempHour12(hour12);
    setTempMinutes(minutes);
    setTempPeriod(period);
    setIsOpen(false);
  }, [hour12, minutes, period]);

  // Cleanup interval and timeout on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Perform single change (for click)
  const performSingleChange = useCallback((
    type: 'hours' | 'minutes' | 'period',
    direction: 'up' | 'down'
  ) => {
    if (type === 'hours') {
      setTempHour12((current) => {
        const currentIndex = hoursList.indexOf(current);
        if (direction === 'up') {
          const nextIndex = currentIndex === hoursList.length - 1 ? 0 : currentIndex + 1;
          return hoursList[nextIndex];
        } else {
          const prevIndex = currentIndex === 0 ? hoursList.length - 1 : currentIndex - 1;
          return hoursList[prevIndex];
        }
      });
    } else if (type === 'minutes') {
      setTempMinutes((current) => {
        const currentIndex = minutesList.indexOf(current);
        if (direction === 'up') {
          const nextIndex = currentIndex === minutesList.length - 1 ? 0 : currentIndex + 1;
          return minutesList[nextIndex];
        } else {
          const prevIndex = currentIndex === 0 ? minutesList.length - 1 : currentIndex - 1;
          return minutesList[prevIndex];
        }
      });
    } else if (type === 'period') {
      setTempPeriod((current) => (current === 'AM' ? 'PM' : 'AM'));
    }
  }, [hoursList, minutesList]);

  // Handle continuous increment/decrement (for hold)
  const startContinuousChange = useCallback((
    type: 'hours' | 'minutes' | 'period',
    direction: 'up' | 'down'
  ) => {
    // Mark as holding
    isHoldingRef.current = true;

    // Clear any existing interval and timeout
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Reset speed
    speedRef.current = 200;

    // Function to perform change
    const performChange = () => {
      performSingleChange(type, direction);
    };

    // Start continuous change after delay (300ms) - only if still holding
    timeoutRef.current = setTimeout(() => {
      if (isHoldingRef.current) {
        // Perform first change after delay
        performChange();

        // Start interval with increasing speed
        const startInterval = () => {
          intervalRef.current = setInterval(() => {
            if (isHoldingRef.current) {
              performChange();
              // Gradually increase speed (decrease interval)
              speedRef.current = Math.max(50, speedRef.current * 0.9);
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                startInterval();
              }
            } else {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
            }
          }, speedRef.current);
        };

        startInterval();
      }
    }, 300); // 300ms delay before starting continuous change
  }, [performSingleChange]);

  const stopContinuousChange = useCallback(() => {
    isHoldingRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    speedRef.current = 200; // Reset speed
  }, []);

  const scrollToValue = (containerId: string, value: string) => {
    const container = document.getElementById(containerId);
    const item = container?.querySelector(`[data-value="${value}"]`);
    if (item) {
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToValue('hours-list', tempHour12);
        scrollToValue('minutes-list', tempMinutes);
        scrollToValue('period-list', tempPeriod);
      }, 100);
    }
  }, [isOpen, tempHour12, tempMinutes, tempPeriod]);

  // Format display value in 12-hour format
  const displayValue = value ? (() => {
    const [h, m] = value.split(':');
    const { hour12, period } = convertTo12Hour(h || '00');
    return `${hour12}:${m || '00'} ${period}`;
  })() : placeholder;

  return (
    <>
      <div ref={pickerRef} className={`relative ${className}`}>
        {/* Time Input Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`w-full pl-12 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 text-sm transition-all flex items-center justify-between ${
            error ? 'border-red-400/50 focus:ring-red-400/30' : 'focus:ring-white/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${
            isOpen ? 'ring-2 ring-white/30' : ''
          }`}
          style={{
            background: isOpen ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(16px)",
            border: error ? "1px solid rgba(239, 68, 68, 0.5)" : isOpen ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: isOpen 
              ? "0 6px 20px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2), 0 0 0 2px rgba(59, 130, 246, 0.2)" 
              : "inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.05)",
            zIndex: isOpen ? 10000 : 'auto',
            position: 'relative',
            minHeight: '42px',
            height: '42px',
          }}
          onMouseEnter={(e) => {
            if (!disabled && !isOpen) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !isOpen) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
          }}
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-10 pointer-events-none">
            <Clock className="w-5 h-5" />
          </div>
          <span className={`flex-1 truncate text-left pl-8 ${value ? 'text-white font-medium' : 'text-white/60'}`}>
            {displayValue}
          </span>
        </button>
      </div>

      {/* Backdrop Overlay */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[9998] transition-opacity duration-200"
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
          onClick={handleCancel}
        />,
        document.body
      )}

      {/* Time Picker Dropdown */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[9999] rounded-xl border overflow-hidden flex flex-col shadow-2xl"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${Math.max(480, position.width)}px`,
            maxHeight: 'calc(100vh - 20px)',
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
            animation: "fadeIn 0.2s ease-out",
            transform: "translateY(0)",
            position: "fixed",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Time Selection - Organized Layout */}
          <div className="p-5 flex-1 min-h-0">
            <div className="flex items-center justify-center gap-5">
              {/* Hours Column */}
              <div className="flex flex-col items-center gap-2.5">
                <label className="text-xs text-white/50 font-medium uppercase tracking-wider mb-0.5">Hours</label>
                <div 
                  className="flex items-center gap-2 rounded-lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)",
                    padding: '10px 12px',
                  }}
                >
                  {/* Current Value */}
                  <div 
                    className="flex items-center justify-center rounded-lg transition-all duration-200"
                    style={{
                      background: "rgba(59, 130, 246, 0.25)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      boxShadow: "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                      width: '56px',
                      height: '56px',
                    }}
                  >
                    <span className="text-2xl font-bold text-white">{tempHour12}</span>
                  </div>
                  
                  {/* Buttons Container - Right Side */}
                  <div className="flex flex-col gap-1 items-center justify-center">
                    {/* Up Button */}
                    <button
                      type="button"
                      onClick={() => {
                        // Single click - only if not holding
                        if (!isHoldingRef.current) {
                          performSingleChange('hours', 'up');
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        startContinuousChange('hours', 'up');
                      }}
                      onMouseUp={stopContinuousChange}
                      className="w-5 h-4 flex items-center justify-center rounded transition-all duration-150"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        stopContinuousChange();
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      <ChevronUp className="w-2 h-2 text-white/60" strokeWidth={2.5} />
                    </button>
                    
                    {/* Down Button */}
                    <button
                      type="button"
                      onClick={() => {
                        // Single click - only if not holding
                        if (!isHoldingRef.current) {
                          performSingleChange('hours', 'down');
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        startContinuousChange('hours', 'down');
                      }}
                      onMouseUp={stopContinuousChange}
                      className="w-5 h-4 flex items-center justify-center rounded transition-all duration-150"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        stopContinuousChange();
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      <ChevronDown className="w-2 h-2 text-white/60" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="flex flex-col items-center justify-center pt-11">
                <span className="text-3xl font-bold text-white/50">:</span>
              </div>

              {/* Minutes Column */}
              <div className="flex flex-col items-center gap-2.5">
                <label className="text-xs text-white/50 font-medium uppercase tracking-wider mb-0.5">Minutes</label>
                <div 
                  className="flex items-center gap-2 rounded-lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)",
                    padding: '10px 12px',
                  }}
                >
                  {/* Current Value */}
                  <div 
                    className="flex items-center justify-center rounded-lg transition-all duration-200"
                    style={{
                      background: "rgba(59, 130, 246, 0.25)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      boxShadow: "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                      width: '56px',
                      height: '56px',
                    }}
                  >
                    <span className="text-2xl font-bold text-white">{tempMinutes}</span>
                  </div>
                  
                  {/* Buttons Container - Right Side */}
                  <div className="flex flex-col gap-1 items-center justify-center">
                    {/* Up Button */}
                    <button
                      type="button"
                      onClick={() => {
                        // Single click - only if not holding
                        if (!isHoldingRef.current) {
                          performSingleChange('minutes', 'up');
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        startContinuousChange('minutes', 'up');
                      }}
                      onMouseUp={stopContinuousChange}
                      className="w-5 h-4 flex items-center justify-center rounded transition-all duration-150"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        stopContinuousChange();
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      <ChevronUp className="w-2 h-2 text-white/60" strokeWidth={2.5} />
                    </button>
                    
                    {/* Down Button */}
                    <button
                      type="button"
                      onClick={() => {
                        // Single click - only if not holding
                        if (!isHoldingRef.current) {
                          performSingleChange('minutes', 'down');
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        startContinuousChange('minutes', 'down');
                      }}
                      onMouseUp={stopContinuousChange}
                      className="w-5 h-4 flex items-center justify-center rounded transition-all duration-150"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        stopContinuousChange();
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      <ChevronDown className="w-2 h-2 text-white/60" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>

              {/* AM/PM Column */}
              <div className="flex flex-col items-center gap-2.5">
                <label className="text-xs text-white/50 font-medium uppercase tracking-wider mb-0.5">Period</label>
                <div 
                  className="flex items-center gap-2 rounded-lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)",
                    padding: '10px 12px',
                  }}
                >
                  {/* Current Value */}
                  <div 
                    className="flex items-center justify-center rounded-lg transition-all duration-200"
                    style={{
                      background: "rgba(59, 130, 246, 0.25)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      boxShadow: "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                      width: '56px',
                      height: '56px',
                    }}
                  >
                    <span className="text-xl font-bold text-white">{tempPeriod}</span>
                  </div>
                  
                  {/* Buttons Container - Right Side */}
                  <div className="flex flex-col gap-1 items-center justify-center">
                    {/* Up Button */}
                    <button
                      type="button"
                      onClick={() => {
                        // Single click - only if not holding
                        if (!isHoldingRef.current) {
                          performSingleChange('period', 'up');
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        startContinuousChange('period', 'up');
                      }}
                      onMouseUp={stopContinuousChange}
                      className="w-5 h-4 flex items-center justify-center rounded transition-all duration-150"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        stopContinuousChange();
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      <ChevronUp className="w-2 h-2 text-white/60" strokeWidth={2.5} />
                    </button>
                    
                    {/* Down Button */}
                    <button
                      type="button"
                      onClick={() => {
                        // Single click - only if not holding
                        if (!isHoldingRef.current) {
                          performSingleChange('period', 'down');
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        startContinuousChange('period', 'down');
                      }}
                      onMouseUp={stopContinuousChange}
                      className="w-5 h-4 flex items-center justify-center rounded transition-all duration-150"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        stopContinuousChange();
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      <ChevronDown className="w-2 h-2 text-white/60" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 flex items-center justify-center flex-shrink-0">
            <button
              type="button"
              onClick={handleOK}
              className="px-6 py-2.5 rounded-lg font-semibold transition-all text-white text-sm"
              style={{
                background: "rgba(59, 130, 246, 0.15)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(59, 130, 246, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
              }}
            >
              OK
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default TimePicker;

