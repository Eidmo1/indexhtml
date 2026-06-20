import React, { useState, useEffect } from 'react';
import { hover } from 'motion/react';
import { Calendar, TrendingUp, Users, CheckCircle2, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { UserStats } from '../types';

interface DashboardTabProps {
  stats: UserStats;
  onClaimDaily: () => void;
  lang: 'ar' | 'en';
  t: any;
}

export default function DashboardTab({
  stats,
  onClaimDaily,
  lang,
  t,
}: DashboardTabProps) {
  // Hardcoded check-in rewards in TON
  const dailyRewards = [0.01, 0.02, 0.03, 0.05, 0.08, 0.12, 0.25];

  // Check if daily check-in is already claimed today
  const isDailyClaimedToday = () => {
    if (!stats.lastCheckIn) return false;
    const last = new Date(stats.lastCheckIn);
    const today = new Date();
    return last.toDateString() === today.toDateString();
  };

  const claimedToday = isDailyClaimedToday();

  // Simulated live fee feed showing payouts in TON
  const [feedLogs, setFeedLogs] = useState<{ id: number; textAr: string; textEn: string; time: string }[]>([
    { id: 1, textAr: 'تم دفع 2.45 TON إلى E38d...9dfa', textEn: 'Paid 2.45 TON to E38d...9dfa', time: '1m ago' },
    { id: 2, textAr: 'انضم مستخدم جديد للمعلن "رعاية قنوات التون"', textEn: 'New user joined advertiser "TON Channels"', time: '3m ago' },
    { id: 3, textAr: 'تم دفع 1.12 TON إلى TG_892k...sf88', textEn: 'Paid 1.12 TON to TG_892k...sf88', time: '5m ago' },
    { id: 4, textAr: 'تم إطلاق حملة ممولة جديدة بقيمة 50.0 TON', textEn: 'New ad campaign funded with 50.0 TON', time: '8m ago' },
  ]);

  useEffect(() => {
    const addresses = ['EQAx_89a', 'EQD9_e42', 'EQBy_77a', 'EQF7_e38', 'EQC8_m0b', 'EQA_ud8'];
    const interval = setInterval(() => {
      const randAddr = addresses[Math.floor(Math.random() * addresses.length)] + '...' + Math.random().toString(36).substring(2, 6);
      const randAmt = (Math.random() * 4.5 + 0.5).toFixed(2);
      const newLog = {
        id: Date.now(),
        textAr: `تم دفع ${randAmt} TON إلى ${randAddr}`,
        textEn: `Paid ${randAmt} TON to ${randAddr}`,
        time: 'Just now',
      };
      setFeedLogs((prev) => [newLog, ...prev.slice(0, 3)]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-5 flex flex-col pb-20">
      {/* Gold Mine Majestic Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 shadow-lg shadow-amber-500/5 aspect-[16/9] w-full bg-zinc-950">
        <img
          src="/src/assets/images/gold_mine_banner_1781944531933.jpg"
          alt="TON Gold Mine"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent flex flex-col justify-end p-5">
          <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full w-fit mb-2 border border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-400 font-mono tracking-wider">
              {lang === 'ar' ? '⛏️ منجم ذهب TON النشط' : '⛏️ ACTIVE TON GOLD MINE'}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight drop-shadow-md">
            {lang === 'ar' ? 'ابدأ التنقيب وحصد الأرباح المضمونة' : 'Start Mining & Collecting Real Rewards'}
          </h2>
          <p className="text-zinc-300 text-xs mt-1 max-w-[90%] font-medium">
            {lang === 'ar'
              ? 'كل نقرة، مشاهدة، وزيارة تدعم رصيدك الحقيقي بعملة TON بشكل فوري!'
              : 'Every click, task, and visit increases your real TON balance instantly!'}
          </p>
        </div>
      </div>

      {/* Main Total Balance Counter Display */}
      <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 text-center shadow-xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

        <p className="text-xs tracking-wider text-zinc-400 font-medium mb-1.5 uppercase">
          {t.balance}
        </p>

        <div className="flex items-center justify-center gap-2 mb-2">
          {/* TON Coin Logo */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-sky-600 p-0.5 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
              <span className="text-cyan-400 font-extrabold text-xs tracking-wider font-mono">TON</span>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-mono">
            {stats.balance.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 4 })}
          </h1>
          <span className="text-xs font-semibold text-cyan-400 mt-2 font-mono">TON</span>
        </div>
      </div>

      {/* Quick Action Navigation Suggestions */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500">
              {lang === 'ar' ? 'العروض اليومية' : 'SPONSOR TASKS'}
            </span>
            <p className="text-xs text-zinc-400 mt-1">
              {lang === 'ar' ? 'أكمل زيارات القنوات والمشاهدات لحصد الـ TON يدوياً.' : 'Complete clicks & views to claim real TON points instantly.'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400">
              {lang === 'ar' ? 'دعوة المعارف' : 'VIRAL REFERRALS'}
            </span>
            <p className="text-xs text-zinc-400 mt-1">
              {lang === 'ar' ? 'احصل على عمولات بنسبة 10% من مخرجات إحالاتك الكلية.' : 'Extract life 10% cashbacks from peer tasks completed.'}
            </p>
          </div>
        </div>
      </div>

      {/* Daily Reward Check-in */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 relative">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-white text-md flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {t.dailyCheckIn}
            </h3>
            <p className="text-zinc-500 text-xs mt-0.5">{t.dailyBonusTitle}</p>
          </div>

          <button
            id="btn-claim-daily-award"
            onClick={onClaimDaily}
            disabled={claimedToday}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-150 ${
              claimedToday
                ? 'bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-md shadow-emerald-500/10'
            }`}
          >
            {claimedToday ? t.completed : t.claim}
          </button>
        </div>

        {/* 7 Days Reward Track Row */}
        <div className="grid grid-cols-7 gap-1.5 pt-1 overflow-x-auto">
          {dailyRewards.map((reward, idx) => {
            const dayNum = idx + 1;
            const isCompleted = stats.dailyCheckInDay > dayNum;
            const isCurrent = stats.dailyCheckInDay === dayNum && !claimedToday;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all min-w-[50px] ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-900 text-emerald-400'
                    : isCurrent
                    ? 'bg-amber-950/30 border-amber-500 text-amber-400 ring-1 ring-amber-500/30 font-bold'
                    : 'bg-zinc-950 border-zinc-800/80 text-zinc-500'
                }`}
              >
                <span className="text-[9px] font-mono uppercase tracking-wider">Day {dayNum}</span>
                <span className="text-[10px] font-mono mt-1 font-bold">+{reward}</span>
                <span className="text-[8px] text-zinc-500 block">TON</span>
                {isCompleted && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Payout Log Bar */}
      <div className="bg-zinc-950/60 border border-zinc-900 rounded-3xl p-4">
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 ml-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          {t.recentWithdrawalFeed}
        </h4>
        <div className="space-y-2 max-h-[140px] overflow-hidden">
          {feedLogs.map((log) => (
            <div
              key={log.id}
              className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/50"
            >
              <span className="text-zinc-300 font-medium truncate max-w-[210px]">
                {lang === 'ar' ? log.textAr : log.textEn}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
