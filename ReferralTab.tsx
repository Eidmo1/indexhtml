import React, { useState } from 'react';
import { Referral } from '../types';
import { Send, Copy, Check, Users, Gift, HelpCircle, UserCheck } from 'lucide-react';

interface ReferralTabProps {
  referrals: Referral[];
  referralCode: string;
  lang: 'ar' | 'en';
  t: any;
}

export default function ReferralTab({
  referrals,
  referralCode,
  lang,
  t,
}: ReferralTabProps) {
  const [copied, setCopied] = useState(false);

  const inviteUrl = `https://t.me/OneGramTonBot?start=ref_${referralCode}`;

  const handleCopyLink = () => {
    try {
      const inputEl = document.getElementById('input-referral-link') as HTMLInputElement;
      if (inputEl) {
        inputEl.select();
        inputEl.setSelectionRange(0, 99999);
      }
      
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(inviteUrl)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(() => {
            try {
              document.execCommand('copy');
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch (err) {}
          });
      } else {
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {}
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTelegramShare = () => {
    const shareText = lang === 'ar' 
      ? `انضم إلى بوت 1gram وابدأ بربح TON مجاناً عبر إتمام مهام ومشاهدة إعلانات يومية! 💎🚀`
      : `Join 1gram Bot to earn real TON for free by completing simple daily ad tasks! 💎🚀`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, '_blank');
  };

  const totalCommission = referrals.reduce((sum, r) => sum + r.earned, 0);

  return (
    <div className="space-y-5 pb-20">
      {/* Referral Program Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-neutral-900 border border-zinc-800 rounded-3xl p-5 md:p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl shrink-0 mt-0.5 animate-pulse">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-md leading-tight mb-1">
              {lang === 'ar' ? 'برنامج الإحالات الذكي' : 'Refer & Earn TON'}
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              {lang === 'ar'
                ? 'اكسب 0.05 TON فورياً لكل صديق يسجل في البوت، بالإضافة إلى عمولة ثابتة بقيمة 10% من رصيد كل مهمة إعلانية يكملها صديقك!'
                : 'Get 0.05 TON instantly for each new referral, plus a lifetime 10% commission on all advertising tasks they complete!'}
            </p>
          </div>
        </div>
      </div>

      {/* Referral Link Box */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 block">
          {t.referralLink}
        </h4>
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5">
          <input
            id="input-referral-link"
            type="text"
            readOnly
            value={inviteUrl}
            className="flex-1 bg-transparent border-none text-xs text-zinc-300 font-mono tracking-wide px-2 focus:ring-0 outline-none truncate"
          />
          <button
            id="btn-copy-ref-link"
            onClick={handleCopyLink}
            className={`p-2.5 rounded-xl transition flex items-center justify-center ${
              copied
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
            title={t.copy}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Telegram Share Button */}
        <button
          id="btn-share-tg-invite"
          onClick={handleTelegramShare}
          className="w-full mt-3 py-3 px-5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 active:scale-[0.99] font-semibold text-white rounded-2xl text-xs flex items-center justify-center gap-2 transition duration-150 shadow-md shadow-sky-500/10"
        >
          <Send className="w-4 h-4 fill-current" />
          <span>{t.inviteFriend}</span>
        </button>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
          <span className="text-[10px] text-zinc-500 font-semibold uppercase block">
            {t.totalReferrals}
          </span>
          <span className="text-2xl font-extrabold text-white font-mono block mt-1">
            {referrals.length}
          </span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
          <span className="text-[10px] text-zinc-500 font-semibold uppercase block">
            {t.referralEarnings}
          </span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono block mt-1">
            +{totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} <span className="text-xs font-sans text-zinc-400 ml-0.5">TON</span>
          </span>
        </div>
      </div>

      {/* Referrals List Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-405 mb-3 flex items-center gap-1.5 ml-1">
          <Users className="w-4 h-4 text-indigo-400" />
          {lang === 'ar' ? 'أصدقاؤك المسجلون' : 'Registered Referrals'}
        </h4>

        {referrals.length === 0 ? (
          <div className="text-center py-8 bg-zinc-950 border border-zinc-800/60 rounded-2xl border-dashed">
            <HelpCircle className="w-7 h-7 text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-500 text-xs">
              {lang === 'ar' ? 'لا يوجد أصدقاء مسجلون برابطك حالياً.' : 'Your referral list is currently empty.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {referrals.map((friend) => (
              <div
                key={friend.id}
                className="flex justify-between items-center p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl"
              >
                <div className="min-w-0 pr-2 pb-0.5">
                  <div className="text-xs font-bold text-white font-mono truncate">{friend.name}</div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">{friend.date}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    +{friend.earned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} TON
                  </span>
                  <div className="text-[9px] text-zinc-500">10% commission</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
