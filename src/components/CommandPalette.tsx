import React, { useState, useEffect } from 'react';
import { ListingItem, ActiveScreen } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: ListingItem[];
  onSelectItem: (item: ListingItem) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onSelectCategory: (category: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onNavigate,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? items.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.category.toLowerCase().includes(query.toLowerCase()) ||
          i.location.toLowerCase().includes(query.toLowerCase())
      )
    : items.slice(0, 5);

  const categories = [
    'Books & Notes',
    'Electronics & STEM',
    'Lab Gear & Coats',
    'Calculators & Kits',
    'Dorm Living',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-primary/40 backdrop-blur-sm animate-fadeIn">
      <div onClick={onClose} className="fixed inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden z-10 flex flex-col">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-surface-container bg-surface-container-low">
          <span className="material-symbols-outlined text-primary text-[22px] mr-3">search</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search textbooks, equipment, calculators, dorm gear..."
            className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant text-body-lg outline-none"
          />
          <kbd className="font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded text-on-surface-variant border border-outline-variant/30">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3">
          {/* Quick Categories */}
          {!query && (
            <div>
              <span className="text-label-sm font-semibold uppercase tracking-wider text-secondary px-2">
                Quick Category Jump
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2 px-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onSelectCategory(c);
                      onNavigate('browse-items');
                      onClose();
                    }}
                    className="font-label-md text-label-md bg-surface-container hover:bg-secondary-container hover:text-primary px-3 py-1.5 rounded-lg text-on-surface transition-colors cursor-pointer"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div>
            <span className="text-label-sm font-semibold uppercase tracking-wider text-secondary px-2">
              {query ? `Matching Campus Listings (${filtered.length})` : 'Popular on Campus'}
            </span>
            <div className="mt-1 divide-y divide-surface-container">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container transition-colors cursor-pointer group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover bg-surface-container shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-fixed px-2 py-0.2 rounded font-medium">
                        {item.type}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {item.category}
                      </span>
                    </div>
                    <div className="font-title-md text-[14px] text-on-surface group-hover:text-primary truncate">
                      {item.title}
                    </div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">
                      {item.location} • {item.userName}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[18px]">
                    arrow_forward
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-surface-container-low border-t border-surface-container flex items-center justify-between text-label-sm text-on-surface-variant px-4">
          <span>Navigate with arrow keys</span>
          <button
            onClick={() => {
              onNavigate('browse-items');
              onClose();
            }}
            className="text-primary hover:underline cursor-pointer"
          >
            View all 472 listings
          </button>
        </div>
      </div>
    </div>
  );
};
