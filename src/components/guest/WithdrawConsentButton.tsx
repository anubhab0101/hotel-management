'use client';

import { useState, useEffect } from 'react';

export default function WithdrawConsentButton() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('guest_consent');
    if (consent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasConsent(true);
    }
  }, []);

  const handleWithdraw = () => {
    localStorage.removeItem('guest_consent');
    window.location.reload();
  };

  if (!hasConsent) return null;

  return (
    <>
      <span className="text-black/20">|</span>
      <button onClick={handleWithdraw} className="underline hover:opacity-100 transition-opacity">
        Withdraw Consent
      </button>
    </>
  );
}
