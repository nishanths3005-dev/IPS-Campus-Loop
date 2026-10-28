import React from 'react';
import { ListingItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface ItemDetailModalProps {
  item: ListingItem | null;
  onClose: () => void;
  onToggleBookmark: (id: string) => void;
  onRequestHandover: (item: ListingItem) => void;
  onRequireAuth: (prompt: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onToggleBookmark,
  onRequestHandover,
  onRequireAuth,
}) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!item) return null;

  const isOwner = currentUser?.id === item.userId;

  const handleActionClick = () => {
    if (!isAuthenticated) {
      onRequireAuth('Please sign in with Google or your college email to coordinate a safe pickup.');
      return;
    }
    onRequestHandover(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fadeIn">
      <div onClick={onClose} className="fixed inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden z-10 border border-outline-variant/30 max-h-[90vh] flex flex-col">
        {/* Header bar */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`font-label-sm text-label-sm px-3 py-1 rounded-full font-semibold ${
                item.type === 'Donation'
                  ? 'bg-secondary-container text-on-secondary-fixed'
                  : 'bg-tertiary-fixed text-on-tertiary-fixed'
              }`}
            >
              {item.type === 'Donation' ? 'Free Donation • Mutual Aid' : 'Campus Exchange'}
            </span>
            <span className="font-label-sm text-label-sm bg-surface-container px-2.5 py-1 rounded-full text-on-surface">
              {item.condition}
            </span>
            {item.status === 'reserved' && (
              <span className="font-label-sm text-label-sm bg-tertiary text-on-tertiary px-2.5 py-1 rounded-full">
                Pending Handover
              </span>
            )}
            {item.status === 'completed' && (
              <span className="font-label-sm text-label-sm bg-primary text-on-primary px-2.5 py-1 rounded-full">
                Reused • Completed
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(item.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center bg-surface hover:bg-surface-container transition-colors cursor-pointer ${
                item.bookmarked ? 'text-primary' : 'text-on-surface-variant'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.bookmarked ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-surface hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Visual */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-surface-container shadow-inner">
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            {item.courseTag && (
              <div className="absolute bottom-3 left-3 bg-primary/90 backdrop-blur-md text-on-primary font-label-sm text-label-sm px-3 py-1 rounded-lg">
                Course Requisite: {item.courseTag}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h2 className="font-headline-md text-headline-md text-primary tracking-tight">
              {item.title}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Exchange Wish if Exchange */}
          {item.type === 'Exchange' && item.exchangeWish && (
            <div className="p-4 rounded-xl bg-tertiary-fixed/40 border border-tertiary-fixed text-on-tertiary-fixed">
              <div className="flex items-center gap-1.5 font-label-md text-label-md font-semibold mb-1">
                <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                <span>Owner's Exchange Wishlist:</span>
              </div>
              <p className="font-body-md text-body-md">{item.exchangeWish}</p>
            </div>
          )}

          {/* Safe-Swap Drop-off Node Box */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">location_on</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-title-md text-[16px] text-on-surface font-semibold">
                  {item.location}
                </span>
                <span className="font-label-sm text-label-sm bg-surface px-2 py-0.5 rounded text-secondary font-semibold">
                  Verified Safe Node
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Monitored collegiate pick-up point with safety coverage. Student verification required.
              </p>
            </div>
          </div>

          {/* Donor Profile Strip */}
          <div className="p-4 rounded-2xl bg-surface-container flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${
                  item.userAvatarBg || 'bg-primary-container text-on-primary'
                }`}
              >
                {item.userInitials}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-title-md text-[16px] text-on-surface font-semibold">
                    {item.userName}
                  </span>
                  <span className="material-symbols-outlined text-[15px] text-primary">
                    verified
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {item.userDept} • Listed {item.listedTime}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-fixed px-2.5 py-1 rounded-full font-medium">
                Verified Student
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <div>
            {isOwner ? (
              <div className="p-3 bg-surface-container text-center rounded-xl text-label-md text-on-surface-variant">
                You posted this listing. You can manage incoming requests in your Dashboard.
              </div>
            ) : item.status === 'completed' ? (
              <div className="p-3 bg-surface-container text-center rounded-xl text-label-md text-on-surface-variant">
                This item has been successfully handed over to a classmate.
              </div>
            ) : (
              <button
                type="button"
                onClick={handleActionClick}
                className="w-full py-3.5 bg-primary-container hover:bg-primary text-on-primary font-title-md text-title-md rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.type === 'Donation' ? 'volunteer_activism' : 'swap_horiz'}
                </span>
                <span>
                  {item.type === 'Donation'
                    ? 'Request Free Item & Pick Safe Slot'
                    : 'Propose Direct Campus Exchange'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
