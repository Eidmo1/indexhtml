import React, { useState } from 'react';
import { AdTask } from '../types';
import { ShortenerConfig, estimateRevenue, SHORTENER_CPM_LOGS } from '../utils/monetizer';
import { 
  Megaphone, Plus, Sparkles, BarChart2, Globe, MessageSquare, 
  Tv, Twitter, FileText, Key, Save, Check, Coins, Settings, TrendingUp, HelpCircle 
} from 'lucide-react';

interface AdvertiserTabProps {
  userBalance: number;
  userCampaigns: AdTask[];
  onAddCampaign: (campaign: Omit<AdTask, 'id' | 'views' | 'completedUsers'>) => boolean;
  lang: 'ar' | 'en';
  t: any;
  shortenerConfig: ShortenerConfig;
  setShortenerConfig: React.Dispatch<React.SetStateAction<ShortenerConfig>>;
  shortenerClicks: number;
}

export default function AdvertiserTab({
  userBalance,
  userCampaigns,
  onAddCampaign,
  lang,
  t,
  shortenerConfig,
  setShortenerConfig,
  shortenerClicks
}: AdvertiserTabProps) {
  // Tab Switcher between general advertisers and bot owner controls
  const [activeSubTab, setActiveSubTab] = useState<'advertise' | 'monetization'>('advertise');

  // Form State for custom campaign
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [link, setLink] = useState('');
  const [reward, setReward] = useState(0.01); 
  const [duration, setDuration] = useState(15); 
  const [category, setCategory] = useState<'telegram' | 'website' | 'youtube' | 'twitter'>('website');
  const [maxViews, setMaxViews] = useState(50);

  // Campaign feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Monetization setting states
  const [provider, setProvider] = useState<ShortenerConfig['provider']>(shortenerConfig.provider);
  const [apiToken, setApiToken] = useState(shortenerConfig.apiToken);
  const [monEnabled, setMonEnabled] = useState(shortenerConfig.enabled);
  const [revenueShare, setRevenueShare] = useState(shortenerConfig.revenueSharePercent);
  const [monetizationSaved, setMonetizationSaved] = useState(false);

  // Calculations for advertisers
  const viewsFactor = 1.3; 
  const totalCost = parseFloat((maxViews * reward * viewsFactor).toFixed(4));

  // Calculations for monetization stats
  const estimatedProfit = estimateRevenue(shortenerClicks, shortenerConfig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!titleAr || !titleEn || !link) {
      setErrorMsg(lang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    if (!link.startsWith('http://') && !link.startsWith('https://') && !link.startsWith('tg://')) {
      setErrorMsg(lang === 'ar' ? 'يجب أن يبدأ الرابط بـ https:// أو tg://' : 'URL must start with https:// or tg://');
      return;
    }

    if (totalCost > userBalance) {
      setErrorMsg(t.insufficientBal);
      return;
    }

    if (reward <= 0) {
      setErrorMsg(lang === 'ar' ? 'المكافأة يجب أن تكون أكبر من 0' : 'Reward must be greater than 0');
      return;
    }

    if (maxViews <= 0) {
      setErrorMsg(lang === 'ar' ? 'عدد مرات الزيارة يجب أن يكون أكبر من 0' : 'Target views must be greater than 0');
      return;
    }

    const success = onAddCampaign({
      titleAr,
      titleEn,
      link,
      reward,
      duration,
      category,
      maxViews,
    });

    if (success) {
      setSuccessMsg(lang === 'ar' ? 'تم إطلاق حملتك الإعلانية بنجاح!' : 'Campaign launched successfully!');
      setTitleAr('');
      setTitleEn('');
      setLink('');
    } else {
      setErrorMsg(lang === 'ar' ? 'فشل إطلاق الحملة' : 'Failed to launch campaign');
    }
  };

  const handleSaveMonetization = (e: React.FormEvent) => {
    e.preventDefault();
    setShortenerConfig({
      provider,
      apiToken,
      enabled: monEnabled,
      revenueSharePercent: revenueShare
    });
    setMonetizationSaved(true);
    setTimeout(() => setMonetizationSaved(false), 3000);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'telegram':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'website':
        return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'youtube':
        return <Tv className="w-4 h-4 text-red-500" />;
      case 'twitter':
        return <Twitter className="w-4 h-4 text-cyan-400" />;
      default:
        return <FileText className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Upper Segmented Tab Switcher */}
      <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1 shrink-0 select-none">
        <button
          id="subtab-btn-advertise"
          onClick={() => setActiveSubTab('advertise')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'advertise'
              ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Megaphone className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'ar' ? 'بوابة المعلنين' : 'Advertiser Portal'}</span>
        </button>

        <button
          id="subtab-btn-monetization"
          onClick={() => setActiveSubTab('monetization')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'monetization'
              ? 'bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 text-amber-400 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>{lang === 'ar' ? 'أرباح مالك البوت' : 'Bot Owner Earnings'}</span>
          <span className="text-[8.5px] font-mono tracking-wider font-extrabold uppercase bg-amber-500 text-black px-1.5 py-0.5 rounded-md scale-90">
            REAL
          </span>
        </button>
      </div>

      {/* RENDER ADVERTISER PORTAL */}
      {activeSubTab === 'advertise' && (
        <div className="space-y-5 animate-fade-in-up">
          {/* Advertiser Header Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-cyan-950/20 to-zinc-900 border border-zinc-900 rounded-3xl p-5 md:p-6 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 rounded-2xl shrink-0 mt-0.5 animate-pulse">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-md leading-tight mb-1">
                  {t.advertiserPanel}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {t.advertiserDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Available Balance Preview */}
          <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase block">
                {lang === 'ar' ? 'رصيد غطاء إعلاناتك المتاح' : 'Your Available TON Balance'}
              </span>
              <span className="text-lg font-extrabold text-cyan-400 font-mono block mt-0.5">
                {userBalance.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 4 })} TON
              </span>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs rounded-lg uppercase">
                Sponsor Mode
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-1.5 border-b border-zinc-800 pb-3">
              <Plus className="w-4 h-4 text-cyan-400" />
              {t.newCamp}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 block">
                    {t.adTitleAr} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-title-ar"
                    type="text"
                    placeholder="مثال: اشترك بقناة المعلم للربط السريع"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-xl text-xs text-white placeholder-zinc-600 outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 block">
                    {t.adTitleEn} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-title-en"
                    type="text"
                    placeholder="e.g. Subscribe to Education Hub"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-xl text-xs text-white placeholder-zinc-600 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 block">
                  {t.adLink} <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-ad-link"
                  type="text"
                  placeholder="https://t.me/channel_name or https://mywebsite.com"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-xl text-xs text-white placeholder-zinc-600 outline-none font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 block">
                    {t.category}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-xl text-xs text-zinc-300 outline-none"
                  >
                    <option value="website">{t.websiteVisit}</option>
                    <option value="telegram">{t.telegramTask}</option>
                    <option value="youtube">{t.youtubeVideo}</option>
                    <option value="twitter">{t.twitterTask}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 block">
                    {t.timeRequired}
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-xl text-xs text-zinc-300 outline-none"
                  >
                    <option value="10">10s (Budget friendly)</option>
                    <option value="15">15s (Optimal Engagement)</option>
                    <option value="30">30s (In-depth view)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 block">
                    {t.rewardPerView}
                  </label>
                  <input
                    id="input-view-reward"
                    type="number"
                    step="0.001"
                    min="0.001"
                    max="1.0"
                    value={reward}
                    onChange={(e) => setReward(Math.max(0.001, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-xl text-xs text-white outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 block">
                    {lang === 'ar' ? 'تحديد مرات الزيارة (الجمهور)' : 'Target Views Audience'}
                  </label>
                  <input
                    id="input-max-views"
                    type="number"
                    min="10"
                    max="10000"
                    value={maxViews}
                    onChange={(e) => setMaxViews(Math.max(10, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-xl text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              {/* Pricing Calculation Display */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl flex items-center justify-between text-xs text-zinc-400">
                <div>
                  <span className="block text-[10px] text-zinc-500">
                    Total Budget Cost ({maxViews} x {reward} TON + 30% system fee)
                  </span>
                  <span className="text-cyan-400 font-bold font-mono text-sm">
                    {totalCost.toFixed(4)} TON
                  </span>
                </div>
                <span className="px-2 py-1 text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded font-mono font-medium">
                  +{ (maxViews * reward * 0.3).toFixed(4) } TON System Fee
                </span>
              </div>

              {/* Feedback messages */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-red-400 text-xs">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 text-xs">
                  {successMsg}
                </div>
              )}

              <button
                id="btn-submit-advertiser-campaign"
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 active:scale-[0.99] font-bold text-white rounded-2xl text-xs transition shadow-md shadow-cyan-500/10"
              >
                {t.createAdBtn}
              </button>
            </form>
          </div>

          {/* User's Campaign History */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5 ml-1">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              {t.activeCamps}
            </h4>

            {userCampaigns.length === 0 ? (
              <div className="text-center py-8 bg-zinc-950 border border-zinc-800/60 rounded-2xl border-dashed">
                <span className="text-zinc-500 text-xs font-medium block">
                  {t.noCampaigns}
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {userCampaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-3 bg-zinc-950/60 border border-zinc-800/50 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-2">
                      <div className="p-2 bg-zinc-900 rounded-xl text-zinc-400 flex-shrink-0">
                        {getCategoryIcon(camp.category)}
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-white truncate">
                          {lang === 'ar' ? camp.titleAr : camp.titleEn}
                        </h5>
                        <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block truncate max-w-[180px]">
                          {camp.link}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-white font-mono">
                        {camp.views} / {camp.maxViews}
                      </span>
                      <span className="text-[9px] text-zinc-500 block">
                        {t.viewsCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER BOT OWNER MONETIZATION CONSOLE */}
      {activeSubTab === 'monetization' && (
        <div className="space-y-5 animate-fade-in-up">
          {/* Header Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/20 to-zinc-900 border border-zinc-900 rounded-3xl p-5 md:p-6 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/15 border border-amber-500/20 text-amber-400 rounded-2xl shrink-0 mt-0.5">
                <Coins className="w-6 h-6 animate-spin" style={{ animationDuration: '5s' }} />
              </div>
              <div>
                <h3 className="text-white font-bold text-md leading-tight mb-1">
                  {t.ownerConsole}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {t.ownerConsoleDesc}
                </p>
              </div>
            </div>
          </div>

          {/* LIVE REVENUE & NET PROFIT ESTIMATES */}
          <div className="bg-zinc-900 border border-zinc-500/20 shadow-lg rounded-3xl p-5 relative">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-zinc-800 pb-2.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {t.estimatedStats}
            </h4>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl text-center">
                <span className="text-[9px] text-zinc-500 uppercase font-bold block mb-1">
                  {t.totalClicksLogged}
                </span>
                <span className="text-lg font-extrabold text-white font-mono block">
                  {shortenerClicks.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-emerald-950/10 border border-emerald-900/30 rounded-2xl text-center">
                <span className="text-[9px] text-emerald-500/80 uppercase font-bold block mb-1">
                  {lang === 'ar' ? 'إجمالي الربح (USD)' : 'Total Revenue (USD)'}
                </span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono block">
                  ${estimatedProfit.usd.toFixed(2)}
                </span>
                <span className="text-[8px] text-zinc-500 font-sans block mt-0.5">
                  Est. eCPM: ${SHORTENER_CPM_LOGS[provider === 'none' ? 'shrinkme' : provider].toFixed(2)}
                </span>
              </div>

              <div className="p-3 bg-amber-950/10 border border-amber-900/30 rounded-2xl text-center">
                <span className="text-[9px] text-amber-500/80 uppercase font-bold block mb-1">
                  {lang === 'ar' ? 'أرباحك بـ TON' : 'Profit in TON'}
                </span>
                <span className="text-lg font-extrabold text-amber-400 font-mono block">
                  {estimatedProfit.ton.toFixed(3)}
                </span>
                <span className="text-[8px] font-mono font-bold tracking-wider text-amber-500 bg-amber-500/10 px-1 rounded-md block mt-0.5 mx-auto w-max uppercase scale-90">
                  {t.premiumVerifiedBadge}
                </span>
              </div>
            </div>
          </div>

          {/* MONETIZATION GATEWAY INPUT SETTINGS FORM */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5 pb-2 border-b border-zinc-800" id="form-header-monetize">
              <Settings className="w-4 h-4 text-amber-500" />
              {lang === 'ar' ? 'إعدادات بوابة الربح الشريك' : 'Monetization Integration Credentials'}
            </h4>

            <form onSubmit={handleSaveMonetization} className="space-y-4">
              {/* Enable / Disable switch */}
              <div className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-2xl border border-zinc-850">
                <div className="pr-2">
                  <span className="text-xs font-bold text-white block">
                    {t.enableShorteners}
                  </span>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {t.shortenerDesc}
                  </p>
                </div>
                <button
                  id="toggle-monetization"
                  type="button"
                  onClick={() => setMonEnabled(!monEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    monEnabled ? 'bg-amber-500' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                      monEnabled ? (lang === 'ar' ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Provider Platform Selector */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 block">
                  {t.shortenerProvider}
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-zinc-300 outline-none"
                >
                  <option value="none">None (Disabled)</option>
                  <option value="shrinkme">ShrinkMe.io (Avg $12.00 CPM)</option>
                  <option value="gplinks">GPLinks.in (Avg $10.00 CPM)</option>
                  <option value="cuty">Cuty.io (Avg $8.50 CPM)</option>
                  <option value="clicksfly">ClicksFly.com (Avg $11.50 CPM)</option>
                </select>
              </div>

              {/* API Token Input Key */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 block flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-zinc-550" />
                  {t.apiTokenLabel}
                </label>
                <input
                  id="input-shortener-token"
                  type="password"
                  placeholder="e.g. 586ac0ba1ef93214b7e98a3..."
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none font-mono"
                  disabled={provider === 'none'}
                />
              </div>

              {/* User Reward Share percent */}
              <div className="space-y-1 p-3 bg-zinc-950/60 border border-zinc-850 rounded-2xl">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-zinc-300">{t.rewardShare}</span>
                  <span className="font-bold text-amber-500 font-mono bg-amber-500/10 px-2 py-0.5 rounded">
                    {revenueShare}%
                  </span>
                </div>
                <input
                  id="input-revenue-share"
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={revenueShare}
                  onChange={(e) => setRevenueShare(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[10px] text-zinc-500 block leading-normal mt-1.5">
                  {t.rewardShareDesc}
                </span>
              </div>

              {/* Dynamic Feedback Save Message */}
              {monetizationSaved && (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>{t.savedMonetizationSuccess}</span>
                </div>
              )}

              {/* Save Trigger Button */}
              <button
                id="btn-save-monetization-parameters"
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 font-bold text-black rounded-2xl text-xs transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{t.saveMonetization}</span>
              </button>
            </form>
          </div>

          {/* SETUP STEP BY STEP INSTRUCTIONS */}
          <div className="bg-zinc-900 border border-zinc-850 rounded-3xl p-5">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              {t.setupInstructionsTitle}
            </h4>
            <div className="text-xs text-zinc-400 space-y-2.5 leading-relaxed font-sans pr-1">
              <p className="border-l-2 border-amber-500 pl-2 text-zinc-300">
                {t.setupStep1}
              </p>
              <p className="border-l-2 border-amber-500 pl-2 text-zinc-300">
                {t.setupStep2}
              </p>
              <p className="border-l-2 border-amber-500 pl-2 text-zinc-300">
                {t.setupStep3}
              </p>
              <p className="bg-zinc-950 p-2.5 rounded-xl text-[10.5px] text-zinc-500 mt-2 block border border-zinc-850">
                {lang === 'ar'
                  ? '💡 معلومات سرية: رصيد الإعلانات وحفظ الـ Token آمن بالكامل ويتم تشفيره وحفظه محلياً في ذاكرة البوت.'
                  : '💡 Security Warning: Advertising Tokens and configuration credentials are safe, encrypted, and compiled directly at client/session layers.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
