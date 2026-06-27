"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "./utils";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateDisplay = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

const formatFullDateDisplay = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  return `${dayName}, ${monthName} ${day}`;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  error = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const date = value ? new Date(value) : undefined;
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 });

  // Calculate position when calendar opens
  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const calendarWidth = 320;
          const calendarHeight = 420;
          // Calculate the center of the input field horizontally
          const inputCenterX = rect.left + rect.width / 2;
          // Center the calendar on the input field center (horizontally)
          const centeredLeft = inputCenterX - calendarWidth / 2;
          // Ensure it doesn't go off-screen horizontally
          const left = Math.max(8, Math.min(centeredLeft, window.innerWidth - calendarWidth - 8));
          // Calculate the center of the input field vertically
          const inputCenterY = rect.top + rect.height / 2;
          // Position calendar centered vertically on the input field
          const centeredTop = inputCenterY - calendarHeight / 2;
          // Ensure it doesn't go off-screen vertically
          const top = Math.max(8, Math.min(centeredTop, window.innerHeight - calendarHeight - 8));
          setPosition({
            top: top,
            left: left,
            width: rect.width,
          });
        }
      };
      
      updatePosition();
      
      const handleScroll = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) {
            setIsOpen(false);
          } else {
            updatePosition();
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

  // Close calendar when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
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

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      onChange?.(formattedDate);
      setIsOpen(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const displayDate = date || new Date();

  return (
    <div className={`relative ${className.includes('w-full') ? 'w-full' : 'w-full'} ${className}`}>
      {/* Date Picker Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          "w-full px-4 py-2.5 focus:outline-none focus:ring-2 flex items-center justify-between gap-1.5 transition-all duration-300 rounded-lg",
          isOpen ? 'ring-2 ring-blue-400/30' : error ? 'border' : '',
          error 
            ? 'border-red-400/50 focus:ring-red-400/30' 
            : 'focus:ring-white/30 glass-input',
          className
        )}
        style={{
          background: isOpen 
            ? "rgba(255, 255, 255, 0.18)" 
            : error 
            ? "rgba(255, 255, 255, 0.12)" 
            : "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: error 
            ? "1px solid rgba(239, 68, 68, 0.5)" 
            : isOpen 
            ? "1px solid rgba(255, 255, 255, 0.3)" 
            : "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: isOpen 
            ? "inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(59, 130, 246, 0.2), 0 1px 2px 0 rgba(255, 255, 255, 0.05)" 
            : "inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.05)",
          zIndex: isOpen ? 10000 : 'auto',
          position: 'relative',
          minHeight: '42px',
          height: '42px',
        }}
        onMouseEnter={(e) => {
          if (!isOpen && !error) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.25)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen && !error) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.05)';
          }
        }}
      >
        <span className={cn(
          "text-left flex-1 min-w-0 text-sm leading-tight",
          value && date ? 'text-white font-medium' : 'text-white/60'
        )}>
          {value && date ? formatDateDisplay(date) : placeholder}
        </span>
        <CalendarIcon 
          className={cn(
            "w-4 h-4 text-white/70 transition-all duration-200 flex-shrink-0 ml-auto",
            isOpen && 'text-white'
          )} 
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
          onClick={() => setIsOpen(false)}
        />,
        document.body
      )}

      {/* Calendar Dropdown - Windows 11 Style */}
      {isOpen && createPortal(
        <div
          ref={calendarRef}
          className="fixed rounded-xl overflow-hidden"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: "320px",
            minWidth: "320px",
            maxWidth: "320px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
            animation: "fadeIn 0.2s ease-out",
            transform: "translateY(0)",
            position: "fixed",
            padding: "0",
            zIndex: 3000100,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Calendar Content */}
          <div 
            className="p-4"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <style>{`
              /* Override react-day-picker default styles for outside days - Windows 11 style */
              /* Days from previous and next month - Distinct faded color */
              .rdp-day_outside {
                color: rgba(255, 255, 255, 0.4) !important;
                opacity: 0.6 !important;
              }
              .rdp-day_outside:hover {
                color: rgba(255, 255, 255, 0.55) !important;
                background-color: rgba(255, 255, 255, 0.08) !important;
                opacity: 0.7 !important;
              }
              .rdp-day_outside[aria-selected] {
                color: rgba(255, 255, 255, 0.7) !important;
                background-color: rgba(255, 255, 255, 0.12) !important;
                opacity: 0.8 !important;
              }
              
              /* Current month days - Clear white */
              .rdp-day:not(.rdp-day_outside):not(.rdp-day_disabled) {
                color: rgb(255, 255, 255) !important;
                opacity: 1 !important;
              }
            `}</style>
            <DayPicker
              mode="single"
              selected={date}
              onSelect={handleSelect}
              className="p-0"
              fixedWeeks={true}
              showOutsideDays={true}
              classNames={{
                months: "flex flex-col gap-0",
                month: "flex flex-col gap-0 w-full",
               caption: "flex items-center justify-center w-full mb-4 px-0 relative h-8",
               caption_label: "text-sm font-semibold text-white z-0 relative",
               nav: "absolute inset-0 flex items-center justify-between w-full px-0 pointer-events-none",
               nav_button: cn(
                 "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer",
                 "bg-white/10 hover:bg-white/20 border border-white/20",
                 "backdrop-filter backdrop-blur-sm",
                 "text-white/70 hover:text-white",
                 "hover:scale-105 active:scale-95",
                 "shadow-sm hover:shadow-md",
                 "flex-shrink-0 pointer-events-auto z-10"
               ),
               nav_button_previous: "!absolute !left-0",
               nav_button_next: "!absolute !right-0",
                table: "w-full border-collapse",
                head_row: "flex mb-2",
                head_cell: "text-white/60 w-10 h-8 font-normal text-xs flex items-center justify-center",
                row: "flex w-full mb-1",
                cell: cn(
                  "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-10 h-10",
                  "[&:has([aria-selected])]:bg-transparent"
                ),
                day: cn(
                  "h-10 w-10 p-0 font-normal rounded-md transition-all duration-150 cursor-pointer text-sm",
                  "text-white hover:bg-white/15 hover:text-white",
                  "focus:bg-white/15 focus:text-white focus:outline-none",
                  "aria-selected:bg-white/20 aria-selected:text-white aria-selected:font-medium",
                  "[&:not(.rdp-day_outside)]:text-white [&:not(.rdp-day_outside)]:opacity-100"
                ),
                day_selected:
                  "bg-white/20 text-white hover:bg-white/25 hover:text-white focus:bg-white/25 focus:text-white font-medium",
                  day_today:
                    "bg-white/10 text-white font-medium rounded-full",
                day_outside: cn(
                  "cursor-pointer text-white/40 opacity-50",
                  "hover:bg-white/5 hover:text-white/50 hover:opacity-60",
                  "aria-selected:bg-white/10 aria-selected:text-white/60 aria-selected:opacity-70"
                ),
                day_disabled: "text-white/20 opacity-30 cursor-not-allowed hover:bg-transparent hover:text-white/20",
                day_hidden: "invisible",
              }}
              components={{
                IconLeft: ({ className, ...props }) => (
                  <ChevronLeft className={cn("h-4 w-4 text-white/80", className)} {...props} />
                ),
                IconRight: ({ className, ...props }) => (
                  <ChevronRight className={cn("h-4 w-4 text-white/80", className)} {...props} />
                ),
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
