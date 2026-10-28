import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { ViewportSwitcher } from './components/ViewportSwitcher';
import { HomeView } from './components/HomeView';
import { BrowseView } from './components/BrowseView';
import { ImpactView } from './components/ImpactView';
import { SafetyView } from './components/SafetyView';
import { DashboardView } from './components/DashboardView';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { ItemDetailModal } from './components/ItemDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { CommandPalette } from './components/CommandPalette';
import { AuthModal } from './components/AuthModal';
import { HandoverModal } from './components/HandoverModal';
import {
  INITIAL_ITEMS,
  INITIAL_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_IMPACT_STATS,
} from './data/mockItems';
import { ActiveScreen, AppNotification, HandoverRequest, ImpactStats, ListingItem, ViewportMode } from './types';

function CampusLoopInner() {
  const { currentUser, isAuthenticated, updateProfile } = useAuth();

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Persistent Items state
  const [items, setItems] = useState<ListingItem[]>(() => {
    try {
      const saved = localStorage.getItem('campusloop_items');
      return saved ? JSON.parse(saved) : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  // Persistent Handover Requests state
  const [requests, setRequests] = useState<HandoverRequest[]>(() => {
    try {
      const saved = localStorage.getItem('campusloop_requests');
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  // Persistent Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('campusloop_notifs');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Persistent Impact Stats state
  const [impactStats, setImpactStats] = useState<ImpactStats>(() => {
    try {
      const saved = localStorage.getItem('campusloop_stats');
      return saved ? JSON.parse(saved) : INITIAL_IMPACT_STATS;
    } catch {
      return INITIAL_IMPACT_STATS;
    }
  });

  // Modals state
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null);
  const [handoverTargetItem, setHandoverTargetItem] = useState<ListingItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campusloop_items', JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('campusloop_requests', JSON.stringify(requests));
    } catch {}
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem('campusloop_notifs', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('campusloop_stats', JSON.stringify(impactStats));
    } catch {}
  }, [impactStats]);

  // Global ⌘K hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenAuth = (prompt?: string) => {
    setAuthPromptMessage(prompt);
    setIsAuthModalOpen(true);
  };

  const handleToggleBookmark = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, bookmarked: !item.bookmarked };
          showToast(updated.bookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks');
          return updated;
        }
        return item;
      })
    );
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, bookmarked: !prev.bookmarked } : null));
    }
  };

  const handleAddItem = (newItem: ListingItem) => {
    setItems((prev) => [newItem, ...prev]);
    setImpactStats((prev) => ({
      ...prev,
      activeListings: prev.activeListings + 1,
    }));
    showToast(`"${newItem.title}" published to live campus feed!`);
    setActiveScreen('browse-items');
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setImpactStats((prev) => ({
      ...prev,
      activeListings: Math.max(0, prev.activeListings - 1),
    }));
    showToast('Listing removed from campus inventory.');
  };

  const handleStartHandoverRequest = (item: ListingItem) => {
    setSelectedItem(null);
    setHandoverTargetItem(item);
  };

  const handleSubmitHandoverRequest = (newRequest: HandoverRequest) => {
    setRequests((prev) => [newRequest, ...prev]);

    // Mark item as reserved
    setItems((prev) =>
      prev.map((i) =>
        i.id === newRequest.itemId
          ? {
              ...i,
              status: 'reserved',
              reservedByUserId: newRequest.requesterId,
              reservedByName: newRequest.requesterName,
            }
          : i
      )
    );

    // Add alert notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Handover Pass Created',
      desc: `Meet ${newRequest.donorName} at ${newRequest.dropOffNode}. Verification code: ${newRequest.securityCode}.`,
      time: 'Just now',
      unread: true,
      type: 'swap',
      requestId: newRequest.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Handover pass generated! Check your dashboard.');
  };

  const handleAcceptRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'accepted' } : r))
    );
    const matched = requests.find((r) => r.id === requestId);
    if (matched) {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: 'Meet-up Confirmed',
        desc: `You confirmed meet-up with ${matched.requesterName} at ${matched.dropOffNode}.`,
        time: 'Just now',
        unread: true,
        type: 'swap',
        requestId: matched.id,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
    showToast('Handover request accepted and confirmed!');
  };

  const handleDeclineRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'declined' } : r))
    );
    showToast('Request declined.');
  };

  const handleCompleteHandover = (requestId: string) => {
    const matched = requests.find((r) => r.id === requestId);
    if (!matched) return;

    // Mark request complete
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'completed' } : r))
    );

    // Mark item complete
    setItems((prev) =>
      prev.map((i) => (i.id === matched.itemId ? { ...i, status: 'completed' } : i))
    );

    // Increment Karma for current user
    if (currentUser) {
      updateProfile({ karmaScore: (currentUser.karmaScore || 100) + 25 });
    }

    // Increment Circular Impact stats
    setImpactStats((prev) => ({
      itemsReused: prev.itemsReused + 1,
      activeListings: Math.max(0, prev.activeListings - 1),
      wasteDivertedKg: prev.wasteDivertedKg + 4,
      studentsSharing: prev.studentsSharing + (Math.random() > 0.5 ? 1 : 0),
      fundsSavedUsd: prev.fundsSavedUsd + 45,
    }));

    showToast('Safe-Swap complete! +25 Karma awarded to your student profile.');
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
  };

  // Simulated container width
  const getContainerMaxWidth = () => {
    switch (viewportMode) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'max-w-[1280px]';
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col selection:bg-secondary-container selection:text-primary">
      {/* Top Header */}
      <Header
        activeScreen={activeScreen}
        onNavigate={(screen) => {
          setActiveScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenAuth={handleOpenAuth}
        searchQuery=""
        onSearchChange={() => {}}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)] flex-1">
        {/* Interactive Viewport Switcher Toolbar */}
        <ViewportSwitcher
          currentMode={viewportMode}
          onModeChange={setViewportMode}
          activeNodeName={currentUser ? `${currentUser.primaryNode} (${currentUser.name})` : 'North Quad Hub (Active)'}
        />

        {/* Adaptive Canvas Container with Transition */}
        <div
          className={`w-full ${getContainerMaxWidth()} mx-auto transition-all duration-300 px-margin-mobile md:px-margin py-space-lg md:py-space-xl`}
        >
          {activeScreen === 'home' && (
            <HomeView
              items={items}
              onSelectItem={(item) => setSelectedItem(item)}
              onNavigate={(screen) => {
                setActiveScreen(screen);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectCategory={handleSelectCategory}
              onOpenCreate={() => {
                if (!isAuthenticated) {
                  handleOpenAuth('Sign in with Google or your college email to donate or post items.');
                } else {
                  setIsCreateOpen(true);
                }
              }}
            />
          )}

          {activeScreen === 'browse-items' && (
            <BrowseView
              items={items}
              onSelectItem={(item) => setSelectedItem(item)}
              onToggleBookmark={handleToggleBookmark}
              onNavigate={(screen) => {
                setActiveScreen(screen);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              initialCategory={selectedCategory}
              onOpenCreate={() => {
                if (!isAuthenticated) {
                  handleOpenAuth('Sign in with Google or your college email to list items.');
                } else {
                  setIsCreateOpen(true);
                }
              }}
            />
          )}

          {activeScreen === 'impact' && <ImpactView />}

          {activeScreen === 'safety' && <SafetyView />}

          {activeScreen === 'dashboard' && (
            <DashboardView
              items={items}
              requests={requests}
              onSelectItem={(item) => setSelectedItem(item)}
              onToggleBookmark={handleToggleBookmark}
              onDeleteItem={handleDeleteItem}
              onCompleteHandover={handleCompleteHandover}
              onAcceptRequest={handleAcceptRequest}
              onDeclineRequest={handleDeclineRequest}
              onNavigate={(screen) => {
                setActiveScreen(screen);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenCreate={() => setIsCreateOpen(true)}
              onOpenAuth={() => handleOpenAuth()}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(screen) => {
          setActiveScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={handleSelectCategory}
      />

      {/* Mobile Bottom Nav */}
      <MobileNav
        activeScreen={activeScreen}
        onNavigate={(screen) => {
          setActiveScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCreate={() => {
          if (!isAuthenticated) {
            handleOpenAuth('Sign in with Google or your college email to list items.');
          } else {
            setIsCreateOpen(true);
          }
        }}
      />

      {/* Modals & Dialogs */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onToggleBookmark={handleToggleBookmark}
        onRequestHandover={handleStartHandoverRequest}
        onRequireAuth={handleOpenAuth}
      />

      <HandoverModal
        isOpen={!!handoverTargetItem}
        item={handoverTargetItem}
        onClose={() => setHandoverTargetItem(null)}
        onSubmitRequest={handleSubmitHandoverRequest}
      />

      <CreateListingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddItem={handleAddItem}
        onRequireAuth={() => handleOpenAuth('Please sign in or register to publish campus listings.')}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        items={items}
        onSelectItem={(item) => setSelectedItem(item)}
        onNavigate={(screen) => {
          setActiveScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={handleSelectCategory}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionPromptMessage={authPromptMessage}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-24 md:bottom-8 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce font-label-md text-label-md border border-primary-container">
          <span className="material-symbols-outlined text-[20px] text-primary-fixed">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CampusLoopInner />
    </AuthProvider>
  );
}
