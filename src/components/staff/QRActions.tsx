'use client';

import React, { useState } from 'react';
import { Download, RefreshCw, Eye, Check } from 'lucide-react';
import { rotateRoomToken } from '@/lib/db/queries/admin';

export default function QRActions({ roomId, roomLabel, tokenHash }: { roomId: string, roomLabel: string, tokenHash: string | null }) {
  const [isRotating, setIsRotating] = useState(false);
  const [justRotated, setJustRotated] = useState(false);
  
  const handleRotate = async () => {
    if (!confirm(`Are you sure you want to regenerate the QR code for Room ${roomLabel}? The old QR code will stop working immediately.`)) {
      return;
    }
    
    setIsRotating(true);
    try {
      const res = await rotateRoomToken(roomId);
      if (res.success) {
        setJustRotated(true);
        setTimeout(() => setJustRotated(false), 3000);
        // Refresh the page to get new data
        window.location.reload();
      } else {
        alert('Failed to rotate QR token');
      }
    } catch (e) {
      console.error(e);
      alert('Error rotating token');
    } finally {
      setIsRotating(false);
    }
  };

  const handlePreview = () => {
    if (!tokenHash) return alert('No active token');
    window.open(`/q/${tokenHash}`, '_blank');
  };

  const handleDownload = () => {
    if (!tokenHash) return alert('No active token');
    // Open a print window or generate PDF
    const qrUrl = `${window.location.origin}/q/${tokenHash}`;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert('Popup blocked');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Room ${roomLabel} QR</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            h1 { font-size: 48px; margin-bottom: 24px; }
            .qr-container { padding: 24px; border: 4px solid #171717; border-radius: 16px; }
            p { margin-top: 24px; font-size: 24px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Room ${roomLabel}</h1>
          <div class="qr-container" id="qr-target"></div>
          <p>Scan to access room services</p>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
          <script>
            new QRCode(document.getElementById("qr-target"), {
              text: "${qrUrl}",
              width: 300,
              height: 300,
              colorDark : "#000000",
              colorLight : "#ffffff",
              correctLevel : QRCode.CorrectLevel.H
            });
            setTimeout(() => { window.print(); }, 1000);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex justify-end space-x-2">
      <button 
        onClick={handlePreview}
        disabled={!tokenHash}
        className="p-2 text-ink/50 hover:text-forest hover:bg-forest/10 rounded-lg transition-colors disabled:opacity-50" 
        title="Preview Portal"
      >
        <Eye size={18} />
      </button>
      <button 
        onClick={handleDownload}
        disabled={!tokenHash}
        className="p-2 text-ink/50 hover:text-forest hover:bg-forest/10 rounded-lg transition-colors disabled:opacity-50" 
        title="Print/Download QR"
      >
        <Download size={18} />
      </button>
      <button 
        onClick={handleRotate}
        disabled={isRotating}
        className="p-2 text-ink/50 hover:text-critical hover:bg-critical/10 rounded-lg transition-colors disabled:opacity-50" 
        title="Regenerate Token"
      >
        {justRotated ? <Check size={18} className="text-forest" /> : <RefreshCw size={18} className={isRotating ? 'animate-spin' : ''} />}
      </button>
    </div>
  );
}
