import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from './utils/translations';
import { AdTask, Referral, UserStats, WithdrawalItem } from './types';
import { ShortenerConfig } from './utils/monetizer';

// Importing TMA Platform Tabs & Components
import TelegramHeader from './components/TelegramHeader';
import DashboardTab from './components/DashboardTab';
import TasksTab from './components/TasksTab';
import ReferralTab from './components/ReferralTab';
import AdvertiserTab from './components/AdvertiserTab';
import WalletTab from './components/WalletTab';
import AdViewer from './components/AdViewer';

// Lucide Icons
import { Home, Compass, Users, Megaphone, Wallet, ShieldCheck, CheckCircle2 } from 'lucide-react';

const SEED_TASKS: AdTask[] = [
  {
    id: 't_major_bot',
    titleAr: 'لعبة الكريبتو الشهيرة Major - ابدأ اللعب فوراً واجمع نجوم التون المربحة',
    titleEn: 'Major Web3 Game Star Farming - Open Bot & Claim Rewards',
    link: 'https://t.me/major/start?startapp=5619251749',
    reward: 0.005,
    duration: 15,
    category: 'telegram',
    views: 12450,
    maxViews: 500000,
    completedUsers: []
  },
  {
    id: 't_blum_bot',
    titleAr: 'منصة تداول بلوم Blum - انضم للأعضاء فورا وابدأ التعدين السحابي للعملة',
    titleEn: 'Join Blum Exchange App - Open Premium Mining Room',
    link: 'https://t.me/BlumCryptoBot/app?startapp=ref_6K8N7L',
    reward: 0.005,
    duration: 15,
    category: 'telegram',
    views: 9480,
    maxViews: 200000,
    completedUsers: []
  },
  {
    id: 't_shrinkme_earn',
    titleAr: 'موقع ShrinkMe لربح الدولار - موقع ترافيك الإعلانات ذو الدفع المرتفع للبوت المالك والأعضاء',
    titleEn: 'ShrinkMe Publisher Portal - Complete micro sponsor survey to claim TON',
    link: 'https://shrinkme.io/',
    reward: 0.01,
    duration: 30,
    category: 'website',
    views: 4520,
    maxViews: 100000,
    completedUsers: []
  },
  {
    id: 't_faucetpay_ptc',
    titleAr: 'بوابة صنابير ومحافظ الكريبتو FaucetPay - كسب أرباح السنتات والتون من عروض الضغط على الروابط',
    titleEn: 'FaucetPay Micro-wallet - Visit Premium PTC ads & Get Paid',
    link: 'https://faucetpay.io/',
    reward: 0.008,
    duration: 20,
    category: 'website',
    views: 3120,
    maxViews: 150000,
    completedUsers: []
  },
  {
    id: 't_toncoin_news',
    titleAr: 'قناة المجتمع العربي والعالمي الرسمي لعملة TON - انضم وتابع التوقعات',
    titleEn: 'Subscribe to TON Coin Official Global Community Channel',
    link: 'https://t.me/toncoin',
    reward: 0.003,
    duration: 15,
    category: 'telegram',
    views: 15820,
    maxViews: 800000,
    completedUsers: []
  },
  {
    id: 't_course_youtube',
    titleAr: 'مشاهدة فيديو يوتيوب - كورس خطوة بخطوة للربح الأوتوماتيكي وصناعة المحتوى',
    titleEn: 'Watch Free Premium YouTube Creator Course & Revenue Strategy',
    link: 'https://youtube.com/shorts/iit2Ecnff5U?si=wLoKtndyAFB52zE3',
    reward: 0.005,
    duration: 15,
    category: 'youtube',
    views: 7850,
    maxViews: 300000,
    completedUsers: []
  },
  {
    id: 't_onegram_updates',
    titleAr: 'الاشتراك بقناة تحديثات RaeTON - متابعة إثبات سحب الأعضاء الحقيقي ودفع الإداري',
    titleEn: 'Subscribe to RaeTON Live Updates Channel & Verification Logs',
    link: 'https://t.me/OneGramTonUpdates',
    reward: 0.003,
    duration: 10,
    category: 'telegram',
    views: 11200,
    maxViews: 500000,
    completedUsers: []
  }
];

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isTelegramView, setIsTelegramView] = useState<boolean>(true);

  // Config for Auto-Shortener Monetization
  const [shortenerConfig, setShortenerConfig] = useState<ShortenerConfig>(() => {
    const cached = localStorage.getItem('raeton_shortener_config');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return {
      provider: 'none',
      apiToken: '',
      enabled: false,
      revenueSharePercent: 50
    };
  });

  const [shortenerClicks, setShortenerClicks] = useState<number>(() => {
    const cached = localStorage.getItem('raeton_shortener_clicks');
    return cached ? parseInt(cached) || 0 : 0;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('raeton_shortener_config', JSON.stringify(shortenerConfig));
  }, [shortenerConfig]);

  useEffect(() => {
    localStorage.setItem('raeton_shortener_clicks', shortenerClicks.toString());
  }, [shortenerClicks]);

  // Generate dynamic, unique user referral code saved in LocalStorage
  const [referralCode] = useState<string>(() => {
    let cached = localStorage.getItem('raeton_user_ref_code');
    if (!cached) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      cached = code;
      localStorage.setItem('raeton_user_ref_code', code);
    }
    return cached;
  });

  // Core App states backed up by LocalStorage
  const [userStats, setUserStats] = useState<UserStats>(() => {
    // Determine real referrals first so we can sync refCount perfectly in a robust way
    let realRefCount = 0;
    try {
      const cachedRefs = localStorage.getItem('raeton_referrals');
      if (cachedRefs) {
        const parsedRefs = JSON.parse(cachedRefs);
        if (Array.isArray(parsedRefs)) {
          const filtered = parsedRefs.filter((r: any) => {
            const lowerName = (r.name || '').toLowerCase();
            return !lowerName.includes('it_teacher_59') &&
                   !lowerName.includes('ton_expert_99') &&
                   !lowerName.includes('cryptolion_ar');
          });
          realRefCount = filtered.length;
        }
      }
    } catch (e) {}

    const cached = localStorage.getItem('raeton_stats');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed) {
          const hasBeenMigrated = localStorage.getItem('raeton_real_migrated_v3') === 'true';
          let finalBalance = parsed.balance ?? 0.0;
          let finalRefCount = realRefCount; // Keep synchronized with the filtered actual referrals!
          
          if (!hasBeenMigrated) {
            finalBalance = 0.0; // Clean fake starting balances to make it 100% real
            finalRefCount = 0;
            localStorage.setItem('raeton_real_migrated_v3', 'true');
          }

          return {
            balance: finalBalance,
            refCount: finalRefCount,
            completedTasksCount: parsed.completedTasksCount ?? 0,
            dailyCheckInDay: parsed.dailyCheckInDay ?? 1,
            lastCheckIn: parsed.lastCheckIn,
            withdrawals: parsed.withdrawals ?? []
          };
        }
      } catch (e) { }
    }
    return {
      balance: 0.0, // Starting real TON balance is 0.0
      refCount: realRefCount,
      completedTasksCount: 0,
      dailyCheckInDay: 1,
      withdrawals: []
    };
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const cached = localStorage.getItem('raeton_referrals');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const hasBeenMigrated = localStorage.getItem('raeton_real_migrated_v3') === 'true';
        if (!hasBeenMigrated) {
          return [];
        }
        if (Array.isArray(parsed)) {
          return parsed.filter((r: Referral) => {
            const lowerName = (r.name || '').toLowerCase();
            return !lowerName.includes('it_teacher_59') &&
                   !lowerName.includes('ton_expert_99') &&
                   !lowerName.includes('cryptolion_ar');
          });
        }
        return parsed;
      } catch (e) { }
    }
    return [];
  });

  const [availableTasks, setAvailableTasks] = useState<AdTask[]>(() => {
    const cached = localStorage.getItem('raeton_available_tasks');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as AdTask[];
        // Filter out deleted original simulated tasks
        const filtered = parsed.filter(t => !['t1', 't2', 't3', 't4', 't5'].includes(t.id));
        const merged = [...filtered];
        SEED_TASKS.forEach((seed) => {
          if (!merged.some((item) => item.id === seed.id)) {
            merged.unshift(seed);
          }
        });
        return merged;
      } catch (e) { }
    }
    return SEED_TASKS;
  });

  const [userCampaigns, setUserCampaigns] = useState<AdTask[]>(() => {
    const cached = localStorage.getItem('raeton_user_campaigns');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { }
    }
    return [];
  });

  const [activeViewingTask, setActiveViewingTask] = useState<AdTask | null>(null);

  // Sync state with LocalStorage
  useEffect(() => {
    localStorage.setItem('raeton_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('raeton_referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('raeton_available_tasks', JSON.stringify(availableTasks));
  }, [availableTasks]);

  useEffect(() => {
    localStorage.setItem('raeton_user_campaigns', JSON.stringify(userCampaigns));
  }, [userCampaigns]);

  // Active translations
  const t = translations[lang];

  // Callback functions
  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleClaimDaily = () => {
    // Loyalty rewarding structure in TON coin
    const dailyRewards = [0.01, 0.02, 0.03, 0.05, 0.08, 0.12, 0.25];
    const currentDayIndex = userStats.dailyCheckInDay - 1;
    const todayReward = dailyRewards[currentDayIndex % 7];

    setUserStats((prev) => {
      const nextDay = prev.dailyCheckInDay >= 7 ? 1 : prev.dailyCheckInDay + 1;
      return {
        ...prev,
        balance: parseFloat((prev.balance + todayReward).toFixed(4)),
        dailyCheckInDay: nextDay,
        lastCheckIn: new Date().toISOString()
      };
    });

    alert(
      lang === 'ar'
        ? `✅ تم استلام مكافأة الحضور اليومي لليوم ${userStats.dailyCheckInDay}! الرصيد المضاف: +${todayReward} TON`
        : `✅ Daily reward claimed for Day ${userStats.dailyCheckInDay}! Balance updated with +${todayReward} TON`
    );
  };

  // Reward user from completing advertiser task or sponsor ad
  const handleClaimAdTaskReward = (rewardAmount: number, taskId: string) => {
    setUserStats((prev) => ({
      ...prev,
      balance: parseFloat((prev.balance + rewardAmount).toFixed(4)),
      completedTasksCount: prev.completedTasksCount + 1
    }));

    if (shortenerConfig.enabled && shortenerConfig.provider !== 'none' && shortenerConfig.apiToken) {
      setShortenerClicks((prev) => prev + 1);
    }

    // Update available tasks completedUsers list
    setAvailableTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            views: task.views + 1,
            completedUsers: [...task.completedUsers, 'current-user']
          };
        }
        return task;
      })
    );

    // Also update publisher campaign counters if it was self created
    setUserCampaigns((prev) =>
      prev.map((camp) => {
        if (camp.id === taskId) {
          return { ...camp, views: camp.views + 1 };
        }
        return camp;
      })
    );

    setActiveViewingTask(null);
  };

  // Adding Advertiser Campaign
  const handleCreateAdvertiserCampaign = (
    campData: Omit<AdTask, 'id' | 'views' | 'completedUsers'>
  ): boolean => {
    const viewsFactor = 1.3;
    const totalCost = parseFloat((campData.maxViews * campData.reward * viewsFactor).toFixed(4));

    if (totalCost > userStats.balance) return false;

    // Build the campaign task
    const newTaskId = `custom_${Date.now()}`;
    const newAdCampaign: AdTask = {
      ...campData,
      id: newTaskId,
      views: 0,
      completedUsers: []
    };

    // Deduct totalCost instantly, and insert campaign
    setUserStats((prev) => ({
      ...prev,
      balance: parseFloat((prev.balance - totalCost).toFixed(4))
    }));

    setUserCampaigns((prev) => [newAdCampaign, ...prev]);
    setAvailableTasks((prev) => [newAdCampaign, ...prev]);

    return true;
  };

  // Handle real query string link tracking on launch
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let ref = params.get('start') || params.get('ref') || params.get('startapp');
    
    // Support telegram standard custom start_param
    if (!ref && window.location.hash) {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const tgWebAppData = hashParams.get('tgWebAppData');
        if (tgWebAppData) {
          const parsedData = new URLSearchParams(decodeURIComponent(tgWebAppData));
          ref = parsedData.get('start_param');
        }
      } catch (err) {
        console.error("Failed to parse hash params", err);
      }
    }

    if (ref && ref.startsWith('ref_')) {
      ref = ref.substring(4);
    }

    // Allocate reward if never registered invite before
    if (ref && ref !== referralCode && !localStorage.getItem('raeton_invited_by')) {
      localStorage.setItem('raeton_invited_by', ref);
      setUserStats((prev) => ({
        ...prev,
        balance: parseFloat((prev.balance + 0.05).toFixed(4)),
        refCount: prev.refCount + 1
      }));
      
      // Save referral log
      const newRefLog = {
        id: `ref_${Date.now()}`,
        name: `@tg_user_${ref}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        earned: 0.05
      };
      
      setReferrals((prev) => [newRefLog, ...prev]);

      setTimeout(() => {
        alert(
          lang === 'ar'
            ? `🎉 مرحباً بك! لقد سجلت عبر رابط إحالة صديقك (${ref}). تم منحك مكافأة انضمام بقيمة +0.05 TON في محفظتك!`
            : `🎉 Welcome! Registered via referral link from friend (${ref}). Earned +0.05 TON welcoming bonus!`
        );
      }, 1000);
    }
  }, [lang]);

  // Withdrawal logic
  const handleRequestWithdrawal = (amount: number, address: string): boolean => {
    if (amount > userStats.balance) return false;

    const newWithdraw: WithdrawalItem = {
      id: "TX_" + Math.random().toString(36).substring(2, 11).toUpperCase(),
      amount: amount,
      address: address,
      date: new Date().toISOString().split('T')[0],
      status: 'pending' as const
    };

    setUserStats((prev) => ({
      ...prev,
      balance: parseFloat((prev.balance - amount).toFixed(4)),
      withdrawals: [newWithdraw, ...prev.withdrawals]
    }));

    return true;
  };

  // Helper render tab
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <DashboardTab
            stats={userStats}
            onClaimDaily={handleClaimDaily}
            lang={lang}
            t={t}
          />
        );
      case 'tasks':
        return (
          <TasksTab
            tasks={availableTasks}
            onSelectTask={(task) => setActiveViewingTask(task)}
            lang={lang}
            t={t}
          />
        );
      case 'referrals':
        return (
          <ReferralTab
            referrals={referrals}
            referralCode={referralCode}
            lang={lang}
            t={t}
          />
        );
      case 'advertise':
        return (
          <AdvertiserTab
            userBalance={userStats.balance}
            userCampaigns={userCampaigns}
            onAddCampaign={handleCreateAdvertiserCampaign}
            lang={lang}
            t={t}
            shortenerConfig={shortenerConfig}
            setShortenerConfig={setShortenerConfig}
            shortenerClicks={shortenerClicks}
          />
        );
      case 'wallet':
        return (
          <WalletTab
            stats={userStats}
            onRequestWithdrawal={handleRequestWithdrawal}
            lang={lang}
            t={t}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`h-screen w-full text-white bg-zinc-950 flex justify-center items-center transition-colors duration-300 font-sans overflow-hidden ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Centered TMA full-screen portal */}
      <div className="w-full max-w-lg h-full flex flex-col bg-zinc-950 border-x border-zinc-900 shadow-2xl relative select-text overflow-hidden">
        {/* Telegram Styled Top Bar */}
        <TelegramHeader
          lang={lang}
          onToggleLang={handleToggleLang}
          activeTab={activeTab}
          t={t}
        />

        {/* Core Body View */}
        <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-thumb-zinc-800">
          {renderActiveTabContent()}
        </div>

              {/* Bottom Nav Menu */}
              <div className="absolute bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 flex justify-around items-center py-2.5 z-30 select-none">
                <button
                  id="tab-btn-home"
                  onClick={() => setActiveTab('home')}
                  className={`flex flex-col items-center gap-1 transition-all flex-1 ${
                    activeTab === 'home' ? 'text-amber-500 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Home className="w-4.5 h-4.5" />
                  <span className="text-[8px] tracking-tight">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
                </button>

                <button
                  id="tab-btn-tasks"
                  onClick={() => setActiveTab('tasks')}
                  className={`flex flex-col items-center gap-1 transition-all flex-1 ${
                    activeTab === 'tasks' ? 'text-amber-500 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Compass className="w-4.5 h-4.5" />
                  <span className="text-[8px] tracking-tight">{t.tasks}</span>
                </button>

                <button
                  id="tab-btn-referrals"
                  onClick={() => setActiveTab('referrals')}
                  className={`flex flex-col items-center gap-1 transition-all flex-1 ${
                    activeTab === 'referrals' ? 'text-amber-500 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Users className="w-4.5 h-4.5" />
                  <span className="text-[8px] tracking-tight">{t.referral}</span>
                </button>

                <button
                  id="tab-btn-advertise"
                  onClick={() => setActiveTab('advertise')}
                  className={`flex flex-col items-center gap-1 transition-all flex-1 ${
                    activeTab === 'advertise' ? 'text-emerald-400 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Megaphone className="w-4.5 h-4.5" />
                  <span className="text-[8px] tracking-tight">{t.advertise}</span>
                </button>

                <button
                  id="tab-btn-wallet"
                  onClick={() => setActiveTab('wallet')}
                  className={`flex flex-col items-center gap-1 transition-all flex-1 ${
                    activeTab === 'wallet' ? 'text-cyan-400 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Wallet className="w-4.5 h-4.5" />
                  <span className="text-[8px] tracking-tight">{t.wallet}</span>
                </button>
              </div>

              {/* Floating Immersive Ad Overlay */}
              {activeViewingTask && (
                <AdViewer
                  task={activeViewingTask}
                  onClose={() => setActiveViewingTask(null)}
                  onReward={handleClaimAdTaskReward}
                  lang={lang}
                  t={t}
                  shortenerConfig={shortenerConfig}
                />
              )}
      </div>
    </div>
  );
}
