import React, { useState } from 'react';
import { AdTask } from '../types';
import { Compass, ExternalLink, Globe, Tv, Twitter, MessageSquare, Check, ShieldAlert } from 'lucide-react';

interface TasksTabProps {
  tasks: AdTask[];
  onSelectTask: (task: AdTask) => void;
  lang: 'ar' | 'en';
  t: any;
}

type FilterCategory = 'all' | 'telegram' | 'website' | 'youtube' | 'twitter';

export default function TasksTab({ tasks, onSelectTask, lang, t }: TasksTabProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return true;
    return task.category === activeFilter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'telegram':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'website':
        return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'youtube':
        return <Tv className="w-4 h-4 text-red-500" />;
      case 'twitter':
        return <Twitter className="w-4 h-4 text-cyan-400" />;
      default:
        return <Compass className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'telegram':
        return lang === 'ar' ? 'تيليجرام' : 'Telegram';
      case 'website':
        return lang === 'ar' ? 'موقـع' : 'Website';
      case 'youtube':
        return lang === 'ar' ? 'يوتيوب' : 'YouTube';
      case 'twitter':
        return lang === 'ar' ? 'تويتر' : 'Twitter';
      default:
        return category;
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Intro Description */}
      <div className="bg-gradient-to-r from-zinc-950/40 to-zinc-900 border border-zinc-900 rounded-3xl p-5 relative">
        <h3 className="text-white font-bold text-md flex items-center gap-1.5 mb-1.5">
          <Compass className="w-5 h-5 text-amber-500" />
          {t.allTasks}
        </h3>
        <p className="text-zinc-400 text-xs leading-relaxed">
          {t.taskIntro}
        </p>
      </div>

      {/* Filter Chips Container */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 select-none">
        {(['all', 'telegram', 'website', 'youtube', 'twitter'] as FilterCategory[]).map((cat) => (
          <button
            id={`filter-${cat}`}
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all shrink-0 capitalize ${
              activeFilter === cat
                ? 'bg-amber-500 border-amber-500 text-black font-extrabold shadow-sm shadow-amber-500/10'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {cat === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40">
            <p className="text-zinc-500 text-xs font-medium">
              {lang === 'ar' ? 'لا توجد مهام إعلانية متوفرة لهذه الفئة حالياً.' : 'No tasks available in this category.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            // Check if user already completed this task
            const isCompleted = task.completedUsers.includes('current-user');

            return (
              <div
                key={task.id}
                onClick={() => !isCompleted && onSelectTask(task)}
                className={`flex items-center justify-between p-4 bg-zinc-900 border rounded-2xl transition duration-150 ${
                  isCompleted
                    ? 'border-zinc-800/40 opacity-60 cursor-not-allowed bg-zinc-950'
                    : 'border-zinc-800 hover:border-zinc-700 active:bg-zinc-800/60 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Category Styled Icon */}
                  <div className={`p-3 rounded-xl ${
                    isCompleted 
                      ? 'bg-zinc-950 text-zinc-600' 
                      : 'bg-zinc-950 border border-zinc-800'
                  }`}>
                    {getCategoryIcon(task.category)}
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 flex items-center gap-1">
                      {getCategoryLabel(task.category)} • {task.duration}s
                    </span>
                    <h4 className="text-sm font-bold text-white leading-snug mt-0.5 truncate pr-1">
                      {lang === 'ar' ? task.titleAr : task.titleEn}
                    </h4>
                    <span className="text-[10px] text-zinc-500 block font-mono mt-0.5">
                      {task.views.toLocaleString()} / {task.maxViews.toLocaleString()} {lang === 'ar' ? 'عرض متبقي' : 'views'}
                    </span>
                  </div>
                </div>

                {/* Right Earn Token Badge / Completed state */}
                <div className="flex-shrink-0 ml-1">
                  {isCompleted ? (
                    <span className="px-3 py-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900 rounded-xl flex items-center gap-1 font-sans">
                      <Check className="w-3.5 h-3.5" />
                      {t.completed}
                    </span>
                  ) : (
                    <button
                      id={`btn-earn-task-${task.id}`}
                      className="px-3.5 py-1.5 text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-xl flex items-center gap-1 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTask(task);
                      }}
                    >
                      <span>+{task.reward}</span>
                      <span className="text-[9px] font-mono opacity-80">TON</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Safety Notice for verification */}
      <div className="p-3.5 bg-zinc-950/50 border border-zinc-900 rounded-2xl flex items-start gap-2.5 text-left leading-normal">
        <ShieldAlert className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
        <p className="text-[11px] text-zinc-500">
          Our bot verifies joining channels and completing tasks using smart validators. Cheating or withdrawing without real views will trigger account suspension.
        </p>
      </div>
    </div>
  );
}
