import React from 'react';
import { ActiveScreen } from '../types';

interface MobileNavProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenCreate: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeScreen,
  onNavigate,
  onOpenCreate,
}) => {
  return (
    <>
      {/* Floating Action Button */}
      <aside className="fixed bottom-20 right-4 z-40 md:hidden">
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-space-xs bg-primary-container text-on-primary px-4 py-3 rounded-full shadow-[0_6px_16px_rgba(31,77,58,0.2)] font-label-md text-label-md active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Post Item</span>
        </button>
      </aside>

      {/* Fixed Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_-2px_12px_rgba(31,77,58,0.06)] md:hidden border-t border-surface-container">
        <div className="flex items-center justify-around h-16 px-2">
          <button
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 cursor-pointer ${
              activeScreen === 'home'
                ? 'text-primary font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">home</span>
            <span className="font-label-sm text-[10px]">Home</span>
          </button>

          <button
            onClick={() => onNavigate('browse-items')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 cursor-pointer ${
              activeScreen === 'browse-items'
                ? 'text-primary font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">explore</span>
            <span className="font-label-sm text-[10px]">Browse</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-on-surface py-1 px-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">volunteer_activism</span>
            <span className="font-label-sm text-[10px]">Donate</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 cursor-pointer ${
              activeScreen === 'dashboard'
                ? 'text-primary font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
            <span className="font-label-sm text-[10px]">Requests</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center gap-0.5 text-on-surface-variant hover:text-on-surface py-1 px-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">account_circle</span>
            <span className="font-label-sm text-[10px]">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
