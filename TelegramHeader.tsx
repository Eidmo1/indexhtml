import React from 'react';
import { Shield, Sparkles, MessageCircle, Signal, Battery, MoreVertical, X, Globe, Info } from 'lucide-react';

interface TelegramHeaderProps {
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  activeTab: string;
  t: any;
}

export default function TelegramHeader({ lang, onToggleLang, activeTab, t }: TelegramHeaderProps) {
  // Current dynamic time for the status bar
  const currentTime = "13:05"; // Hardcoded to matches local time from metadata nicely, or we can use simulated live time

  return (
    <div className="bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 border-b border-zinc-900 select-none">
      {/* Visual Telegram Status Bar */}
      <div className="px-5 py-1.5 flex justify-between items-center text-[10px] text-zinc-500 font-mono font-semibold">
        <span>{currentTime}</span>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3.5 h-3.5 fill-current" />
          <span className="text-[9px]">5G</span>
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* Mini App Header Navigation Bar */}
      <div className="px-5 py-3 flex justify-between items-center bg-zinc-950">
        <div className="flex items-center gap-2.5">
          {/* Custom Avatar Circular Icon */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-600 flex items-center justify-center font-bold text-zinc-950 text-sm tracking-widest shadow-lg shadow-amber-500/10">
              1G
            </div>
            {/* Online Status Dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-950" />
          </div>

          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm text-white font-sans tracking-tight">
                1gram Bot
              </span>
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-sky-500 text-[8px] text-zinc-950 font-bold">
                ✓
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium block">
              @OneGramTonBot
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Interactive Language Toggle Option (English / العربية) */}
          <button
            id="btn-lang-toggle"
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850/80 border-zinc-800 text-[11px] text-amber-500 font-bold transition duration-150"
            title="Switch Language / تغيير اللغة"
          >
            <Globe className="w-3 h-3 text-zinc-400" />
            <span>{lang === 'en' ? 'العربية' : 'EN'}</span>
          </button>

          {/* Simulated three-dots menu or info button */}
          <button
            id="btn-info"
            className="p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
            title="App Information"
            onClick={() => {
              alert(
                lang === 'ar'
                  ? 'منصة 1gram: تطبيق تيليجرام مصغر متكامل للربح الحقيقي من الإعلانات والإحالات ويدعم التنسيق المباشر والتحويل التلقائي.'
                  : '1gram Platform: High fidelity Telegram Mini App for earning real TON by viewing sponsored ads and referring friends.'
              );
            }}
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Close Application Icon */}
          <div className="h-5 w-[1px] bg-zinc-800" />

          <button
            id="btn-close-sim"
            className="p-1.5 rounded-full bg-zinc-900/60 hover:bg-zinc-800 text-zinc-500 hover:text-white transition"
            onClick={() => {
              alert(
                lang === 'ar'
                  ? 'هذا تطبيق ويب يحاكي تيليجرام. يمكنك استعراض كافة الميزات ونقلها لبيئة الإنتاج لاحقاً.'
                  : 'This is a simulation platform representing the Telegram Mini App environment! Explore the full functional stack.'
              );
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
