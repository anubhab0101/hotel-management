'use client';

import { useState, useEffect } from 'react';

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('guest_consent');
    if (!consent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('guest_consent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">Data Collection Consent (DPDP Act)</h3>
        <p className="text-sm text-gray-700 max-w-4xl">
          To provide you with room service and fulfill your requests, we collect essential data such as your room number and order preferences. This data is strictly processed for service delivery in compliance with the Digital Personal Data Protection (DPDP) Act of India. We anonymize your data when you check out. You can withdraw your consent at any time from the bottom of the page.
        </p>
      </div>
      <button
        onClick={handleAccept}
        className="bg-brand-primary text-white px-6 py-2 rounded-md font-medium whitespace-nowrap hover:opacity-90 transition-opacity shrink-0"
      >
        I Accept
      </button>
    </div>
  );
}
