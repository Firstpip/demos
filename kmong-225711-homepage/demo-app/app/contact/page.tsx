'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlurFade from '@/components/ui/BlurFade';
import GlitchText from '@/components/ui/GlitchText';
import Particles from '@/components/ui/Particles';
import ShimmerButton from '@/components/ui/ShimmerButton';
import PageTransition from '@/components/layout/PageTransition';
import { company } from '@/data';

const types = ['웹사이트 개발', '모바일 앱', '데이터 분석', 'IT 컨설팅', '기타'];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', type: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = '필수';
    if (!form.email.trim()) e.email = '필수';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = '형식 오류';
    if (!form.type) e.type = '필수';
    if (!form.message.trim()) e.message = '필수';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const inp = (f: string) => `w-full px-0 py-4 bg-transparent border-b text-[14px] text-[#f5f5f0] placeholder-[#333330] focus:outline-none transition-colors duration-300 ${errors[f] ? 'border-red-500/40' : 'border-[#1a1a1a] focus:border-[#c8ff00]'}`;

  return (
    <PageTransition>
      <div className="relative pt-20 overflow-hidden">
        <Particles quantity={60} />
        <section className="relative py-24 md:py-32">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32">
              {/* Left */}
              <div>
                <BlurFade><p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-8">Contact</p></BlurFade>
                <BlurFade delay={0.05}>
                  <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight leading-[0.9] mb-14" style={{ fontFamily: 'var(--font-display)' }}>
                    <GlitchText text="Let's" />
                    <br />
                    <GlitchText text="talk." />
                  </h1>
                </BlurFade>
                <BlurFade delay={0.15}>
                  <div className="space-y-7">
                    {[
                      { label: 'Email', val: company.email },
                      { label: 'Phone', val: company.phone },
                      { label: 'Location', val: company.address },
                    ].map(c => (
                      <div key={c.label}>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#333330] mb-1.5 font-mono">{c.label}</p>
                        <p className="text-[13px] text-[#999990]">{c.val}</p>
                      </div>
                    ))}
                  </div>
                </BlurFade>
              </div>

              {/* Right — form */}
              <div>
                <BlurFade delay={0.1}>
                  <form onSubmit={submit} className="space-y-2" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.2em] text-[#333330] font-mono">Name <span className="text-[#c8ff00]">*</span></label>
                        <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inp('name')} />
                        {errors.name && <p className="text-[9px] text-red-400/60 mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.2em] text-[#333330] font-mono">Email <span className="text-[#c8ff00]">*</span></label>
                        <input type="email" placeholder="hello@company.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inp('email')} />
                        {errors.email && <p className="text-[9px] text-red-400/60 mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.2em] text-[#333330] font-mono">Company</label>
                        <input type="text" placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className={inp('company')} />
                      </div>
                      <div className="relative">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-[#333330] font-mono">Type <span className="text-[#c8ff00]">*</span></label>
                        <button type="button" onClick={() => setDdOpen(!ddOpen)} className={`${inp('type')} text-left flex justify-between items-center w-full`} data-hover>
                          <span className={form.type ? '' : 'text-[#333330]'}>{form.type || 'Select'}</span>
                          <svg className={`w-3 h-3 text-[#333330] transition-transform ${ddOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <AnimatePresence>
                          {ddOpen && (
                            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
                              className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#111111] border border-[#1a1a1a] rounded-lg overflow-hidden shadow-2xl">
                              {types.map(t => (
                                <button key={t} type="button" onClick={() => {setForm({...form, type: t}); setDdOpen(false);}}
                                  className="w-full px-4 py-3 text-left text-[12px] text-[#666660] hover:bg-[#c8ff00]/5 hover:text-[#c8ff00] transition-colors" data-hover>{t}</button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {errors.type && <p className="text-[9px] text-red-400/60 mt-1">{errors.type}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-[0.2em] text-[#333330] font-mono">Message <span className="text-[#c8ff00]">*</span></label>
                      <textarea placeholder="About your project..." rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className={`${inp('message')} resize-none`} />
                      {errors.message && <p className="text-[9px] text-red-400/60 mt-1">{errors.message}</p>}
                    </div>
                    <div className="pt-8 flex justify-start">
                      <ShimmerButton type="submit">Send Message</ShimmerButton>
                    </div>
                  </form>
                </BlurFade>
              </div>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {sent && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 px-5 py-3.5 rounded-lg bg-[#111111] border border-[#c8ff00]/20 z-50 flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#c8ff00]/10 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-[#c8ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-[11px] text-[#f5f5f0]">Sent successfully</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
