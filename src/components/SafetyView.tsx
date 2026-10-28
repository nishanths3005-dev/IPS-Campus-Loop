import React from 'react';
import { SAFE_SWAP_NODES } from '../data/mockItems';

export const SafetyView: React.FC = () => {
  return (
    <div className="flex flex-col gap-space-xl">
      {/* Safety Header */}
      <section className="bg-surface-container-lowest p-space-md md:p-space-xl rounded-2xl shadow-sm border border-surface-container">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm px-3.5 py-1.5 rounded-full mb-3">
            <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
            <span>Campus Security Endorsed</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Safety &amp; Verified Safe-Swap Zones
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 leading-relaxed">
            CampusLoop eliminates the risks of stranger marketplaces. Every user is authenticated through their university <code className="bg-surface-container px-1.5 py-0.5 rounded text-primary font-semibold text-label-sm">.edu</code> domain, and all handovers occur at monitored campus locations.
          </p>
        </div>
      </section>

      {/* 4 Official Campus Nodes */}
      <section className="flex flex-col gap-space-md">
        <div>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
            Official Pickup Points
          </span>
          <h2 className="font-headline-md text-headline-md text-primary">
            Designated Safe-Swap Zones
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Locations verified for continuous lighting, collegiate staff presence, and security camera coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {SAFE_SWAP_NODES.map((node) => (
            <div
              key={node.name}
              className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">location_on</span>
                    <h3 className="font-title-md text-title-md text-primary font-semibold">
                      {node.name}
                    </h3>
                  </div>
                  <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-fixed px-2.5 py-0.5 rounded-full font-semibold">
                    {node.zone}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-3">
                  {node.description}
                </p>
                <div className="flex items-center gap-1.5 text-label-sm font-label-sm text-secondary font-medium mb-3">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>Operational Hours: {node.hours}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-surface-container">
                {node.amenities.map((a) => (
                  <span
                    key={a}
                    className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-2.5 py-1 rounded-md flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px] text-primary">check_circle</span>
                    <span>{a}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Safety Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-surface-container-low p-space-md rounded-2xl space-y-2 border border-surface-container">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">badge</span>
          </div>
          <h3 className="font-title-md text-title-md text-on-surface font-semibold">
            Institutional Email Auth
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Zero guest or anonymous accounts. Only active students, teaching assistants, and university staff with registered credentials may post or respond.
          </p>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-2xl space-y-2 border border-surface-container">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">handshake</span>
          </div>
          <h3 className="font-title-md text-title-md text-on-surface font-semibold">
            The Collegiate Honor Code
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Members commit to accurate condition grading, prompt arrivals, and respectful peer mutual aid. Ratings protect the integrity of the loop.
          </p>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-2xl space-y-2 border border-surface-container">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">no_sim</span>
          </div>
          <h3 className="font-title-md text-title-md text-on-surface font-semibold">
            Zero Cash Transactions
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            CampusLoop items are strictly either 100% Free Mutual Aid donations or direct 1-to-1 material trades. No predatory pricing or scalping allowed.
          </p>
        </div>
      </section>
    </div>
  );
};
