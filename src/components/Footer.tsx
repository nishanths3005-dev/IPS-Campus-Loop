import React from 'react';
import { ActiveScreen } from '../types';

interface FooterProps {
  onNavigate: (screen: ActiveScreen) => void;
  onSelectCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  return (
    <footer className="w-full bg-surface-container-low mt-space-xl pt-space-xl pb-24 md:pb-16 border-t border-surface-container">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-space-xl">
          {/* Column 1: Brand & Initiative */}
          <div>
            <div className="flex items-center gap-space-sm mb-space-md">
              <img
                alt="CampusLoop Leaf Logo"
                className="h-7 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCxdGVUrZLCKyGDgr5UkF4AcGtRpBbWI4fP1MNKBoXrXM0dwEXrM2JC9_YKrz5OneXBeWDWvZVGz44vhr7TwveLxGYX6CYF2nDp_A03nonhzPAj5Hd9H7NIvjsFrg_F5BRbjJvgMCEHsYzN3uQPtL0Y9DQLY6n98ULE1vIevmvk9UUAYgf2bWVMUWDtjWW6Q79YWMM7cw2zcbRUr0Q6H1-SwTyveh12LgfnrMGEwkYFjTMft-N7SI-"
              />
              <span className="font-headline-sm text-headline-sm text-primary">
                CampusLoop
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-md max-w-xs">
              One campus. Less waste. More sharing. A verified student community powering circular reuse and mutual aid.
            </p>
            <div className="inline-flex items-center gap-space-xs bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">eco</span>
              <span>Zero-Waste Collegiate Initiative</span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 className="font-title-md text-title-md text-on-surface mb-space-md">
              Platform
            </h4>
            <ul className="space-y-space-sm">
              <li className="font-body-md text-body-md">
                <button
                  onClick={() => {
                    onSelectCategory?.('Books & Notes');
                    onNavigate('browse-items');
                  }}
                  className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-left"
                >
                  Textbooks &amp; Notes
                </button>
              </li>
              <li className="font-body-md text-body-md">
                <button
                  onClick={() => {
                    onSelectCategory?.('Dorm Living');
                    onNavigate('browse-items');
                  }}
                  className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-left"
                >
                  Dorm Furniture
                </button>
              </li>
              <li className="font-body-md text-body-md">
                <button
                  onClick={() => onNavigate('browse-items')}
                  className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-left"
                >
                  Free Donations Hub
                </button>
              </li>
              <li className="font-body-md text-body-md">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-left"
                >
                  Student Wishlist Pool
                </button>
              </li>
              <li className="font-body-md text-body-md">
                <button
                  onClick={() => onNavigate('impact')}
                  className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-left"
                >
                  Carbon &amp; Metric Ledger
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Safety */}
          <div>
            <h4 className="font-title-md text-title-md text-on-surface mb-space-md">
              Support &amp; Safety
            </h4>
            <ul className="space-y-space-sm">
              <li className="font-body-md text-body-md">
                <button
                  onClick={() => onNavigate('safety')}
                  className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-left"
                >
                  Campus Safe-Swap Zones
                </button>
              </li>
              <li className="font-body-md text-body-md">
                <button
                  onClick={() => onNavigate('safety')}
                  className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-left"
                >
                  .EDU Verification Rules
                </button>
              </li>
              <li className="font-body-md text-body-md">
                <button
                  onClick={() => onNavigate('safety')}
                  className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-left"
                >
                  Student Honor Code
                </button>
              </li>
              <li className="font-body-md text-body-md">
                <button
                  onClick={() => onNavigate('safety')}
                  className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-left"
                >
                  Campus Liaison Desk
                </button>
              </li>
              <li className="font-body-md text-body-md">
                <button
                  onClick={() => onNavigate('safety')}
                  className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer text-left"
                >
                  Exchange Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Verification & Trust */}
          <div>
            <h4 className="font-title-md text-title-md text-on-surface mb-space-md">
              Verification &amp; Trust
            </h4>
            <div className="bg-surface-container rounded-xl p-space-md space-y-space-sm">
              <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span className="font-semibold">Institutionally Protected</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Only authenticated university email accounts can transact, browse pickup nodes, or exchange goods.
              </p>
              <span className="inline-block font-label-sm text-label-sm text-on-secondary-container bg-surface px-2.5 py-1 rounded font-medium">
                Status: Active Academic Year
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md font-body-md text-body-md text-on-surface-variant border-t border-surface-container">
          <p>© 2025 CampusLoop Mutual Aid Network. Crafted for collegiate stewardship.</p>
          <div className="flex items-center gap-space-md">
            <button
              onClick={() => onNavigate('safety')}
              className="hover:text-on-surface transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('safety')}
              className="hover:text-on-surface transition-colors cursor-pointer"
            >
              Campus Terms
            </button>
            <button
              onClick={() => onNavigate('safety')}
              className="hover:text-on-surface transition-colors cursor-pointer"
            >
              Safety Guidelines
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
