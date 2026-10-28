import React, { useState, useMemo } from 'react';
import { ListingItem, ActiveScreen, DropOffNode, ItemCondition, ListingType } from '../types';

interface BrowseViewProps {
  items: ListingItem[];
  onSelectItem: (item: ListingItem) => void;
  onToggleBookmark: (id: string) => void;
  onNavigate: (screen: ActiveScreen) => void;
  initialCategory?: string;
  onOpenCreate: () => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  items,
  onSelectItem,
  onToggleBookmark,
  onNavigate,
  initialCategory,
  onOpenCreate,
}) => {
  // State switcher for demo: results | skeleton | empty
  const [mockState, setMockState] = useState<'results' | 'skeleton' | 'empty'>('results');
  
  // Search query
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filter selections
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : ['Books & Notes']
  );
  const [selectedTypes, setSelectedTypes] = useState<ListingType[]>(['Donation']);
  const [selectedConditions, setSelectedConditions] = useState<ItemCondition[]>(['Like New']);
  const [selectedLocations, setSelectedLocations] = useState<DropOffNode[]>([]);

  // Accordion collapsed states
  const [accordionOpen, setAccordionOpen] = useState({
    category: true,
    type: true,
    condition: true,
    location: true,
  });

  // Mobile drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination count
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter computation
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          (i.courseTag && i.courseTag.toLowerCase().includes(q))
      );
    }

    // Categories
    if (selectedCategories.length > 0) {
      result = result.filter((i) =>
        selectedCategories.some((cat) => i.category.toLowerCase().includes(cat.toLowerCase()))
      );
    }

    // Types
    if (selectedTypes.length > 0) {
      result = result.filter((i) => selectedTypes.includes(i.type));
    }

    // Condition
    if (selectedConditions.length > 0) {
      result = result.filter((i) => selectedConditions.includes(i.condition));
    }

    // Location
    if (selectedLocations.length > 0) {
      result = result.filter((i) => selectedLocations.includes(i.location));
    }

    // Sorting
    if (sortBy === 'oldest') {
      result.reverse();
    } else if (sortBy === 'requested') {
      // sort by type or priority
      result.sort((a, b) => (a.type === 'Exchange' ? -1 : 1));
    }

    return result;
  }, [items, searchQuery, selectedCategories, selectedTypes, selectedConditions, selectedLocations, sortBy]);

  const toggleAccordion = (key: keyof typeof accordionOpen) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedConditions([]);
    setSelectedLocations([]);
    setSearchQuery('');
  };

  const removeCategoryChip = (cat: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== cat));
  };

  const removeConditionChip = (cond: ItemCondition) => {
    setSelectedConditions((prev) => prev.filter((c) => c !== cond));
  };

  const removeTypeChip = (type: ListingType) => {
    setSelectedTypes((prev) => prev.filter((t) => t !== type));
  };

  const totalActiveFilters =
    selectedCategories.length + selectedTypes.length + selectedConditions.length + selectedLocations.length;

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb strip */}
      <div className="w-full bg-surface-container-low/60 py-space-md shadow-sm -mt-6 mb-6">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              Home
            </button>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-semibold">Browse Listings</span>
          </div>

          <div className="flex items-center gap-space-xs bg-surface-container px-3 py-1 rounded-full text-secondary font-label-sm text-label-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse"></span>
            <span>Verified Campus Nodes Only</span>
          </div>
        </div>
      </div>

      {/* Main Browse Container */}
      <div className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mb-space-md">
          <div>
            <div className="inline-flex items-center gap-space-xs px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm mb-space-xs">
              <span className="material-symbols-outlined text-[14px]">cached</span>
              <span>Circular Exchange Directory</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Browse Campus Items
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 flex items-center gap-2">
              <span className="font-semibold text-primary">
                {mockState === 'empty'
                  ? '0 items matching criteria'
                  : mockState === 'skeleton'
                  ? 'Refreshing node inventory...'
                  : `${filteredItems.length} items available on campus`}
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span>Refreshed 3 minutes ago</span>
            </p>
          </div>

          {/* State Switcher Buttons (Active Grid, Loading Skeleton, Empty State) */}
          <div className="flex items-center gap-space-xs self-start lg:self-auto bg-surface-container p-1 rounded-lg">
            <button
              onClick={() => setMockState('results')}
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
                mockState === 'results'
                  ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Active Grid
            </button>
            <button
              onClick={() => setMockState('skeleton')}
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
                mockState === 'skeleton'
                  ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Loading Skeleton
            </button>
            <button
              onClick={() => setMockState('empty')}
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
                mockState === 'empty'
                  ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Empty State
            </button>
          </div>
        </div>

        {/* Full-width Search Bar */}
        <div className="relative w-full mb-space-lg">
          <div className="relative flex items-center bg-surface-container-lowest rounded-xl shadow-sm focus-within:shadow-md transition-shadow">
            <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[24px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchQuery('');
              }}
              className="w-full bg-transparent pl-12 pr-28 py-3.5 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
              placeholder="Search textbooks, graphing calculators, lab coats, desk lamps..."
              type="text"
            />
            <div className="absolute right-3 flex items-center gap-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container hover:bg-surface-container-high px-2 py-1 rounded cursor-pointer"
                >
                  ESC to clear
                </button>
              )}
              <button
                onClick={() => {}}
                className="bg-primary hover:bg-primary-container text-on-primary px-3.5 py-1.5 rounded-lg font-label-md text-label-md transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Find</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Chip Strip */}
        <div className="flex flex-wrap items-center justify-between gap-space-md py-space-sm mb-space-md bg-surface-container-low rounded-xl px-space-md shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mr-1">
              Active:
            </span>

            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm"
              >
                <span>{cat}</span>
                <button
                  onClick={() => removeCategoryChip(cat)}
                  className="hover:opacity-75 focus:outline-none flex items-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            ))}

            {selectedConditions.map((cond) => (
              <span
                key={cond}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md shadow-sm"
              >
                <span>{cond}</span>
                <button
                  onClick={() => removeConditionChip(cond)}
                  className="hover:opacity-75 focus:outline-none flex items-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            ))}

            {selectedTypes.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md shadow-sm"
              >
                <span>{type === 'Donation' ? 'Free Donation' : 'Campus Exchange'}</span>
                <button
                  onClick={() => removeTypeChip(type)}
                  className="hover:opacity-75 focus:outline-none flex items-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            ))}

            {totalActiveFilters > 0 && (
              <button
                onClick={clearAllFilters}
                className="font-label-sm text-label-sm text-primary hover:underline ml-2 transition-all cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-space-sm ml-auto">
            {/* Mobile Filters Toggle Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface text-primary shadow-sm font-label-md text-label-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>Filters ({totalActiveFilters})</span>
              </button>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="font-label-md text-label-md text-on-surface-variant hidden sm:inline">
                Sort:
              </span>
              <div className="relative inline-block text-left">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-surface pl-3 pr-8 py-1.5 rounded-lg font-label-md text-label-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
                >
                  <option value="newest">Newest listings</option>
                  <option value="oldest">Oldest listings</option>
                  <option value="requested">Most requested</option>
                  <option value="closest">Nearest building</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-2 pointer-events-none text-on-surface-variant text-[18px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: Sidebar + Listings Grid */}
        <div className="flex flex-col lg:flex-row gap-gutter items-start pb-space-xl">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-24 bg-surface-container-low rounded-2xl p-space-md shadow-sm">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">filter_list</span>
                <h3 className="font-title-md text-title-md text-primary">Filter Catalog</h3>
              </div>
              <button
                onClick={clearAllFilters}
                className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="space-y-space-md">
              {/* Category Accordion */}
              <div className="bg-surface rounded-xl p-space-sm shadow-sm">
                <button
                  onClick={() => toggleAccordion('category')}
                  className="w-full flex items-center justify-between text-left py-1 cursor-pointer"
                >
                  <span className="font-title-md text-title-md text-on-surface text-[15px]">
                    Category
                  </span>
                  <span
                    className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform ${
                      accordionOpen.category ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {accordionOpen.category && (
                  <div className="pt-space-xs space-y-2">
                    {[
                      { name: 'Books & Notes', count: 184 },
                      { name: 'Electronics & STEM', count: 112 },
                      { name: 'Lab Gear & Coats', count: 64 },
                      { name: 'Dorm Living', count: 78 },
                      { name: 'Calculators & Kits', count: 34 },
                    ].map((cat) => (
                      <label
                        key={cat.name}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories((prev) => [...prev, cat.name]);
                              } else {
                                setSelectedCategories((prev) => prev.filter((c) => c !== cat.name));
                              }
                            }}
                            className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                          />
                          <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                            {cat.name}
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                          {cat.count}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Listing Type Accordion */}
              <div className="bg-surface rounded-xl p-space-sm shadow-sm">
                <button
                  onClick={() => toggleAccordion('type')}
                  className="w-full flex items-center justify-between text-left py-1 cursor-pointer"
                >
                  <span className="font-title-md text-title-md text-on-surface text-[15px]">
                    Listing Type
                  </span>
                  <span
                    className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform ${
                      accordionOpen.type ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {accordionOpen.type && (
                  <div className="pt-space-xs space-y-2">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes('Donation')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTypes((prev) => [...prev, 'Donation']);
                            } else {
                              setSelectedTypes((prev) => prev.filter((t) => t !== 'Donation'));
                            }
                          }}
                          className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                          Free Donation
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">
                        312
                      </span>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes('Exchange')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTypes((prev) => [...prev, 'Exchange']);
                            } else {
                              setSelectedTypes((prev) => prev.filter((t) => t !== 'Exchange'));
                            }
                          }}
                          className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                        />
                        <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                          Campus Exchange
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full">
                        160
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Condition Accordion */}
              <div className="bg-surface rounded-xl p-space-sm shadow-sm">
                <button
                  onClick={() => toggleAccordion('condition')}
                  className="w-full flex items-center justify-between text-left py-1 cursor-pointer"
                >
                  <span className="font-title-md text-title-md text-on-surface text-[15px]">
                    Condition
                  </span>
                  <span
                    className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform ${
                      accordionOpen.condition ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {accordionOpen.condition && (
                  <div className="pt-space-xs space-y-2">
                    {[
                      { name: 'Like New', count: 198 },
                      { name: 'Good', count: 214 },
                      { name: 'Fair / Readable', count: 60 },
                    ].map((c) => (
                      <label key={c.name} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedConditions.includes(c.name as ItemCondition)}
                            onChange={(e) => {
                              const val = c.name as ItemCondition;
                              if (e.target.checked) {
                                setSelectedConditions((prev) => [...prev, val]);
                              } else {
                                setSelectedConditions((prev) => prev.filter((x) => x !== val));
                              }
                            }}
                            className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                          />
                          <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                            {c.name}
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                          {c.count}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Drop-off Node Accordion */}
              <div className="bg-surface rounded-xl p-space-sm shadow-sm">
                <button
                  onClick={() => toggleAccordion('location')}
                  className="w-full flex items-center justify-between text-left py-1 cursor-pointer"
                >
                  <span className="font-title-md text-title-md text-on-surface text-[15px]">
                    Drop-off Node
                  </span>
                  <span
                    className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform ${
                      accordionOpen.location ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {accordionOpen.location && (
                  <div className="pt-space-xs space-y-2">
                    {[
                      { name: 'Library North Atrium', count: 145 },
                      { name: 'Engineering Block C', count: 92 },
                      { name: 'Student Union Hub', count: 166 },
                      { name: 'East Dorm Quad Hub', count: 69 },
                    ].map((loc) => (
                      <label key={loc.name} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedLocations.includes(loc.name as DropOffNode)}
                            onChange={(e) => {
                              const val = loc.name as DropOffNode;
                              if (e.target.checked) {
                                setSelectedLocations((prev) => [...prev, val]);
                              } else {
                                setSelectedLocations((prev) => prev.filter((x) => x !== val));
                              }
                            }}
                            className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                          />
                          <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                            {loc.name}
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                          {loc.count}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-space-md p-space-sm bg-surface-container rounded-xl flex items-start gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                verified_user
              </span>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                All exchanges protected under campus honor safety standards.
              </p>
            </div>
          </aside>

          {/* Right Main Grid Area */}
          <section className="flex-1 w-full min-w-0">
            {/* 1. Results State */}
            {mockState === 'results' && (
              <div>
                {filteredItems.length === 0 ? (
                  /* Zero matches inside active grid */
                  <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center shadow-sm flex flex-col items-center justify-center max-w-xl mx-auto my-space-lg">
                    <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-space-md text-primary">
                      <span className="material-symbols-outlined text-[36px]">search_off</span>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm mb-space-xs">
                      Zero Matches Found
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-space-xs">
                      No items match your filters
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg max-w-md">
                      Try clearing selected conditions, widening the campus drop-off zones, or posting a student request.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-space-sm">
                      <button
                        onClick={clearAllFilters}
                        className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2.5 rounded-xl font-title-md text-title-md transition-colors shadow-sm cursor-pointer"
                      >
                        Clear filters
                      </button>
                      <button
                        onClick={onOpenCreate}
                        className="bg-surface-container hover:bg-surface-container-high text-primary px-5 py-2.5 rounded-xl font-title-md text-title-md transition-colors cursor-pointer"
                      >
                        Request an Item
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
                    {filteredItems.slice(0, visibleCount).map((item) => (
                      <article
                        key={item.id}
                        className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative"
                      >
                        {/* Card Image Slot with Badges and Details Overlay */}
                        <div
                          onClick={() => onSelectItem(item)}
                          className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container mb-space-sm cursor-pointer"
                        >
                          <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            alt={item.title}
                            src={item.imageUrl}
                          />
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm shadow-sm flex items-center gap-1 ${
                                item.type === 'Donation'
                                  ? 'bg-secondary-container text-on-secondary-container font-semibold'
                                  : 'bg-tertiary-fixed text-on-tertiary-fixed font-semibold'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {item.type === 'Donation' ? 'volunteer_activism' : 'swap_horiz'}
                              </span>
                              {item.type}
                            </span>
                            {item.status === 'reserved' && (
                              <span className="bg-tertiary/90 text-on-tertiary px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold shadow-xs">
                                Reserved
                              </span>
                            )}
                            {item.status === 'completed' && (
                              <span className="bg-primary text-on-primary px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold shadow-xs">
                                Reused
                              </span>
                            )}
                          </div>

                          {/* Bookmark Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleBookmark(item.id);
                            }}
                            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface/90 hover:text-primary flex items-center justify-center shadow-sm backdrop-blur-sm transition-colors cursor-pointer ${
                              item.bookmarked ? 'text-primary' : 'text-on-surface-variant'
                            }`}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {item.bookmarked ? 'bookmark' : 'bookmark_border'}
                            </span>
                          </button>

                          {/* Hover 'View details' scrim */}
                          <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-on-primary font-label-md text-label-md flex items-center gap-1">
                              View details <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </span>
                          </div>
                        </div>

                        {/* Condition + Location Pill */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-primary font-semibold">
                            {item.condition}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                            {item.location.replace('Library North Atrium', 'Lib. North').replace('Engineering Block C', 'Eng. Block C').replace('Student Union Hub', 'Union Hub').replace('East Dorm Quad Hub', 'East Dorm')}
                          </span>
                        </div>

                        {/* Title */}
                        <h2
                          onClick={() => onSelectItem(item)}
                          className="font-title-md text-title-md text-on-surface line-clamp-2 mb-2 group-hover:text-primary transition-colors cursor-pointer"
                        >
                          {item.title}
                        </h2>

                        {/* User Bar */}
                        <div className="mt-auto pt-space-xs flex items-center justify-between text-on-surface-variant">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-6 h-6 rounded-full font-label-sm text-label-sm flex items-center justify-center shrink-0 ${
                                item.userAvatarBg || 'bg-primary-container text-on-primary'
                              }`}
                            >
                              {item.userInitials}
                            </div>
                            <span className="font-label-md text-label-md truncate text-on-surface font-semibold">
                              {item.userName} • {item.userDept}
                            </span>
                          </div>
                          <span className="font-label-sm text-label-sm shrink-0">
                            {item.listedTime}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {filteredItems.length > visibleCount && (
                  <div className="mt-space-xl pt-space-lg flex flex-col items-center justify-center gap-space-sm text-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="px-6 py-3 rounded-xl bg-transparent text-primary border-2 border-primary hover:bg-primary-container hover:text-on-primary font-title-md text-title-md transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">refresh</span>
                      <span>Load more items</span>
                    </button>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Showing {Math.min(visibleCount, filteredItems.length)} of {filteredItems.length} items across 6 verified campus nodes
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 2. Loading Skeleton State */}
            {mockState === 'skeleton' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm animate-pulse space-y-3"
                  >
                    <div className="w-full aspect-square rounded-xl bg-surface-container-high"></div>
                    <div className="h-4 bg-surface-container-high rounded w-1/3"></div>
                    <div className="h-6 bg-surface-container-high rounded w-4/5"></div>
                    <div className="h-4 bg-surface-container-high rounded w-1/2"></div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-surface-container-high"></div>
                        <div className="h-4 bg-surface-container-high rounded w-24"></div>
                      </div>
                      <div className="h-3 bg-surface-container-high rounded w-10"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Empty State */}
            {mockState === 'empty' && (
              <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center shadow-sm flex flex-col items-center justify-center max-w-xl mx-auto my-space-lg">
                <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-space-md text-primary">
                  <span className="material-symbols-outlined text-[48px]">search_off</span>
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm mb-space-xs">
                  Zero Matches Found
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-space-xs">
                  No items match your filters
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg max-w-md">
                  Try resetting selected conditions, widening the campus drop-off zones, or posting a student request so peers can find it for you.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-space-sm">
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setMockState('results');
                    }}
                    className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2.5 rounded-xl font-title-md text-title-md transition-colors shadow-sm cursor-pointer"
                  >
                    Clear filters
                  </button>
                  <button
                    onClick={onOpenCreate}
                    className="bg-surface-container hover:bg-surface-container-high text-primary px-5 py-2.5 rounded-xl font-title-md text-title-md transition-colors cursor-pointer"
                  >
                    Request an Item
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
          />
          <div className="relative bg-surface rounded-t-3xl z-50 max-h-[85vh] flex flex-col shadow-2xl animate-slideUp">
            <div className="p-space-md flex items-center justify-between border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">tune</span>
                <h3 className="font-title-md text-title-md text-primary">
                  Filters ({totalActiveFilters} active)
                </h3>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-space-md overflow-y-auto space-y-space-md flex-1">
              <div>
                <h4 className="font-title-md text-title-md text-on-surface text-[15px] mb-space-xs">
                  Category
                </h4>
                <div className="space-y-2">
                  {['Books & Notes', 'Electronics & STEM', 'Lab Gear & Coats', 'Dorm Living'].map((c) => (
                    <label key={c} className="flex items-center justify-between">
                      <span className="font-body-md text-body-md text-on-surface">{c}</span>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCategories((p) => [...p, c]);
                          else setSelectedCategories((p) => p.filter((x) => x !== c));
                        }}
                        className="w-5 h-5 rounded accent-primary"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-title-md text-title-md text-on-surface text-[15px] mb-space-xs">
                  Listing Type
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="font-body-md text-body-md text-on-surface">Free Donation</span>
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes('Donation')}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedTypes((p) => [...p, 'Donation']);
                        else setSelectedTypes((p) => p.filter((x) => x !== 'Donation'));
                      }}
                      className="w-5 h-5 rounded accent-primary"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="font-body-md text-body-md text-on-surface">Campus Exchange</span>
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes('Exchange')}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedTypes((p) => [...p, 'Exchange']);
                        else setSelectedTypes((p) => p.filter((x) => x !== 'Exchange'));
                      }}
                      className="w-5 h-5 rounded accent-primary"
                    />
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-title-md text-title-md text-on-surface text-[15px] mb-space-xs">
                  Condition
                </h4>
                <div className="space-y-2">
                  {(['Like New', 'Good', 'Fair / Readable'] as ItemCondition[]).map((c) => (
                    <label key={c} className="flex items-center justify-between">
                      <span className="font-body-md text-body-md text-on-surface">{c}</span>
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(c)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedConditions((p) => [...p, c]);
                          else setSelectedConditions((p) => p.filter((x) => x !== c));
                        }}
                        className="w-5 h-5 rounded accent-primary"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-space-md bg-surface-container-low flex items-center gap-space-sm border-t border-surface-container">
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFiltersOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-surface text-primary font-title-md text-title-md cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-title-md text-title-md cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
