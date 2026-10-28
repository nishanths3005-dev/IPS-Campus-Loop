import React from 'react';
import { ViewportMode } from '../types';

interface ViewportSwitcherProps {
  currentMode: ViewportMode;
  onModeChange: (mode: ViewportMode) => void;
  activeNodeName?: string;
}

export const ViewportSwitcher: React.FC<ViewportSwitcherProps> = ({
  currentMode,
  onModeChange,
  activeNodeName = 'North Quad Hub (Active)',
}) => {
  return (
    <div className="w-full bg-surface-container-high py-2 px-margin-mobile md:px-margin border-b border-surface-container-highest">
      <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-primary">devices</span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
            Simulate Viewport:
          </span>
        </div>

        <div className="flex items-center bg-surface-container rounded-lg p-0.5">
          <button
            onClick={() => onModeChange('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-label-sm text-label-sm transition-all cursor-pointer ${
              currentMode === 'desktop'
                ? 'text-on-primary bg-primary-container shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
            <span>Desktop (1440px)</span>
          </button>

          <button
            onClick={() => onModeChange('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-label-sm text-label-sm transition-all cursor-pointer ${
              currentMode === 'tablet'
                ? 'text-on-primary bg-primary-container shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">tablet_mac</span>
            <span>Tablet (768px)</span>
          </button>

          <button
            onClick={() => onModeChange('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-label-sm text-label-sm transition-all cursor-pointer ${
              currentMode === 'mobile'
                ? 'text-on-primary bg-primary-container shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">smartphone</span>
            <span>Mobile (375px)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-space-xs text-primary font-label-sm text-label-sm">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
          <span>Campus Node: {activeNodeName}</span>
        </div>
      </div>
    </div>
  );
};
