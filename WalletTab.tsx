import React, { useState } from 'react';
import { UserStats, WithdrawalItem } from '../types';
import { Shield, Wallet, Layers, CheckCircle, RefreshCw, Send, HelpCircle } from 'lucide-react';

interface WalletTabProps {
  stats: UserStats;
  onRequestWithdrawal: (amount: number, address: string) => boolean;
  lang: 'ar' | 'en';
  t: any;
}

export default function WalletTab({
  stats,
  onRequestWithdrawal,
  lang,
  t,
}: WalletTabProps) {
  const [targetAddress, setTargetAddress] = useState(() => {
    // Attempt to load previously saved address for user convenience
    return localStorage.getItem('ton_saved_address') || '';
  });
  const [saveAddress, setSaveAddress] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState<number | ''>('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess('');

    const formattedAddress = targetAddress.trim();
    if (!formattedAddress) {
      setWithdrawError(t.walletEmpty);
      return;
    }

    if (formattedAddress.length < 10) {
      setWithdrawError(lang === 'ar' ? 'العنوان الذي أدخلته غير صالح' : 'Please enter a valid TON address');
      return;
    }

    if (!withdrawAmount || isNaN(Number(withdrawAmount))) {
      setWithdrawError(lang === 'ar' ? 'يرجى إدخال مبلغ صحيح' : 'Please enter a valid amount');
      return;
    }

    const amountNum = Number(withdrawAmount);

    if (amountNum < 0.5) {
      setWithdrawError(lang === 'ar' ? 'الحد الأدنى للسحب هو 0.5 TON' : 'Minimum withdrawal is 0.5 TON');
      return;
    }

    if (amountNum > stats.balance) {
      setWithdrawError(t.insufficientBal);
      return;
    }

    // Call state updater
    const success = onRequestWithdrawal(amountNum, formattedAddress);
    if (success) {
      setWithdrawSuccess(
        lang === 'ar'
          ? `✓ تم تسجيل طلب سحب بقيمة ${amountNum} TON بنجاح (سيتم الإرسال خلال 21 ساعة). يرجى الضغط على زر "أرسل لـ @eidmo11" بالأسفل لإرسال عنوانك مباشرة للمدير لتمرير العملية!`
          : `✓ Withdrawal request of ${amountNum} TON recorded successfully! (Will be sent within 21 hours). Make sure to click the "Send to @eidmo11" button below to notify the admin.`
      );
      setWithdrawAmount('');
      if (saveAddress) {
        localStorage.setItem('ton_saved_address', formattedAddress);
      }
    } else {
      setWithdrawError(lang === 'ar' ? 'فشل إرسال طلب السحب' : 'Failed to request withdrawal');
    }
  };

  const handleSaveAddressExplicitly = () => {
    if (targetAddress.trim()) {
      localStorage.setItem('ton_saved_address', targetAddress.trim());
      alert(lang === 'ar' ? 'تم حفظ العنوان بنجاح!' : 'TON Address saved successfully!');
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Wallet Balance Hero Card */}
      <div className="relative overflow-hidden bg-zinc-950 border border-zinc-900 rounded-3xl p-6 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <p className="text-xs text-zinc-500 font-medium tracking-wider uppercase mb-1">
          {t.balance}
        </p>
        <div className="flex items-center justify-center gap-1.5">
          {/* TON Icon */}
          <div className="w-8 h-8 rounded-full bg-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-neutral-950 font-black text-xs">💎</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-mono">
            {stats.balance.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 4 })}
          </h2>
          <span className="text-xs font-semibold text-cyan-400 font-mono mt-1">TON</span>
        </div>
      </div>

      {/* Withdrawal Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
          <Wallet className="w-4 h-4 text-cyan-400" />
          {t.withdrawalHeading}
        </h3>
        <p className="text-zinc-400 text-xs mb-4 leading-normal">
          {lang === 'ar'
            ? 'حدد كمية السحب واكتب عنوان محفظة TON الخاصة بك. يتم تحويل العملات مباشرة وتصلك خلال 21 ساعة فقط فور تقديم الطلب وتأكيده.'
            : 'Enter your preferred TON withdrawal amount and destination wallet address. Your funds will be officially released and arrive within 21 hours.'}
        </p>

        {/* Minimum Threshold Info Card */}
        <div className="p-3.5 bg-zinc-950 border border-zinc-800/80 rounded-2xl flex items-center gap-2.5 mb-4 text-xs text-zinc-300">
          <Shield className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>{t.minimumWith}</span>
        </div>

        <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
          {/* TON Wallet Address Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-400 block">
              {t.tonWallet}
            </label>
            <div className="flex flex-col gap-2">
              <input
                id="input-ton-address"
                type="text"
                placeholder="e.g. EQAx3_...MyTonKeeperAddress"
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-2xl p-3 text-xs text-white font-mono outline-none"
              />
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-1.5 text-[10px] text-zinc-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="rounded bg-zinc-950 border-zinc-800 text-cyan-500 focus:ring-0"
                  />
                  <span>{lang === 'ar' ? 'حفظ للتسهيل لاحقاً' : 'Save as default address'}</span>
                </label>
                {targetAddress.trim() && (
                  <button
                    type="button"
                    onClick={handleSaveAddressExplicitly}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    {lang === 'ar' ? 'حفظ العنوان الآن' : 'Save Address'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-400 block">
              {t.withAmt}
            </label>
            <div className="flex items-center bg-zinc-950 border border-zinc-800 focus-within:border-cyan-500 rounded-2xl p-2.5">
              <input
                id="input-withdraw-amount"
                type="number"
                step="0.01"
                placeholder="e.g. 0.5"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="flex-1 bg-transparent border-none text-sm text-white font-mono px-2 focus:ring-0 outline-none"
              />
              <span className="text-xs font-mono font-bold text-cyan-400 px-2 shrink-0">
                TON
              </span>
            </div>
            {/* Quick Fill Button */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setWithdrawAmount(stats.balance)}
                className="text-[10px] text-amber-500 hover:underline"
              >
                {lang === 'ar' ? 'منح كل الرصيد المتاح' : 'Withdraw max available'}
              </button>
            </div>
          </div>

          {/* Validation Feedback */}
          {withdrawError && (
            <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-red-400 text-xs">
              {withdrawError}
            </div>
          )}

          {withdrawSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 text-xs">
              {withdrawSuccess}
            </div>
          )}

          <button
            id="btn-request-withdrawal"
            type="submit"
            disabled={stats.balance < 0.5}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] font-bold text-white rounded-2xl text-xs transition flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.requestWithdrawal}</span>
          </button>
        </form>
      </div>

      {/* Withdrawal Ledger History */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5 ml-1">
          <Layers className="w-4 h-4 text-cyan-400" />
          {t.withHistory}
        </h4>

        {stats.withdrawals.length === 0 ? (
          <div className="text-center py-8 bg-zinc-950 border border-zinc-800/60 rounded-2xl border-dashed">
            <span className="text-zinc-500 text-xs">
              {t.noHistory}
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.withdrawals.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-zinc-950/60 border border-zinc-800/50 rounded-2xl flex justify-between items-center"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-white font-mono">
                      {item.amount.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 4 })} TON
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[180px] block mt-0.5" title={item.address}>
                    {lang === 'ar' ? 'المحفظة' : 'Wallet'}: {item.address}
                  </span>
                  <span className="text-[9px] text-zinc-600 font-mono block">
                    ID: {item.id}
                  </span>
                </div>

                <div className="text-right flex-shrink-0 ml-1 flex flex-col items-end gap-1.5">
                  {item.status === 'pending' && (
                    <>
                      <span className="px-2.5 py-1 text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full">
                        {t.statusPending}
                      </span>
                      <a
                        href={`https://t.me/eidmo11?text=${encodeURIComponent(
                          lang === 'ar'
                            ? `مرحباً أخي العزيز @eidmo11\nلقد طلبت سحب أرباحي من البوت بقيمة: ${item.amount} TON\nرقم العملية: ${item.id}\nعنوان محفظتي على شبكة TON:\n\`${item.address}\`\n\nيرجى تحويل المعاملة وشكراً جزيلاً!`
                            : `Hello @eidmo11\nI requested a payout of: ${item.amount} TON\nTx ID: ${item.id}\nTON Wallet Address:\n\`${item.address}\`\n\nPlease approve and release the coins. Thank you!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 text-[10px] font-bold bg-green-500 hover:bg-green-600 text-black rounded-xl flex items-center gap-1 shadow-md transition"
                      >
                        📬 {lang === 'ar' ? 'أرسل لـ @eidmo11 عبر تيليجرام' : 'Send to @eidmo11'}
                      </a>
                    </>
                  )}
                  {item.status === 'completed' && (
                    <span className="px-2.5 py-1 text-[9px] font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {t.statusCompleted}
                    </span>
                  )}
                  {item.status === 'failed' && (
                    <span className="px-2.5 py-1 text-[9px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-full">
                      {t.statusFailed}
                    </span>
                  )}
                  <span className="text-[9px] text-zinc-500 block font-mono">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
