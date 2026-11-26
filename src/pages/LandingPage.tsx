import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Globe,
  Headphones,
  HeartHandshake,
  Lock,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { SupportedLanguage } from '../types';

export const LandingPage: React.FC = () => {
  const { language, setLanguage, setHumanModalOpen } = useApp();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 3-Zone Top Bar Contract */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="font-display text-lg font-bold tracking-tight text-[#0F2942] whitespace-nowrap shrink-0"
          >
            Sahaaya AI
          </Link>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <a
              href="#how-it-works"
              className="hover:text-[#0F2942] transition-colors whitespace-nowrap shrink-0"
            >
              How It Works
            </a>
            <a
              href="#capabilities"
              className="hover:text-[#0F2942] transition-colors whitespace-nowrap shrink-0"
            >
              Capabilities
            </a>
            <Link
              to="/privacy"
              className="hover:text-[#0F2942] transition-colors whitespace-nowrap shrink-0"
            >
              Privacy
            </Link>
            <Link
              to="/dashboard"
              className="hover:text-[#0F2942] transition-colors whitespace-nowrap shrink-0"
            >
              Dashboard
            </Link>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => navigate('/assessment')}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
            >
              {t(language, 'startAssessment')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Split */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                  <span>National Helpline Against Atrocities (NHAA 14566)</span>
                  <span aria-hidden="true">·</span>
                  <span>Hackathon Prototype</span>
                </div>

                <h1
                  className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-[#0F2942] leading-[1.15]"
                  style={{ textWrap: 'balance' }}
                >
                  {t(language, 'tagline')}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  Sahaaya AI is an AI-assisted stress and vulnerability support module
                  designed to help helpline officers identify emotional distress early,
                  prioritize compassionate outreach, and coordinate verified counselling
                  and legal aid referrals.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => navigate('/assessment')}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>{t(language, 'startAssessment')}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#0F2942] bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>{t(language, 'openDashboard')}</span>
                  </button>
                </div>

                {/* Language & Direct Human Support toolbar */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    <label htmlFor="landing-lang" className="text-xs font-medium text-slate-600">
                      Language:
                    </label>
                    <select
                      id="landing-lang"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                      className="text-xs font-medium text-slate-800 bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-teal-600"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setHumanModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 hover:underline"
                  >
                    <Headphones className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t(language, 'connectHuman')}</span>
                  </button>
                </div>
              </div>

              {/* Hero Image Container */}
              <div className="lg:col-span-6 flex">
                <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[280px] lg:min-h-[380px] relative">
                  {!imgError ? (
                    <img
                      src="/src/assets/images/hero_civic_support_1795688517024.jpg"
                      alt="Calm public helpline support center with daylight and natural wood interior"
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#0F2942] to-teal-900 text-white">
                      <ShieldCheck className="w-10 h-10 text-teal-300 mb-3" />
                      <p className="font-display text-lg font-semibold">
                        Trauma-Informed Support Architecture
                      </p>
                      <p className="text-xs text-slate-300 max-w-xs mt-1">
                        Human oversight and voluntary participation at every step.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Voluntary Participation & Non-Diagnostic Notice Strip */}
        <section className="bg-[#0F2942] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-sm text-slate-100 leading-relaxed">
                <span className="font-semibold text-white">Voluntary Participation Notice:</span>{' '}
                Users always choose whether to participate in an automated check-in, can
                skip any question, or speak directly to a human officer. This hackathon
                prototype uses synthetic data only and does not provide clinical diagnoses.
              </div>
            </div>
            <Link
              to="/privacy"
              className="text-xs font-semibold text-teal-300 hover:text-white underline whitespace-nowrap shrink-0"
            >
              Read Privacy & Ethics Principles
            </Link>
          </div>
        </section>

        {/* Three-Step Flow: Connect, Assess, Support */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-teal-700 tracking-wide">
              Care Pathway
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F2942] mt-1">
              Three calm steps designed around user dignity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
              <div className="text-xs font-mono font-semibold text-teal-700">
                01. Connect
              </div>
              <h3 className="font-display text-lg font-semibold text-[#0F2942]">
                Consent & Language Choice
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Complainants choose their preferred language, review plain-language
                privacy terms, and decide whether to share via text, simulated voice, or
                request a human officer immediately.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
              <div className="text-xs font-mono font-semibold text-teal-700">
                02. Assess
              </div>
              <h3 className="font-display text-lg font-semibold text-[#0F2942]">
                Preliminary Distress Indicators
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Non-leading check-in prompts and transparent text indicators highlight
                potential emotional strain or safety needs with explicit uncertainty
                margins—never forcing traumatic retelling.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
              <div className="text-xs font-mono font-semibold text-teal-700">
                03. Support
              </div>
              <h3 className="font-display text-lg font-semibold text-[#0F2942]">
                Human Review & Referrals
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Trained NHAA personnel review every submission, verify urgency in
                context, override or dismiss AI indicators if needed, and confirm
                referrals to counselling, legal aid, or welfare relief.
              </p>
            </div>
          </div>
        </section>

        {/* Core Capabilities Bento Grid */}
        <section
          id="capabilities"
          className="bg-white border-t border-b border-slate-200 py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-teal-700 tracking-wide">
                System Capabilities
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F2942] mt-1">
                Built for early assistance and strict human oversight
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 rounded-xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5 text-[#0F2942]">
                  <Sparkles className="w-5 h-5 text-teal-700 shrink-0" aria-hidden="true" />
                  <h3 className="font-display text-lg font-semibold">
                    Transparent Early Distress Identification
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rather than opaque black-box scores, Sahaaya AI surfaces specific
                  language indicators (such as sleep disruption, acute anxiety, or
                  perceived intimidation) alongside a 0–100 preliminary Stress
                  Vulnerability Index and an uncertainty range. Trained professionals
                  retain full authority to confirm, adjust, or dismiss any indicator.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-600">
                  <span>0–100 Preliminary SVI</span>
                  <span aria-hidden="true">·</span>
                  <span>Explicit Confidence Margin</span>
                  <span aria-hidden="true">·</span>
                  <span>Zero Demographic Inference</span>
                </div>
              </div>

              <div className="md:col-span-5 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5 text-[#0F2942]">
                  <Globe className="w-5 h-5 text-teal-700 shrink-0" aria-hidden="true" />
                  <h3 className="font-display text-lg font-semibold">
                    Multilingual Interface Support
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Demonstrates live UI localization in English, Hindi, and Kannada,
                  structured with extensible translation keys for Tamil, Telugu,
                  Marathi, and regional dialects—while keeping critical legal and
                  mental health guidance protected from unverified auto-translation.
                </p>
              </div>

              <div className="md:col-span-5 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5 text-[#0F2942]">
                  <UserCheck className="w-5 h-5 text-teal-700 shrink-0" aria-hidden="true" />
                  <h3 className="font-display text-lg font-semibold">
                    Privacy & Data Minimization
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Operates strictly on anonymized case identifiers (e.g.,{' '}
                  <span className="font-mono text-xs">NHAA-2026-8410</span>). No audio
                  is recorded, no personal data is written to browser storage, and
                  users can withdraw consent at any moment.
                </p>
              </div>

              <div className="md:col-span-7 rounded-xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5 text-[#0F2942]">
                  <HeartHandshake
                    className="w-5 h-5 text-teal-700 shrink-0"
                    aria-hidden="true"
                  />
                  <h3 className="font-display text-lg font-semibold">
                    Human-Confirmed Referral Coordination
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Connects authorized officers to structured pathways for Mental Health
                  Counselling, Free Legal Aid, Medical Assistance, Social Welfare, and
                  Witness Protection Information. Automated indicators never dispatch
                  police or initiate legal actions independently.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">
              Sahaaya AI — Real-Time Stress and Trauma Support System
            </p>
            <p>
              Hackathon demonstration prototype for NHAA 14566. Synthetic data only; not
              a certified clinical or statutory system.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/dashboard" className="hover:text-slate-900">
              Support Dashboard
            </Link>
            <Link to="/assessment" className="hover:text-slate-900">
              Assessment
            </Link>
            <Link to="/referrals" className="hover:text-slate-900">
              Referral Center
            </Link>
            <Link to="/privacy" className="hover:text-slate-900">
              Privacy & Ethics
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
