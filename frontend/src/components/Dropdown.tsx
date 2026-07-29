import React, { useState, useRef, useEffect, useId } from 'react';
import { Search, ChevronDown, Check, X, SlidersHorizontal } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

export interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option...',
  error,
  disabled = false,
  searchable = true,
  className = '',
  id,
  name,
  required = false,
}) => {
  const generatedId = useId();
  const dropdownId = id || generatedId;
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Filter options by search term
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opt.description && opt.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    if (isOpen) {
      const selectedIdx = filteredOptions.findIndex((opt) => String(opt.value) === String(value));
      setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    if (onChange) {
      onChange({ target: { value: option.value, name } });
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 text-left relative ${className}`} ref={dropdownRef}>
      {label && (
        <label htmlFor={dropdownId} className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </span>
          {options.length > 5 && searchable && (
            <span className="text-[10px] text-slate-400 font-normal normal-case">
              {options.length} options
            </span>
          )}
        </label>
      )}

      {/* Dropdown Trigger Button */}
      <div className="relative">
        <button
          type="button"
          id={dropdownId}
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`w-full px-4 py-2.5 text-sm rounded-xl font-medium transition-all duration-200 flex items-center justify-between gap-2 border shadow-xs outline-none cursor-pointer select-none text-left
            ${disabled 
              ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed' 
              : isOpen
                ? 'bg-white dark:bg-slate-900 border-primary ring-2 ring-primary/20 text-slate-900 dark:text-slate-100 shadow-md'
                : error 
                  ? 'bg-white dark:bg-slate-900 border-rose-500 text-slate-900 dark:text-slate-100 hover:border-rose-600' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
            }
          `}
        >
          <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
            {selectedOption?.icon && (
              <span className="text-primary flex-shrink-0">{selectedOption.icon}</span>
            )}
            <span className={`truncate ${!selectedOption ? 'text-slate-400 dark:text-slate-500 font-normal' : ''}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {selectedOption?.badge && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-primary dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                {selectedOption.badge}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
          </div>
        </button>

        {/* Hidden select for accessibility & form compatibility */}
        <select
          name={name}
          value={value}
          onChange={(e) => onChange && onChange(e)}
          className="sr-only"
          tabIndex={-1}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Dropdown Menu Popup */}
        {isOpen && (
          <div 
            className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl glass-dropdown overflow-hidden animate-scale-in origin-top shadow-2xl border border-slate-200/80 dark:border-slate-700/80"
            role="listbox"
          >
            {/* Search Input inside Dropdown */}
            {searchable && options.length > 3 && (
              <div className="p-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search options..."
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center px-4">
                  <SlidersHorizontal className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600 mb-1" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    No matching options found
                  </p>
                  {searchTerm && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      Try searching with a different term
                    </p>
                  )}
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = String(opt.value) === String(value);
                  const isHighlighted = idx === highlightedIndex;

                  return (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(opt)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between gap-3 cursor-pointer transition-colors duration-150 select-none
                        ${opt.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                        ${isSelected 
                          ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-indigo-300 font-semibold' 
                          : isHighlighted
                            ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {opt.icon && (
                          <span className={`flex-shrink-0 ${isSelected ? 'text-primary' : 'text-slate-400'}`}>
                            {opt.icon}
                          </span>
                        )}
                        <div className="flex flex-col truncate">
                          <span className="truncate">{opt.label}</span>
                          {opt.description && (
                            <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 truncate">
                              {opt.description}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {opt.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {opt.badge}
                          </span>
                        )}
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary dark:text-indigo-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-500 font-medium select-none animate-fade-in flex items-center gap-1 mt-0.5">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
