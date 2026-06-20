export interface AdTask {
  id: string;
  titleAr: string;
  titleEn: string;
  link: string;
  reward: number; // Reward in TON (e.g., 0.01 TON)
  duration: number; // in seconds
  category: 'telegram' | 'website' | 'youtube' | 'twitter';
  views: number;
  maxViews: number;
  completedUsers: string[]; // Mock list of user IDs
}

export interface Referral {
  id: string;
  name: string;
  date: string;
  earned: number; // Commission earned in TON
}

export interface WithdrawalItem {
  id: string;
  amount: number; // in TON
  address: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface UserStats {
  balance: number; // in TON
  refCount: number;
  completedTasksCount: number;
  dailyCheckInDay: number;
  lastCheckIn?: string;
  withdrawals: WithdrawalItem[];
}

