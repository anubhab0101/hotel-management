import React from 'react';
import { notFound } from 'next/navigation';
import { resolveQrToken } from '@/lib/db/queries/guest';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function LegalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const guestContext = await resolveQrToken(token);

  if (!guestContext) {
    notFound();
  }

  const { termsAndConditions, privacyPolicy } = guestContext.branding;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-8 pb-32">
      <div className="flex items-center gap-4 py-4">
        <Link href={`/q/${token}`} className="p-2 -ml-2 rounded-full bg-brand-surface border border-black/10 hover:bg-black/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Legal &amp; Privacy</h1>
      </div>

      <section className="bg-white p-6 rounded-xl border border-black/5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
          {termsAndConditions || 'No Terms and Conditions provided.'}
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl border border-black/5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Privacy Policy</h2>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
          {privacyPolicy || 'No Privacy Policy provided.'}
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl border border-black/5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">DPDP Act Compliance &amp; Grievance Redressal</h2>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
          <p>This service complies with the Digital Personal Data Protection (DPDP) Act, India. We collect only the data necessary to provide our services and retain it only as long as required. You have the Right to Erasure, and your data (such as order notes and requests) will be anonymized upon your departure or QR token rotation.</p>
          <p className="mt-4"><strong>Data Protection Officer (DPO) / Grievance Officer:</strong><br />
          Email: dpo@hotel.example.com<br />
          Phone: +91-0000000000<br />
          If you have any grievances regarding your personal data, please contact the DPO using the details provided above.</p>
        </div>
      </section>
    </div>
  );
}
