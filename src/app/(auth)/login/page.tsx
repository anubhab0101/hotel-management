import React from 'react';
import { login } from './actions';
import { AlertCircle } from 'lucide-react';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-ink/5">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-forest text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            L
          </div>
          <h1 className="text-2xl font-bold text-ink">LumiStay Admin</h1>
          <p className="text-ink/60 mt-2 text-sm">Sign in to manage your hotel</p>
        </div>

        {params.error && (
          <div className="bg-critical/10 text-critical p-4 rounded-xl text-sm flex items-start gap-3 mb-6">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{params.error}</p>
          </div>
        )}

        <form action={login} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink/80 mb-1.5" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full bg-warm-surface rounded-xl p-3 border border-transparent focus:border-forest/30 focus:ring-2 focus:ring-forest/20 outline-none transition-all"
              placeholder="manager@hotel.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-ink/80 mb-1.5" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full bg-warm-surface rounded-xl p-3 border border-transparent focus:border-forest/30 focus:ring-2 focus:ring-forest/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-forest text-white font-bold py-3.5 rounded-xl hover:bg-forest/90 active:scale-[0.98] transition-all shadow-md mt-4"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-ink/50 mt-8">
          Powered by LumiStay SaaS
        </p>
      </div>
    </div>
  );
}
