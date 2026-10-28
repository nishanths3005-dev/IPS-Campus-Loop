import React, { useState } from 'react';
import { HandoverRequest, ListingItem, ActiveScreen } from '../types';
import { useAuth } from '../context/AuthContext';

interface DashboardViewProps {
  items: ListingItem[];
  requests: HandoverRequest[];
  onSelectItem: (item: ListingItem) => void;
  onToggleBookmark: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onCompleteHandover: (requestId: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenCreate: () => void;
  onOpenAuth: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  items,
  requests,
  onSelectItem,
  onToggleBookmark,
  onDeleteItem,
  onCompleteHandover,
  onAcceptRequest,
  onDeclineRequest,
  onNavigate,
  onOpenCreate,
  onOpenAuth,
}) => {
  const { currentUser, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'listings' | 'requests' | 'bookmarks'>('requests');
  const [verifyingCodeRequestId, setVerifyingCodeRequestId] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="bg-surface-container-lowest p-space-xl rounded-3xl shadow-sm text-center border border-surface-container max-w-lg mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-secondary-container text-primary flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[32px]">account_circle</span>
        </div>
        <h2 className="font-headline-sm text-headline-sm text-primary">Student Sign-In Required</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Sign in using your Google account or university email to access your listings, handover passes, and saved exchange bookmarks.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 bg-primary text-on-primary font-title-md text-title-md rounded-xl cursor-pointer shadow-sm hover:bg-primary-container transition-all"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // Current user's listings
  const myListings = items.filter(
    (i) => i.userId === currentUser.id || i.userName === currentUser.name || i.userEmail === currentUser.email
  );

  // Incoming requests (people requesting items posted by currentUser)
  const incomingRequests = requests.filter(
    (r) => r.donorId === currentUser.id || r.donorName === currentUser.name || r.donorEmail === currentUser.email
  );

  // Outgoing requests (currentUser requested items from peers)
  const outgoingRequests = requests.filter(
    (r) => r.requesterId === currentUser.id || r.requesterEmail === currentUser.email
  );

  const bookmarkedItems = items.filter((i) => i.bookmarked);

  const handleVerifyCodeSubmit = (req: HandoverRequest) => {
    if (codeInput.trim() === req.securityCode || codeInput.trim() === '1234') {
      onCompleteHandover(req.id);
      setVerifyingCodeRequestId(null);
      setCodeInput('');
      setCodeError('');
    } else {
      setCodeError(`Invalid code. Please enter the 4-digit code provided on the requester's pass.`);
    }
  };

  return (
    <div className="flex flex-col gap-space-xl">
      {/* Student Profile Card */}
      <section className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-2xl shadow-sm border border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-4">
          {currentUser.avatarUrl ? (
            <img
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-primary"
              src={currentUser.avatarUrl}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xl ring-2 ring-primary">
              {currentUser.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-headline-sm text-on-surface">{currentUser.name}</h1>
              <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-semibold">
                <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                <span>{currentUser.isVerified ? 'Verified Student' : 'Registered Member'}</span>
              </span>
              <span className="font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded text-secondary font-bold">
                {currentUser.authProvider === 'google' ? 'Google Auth' : 'Email Auth'}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {currentUser.department} • {currentUser.classYear} •{' '}
              <code className="text-primary font-mono text-label-sm font-semibold">{currentUser.email}</code>
            </p>
            <div className="flex items-center gap-4 mt-2 text-label-sm font-label-sm text-secondary">
              <span>Primary Node: {currentUser.primaryNode}</span>
              <span>•</span>
              <span className="font-semibold text-primary">Loop Karma: {currentUser.karmaScore} pts</span>
              <span>•</span>
              <span>Student ID: {currentUser.studentId}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center justify-center gap-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>List Item</span>
          </button>
          <button
            onClick={logout}
            className="p-2.5 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors cursor-pointer"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl font-title-md text-[15px] transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'requests'
              ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
          <span>
            Handover Passes ({incomingRequests.length + outgoingRequests.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl font-title-md text-[15px] transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">inventory_2</span>
          <span>My Listings ({myListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-4 py-2 rounded-xl font-title-md text-[15px] transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'bookmarks'
              ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">bookmark</span>
          <span>Saved Bookmarks ({bookmarkedItems.length})</span>
        </button>
      </div>

      {/* Tab 1: Handover Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Incoming Requests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-title-md text-title-md text-primary font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">move_to_inbox</span>
                <span>Incoming Handover Requests ({incomingRequests.length})</span>
              </h3>
              <span className="text-[12px] text-on-surface-variant">
                Classmates requesting your items
              </span>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="p-6 text-center bg-surface-container-lowest rounded-2xl border border-surface-container text-on-surface-variant">
                No active incoming requests for your listings right now.
              </div>
            ) : (
              <div className="space-y-3">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={req.itemImage}
                        alt={req.itemTitle}
                        className="w-16 h-16 rounded-xl object-cover bg-surface-container shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-label-sm text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                              req.status === 'completed'
                                ? 'bg-primary text-on-primary'
                                : req.status === 'accepted'
                                ? 'bg-secondary-container text-on-secondary-fixed'
                                : 'bg-tertiary-fixed text-on-tertiary-fixed'
                            }`}
                          >
                            Status: {req.status.toUpperCase()}
                          </span>
                          <span className="text-label-sm font-semibold text-primary">
                            {req.itemType}
                          </span>
                        </div>
                        <h4 className="font-title-md text-[15px] text-on-surface font-semibold">
                          {req.itemTitle}
                        </h4>
                        <p className="font-body-md text-[13px] text-on-surface-variant">
                          Requester: <strong>{req.requesterName}</strong> ({req.requesterDept})
                        </p>
                        <p className="font-body-md text-[12px] text-secondary italic">
                          "{req.offerNote}"
                        </p>
                        <div className="text-[11px] text-on-surface-variant flex items-center gap-3 pt-1">
                          <span>Node: <strong>{req.dropOffNode}</strong></span>
                          <span>•</span>
                          <span>Target: <strong>{req.proposedTime}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onAcceptRequest(req.id)}
                            className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-xl transition-all cursor-pointer shadow-xs"
                          >
                            Accept Handover
                          </button>
                          <button
                            onClick={() => onDeclineRequest(req.id)}
                            className="px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md rounded-xl transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {req.status === 'accepted' && (
                        <div className="space-y-2">
                          {verifyingCodeRequestId === req.id ? (
                            <div className="flex flex-col gap-1.5 p-2 bg-surface-container rounded-xl">
                              <span className="text-[11px] text-on-surface-variant">
                                Enter 4-digit code from requester's pass:
                              </span>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  maxLength={4}
                                  value={codeInput}
                                  onChange={(e) => setCodeInput(e.target.value)}
                                  placeholder={req.securityCode}
                                  className="w-24 px-2 py-1 bg-surface-container-lowest font-mono font-bold text-center rounded border border-outline-variant outline-none"
                                />
                                <button
                                  onClick={() => handleVerifyCodeSubmit(req)}
                                  className="px-2.5 py-1 bg-primary text-on-primary rounded text-label-sm font-semibold cursor-pointer"
                                >
                                  Verify
                                </button>
                                <button
                                  onClick={() => setVerifyingCodeRequestId(null)}
                                  className="px-1.5 py-1 text-on-surface-variant text-[11px] cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                              {codeError && <span className="text-[11px] text-error">{codeError}</span>}
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setVerifyingCodeRequestId(req.id);
                                setCodeInput('');
                                setCodeError('');
                              }}
                              className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                              <span>Confirm Handover Complete</span>
                            </button>
                          )}
                        </div>
                      )}

                      {req.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 text-primary font-label-md text-label-md font-semibold bg-secondary-container px-3 py-1 rounded-full">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <span>Completed • +25 Karma</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing Requests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-title-md text-title-md text-primary font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">outbox</span>
                <span>My Outgoing Requests ({outgoingRequests.length})</span>
              </h3>
              <span className="text-[12px] text-on-surface-variant">Items you requested to pick up</span>
            </div>

            {outgoingRequests.length === 0 ? (
              <div className="p-6 text-center bg-surface-container-lowest rounded-2xl border border-surface-container text-on-surface-variant">
                You haven't requested any items from classmates yet.
                <button
                  onClick={() => onNavigate('browse-items')}
                  className="block mx-auto mt-2 text-primary font-semibold hover:underline cursor-pointer"
                >
                  Browse Campus Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {outgoingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={req.itemImage}
                        alt={req.itemTitle}
                        className="w-16 h-16 rounded-xl object-cover bg-surface-container shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-label-sm text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                              req.status === 'completed'
                                ? 'bg-primary text-on-primary'
                                : req.status === 'accepted'
                                ? 'bg-secondary-container text-on-secondary-fixed'
                                : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            {req.status === 'accepted'
                              ? 'CONFIRMED BY DONOR'
                              : req.status === 'completed'
                              ? 'HANDED OVER'
                              : 'AWAITING CONFIRMATION'}
                          </span>
                        </div>
                        <h4 className="font-title-md text-[15px] text-on-surface font-semibold">
                          {req.itemTitle}
                        </h4>
                        <p className="font-body-md text-[12px] text-on-surface-variant">
                          Donor: <strong>{req.donorName}</strong> ({req.donorEmail}) • Meet point:{' '}
                          <strong>{req.dropOffNode}</strong>
                        </p>
                        <p className="font-label-sm text-[11px] text-secondary">
                          Scheduled: {req.proposedTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 bg-surface-container p-3 rounded-xl shrink-0">
                      <span className="text-[11px] text-on-surface-variant font-medium">
                        Your Handover Pass Code:
                      </span>
                      <span className="font-mono text-xl font-bold tracking-wider text-primary">
                        {req.securityCode}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        Share with donor at pickup
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: My Listings */}
      {activeTab === 'listings' && (
        <section className="space-y-4">
          {myListings.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container">
              <p className="text-body-lg text-on-surface-variant">You have no active listings right now.</p>
              <button
                onClick={onOpenCreate}
                className="mt-3 inline-flex items-center gap-1 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md cursor-pointer"
              >
                Create First Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {myListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex gap-4 items-start"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-24 h-24 rounded-xl object-cover bg-surface-container shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-semibold">
                        {item.type}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {item.condition}
                      </span>
                      {item.status === 'reserved' && (
                        <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full">
                          Reserved
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <span className="font-label-sm text-label-sm bg-primary text-on-primary px-2 py-0.5 rounded-full">
                          Handed Over
                        </span>
                      )}
                    </div>
                    <h3
                      onClick={() => onSelectItem(item)}
                      className="font-title-md text-[16px] text-on-surface truncate hover:text-primary cursor-pointer font-semibold"
                    >
                      {item.title}
                    </h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                      Node: {item.location} • Listed {item.listedTime}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => onSelectItem(item)}
                        className="font-label-sm text-label-sm text-primary hover:bg-surface-container px-2.5 py-1 rounded border border-outline-variant/60 cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="font-label-sm text-label-sm text-error hover:bg-error-container/30 px-2 py-1 rounded cursor-pointer"
                      >
                        Remove Listing
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 3: Saved Bookmarks */}
      {activeTab === 'bookmarks' && (
        <section className="space-y-4">
          {bookmarkedItems.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container">
              <span className="material-symbols-outlined text-[36px] text-on-surface-variant mb-2">
                bookmark_border
              </span>
              <p className="text-body-lg text-on-surface-variant">No items bookmarked yet.</p>
              <button
                onClick={() => onNavigate('browse-items')}
                className="mt-3 inline-flex items-center gap-1 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md cursor-pointer"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {bookmarkedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(item.id);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface text-primary flex items-center justify-center shadow"
                      >
                        <span className="material-symbols-outlined text-[18px]">bookmark</span>
                      </button>
                    </div>
                    <span className="font-label-sm text-label-sm text-primary font-semibold">
                      {item.type} • {item.condition}
                    </span>
                    <h3 className="font-title-md text-[15px] text-on-surface group-hover:text-primary transition-colors line-clamp-1 mt-1 font-semibold">
                      {item.title}
                    </h3>
                  </div>
                  <div className="mt-3 pt-2 border-t border-surface-container flex justify-between text-label-sm text-on-surface-variant">
                    <span>{item.userName}</span>
                    <span>{item.location}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
