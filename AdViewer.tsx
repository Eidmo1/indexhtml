import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ArrowUpRight, Timer, CheckCircle, ShieldAlert, Award } from 'lucide-react';
import { AdTask } from '../types';
import { generateMonetizedUrl, ShortenerConfig } from '../utils/monetizer';

interface AdViewerProps {
  task: AdTask | null;
  onClose: () => void;
  onReward: (rewardAmount: number, taskId: string) => void;
  lang: 'ar' | 'en';
  t: any;
  shortenerConfig?: ShortenerConfig;
}

export default function AdViewer({ task, onClose, onReward, lang, t, shortenerConfig }: AdViewerProps) {
  if (!task) return null;

  const [counter, setCounter] = useState(task.duration);
  const [visited, setVisited] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [resolvedLink, setResolvedLink] = useState(task.link);

  useEffect(() => {
    setCounter(task.duration);
    setVisited(false);
    setVerifying(false);
    setFinished(false);
    setIsFocused(true);

    async function resolve() {
      if (shortenerConfig && shortenerConfig.enabled && shortenerConfig.apiToken) {
        const url = await generateMonetizedUrl(task.link, shortenerConfig);
        setResolvedLink(url);
      } else {
        setResolvedLink(task.link);
      }
    }
    resolve();
  }, [task, shortenerConfig]);

  // Anti-cheat: Track user active focus
  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const handleVisibility = () => {
      setIsFocused(document.visibilityState === 'visible');
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (!visited) return;
    if (counter <= 0) {
      return;
    }
    if (!isFocused) {
      return; // Pause timer!
    }

    const interval = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [counter, visited, isFocused]);

  const handleVisitLink = () => {
    // Open target website in a new window/tab
    window.open(resolvedLink, '_blank');
    setVisited(true);
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setFinished(true);
      onReward(task.reward, task.id);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden border bg-zinc-900 border-zinc-800 rounded-3xl"
        >
          {/* Glowing Aura */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col items-center text-center">
            {/* Header Category Icon */}
            <div className="p-4 mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Award className="w-10 h-10 animate-pulse" />
            </div>

            <span className="px-3 py-1 mb-2 text-xs font-mono font-medium tracking-wider uppercase text-amber-400 bg-amber-950/40 border border-amber-500/30 rounded-full">
              {task.category.toUpperCase()} SPONSOR
            </span>

            <h3 className="text-xl md:text-2xl font-bold font-sans text-white mb-2 leading-snug">
              {lang === 'ar' ? task.titleAr : task.titleEn}
            </h3>

            <p className="text-zinc-400 text-sm mb-6 max-w-sm">
              {t.adTimerMsg.replace('{sec}', task.duration.toString())}
            </p>

            {/* Simulated Live Frame / Link Details */}
            <div className="w-full mb-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 ml-1 rounded-lg bg-zinc-900 text-zinc-400 flex-shrink-0">
                  <Globe className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-zinc-500 font-mono">AD TARGET URL</div>
                  <div className="text-sm font-medium text-zinc-300 truncate">{task.link}</div>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-bold text-amber-500 bg-amber-500/10 rounded-lg flex-shrink-0">
                +{task.reward} TON
              </span>
            </div>

            {/* Action State Section */}
            {!visited ? (
              <div className="w-full space-y-3">
                <button
                  id="btn-visit-ad-link"
                  onClick={handleVisitLink}
                  className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-2xl flex items-center justify-center gap-2 transition duration-200 shadow-lg shadow-amber-500/20 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  <span>{t.clickAction}</span>
                  <ArrowUpRight className="w-5 h-5 font-bold" />
                </button>
                <button
                  id="btn-close-ad-cancel"
                  onClick={onClose}
                  className="w-full py-3 px-6 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white text-sm font-medium rounded-2xl transition duration-150 border border-zinc-800"
                >
                  {t.closeAd}
                </button>
              </div>
            ) : (
              <div className="w-full">
                {/* Timer Countdown UI */}
                {counter > 0 && !finished && (
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative flex items-center justify-center w-24 h-24 mb-3">
                      <svg className="absolute w-full h-full -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          className="text-zinc-800"
                          strokeWidth="6"
                          fill="transparent"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          className="text-amber-500"
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - counter / task.duration)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-extrabold text-white font-mono">{counter}</span>
                        <span className="text-[10px] text-zinc-500 tracking-wider">SEC</span>
                      </div>
                    </div>
                    <p className="text-xs text-amber-400 bg-amber-500/5 border border-amber-500/10 px-4 py-1.5 rounded-full flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5" />
                      Keep this page active
                    </p>
                    {!isFocused && (
                      <div className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl flex items-center gap-2 animate-pulse justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        <span>
                          {lang === 'ar'
                            ? '⚠️ مكافحة الغش: الإعلان متوقف مؤقتاً! يرجى البقاء داخل شاشة البوت الاحتساب.'
                            : '⚠️ Anti-Cheat Active: Ad paused! Please keep the app open to count.'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Validation & Claim States */}
                {counter === 0 && !finished && (
                  <div className="w-full space-y-4 animate-fade-in-up">
                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-center text-amber-400 gap-2 mb-4 text-sm font-medium">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span>Duration requirement completed! Ready to claim.</span>
                    </div>

                    <button
                      id="btn-verify-ad-claim"
                      onClick={handleVerify}
                      disabled={verifying}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800/50 text-black font-semibold rounded-2xl flex items-center justify-center gap-2 transition duration-200"
                    >
                      {verifying ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>{t.verificationPending}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 font-bold" />
                          <span>{t.verifyAction}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {finished && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center py-4 text-center"
                  >
                    <div className="w-16 h-16 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 font-bold" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{t.congratulations}</h4>
                    <p className="text-zinc-400 text-sm mb-6">
                      {t.adVerified.replace('{amount}', task.reward.toString())}
                    </p>
                    <button
                      id="btn-reward-ad-close"
                      onClick={onClose}
                      className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-2xl transition duration-150"
                    >
                      {t.closeAd}
                    </button>
                  </motion.div>
                )}

                {/* Info Note */}
                {!finished && (
                  <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-left">
                    <ShieldAlert className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      Closing this screen or navigating away beforehand will abort the verification loop and void rewards.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
