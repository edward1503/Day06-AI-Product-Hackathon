import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center relative overflow-hidden selection:bg-primary-container/30 selection:text-primary">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-container/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10 p-8"
      >
        <div className="bg-surface-variant/40 backdrop-blur-2xl rounded-2xl p-8 shadow-[0_0_50px_rgba(205,189,255,0.05)] ring-1 ring-outline-variant/20">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(205,189,255,0.3)]">
              <Bot className="w-6 h-6 text-on-primary" />
            </div>
            <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight">LEARNING HUB</h1>
            <p className="font-body text-sm text-on-surface-variant mt-2 text-center">
              Enter your credentials to access your high-end learning environment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="font-label text-xs uppercase tracking-widest font-semibold text-on-surface-variant ml-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-on-surface-variant/60" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg py-2.5 pl-10 pr-4 text-sm font-body text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-xs uppercase tracking-widest font-semibold text-on-surface-variant ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-on-surface-variant/60" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg py-2.5 pl-10 pr-4 text-sm font-body text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-primary to-primary-container hover:from-primary/90 hover:to-primary-container/90 text-on-primary font-label text-sm font-bold uppercase tracking-widest py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(205,189,255,0.2)] hover:shadow-[0_0_30px_rgba(205,189,255,0.4)]"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
