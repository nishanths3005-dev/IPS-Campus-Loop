import React, { useState } from 'react';
import { ActiveScreen, AppNotification } from '../types';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_USERS } from '../data/mockItems';

interface HeaderProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenCreate: () => void;
  onOpenSearch: () => void;
  onOpenAuth: (prompt?: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onNavigate,
  onOpenCreate,
  onOpenSearch,
  onOpenAuth,
  searchQuery,
  notifications,
  onMarkNotificationRead,
}) => {
  const { currentUser, isAuthenticated, logout, switchUser } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      onOpenAuth('Please sign in or register with your college email to list campus items.');
    } else {
      onOpenCreate();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md shadow-[0_2px_8px_rgba(31,77,58,0.06)]">
      <div className="h-20 max-w-[1280px] mx-auto px-margin-mobile md:px-margin flex items-center justify-between gap-space-md">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-space-lg">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-space-sm group text-left cursor-pointer focus:outline-none"
          >
            <img
              alt="CampusLoop Leaf Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCxdGVUrZLCKyGDgr5UkF4AcGtRpBbWI4fP1MNKBoXrXM0dwEXrM2JC9_YKrz5OneXBeWDWvZVGz44vhr7TwveLxGYX6CYF2nDp_A03nonhzPAj5Hd9H7NIvjsFrg_F5BRbjJvgMCEHsYzN3uQPtL0Y9DQLY6n98ULE1vIevmvk9UUAYgf2bWVMUWDtjWW6Q79YWMM7cw2zcbRUr0Q6H1-SwTyveh12LgfnrMGEwkYFjTMft-N7SI-"
            />
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight">
              CampusLoop
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-space-sm">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors font-label-md text-label-md rounded-lg px-3 py-2 cursor-pointer ${
                activeScreen === 'home'
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('browse-items')}
              className={`transition-colors font-label-md text-label-md rounded-lg px-3 py-2 cursor-pointer ${
                activeScreen === 'browse-items'
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Browse Items
            </button>
            <button
              onClick={() => onNavigate('impact')}
              className={`transition-colors font-label-md text-label-md rounded-lg px-3 py-2 cursor-pointer ${
                activeScreen === 'impact'
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Impact
            </button>
            <button
              onClick={() => onNavigate('safety')}
              className={`transition-colors font-label-md text-label-md rounded-lg px-3 py-2 cursor-pointer ${
                activeScreen === 'safety'
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Safety
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`transition-colors font-label-md text-label-md rounded-lg px-3 py-2 cursor-pointer ${
                activeScreen === 'dashboard'
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Dashboard
            </button>
          </nav>
        </div>

        {/* Right: Search, List Item CTA, Notifications, Profile / Sign In */}
        <div className="flex items-center gap-space-md">
          {/* Global Search Bar */}
          <div
            onClick={onOpenSearch}
            className="hidden md:flex items-center bg-surface-container hover:bg-surface-container-high rounded-lg px-3 py-2 gap-space-sm text-on-surface-variant cursor-pointer transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span className="font-body-md text-body-md text-on-surface-variant w-44 truncate">
              {searchQuery ? searchQuery : 'Search campus listings...'}
            </span>
            <kbd className="font-label-sm text-label-sm bg-surface-container-lowest px-2 py-0.5 rounded shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-outline-variant/30">
              ⌘K
            </kbd>
          </div>

          {/* List Item Action */}
          <button
            onClick={handleCreateClick}
            className="hidden sm:inline-flex items-center gap-space-xs bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md px-4 py-2.5 rounded-lg transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>List Item</span>
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              aria-label="Notifications"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileMenuOpen(false);
              }}
              className="relative p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface animate-pulse"></span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 py-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-surface-container">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      notifications_active
                    </span>
                    <span className="font-title-md text-[15px] text-primary">Campus Alerts</span>
                  </div>
                  {unreadCount > 0 ? (
                    <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-fixed px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount} Unread
                    </span>
                  ) : (
                    <span className="font-label-sm text-label-sm text-on-surface-variant">All caught up</span>
                  )}
                </div>

                <div className="divide-y divide-surface-container max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onMarkNotificationRead(n.id);
                        if (n.requestId) {
                          onNavigate('dashboard');
                          setNotificationsOpen(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-surface-container transition-colors cursor-pointer ${
                        n.unread ? 'bg-surface-container-low/60' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-label-md text-label-md font-semibold text-primary">
                          {n.title}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {n.time}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-snug">
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 px-4 border-t border-surface-container flex justify-between items-center text-on-surface-variant">
                  <button
                    onClick={() => {
                      notifications.forEach((n) => onMarkNotificationRead(n.id));
                    }}
                    className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      onNavigate('dashboard');
                    }}
                    className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
                  >
                    View in Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Or Sign In Button */}
          {isAuthenticated && currentUser ? (
            <div className="relative">
              <div
                onClick={() => {
                  setProfileMenuOpen(!profileMenuOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-space-sm pl-space-xs cursor-pointer group"
              >
                {currentUser.avatarUrl ? (
                  <img
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant group-hover:ring-primary transition-all"
                    src={currentUser.avatarUrl}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs ring-1 ring-outline-variant group-hover:ring-primary transition-all">
                    {currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div className="hidden xl:flex flex-col text-left">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      {currentUser.name}
                    </span>
                    {currentUser.isVerified && (
                      <span className="material-symbols-outlined text-[14px] text-primary">
                        verified
                      </span>
                    )}
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {currentUser.department.split('&')[0]} • {currentUser.classYear}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant hidden xl:block transition-transform">
                  expand_more
                </span>
              </div>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-surface-container">
                    <div className="font-title-md text-[15px] font-semibold text-on-surface">
                      {currentUser.name}
                    </div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant truncate">
                      {currentUser.email}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium">
                        <span className="material-symbols-outlined text-[13px] text-primary">
                          verified
                        </span>
                        <span>{currentUser.isVerified ? 'Verified Student' : 'Registered Member'}</span>
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary font-semibold">
                        {currentUser.karmaScore} Karma
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full text-left px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                        inventory_2
                      </span>
                      <span>My Active Listings &amp; Handover Passes</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full text-left px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                        bookmark
                      </span>
                      <span>Saved Bookmarks</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onNavigate('impact');
                      }}
                      className="w-full text-left px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                        eco
                      </span>
                      <span>My Circular Contribution</span>
                    </button>
                  </div>

                  {/* Switch to Other Students / Accounts */}
                  <div className="px-4 py-2 border-t border-surface-container">
                    <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">
                      Switch Student Profile
                    </span>
                    <div className="space-y-1">
                      {DEFAULT_USERS.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u);
                            setProfileMenuOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded-lg text-label-sm flex items-center justify-between cursor-pointer ${
                            u.id === currentUser.id
                              ? 'bg-secondary-container/60 text-primary font-semibold'
                              : 'text-on-surface-variant hover:bg-surface-container'
                          }`}
                        >
                          <span>{u.name}</span>
                          <span className="text-[10px] opacity-75">{u.authProvider === 'google' ? 'Google' : '.EDU'}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 border-t border-surface-container">
                    <button
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 font-label-md text-label-md text-error hover:bg-error-container/30 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Actions */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth()}
                className="font-label-md text-label-md text-primary hover:bg-surface-container px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth()}
                className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-3.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Join
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            aria-label="Toggle Mobile Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-surface-container-high px-margin-mobile py-4 shadow-lg animate-fadeIn">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg font-label-md text-label-md ${
                activeScreen === 'home'
                  ? 'bg-primary-container text-on-primary'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('browse-items');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg font-label-md text-label-md ${
                activeScreen === 'browse-items'
                  ? 'bg-primary-container text-on-primary'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Browse Items
            </button>
            <button
              onClick={() => {
                onNavigate('impact');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg font-label-md text-label-md ${
                activeScreen === 'impact'
                  ? 'bg-primary-container text-on-primary'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Impact
            </button>
            <button
              onClick={() => {
                onNavigate('safety');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg font-label-md text-label-md ${
                activeScreen === 'safety'
                  ? 'bg-primary-container text-on-primary'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Safety
            </button>
            <button
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg font-label-md text-label-md ${
                activeScreen === 'dashboard'
                  ? 'bg-primary-container text-on-primary'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Dashboard
            </button>

            <div className="pt-2 border-t border-surface-container flex flex-col gap-2">
              <button
                onClick={() => {
                  handleCreateClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary py-2.5 rounded-lg font-label-md text-label-md"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>List an Item</span>
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-primary border border-primary rounded-lg font-label-md text-label-md"
                >
                  Sign In with Google or Email
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
