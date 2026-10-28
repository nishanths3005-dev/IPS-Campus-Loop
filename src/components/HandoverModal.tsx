import React, { useState } from 'react';
import { DropOffNode, HandoverRequest, ListingItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { SAFE_SWAP_NODES } from '../data/mockItems';

interface HandoverModalProps {
  isOpen: boolean;
  item: ListingItem | null;
  onClose: () => void;
  onSubmitRequest: (request: HandoverRequest) => void;
}

export const HandoverModal: React.FC<HandoverModalProps> = ({
  isOpen,
  item,
  onClose,
  onSubmitRequest,
}) => {
  const { currentUser } = useAuth();

  const [selectedNode, setSelectedNode] = useState<DropOffNode>(
    item?.location || 'Library North Atrium'
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    'Today • 12:30 PM – 1:30 PM (Between Lectures)'
  );
  const [customTime, setCustomTime] = useState('');
  const [offerNote, setOfferNote] = useState('');
  const [submittedPass, setSubmittedPass] = useState<HandoverRequest | null>(null);

  if (!isOpen || !item || !currentUser) return null;

  const timeSlots = [
    'Today • 12:30 PM – 1:30 PM (Between Lectures)',
    'Today • 4:30 PM – 5:30 PM (Afternoon Study Hours)',
    'Tomorrow • 10:00 AM – 11:00 AM (Morning Lab Period)',
    'Tomorrow • 2:00 PM – 3:00 PM (Quad Break)',
    'Custom Time Window...',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    const finalTime =
      selectedTimeSlot === 'Custom Time Window...' ? customTime || 'Flexible Time' : selectedTimeSlot;

    const newRequest: HandoverRequest = {
      id: `req-${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemImage: item.imageUrl,
      itemType: item.type,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterEmail: currentUser.email,
      requesterDept: currentUser.department,
      donorId: item.userId || 'user-donor',
      donorName: item.userName,
      donorEmail: item.userEmail || `${item.userName.toLowerCase().replace(/[^a-z]/g, '')}@college.edu`,
      dropOffNode: selectedNode,
      proposedTime: finalTime,
      offerNote: offerNote.trim() || 'Excited to pick up this item at the safe node!',
      status: 'pending',
      securityCode: randomCode,
      createdAt: 'Just now',
    };

    onSubmitRequest(newRequest);
    setSubmittedPass(newRequest);
  };

  const handleFinish = () => {
    setSubmittedPass(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fadeIn">
      <div onClick={submittedPass ? handleFinish : onClose} className="fixed inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden z-10 border border-outline-variant/30 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              {item.type === 'Donation' ? 'volunteer_activism' : 'swap_horiz'}
            </span>
            <div>
              <h3 className="font-title-md text-title-md text-primary font-semibold">
                {submittedPass ? 'Safe-Swap Handover Pass' : 'Schedule Safe Handover'}
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Campus Safe-Swap Protocol • Verified Peer Handover
              </span>
            </div>
          </div>
          <button
            onClick={submittedPass ? handleFinish : onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {submittedPass ? (
            /* Pass View */
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-secondary-container/60 border border-secondary-container text-on-secondary-fixed text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-primary">
                  Request Dispatched to {item.userName}!
                </h4>
                <p className="font-body-md text-body-md max-w-sm mx-auto text-on-surface-variant">
                  We sent an official notification to <code className="text-primary font-semibold">{item.userEmail || `${item.userName}@college.edu`}</code>.
                </p>
              </div>

              {/* Handover Pass Card */}
              <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b border-surface-container">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover bg-surface-container shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                      {item.type} Pass
                    </span>
                    <h5 className="font-title-md text-[15px] text-on-surface truncate">
                      {item.title}
                    </h5>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                      Donor: {item.userName} ({item.userDept})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-label-md">
                  <div>
                    <span className="text-on-surface-variant text-[11px] uppercase tracking-wider block">
                      Designated Node:
                    </span>
                    <span className="font-semibold text-primary">{submittedPass.dropOffNode}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant text-[11px] uppercase tracking-wider block">
                      Target Window:
                    </span>
                    <span className="font-semibold text-on-surface">{submittedPass.proposedTime}</span>
                  </div>
                </div>

                {/* 4-Digit Verification Code */}
                <div className="pt-3 border-t border-surface-container flex items-center justify-between bg-surface-container rounded-xl p-3">
                  <div>
                    <span className="font-label-sm text-[11px] text-on-surface-variant block">
                      Handover Mutual Auth Code
                    </span>
                    <span className="text-[12px] text-on-surface">Share upon physical receipt</span>
                  </div>
                  <div className="font-mono text-2xl font-bold tracking-widest text-primary bg-surface px-3 py-1 rounded-lg border border-outline-variant/40">
                    {submittedPass.securityCode}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary font-title-md text-title-md rounded-xl transition-all cursor-pointer"
              >
                Done • View in Dashboard
              </button>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Item summary banner */}
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-surface-container">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-14 h-14 rounded-lg object-cover bg-surface-container shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-fixed px-2 py-0.2 rounded font-semibold">
                      {item.type}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {item.condition}
                    </span>
                  </div>
                  <div className="font-title-md text-[14px] text-on-surface truncate mt-0.5">
                    {item.title}
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">
                    Donor: {item.userName} • {item.location}
                  </div>
                </div>
              </div>

              {/* Node Selection */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Pick Verified Safe-Swap Node
                </label>
                <select
                  value={selectedNode}
                  onChange={(e) => setSelectedNode(e.target.value as DropOffNode)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
                >
                  {SAFE_SWAP_NODES.map((node) => (
                    <option key={node.name} value={node.name}>
                      {node.name} ({node.zone})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-secondary mt-1 block">
                  ✓ Continuous CCTV, staff presence, and student ID scanner equipped.
                </span>
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Proposed Meet-Up Time Window
                </label>
                <div className="space-y-1.5">
                  {timeSlots.map((slot) => (
                    <label
                      key={slot}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedTimeSlot === slot
                          ? 'bg-secondary-container/40 border-primary text-primary font-medium'
                          : 'bg-surface-container hover:bg-surface-container-high border-transparent text-on-surface'
                      }`}
                    >
                      <input
                        type="radio"
                        name="timeSlot"
                        checked={selectedTimeSlot === slot}
                        onChange={() => setSelectedTimeSlot(slot)}
                        className="accent-primary w-4 h-4"
                      />
                      <span className="text-body-md text-[13px]">{slot}</span>
                    </label>
                  ))}
                </div>

                {selectedTimeSlot === 'Custom Time Window...' && (
                  <input
                    type="text"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    placeholder="e.g. Wednesday 11:15 AM after Organic Chemistry lab"
                    className="w-full mt-2 px-3.5 py-2 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none"
                  />
                )}
              </div>

              {/* Offer Note / Trade Offering */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  {item.type === 'Exchange'
                    ? 'What are you offering in exchange? *'
                    : 'Note to Donor (Optional)'}
                </label>
                <textarea
                  required={item.type === 'Exchange'}
                  rows={2}
                  value={offerNote}
                  onChange={(e) => setOfferNote(e.target.value)}
                  placeholder={
                    item.type === 'Exchange'
                      ? 'e.g. I have a TI-84 Plus silver edition or German drafting kit in like new condition!'
                      : `Hi ${item.userName}, I need this for my seminar, can meet at the turnstiles!`
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div className="pt-2 border-t border-surface-container">
                <button
                  type="submit"
                  className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary font-title-md text-title-md rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>Confirm &amp; Send Handover Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
