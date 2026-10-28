import React from 'react';

export const ImpactView: React.FC = () => {
  return (
    <div className="flex flex-col gap-space-xl">
      {/* Header Banner */}
      <section className="bg-primary text-on-primary rounded-2xl p-space-lg md:p-space-xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-primary-container/40 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-primary-container text-secondary-fixed px-3.5 py-1.5 rounded-full font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px]">eco</span>
            <span>Zero-Waste Collegiate Sustainability Initiative</span>
          </div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold tracking-tight">
            Campus Circular Metric Ledger
          </h1>
          <p className="font-body-lg text-body-lg text-primary-fixed-dim leading-relaxed">
            Quantifying university peer-to-peer mutual aid. Every book passed forward, lab coat sanitized, and calculator shared keeps raw resources in rotation and out of city landfills.
          </p>
        </div>
      </section>

      {/* KPI 4-Card Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-surface-container">
          <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[24px]">recycling</span>
          </div>
          <span className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-primary tracking-tight">
            1,240
          </span>
          <span className="font-title-md text-title-md text-on-surface">Items Reused</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Across 6 campus drop-off hubs
          </span>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-surface-container">
          <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[24px]">scale</span>
          </div>
          <span className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-primary tracking-tight">
            860 kg
          </span>
          <span className="font-title-md text-title-md text-on-surface">E-Waste &amp; Paper Diverted</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Equivalent to 1,940 lbs landfill mass
          </span>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-surface-container">
          <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[24px]">forest</span>
          </div>
          <span className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-primary tracking-tight">
            1.42 t
          </span>
          <span className="font-title-md text-title-md text-on-surface">CO₂e Emissions Avoided</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Manufacturing &amp; courier freight saved
          </span>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-1 border border-surface-container">
          <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[24px]">savings</span>
          </div>
          <span className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-primary tracking-tight">
            $46,800+
          </span>
          <span className="font-title-md text-title-md text-on-surface">Student Funds Saved</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Avoided bookstore &amp; tech markups
          </span>
        </div>
      </section>

      {/* Breakdown by Category & Department */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Department Participation */}
        <div className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-2xl shadow-sm border border-surface-container">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                Leaderboard
              </span>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Departmental Circulation
              </h3>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
              Fall Semester
            </span>
          </div>

          <div className="space-y-4">
            {[
              { dept: 'Computer Science & Engineering', items: 482, pct: 78, color: 'bg-primary' },
              { dept: 'Biological Sciences & Pre-Med', items: 318, pct: 54, color: 'bg-secondary' },
              { dept: 'Mathematics & Physical Sciences', items: 240, pct: 41, color: 'bg-primary-container' },
              { dept: 'Architecture & Environmental Design', items: 120, pct: 24, color: 'bg-surface-tint' },
              { dept: 'Humanities & Social Sciences', items: 80, pct: 16, color: 'bg-secondary-fixed-dim' },
            ].map((d) => (
              <div key={d.dept} className="space-y-1.5">
                <div className="flex justify-between items-center text-body-md font-medium">
                  <span className="text-on-surface">{d.dept}</span>
                  <span className="text-primary font-semibold">{d.items} items</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${d.color}`}
                    style={{ width: `${d.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Material Diversion Types */}
        <div className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-2xl shadow-sm border border-surface-container">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                Lifecycle Breakdown
              </span>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Diverted Material Flow
              </h3>
            </div>
            <span className="material-symbols-outlined text-primary">pie_chart</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Textbooks &amp; Bound Paper</span>
              <div className="font-headline-sm text-[22px] text-primary font-bold mt-1">520 kg</div>
              <span className="font-label-sm text-label-sm text-secondary">60.5% of total</span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Electronics &amp; Calculators</span>
              <div className="font-headline-sm text-[22px] text-primary font-bold mt-1">190 kg</div>
              <span className="font-label-sm text-label-sm text-secondary">22.1% of total</span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Cotton Lab Coats &amp; Apparel</span>
              <div className="font-headline-sm text-[22px] text-primary font-bold mt-1">95 kg</div>
              <span className="font-label-sm text-label-sm text-secondary">11.0% of total</span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Dorm Furniture &amp; Lamps</span>
              <div className="font-headline-sm text-[22px] text-primary font-bold mt-1">55 kg</div>
              <span className="font-label-sm text-label-sm text-secondary">6.4% of total</span>
            </div>
          </div>

          <div className="p-4 bg-secondary-container/40 rounded-xl border border-secondary-container text-on-secondary-fixed text-body-md flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
            <span>
              All emissions estimates calculated according to the EPA WARM Model for collegiate waste reduction.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
