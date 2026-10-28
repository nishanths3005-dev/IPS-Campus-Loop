import React, { useState } from 'react';
import { CATEGORIES_CONFIG } from '../data/mockItems';
import { ListingItem, ActiveScreen } from '../types';

interface HomeViewProps {
  items: ListingItem[];
  onSelectItem: (item: ListingItem) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onSelectCategory: (category: string) => void;
  onOpenCreate: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  items,
  onSelectItem,
  onNavigate,
  onSelectCategory,
  onOpenCreate,
}) => {
  const [activeChip, setActiveChip] = useState('All');
  const [listingFeedState, setListingFeedState] = useState<'filled' | 'empty'>('filled');
  const [heroSearch, setHeroSearch] = useState('');

  // 4 items for the fresh on campus feed
  const freshItems = items.slice(0, 4);

  const chips = ['All', 'Books', 'Electronics', 'Lab Gear', 'Stationery', 'Sports', 'Hostel', 'Apparel', 'Other'];

  const handleChipClick = (chip: string) => {
    setActiveChip(chip);
    if (chip !== 'All') {
      onSelectCategory(chip);
      onNavigate('browse-items');
    }
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onSelectCategory(heroSearch.trim());
      onNavigate('browse-items');
    }
  };

  return (
    <div className="flex flex-col gap-space-xl">
      {/* 1. Split Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center pt-space-xs">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start gap-space-md">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-space-xs bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[15px] text-primary">school</span>
            <span>Campus-only • Verified students</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary ml-1"></span>
            <span className="text-primary font-semibold">.EDU Required</span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight text-balance">
            Give Items a Second Life.
          </h1>

          {/* Subhead */}
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl text-balance">
            Donate and exchange textbooks, electronics, lab gear, and hostel essentials with classmates across campus. Zero hassle, zero landfill, pure student mutual aid.
          </p>

          {/* CTA Action Group */}
          <div className="flex flex-wrap items-center gap-space-sm pt-space-xs w-full sm:w-auto">
            <button
              onClick={() => onNavigate('browse-items')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              <span>Browse Items</span>
            </button>
            <button
              onClick={onOpenCreate}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs bg-secondary-container hover:bg-secondary-fixed text-primary font-label-md text-label-md px-6 py-3 rounded-lg shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
              <span>Donate an Item</span>
            </button>
          </div>

          {/* Verified Trust Indicator */}
          <div className="flex items-center gap-space-sm pt-space-sm text-on-surface-variant">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-primary text-[10px] font-bold shadow-sm">
                AM
              </div>
              <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface text-[10px] font-bold shadow-sm">
                PS
              </div>
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold shadow-sm">
                +9k
              </div>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Joined by <span className="font-semibold text-on-surface">1,890+ verified students</span> from Engineering, Arts &amp; Sciences
            </p>
          </div>
        </div>

        {/* Right Column: Visual 3-Card Collage */}
        <div className="lg:col-span-5 relative w-full h-[380px] md:h-[440px] flex items-center justify-center select-none">
          {/* Ambient decorative loop glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/40 via-surface-container to-transparent rounded-3xl -z-10 blur-xl"></div>

          {/* Card 1 (Back Left: Lab Coat) */}
          <div
            onClick={() => {
              const labCoat = items.find((i) => i.id === 'item-9' || i.id === 'item-3') || items[0];
              onSelectItem(labCoat);
            }}
            className="absolute left-2 md:left-4 top-8 w-56 md:w-64 bg-surface-container-lowest p-3 rounded-xl shadow-md rotate-[-6deg] hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-surface-container">
              <img
                className="w-full h-full object-cover"
                alt="Official university cotton white laboratory protective coat"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMqBAkMT-VFmMkpRxMxW6vSmdjy3lgI4vY9YH3Or3q-O1MDWB0fazhidC4ODzzhaUP2EHja38IPWTU6qRhNiXUew1WOYcxdo_fzD1FI5Qr8TrHhHekzVZ65LETL4mJS3eHhFcZWKsR7EoS3pp-uX3UtW9BMW16SXJ3bTdlMVVjq9BVzz6ycjqTENr6e5_Qy2loq-zPn4RgYQLVM0cANuuyillsyumEAxlo6nZPwqW3c_HPvUKOvlW"
              />
              <span className="absolute top-2 left-2 bg-secondary-container text-on-secondary-fixed text-label-sm font-label-sm px-2 py-0.5 rounded-full font-semibold">
                Size M
              </span>
            </div>
            <div className="mt-2.5">
              <div className="font-label-md text-label-md text-primary font-semibold truncate">
                Lab Coat — Protective Gear
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Chemistry Annex</span>
                <span className="font-label-sm text-label-sm bg-surface-container text-primary font-medium px-2 py-0.5 rounded">
                  Donation
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 (Back Right: TI-84 Plus) */}
          <div
            onClick={() => {
              const calc = items.find((i) => i.id === 'item-2' || i.id === 'item-8') || items[1];
              onSelectItem(calc);
            }}
            className="absolute right-2 md:right-4 bottom-6 w-56 md:w-64 bg-surface-container-lowest p-3 rounded-xl shadow-md rotate-[5deg] hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-surface-container">
              <img
                className="w-full h-full object-cover"
                alt="Graphing Texas Instruments calculator TI 84 plus silver edition"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjSpwUnAvqu8npx3xaUqCIEjkujVgvJhJxka7CxFhW_jR_xkZwWRjpOLt6a1_70RpowXto2CqzIkwT0OJIQ17ZuW67sm77XEBUYudgmGk8CaFYXPg51TpYqq6Qa4bKMB8Wyi_24CZdra7Ci4skGRtM2we1bd2txs6RvY1lZh2vB89_gYrskbLnOzpFPq6lWtBIfmt1N7OX2_BzawlH8maK3N5flMsPctYJUVLoziquWjE3ip0jrPRD"
              />
              <span className="absolute top-2 right-2 bg-surface-container text-on-surface font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                Good
              </span>
            </div>
            <div className="mt-2.5">
              <div className="font-label-md text-label-md text-primary font-semibold truncate">
                TI-84 Plus Graphing Calc
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">South Dormitory</span>
                <span className="font-label-sm text-label-sm bg-tertiary-fixed text-tertiary font-medium px-2 py-0.5 rounded">
                  Exchange
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 (Center Foreground: Calculus Textbook) */}
          <div
            onClick={() => {
              const calcBook = items.find((i) => i.id === 'item-7' || i.id === 'item-1') || items[0];
              onSelectItem(calcBook);
            }}
            className="relative z-10 w-64 md:w-72 bg-surface-container-lowest p-3.5 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {/* Floating 'Listed 2h ago' Pill */}
            <div className="absolute -top-3.5 -right-2 bg-primary text-on-primary font-label-sm text-label-sm px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>Listed 2h ago</span>
            </div>
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-surface-container">
              <img
                className="w-full h-full object-cover"
                alt="Hardcover Calculus Early Transcendentals textbook 8th edition"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbofHlXyXZPcUjW54cGdwXqpt6O7kUVGJKceNj7n3XtvrnRRYFS9rLObBruuCA68SUyLEvGN_FQaZmO6PvIYxUbwhIj7oP5M2jH2kmCgPI227Wr7Kc3WCJ5vujFSY-wvFEdkWDif9HV8A_kcvkVa4hzZDNJMCwFj7wIB9uDrfgRoLlyZxyRX3F_tXK0rlhTujM5gLIqI30x-xS_oPEJf38ikgU5aNmPKhnkH1rw-zZIICdFmpJsYDy"
              />
              <span className="absolute bottom-2 left-2 bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-semibold">
                Free • Mutual Aid
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                  MATH 201 Required
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Like New</span>
              </div>
              <h4 className="font-title-md text-title-md text-on-surface truncate mt-0.5">
                Calculus: Early Transcendentals
              </h4>
              <div className="flex items-center gap-2 mt-2 pt-2 bg-surface-container-low px-2 py-1.5 rounded-lg">
                <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary text-[10px] flex items-center justify-center font-bold">
                  R
                </span>
                <span className="font-label-sm text-label-sm text-on-surface truncate">
                  Rohan V. • Math '25
                </span>
                <span className="material-symbols-outlined text-[14px] text-primary ml-auto">
                  verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Centered Search Bar & Category Quick-Chips */}
      <section className="w-full flex flex-col items-center gap-space-md bg-surface-container-lowest p-space-md md:p-space-lg rounded-2xl shadow-sm">
        {/* Search Input Container */}
        <form onSubmit={handleHeroSearchSubmit} className="w-full max-w-3xl relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[22px]">
            search
          </span>
          <input
            value={heroSearch}
            onChange={(e) => setHeroSearch(e.target.value)}
            className="w-full pl-12 pr-28 py-3.5 bg-surface-container rounded-xl text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:shadow-md transition-all outline-none"
            placeholder="Search textbooks, calculators, dorm chairs, lab equipment..."
            type="text"
          />
          <button
            type="submit"
            className="absolute right-2.5 bg-primary-container hover:bg-primary text-on-primary font-label-sm text-label-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <span>Search</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </form>

        {/* Quick Category Filter Chips */}
        <div className="w-full max-w-4xl flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-1 text-nowrap">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className={`font-label-md text-label-md px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
                activeChip === chip
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      {/* 3. 8-Card Circular/Pill Category Grid */}
      <section className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
              Campus Catalog
            </span>
            <h2 className="font-headline-md text-headline-md text-primary">Browse by Category</h2>
          </div>
          <button
            onClick={() => onNavigate('browse-items')}
            className="hidden sm:inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline cursor-pointer"
          >
            <span>View all categories</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-space-sm">
          {CATEGORIES_CONFIG.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                onSelectCategory(cat.filterKey);
                onNavigate('browse-items');
              }}
              className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-lowest hover:bg-secondary-container transition-all shadow-sm text-center cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container group-hover:bg-surface-container-lowest flex items-center justify-center text-primary transition-colors mb-2">
                <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
              </div>
              <span className="font-label-md text-label-md font-semibold text-on-surface group-hover:text-primary">
                {cat.name}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. 'Fresh on Campus' 4-Column Recently-Listed Grid */}
      <section className="flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
              Live Feed
            </span>
            <h2 className="font-headline-md text-headline-md text-primary">Fresh on Campus</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Available for pickup at campus nodes today.
            </p>
          </div>

          {/* Interactive State Switcher for Demo / Evaluation */}
          <div className="flex items-center gap-space-xs bg-surface-container rounded-lg p-1 self-start sm:self-auto">
            <button
              onClick={() => setListingFeedState('filled')}
              className={`px-3 py-1 rounded-md font-label-sm text-label-sm transition-all cursor-pointer ${
                listingFeedState === 'filled'
                  ? 'text-on-primary bg-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              Active Feed (4 items)
            </button>
            <button
              onClick={() => setListingFeedState('empty')}
              className={`px-3 py-1 rounded-md font-label-sm text-label-sm transition-all cursor-pointer ${
                listingFeedState === 'empty'
                  ? 'text-on-primary bg-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              Empty State Preview
            </button>
          </div>
        </div>

        {/* Filled State Grid */}
        {listingFeedState === 'filled' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {freshItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group bg-surface-container-lowest rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container mb-3">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={item.title}
                      src={item.imageUrl}
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-semibold ${
                          item.type === 'Donation'
                            ? 'bg-secondary-container text-on-secondary-fixed'
                            : 'bg-tertiary-fixed text-on-tertiary-fixed'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                        {item.condition}
                      </span>
                      {item.status === 'reserved' && (
                        <span className="bg-tertiary text-on-tertiary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                          Reserved
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                          Reused
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 bg-surface-container-low px-3 py-2 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        item.userAvatarBg || 'bg-secondary-container text-primary'
                      }`}
                    >
                      {item.userInitials}
                    </div>
                    <div className="truncate">
                      <div className="font-label-md text-label-md text-on-surface font-semibold truncate">
                        {item.userName}
                      </div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant truncate">
                        {item.userDept}
                      </div>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0 pl-1">
                    {item.listedTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State Container */
          <div className="w-full bg-surface-container-lowest rounded-2xl p-space-xl text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-space-sm">
              <span className="material-symbols-outlined text-[32px] text-primary">inventory_2</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              No listings yet — be the first to share something.
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-1 mb-space-md">
              Dorm move-outs, semester transitions, or leftover lab supplies? Free up shelf space and help a fellow classmate.
            </p>
            <button
              onClick={onOpenCreate}
              className="inline-flex items-center gap-space-xs bg-primary-container text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-lg shadow-sm hover:bg-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Create First Listing</span>
            </button>
          </div>
        )}
      </section>

      {/* 5. 3-Step 'How It Works' Section */}
      <section className="bg-surface-container-lowest p-space-md md:p-space-xl rounded-2xl shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-space-lg">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
            Campus Protocol
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary mt-1">How CampusLoop Works</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Simple, authenticated, and safe reuse designed specifically for collegiate life.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter relative">
          {/* Step 1 */}
          <div className="relative bg-surface-container-low rounded-xl p-space-md flex flex-col items-start gap-space-sm">
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-bold text-headline-sm">
                1
              </div>
              <span className="material-symbols-outlined text-primary text-[24px]">verified_user</span>
            </div>
            <h3 className="font-title-md text-title-md text-on-surface font-semibold">
              Sign up with college email
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Authenticate using your official university{' '}
              <code className="bg-surface-container px-1 py-0.5 rounded text-primary font-semibold text-label-sm">
                @college.edu
              </code>{' '}
              handle to verify active enrollment status.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative bg-surface-container-low rounded-xl p-space-md flex flex-col items-start gap-space-sm">
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-bold text-headline-sm">
                2
              </div>
              <span className="material-symbols-outlined text-primary text-[24px]">
                swap_horizontal_circle
              </span>
            </div>
            <h3 className="font-title-md text-title-md text-on-surface font-semibold">
              List or browse useful items
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Post an item you finished using for zero cost or direct trade. Snap 2 photos, tag course requisites, and publish in under 45 seconds.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative bg-surface-container-low rounded-xl p-space-md flex flex-col items-start gap-space-sm">
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-bold text-headline-sm">
                3
              </div>
              <span className="material-symbols-outlined text-primary text-[24px]">location_on</span>
            </div>
            <h3 className="font-title-md text-title-md text-on-surface font-semibold">
              Meet safely &amp; handover
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Coordinate seamless handovers at verified Campus Safe-Swap Zones like student library lobbies, campus cafes, or quad benches.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Full-Width Forest Green Impact Strip */}
      <section className="w-full bg-primary rounded-2xl p-space-lg md:p-space-xl text-on-primary shadow-lg relative overflow-hidden">
        {/* Background subtle decorative pattern */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-primary-container/30 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col gap-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed font-semibold">
                Our Collective Footprint
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-primary mt-1">
                Campus Circular Impact
              </h2>
            </div>
            <button
              onClick={() => onNavigate('impact')}
              className="inline-flex items-center gap-1.5 bg-primary-container hover:bg-primary-container/80 text-secondary-fixed px-3 py-1.5 rounded-full font-label-sm text-label-sm cursor-pointer transition-colors self-start md:self-auto"
            >
              <span className="material-symbols-outlined text-[16px]">cycle</span>
              <span>Real-time semester cycle • View Ledger</span>
            </button>
          </div>

          {/* Four Big White Numbers Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter pt-space-xs">
            {/* Stat 1 */}
            <div className="flex flex-col gap-1">
              <span className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-on-primary tracking-tight">
                1,240
              </span>
              <span className="font-title-md text-title-md text-primary-fixed-dim">Items reused</span>
              <span className="font-label-sm text-label-sm text-on-primary-container">
                Prevented from dorm dumpsters
              </span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col gap-1">
              <span className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-on-primary tracking-tight">
                312
              </span>
              <span className="font-title-md text-title-md text-primary-fixed-dim">Active listings</span>
              <span className="font-label-sm text-label-sm text-on-primary-container">
                Ready for pickup this week
              </span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col gap-1">
              <span className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-on-primary tracking-tight">
                860 kg
              </span>
              <span className="font-title-md text-title-md text-primary-fixed-dim">Waste diverted (est.)</span>
              <span className="font-label-sm text-label-sm text-on-primary-container">
                Paper, plastic &amp; electronic e-waste
              </span>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col gap-1">
              <span className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-on-primary tracking-tight">
                1,890
              </span>
              <span className="font-title-md text-title-md text-primary-fixed-dim">Students sharing</span>
              <span className="font-label-sm text-label-sm text-on-primary-container">
                Across 34 academic departments
              </span>
            </div>
          </div>

          <div className="pt-space-xs text-on-primary-container font-label-sm text-label-sm flex items-center gap-1.5 opacity-90">
            <span className="material-symbols-outlined text-[14px]">info</span>
            <span>
              *Environmental figures are estimates based on campus survey metrics and average product lifecycle benchmarks.
            </span>
          </div>
        </div>
      </section>

      {/* 7. Real Student Testimonial Cards */}
      <section className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
              Peer Verification
            </span>
            <h2 className="font-headline-md text-headline-md text-primary">What Classmates Are Saying</h2>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-primary font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>100% verified student submissions</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Testimonial 1: Aarav Mehta */}
          <div className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-2xl shadow-sm flex flex-col justify-between gap-space-md">
            <div className="space-y-space-sm">
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface italic">
                “I listed my organic chemistry molecular modeling kit on Tuesday evening, and by 10 AM Wednesday morning I passed it to a freshman in the main library atrium. No shipping boxes, no markup, just fellow students helping each other.”
              </p>
            </div>
            <div className="flex items-center gap-space-sm pt-2 bg-surface-container-low p-space-sm rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
                AM
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-title-md text-title-md text-on-surface">Aarav Mehta</span>
                  <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Computer Science &amp; Engineering • Class of '26
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial 2: Priya Sharma */}
          <div className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-2xl shadow-sm flex flex-col justify-between gap-space-md">
            <div className="space-y-space-sm">
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface italic">
                “Moving out of North Quad used to mean throwing away perfectly good lamps, desk caddies, and books. With CampusLoop, every single item found a home with someone in our neighboring dorm in under 48 hours.”
              </p>
            </div>
            <div className="flex items-center gap-space-sm pt-2 bg-surface-container-low p-space-sm rounded-xl">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center font-bold text-sm shrink-0">
                PS
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-title-md text-title-md text-on-surface">Priya Sharma</span>
                  <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Bioengineering • Class of '25
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Warm Beige CTA Banner */}
      <section className="w-full bg-surface-container rounded-2xl p-space-lg md:p-space-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md relative overflow-hidden">
        {/* Decorative leafy pattern overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-secondary-container/30 to-transparent pointer-events-none"></div>
        <div className="max-w-xl z-10">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
            Make An Impact Today
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">
            Have something you no longer need? Give it a second life.
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Clear out desk clutter, support an incoming junior, and help build a zero-waste collegiate ecosystem.
          </p>
        </div>
        <div className="z-10 flex flex-col sm:flex-row items-center gap-space-sm w-full md:w-auto shrink-0">
          <button
            onClick={onOpenCreate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md px-7 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>List an Item</span>
          </button>
          <button
            onClick={() => onNavigate('browse-items')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs bg-surface-container-lowest hover:bg-surface-container-high text-primary font-label-md text-label-md px-6 py-3.5 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <span>Explore Catalog</span>
          </button>
        </div>
      </section>
    </div>
  );
};
